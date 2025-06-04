<script lang="ts">
  import HUDMain from './lib/HUDMain.svelte';
  //import DeepSeekScreen from './lib/deepseek/DeepSeekScreen.svelte';

  let showDeepSeek = false;
</script>

{#if showDeepSeek}
  <HUDMain />
{:else}
<HUDMain onGotoDeepSeek={() => showDeepSeek = true} />

{/if}
