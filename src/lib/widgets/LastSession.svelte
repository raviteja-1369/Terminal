<script>
  let last = JSON.parse(localStorage.getItem('lastSession') || '{}');
</script>
<div class="widget">
  <p class="widget-label">⏱️ Last Session</p>
  {#if last.category}
    <p class="widget-detail">{last.category} • {last.duration}</p>
  {:else}
    <p class="widget-detail">No session yet</p>
  {/if}
</div>
<style>
/* reuse .widget and .widget-label styles from SleepWidget */
</style>
