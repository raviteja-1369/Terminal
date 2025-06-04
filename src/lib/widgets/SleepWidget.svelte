<script>
  let sleepHours = localStorage.getItem('sleepHours') || '';
  function save() { localStorage.setItem('sleepHours', sleepHours); }
</script>
<div class="widget">
  <p class="widget-label">🌙 Sleep (hrs)</p>
  <input type="number" min="0" step="0.1" bind:value={sleepHours} on:change={save} />
  <p class="widget-detail">Logged: {sleepHours || '—'}</p>
</div>
<style>
:global(.widget) {
  width: 14rem; background: #1e293b; padding: 1rem;
  border-radius: .5rem; box-shadow: 0 0 .5rem rgba(0,255,255,0.2);
  display: flex; flex-direction: column; align-items: center;
}
:global(.widget-label) {
  font-family: 'Orbitron', monospace; color: #3ddbd9; margin-bottom: .5rem;
}
:global(.widget input) {
  width: 100%; background: #0d1117; color: #00ffee; border: none;
  padding: .5rem; border-radius: .25rem; text-align: center;
}
:global(.widget-detail) {
  color: #aaa; margin-top: .5rem; font-size: .85rem;
}
</style>
