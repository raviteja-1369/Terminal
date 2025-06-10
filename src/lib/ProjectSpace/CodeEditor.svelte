<script lang="ts">
    import { onMount } from 'svelte';
    import * as monaco from 'monaco-editor';
    import { fileContent } from './stores/editorStore';
  
    let editorContainer: HTMLDivElement;
    let editorInstance: monaco.editor.IStandaloneCodeEditor;
  
    // Sync editor content with store
    $: if (editorInstance && $fileContent !== undefined) {
      const current = editorInstance.getValue();
      if ($fileContent !== current) {
        editorInstance.setValue($fileContent);
      }
    }
  
    // Export function to get current editor value
    export function getEditorValue(): string {
      return editorInstance?.getValue?.() || '';
    }
  
    onMount(() => {
      monaco.editor.defineTheme('hud-terminal-neon', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: '', foreground: '00ffee' },
          { token: 'keyword', foreground: 'f92672', fontStyle: 'bold' },
          { token: 'comment', foreground: '5d6d7e', fontStyle: 'italic' },
          { token: 'string', foreground: '00ff7f' },
          { token: 'number', foreground: 'ffdd00' }
        ],
        colors: {
          'editor.background': '#0d1117',
          'editor.foreground': '#00ffee',
          'editorLineNumber.foreground': '#00ffee88',
          'editorCursor.foreground': '#00ffee',
          'editorLineHighlightBackground': '#00ffee11',
          'scrollbarSlider.background': '#00ffee33',
          'scrollbarSlider.hoverBackground': '#00ffee55',
          'scrollbarSlider.activeBackground': '#00ffee88'
        }
      });
  
      editorInstance = monaco.editor.create(editorContainer, {
        value: $fileContent,
        language: 'verilog',
        theme: 'hud-terminal-neon',
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true,
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
          useShadows: false,
        }
      });
  
      // Update store when user types
      editorInstance.onDidChangeModelContent(() => {
        fileContent.set(editorInstance.getValue());
      });
  
      return () => editorInstance?.dispose();
    });
  </script>
  
  <div class="editor-wrapper">
    <div class="code-editor" bind:this={editorContainer}></div>
  </div>
  
  <style>
    .editor-wrapper {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;
      margin-bottom: 1rem;
    }
  
    .code-editor {
      width: 100%;
      height: 100%;
      background: #0d1117;
      border: 1px solid #00ffee33;
      border-radius: 10px;
      overflow: hidden;
      box-sizing: border-box;
    }
  </style>
  