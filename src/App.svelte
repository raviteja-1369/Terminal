<script lang="ts">
  import { appMode } from './lib/store';
  import HUDMain from './lib/HUDMain.svelte';
  import ProjectSpacePortal from './lib/ProjectSpace/ProjectSpacePortal.svelte';

  let showDeepSeek = false;
</script>

{#if showDeepSeek}
  <HUDMain />
{:else}
  {#if $appMode === 'pspace'}
    <ProjectSpacePortal />
  {:else}
    <HUDMain onGotoDeepSeek={() => showDeepSeek = true} />
  {/if}
{/if}
