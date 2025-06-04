<script>
  let note = '';
  function save() {
    if (!note.trim()) return;
    const logs = JSON.parse(localStorage.getItem('journalLogs') || '[]');
    logs.push({ text: note, time: new Date().toISOString() });
    localStorage.setItem('journalLogs', JSON.stringify(logs));
    note = '';
  }
</script>
<div class="widget">
  <p class="widget-label">📝 Journal</p>
  <textarea rows="3" bind:value={note} placeholder="Thoughts..."></textarea>
  <button on:click={save}>Save</button>
</div>
<style>
:global(.widget textarea) {
  width: 100%; background: #0d1117; color: #00ffee; border: none;
  padding: .5rem; border-radius: .25rem; font-family: monospace;
}
:global(.widget button) {
  margin-top: .5rem; background: cyan; color: black;
  border: none; padding: .5rem 1rem; border-radius: .25rem;
  font-family: 'Orbitron', monospace; cursor: pointer;
}
</style>
