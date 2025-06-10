<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { Clock3 } from 'lucide-svelte';
    import { openProject, loadFile } from './api/FileAPI'; // Adjust path if needed
    import { openFiles, activeFile, fileContent, isLoading, projectName } from './stores/editorStore';

    
    const time = writable('00:00:00');
  
    // --- Helper to get just the filename from a full path ---
    function getFileName(fullPath: string): string {
      return fullPath.split(/[/\\]/).pop() || fullPath;
    }
    
    onMount(() => {
      let seconds = 0;
      const interval = setInterval(() => {
        seconds++;
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        time.set(`${h}:${m}:${s}`);
      }, 1000);
      return () => clearInterval(interval);
    });
  
    // --- Core Logic ---
    async function handleOpenProject() {
      console.log('[FRONTEND] Open Project button clicked.');
      if ($isLoading) return; // Prevent multiple clicks
     
      const path = prompt('Enter the FULL path to your project folder:');
      if (!path) {
        console.log('[FRONTEND] User cancelled prompt.');
        return;
      }
  
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
  
        // Load the first file automatically
        await handleFileClick(files[0]);
  
      } catch (err) {
        console.error('[FRONTEND] Error opening project:', err);
        alert(`❌ Failed to open project.\n\nError: ${err.message}\n\nCheck the browser console (F12) and the backend terminal for more details.`);
        fileContent.set(`// Error opening project. ${err.message}`);
      } finally {
        isLoading.set(false);
      }
    }
  
    async function handleFileClick(filePath: string) {
      if ($isLoading) return;
      console.log(`[FRONTEND] Tab clicked for: ${filePath}`);
      
      isLoading.set(true);
      activeFile.set(filePath);
      fileContent.set(`// Loading ${getFileName(filePath)}...`);
  
      try {
        const content = await loadFile(filePath);
        fileContent.set(content);
      } catch (err) {
        console.error(`[FRONTEND] Error loading file:`, err);
        alert(`❌ Failed to load file: ${getFileName(filePath)}.\n\nError: ${err.message}`);
        fileContent.set(`// Error loading file. ${err.message}`);
      } finally {
        isLoading.set(false);
      }
    }
  </script>
  
  <div class="design-toolbar">
    <div class="left-group">
      <span class="project-name">{$projectName}</span>
      <div class="tabs" role="tablist">
        {#each $openFiles as file (file)}
          <button
            class="tab"
            class:active={file === $activeFile}
            type="button"
            on:click={() => handleFileClick(file)}
            disabled={$isLoading}
          >
            {getFileName(file)}
          </button>
        {/each}
      </div>
    </div>
  
    <div class="right-group">
      <button class="glow-btn" on:click={handleOpenProject} disabled={$isLoading} type="button" aria-label="Open Project Folder">
        {#if $isLoading}⏳{:else}📂{/if}
      </button>
      <Clock3 class="clock-icon" />
      <span class="timer">{$time}</span>
    </div>
  </div>
  
  <style>
    /* Your styles are good. I've added a z-index to the button just in case. */
    .design-toolbar { width: 100%; height: 60px; background: linear-gradient(to right, #0f172a, #1a2332); border-bottom: 1px solid #00ffee55; display: flex; justify-content: space-between; align-items: center; padding: 0 1rem; color: #00ffee; font-family: 'Orbitron', monospace; box-sizing: border-box; }
    .left-group { display: flex; align-items: center; gap: 1rem; }
    .project-name { font-size: 14px; font-weight: bold; }
    .tabs { display: flex; gap: 0.25rem; align-items: center; }
    .tab { background: #1e293b; padding: 0.25rem 0.75rem; border-radius: 4px; color: #00ffeeaa; font-family: monospace; cursor: pointer; transition: background 0.2s; font-size: 13px; border: none; border-bottom: 2px solid transparent; }
    .tab:disabled { cursor: not-allowed; opacity: 0.6; }
    .tab.active { background: #00ffee22; color: #00ffee; border-bottom: 2px solid #00ffee; }
    .right-group { display: flex; align-items: center; gap: 0.75rem; }
    .glow-btn { background: transparent; border: 1px solid #00ffee44; color: #00ffee; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 16px; cursor: pointer; box-shadow: 0 0 6px #00ffee55; transition: background 0.2s; /* Add these two lines to prevent click issues */ position: relative; z-index: 99; }
    .glow-btn:hover { background: #00ffee22; }
    .glow-btn:disabled { cursor: not-allowed; opacity: 0.6; box-shadow: none; }
    .clock-icon { width: 18px; height: 18px; stroke: #00ffee; }
    .timer { font-weight: bold; font-size: 15px; }

    /* Your existing styles are fine, no changes needed here. */
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
      font-family: 'Orbitron', monospace;
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
    .tab.active { background: #00ffee22; color: #00ffee; border-bottom: 2px solid #00ffee; }
    .tab.new { background: #0d1117; border: 1px dashed #00ffee88; color: #00ffeecc; font-weight: bold; }
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
    .clock-icon { width: 18px; height: 18px; stroke: #00ffee; }
    .timer { font-weight: bold; font-size: 15px; }
  </style>
  
