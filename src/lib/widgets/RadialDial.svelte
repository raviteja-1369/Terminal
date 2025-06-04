<script>
  export let label = "Progress";
  export let percent = 0;
  const r = 58;
  const circumference = 2 * Math.PI * r;
  $: capped = percent > 99.5 ? 99.5 : percent;
  $: dash = (capped / 100) * circumference;
  $: empty = circumference - dash;
</script>

<div class="dial-float">
  <svg viewBox="0 0 160 160" class="dial-svg">
    <!-- Background ring -->
    <circle cx="80" cy="80" r="58" class="dial-bg"/>
    <!-- Foreground glowing arc -->
     <circle
    cx="80" cy="80" r="58"
    class="dial-fg"
    stroke-dasharray="{dash} {empty}"
    stroke-linecap="round"
    style="transform: rotate(-90deg); transform-origin: 50% 50%;"
  />
    <text x="85" y="85" class="dial-num">{percent}%</text>
   
  </svg>
  
  <div class="dial-label">{label}</div>
</div>


<style>
.dial-float {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  margin: 0 auto;
}
.dial-svg {
  width: 260px;
  height: 260px;
  overflow: visible;
}
.dial-bg {
  fill: none;
  stroke: #164060;
  stroke-width: 8;
  opacity: 0.7;
  filter: blur(0.5px);
}
.dial-fg {
  fill: none;
  stroke: var(--hud-neon);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.7s cubic-bezier(.2,1,.4,1);
  filter: drop-shadow(0 0 20px #00ffee) drop-shadow(0 0 44px #00ffee55);
}
.dial-num {
  font-family: 'Orbitron', monospace;
  fill: #00ffee;
  font-size: 2.0rem;
  font-weight: 800;
  text-anchor: middle;
  filter: drop-shadow(0 0 7px #00ffeecc);
  letter-spacing: 0.10em;
  dominant-baseline: middle;
  paint-order: stroke;
  stroke: #021213;
  stroke-width: 1px;
}

.dial-label {
  font-family: 'Orbitron', monospace;
  fill: #3ddbd9;
  font-size: 1.7rem;
  font-weight: 600;
  text-anchor: middle;
  letter-spacing: 0.18em;
  filter: drop-shadow(0 0 2px #00ffee55);
  paint-order: stroke;
  stroke: #021213;
  stroke-width: 0.6px;
}



</style>

