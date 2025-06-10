#!/bin/bash

# Output file
out="project_dump.txt"
echo "" > $out  # Clear or create the file

# List of important files (update this list as needed)
files=(
"src/App.svelte"
"src/app.css"
"src/main.js"
"index.html"
"svelte.config.js"
"vite.config.js"
"src/lib/HUDMain.svelte"
"src/lib/CommandRouter.ts"
"src/lib/contextBuilder.ts"
"src/lib/llm.ts"
"src/lib/ragStore.ts"
"src/lib/memoryStore.ts"
"src/lib/store.ts"
"src/lib/toneHeader.ts"
"src/lib/tonePrefix.ts"
"src/lib/ai/perplexity.ts"
"src/lib/deepseek/ChatWindow.svelte"
"src/lib/deepseek/DeepSeekScreen.svelte"
"src/lib/deepseek/InputBar.svelte"
"src/lib/deepseek/ThoughtBox.svelte"
"src/lib/ProjectSpace/ProjectSpacePortal.svelte"
"src/lib/ProjectSpace/AIAssistant.svelte"
"src/lib/ProjectSpace/ArchitectureView.svelte"
"src/lib/ProjectSpace/CodeEditor.svelte"
"src/lib/ProjectSpace/DesignFileBar.svelte"
"src/lib/ProjectSpace/CodePromptBox.svelte"
"src/lib/ProjectSpace/SimulationPanel.svelte"
"src/lib/ProjectSpace/TabSwitcher.svelte"
"src/lib/ProjectSpace/TopToolbar.svelte"
"src/lib/ProjectSpace/api/FileAPI.ts"
"src/lib/ProjectSpace/api/PerplexityAPI.ts"
"src/lib/ProjectSpace/api/SimAPI.ts"
"src/lib/ProjectSpace/backend/fetchFiles.ts"
"src/lib/ProjectSpace/backend/saveFile.ts"
"src/lib/ProjectSpace/logs/ProjectLog.ts"
"src/lib/ProjectSpace/sim/SimulationManager.ts"
"src/lib/ProjectSpace/stores/editorStore.ts"
"src/lib/ProjectSpace/utils/fileHelpers.ts"
"src/lib/ProjectSpace/utils/simHelpers.ts"
"src/lib/widgets/WelcomePortal.svelte"
"src/lib/widgets/BottomWidget.svelte"
"src/lib/widgets/CommandBox.svelte"
"src/lib/widgets/FloatingStream.svelte"
"src/lib/widgets/JournalWidget.svelte"
"src/lib/widgets/LastSession.svelte"
"src/lib/widgets/MindMapScreen.svelte"
"src/lib/widgets/PracticeQPortal.svelte"
"src/lib/widgets/RadialDial.svelte"
"src/lib/widgets/ResponseLeaf.svelte"
"src/lib/widgets/SleepWidget.svelte"
"src/lib/widgets/StreakWidget.svelte"
"src/lib/widgets/StatusDock.svelte"
)

# Loop over files and append content
for f in "${files[@]}"
do
  if [[ -f "$f" ]]; then
    echo "// $f" >> $out
    echo "" >> $out
    cat "$f" >> $out
    echo -e "\n\n" >> $out
  else
    echo "// $f (NOT FOUND)" >> $out
    echo -e "\n\n" >> $out
  fi
done

echo "✅ Done. All contents dumped into $out"
