<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { Clock3 } from 'lucide-svelte';
    import { openProject,parseProject, loadFile, saveFile } from './api/FileAPI';
    import { openFiles, activeFile, fileContent, projectName, isLoading } from './stores/editorStore';
    import { moduleGraph } from './stores/graphStore';
    import ArchitectureView from './ArchitectureView.svelte';
    import AIAssistant from './AIAssistant.svelte';
    import CodeEditor from './CodeEditor.svelte';
    import CodePromptBox from './CodePromptBox.svelte';
    import SimulationPanel from './SimulationPanel.svelte';
    
    export const designHierarchy = writable(null);

    const time = writable('00:00:00');
    let editorRef: CodeEditor;
    let aiAssistantRef: AIAssistant;
  
    // FIXED: Callback function for AI responses (Svelte 5 style)
    function handleAIResponse(data: {prompt: string, response: string, file: string, source: string}) {
      console.log('[MAIN] AI Response received:', data);
      aiAssistantRef?.addResponse(data.prompt, data.response, data.file, data.source || 'ai');
    }
  
    function getFileName(fullPath: string): string {
      return fullPath.split(/[/\\]/).pop() || fullPath;
    }
  
    function formatTime(seconds: number): string {
      const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
      const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    }
  
    onMount(() => {
      let seconds = 0;
      const interval = setInterval(() => {
        seconds += 1;
        time.set(formatTime(seconds));
      }, 1000);
      return () => clearInterval(interval);
    });
  
    async function handleOpenProject() {
      if ($isLoading) return;
      
      const path = prompt('Enter the FULL path to your project folder:');
      if (!path) return;
  
      isLoading.set(true);
      fileContent.set('// Opening project...');
      
      try {
        const files = await openProject(path);
        
        if (files.length === 0) {
          alert('No Verilog files (.v, .sv, .vh) found in that folder.');
          fileContent.set('// No Verilog files found. Try opening another folder.');
          openFiles.set([]);
          activeFile.set(null);
          return;
        }
        
        
        openFiles.set(files);
        projectName.set(getFileName(path));
        
        const graph = await parseProject(files);
        moduleGraph.set(Object.fromEntries(graph.map(m => [m.module, m])));

        // Load the first file automatically
        await handleFileClick(files[0]);
        
      } catch (err) {
        console.error('[FRONTEND] Error opening project:', err);
        alert(`❌ Failed to open project.\n\nError: ${err.message}`);
        fileContent.set(`// Error opening project. ${err.message}`);
      } finally {
        isLoading.set(false);
      }
    }
  
    async function handleFileClick(filePath: string) {
      if ($isLoading) return;
      
      isLoading.set(true);
      activeFile.set(filePath);
      fileContent.set(`// Loading ${getFileName(filePath)}...`);
  
      try {
        const content = await loadFile(filePath);
        fileContent.set(content);
      } catch (err) {
        console.error(`[FRONTEND] Error loading file:`, err);
        alert(`❌ Failed to load file: ${getFileName(filePath)}\n\nError: ${err.message}`);
        fileContent.set(`// Error loading file. ${err.message}`);
      } finally {
        isLoading.set(false);
      }
    }
  
    async function handleSave() {
      if (!$activeFile || $isLoading) return;
      
      // Get current editor content
      const currentContent = editorRef?.getEditorValue() || $fileContent;
      
      try {
        await saveFile($activeFile, currentContent);
        alert('✅ File saved successfully!');
      } catch (err) {
        alert('❌ Failed to save file: ' + err.message);
      }
    }
  </script>
  
  <div class="pspace-container">
    <div class="design-toolbar">
      <div class="left-group">
        <span class="project-name">{$projectName}</span>
        <div class="tabs" role="tablist">
          {#each $openFiles as file (file)}
            <button
              class="tab"
              class:active={file === $activeFile}
              type="button"
              onclick={() => handleFileClick(file)}
              disabled={$isLoading}
            >
              {getFileName(file)}
            </button>
          {/each}
        </div>
      </div>
  
      <div class="right-group">
        <button class="glow-btn" onclick={handleOpenProject} disabled={$isLoading} type="button" aria-label="Open Project Folder">
          {#if $isLoading}⏳{:else}📂{/if}
        </button>
        <button class="glow-btn" onclick={handleSave} disabled={$isLoading || !$activeFile} type="button" aria-label="Save File">
          💾
        </button>
        <Clock3 class="clock-icon" />
        <span class="timer">{$time}</span>
      </div>
    </div>
  
    <div class="pspace-main">
      <div class="left-column">
        <ArchitectureView />
        <AIAssistant bind:this={aiAssistantRef} />
      </div>
      <div class="center-column">
        <CodeEditor bind:this={editorRef} />
        <!-- FIXED: Pass callback prop instead of using event dispatcher -->
        <CodePromptBox onAiResponse={handleAIResponse} />
      </div>
      <div class="right-column">
        <SimulationPanel />
      </div>
    </div>
  </div>
  
  <style>
    .pspace-container {
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #0d1117;
      color: #00ffee;
      font-family: 'Orbitron', monospace;
      overflow: hidden;
    }
    .design-toolbar {
      width: 100%;
      height: 60px;
      background: linear-gradient(to right, #0f172a, #1a2332);
      border-bottom: 1px solid #00ffee55;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      color: #00ffee;
      box-sizing: border-box;
    }
    .left-group { display: flex; align-items: center; gap: 1rem; }
    .project-name { font-size: 14px; font-weight: bold; }
    .tabs { display: flex; gap: 0.25rem; align-items: center; }
    .tab {
      background: #1e293b;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      color: #00ffeeaa;
      font-family: monospace;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 13px;
      border: none;
      border-bottom: 2px solid transparent;
    }
    .tab:disabled { cursor: not-allowed; opacity: 0.6; }
    .tab.active { background: #00ffee22; color: #00ffee; border-bottom: 2px solid #00ffee; }
    .right-group { display: flex; align-items: center; gap: 0.75rem; }
    .glow-btn {
      background: transparent;
      border: 1px solid #00ffee44;
      color: #00ffee;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 0 6px #00ffee55;
      transition: background 0.2s;
    }
    .glow-btn:hover { background: #00ffee22; }
    .glow-btn:disabled { cursor: not-allowed; opacity: 0.6; box-shadow: none; }
    .clock-icon { width: 18px; height: 18px; stroke: #00ffee; }
    .timer { font-weight: bold; font-size: 15px; }
    .pspace-main {
      flex: 1;
      display: flex;
      flex-direction: row;
      gap: 1rem;
      padding: 1rem;
    }
    .left-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 250px;
    }
    .center-column {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 0;
    }
    .right-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 250px;
    }
  </style>
  