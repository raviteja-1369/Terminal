<script lang="ts">
  import { onMount } from 'svelte';
  import nodes from '../../../dataset/mindmap_nodes.json';
  import { appMode } from '../store';

  let svgEl: SVGSVGElement;

  function close() {
    appMode.set('home');
  }

  onMount(async () => {
    const d3 = await import('https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js');
    const links: any[] = [];
    nodes.forEach((n: any) => {
      if (n.links_to) {
        n.links_to.forEach((t: string) => links.push({ source: n.id, target: t }));
      }
    });

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(300, 200));

    const svg = d3.select(svgEl)
      .attr('viewBox', '0 0 600 400');

    const link = svg.append('g').selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#00ffeeaa');

    const node = svg.append('g').selectAll('circle')
      .data(nodes as any)
      .join('circle')
      .attr('r', 12)
      .attr('fill', '#00ffee')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    const label = svg.append('g').selectAll('text')
      .data(nodes as any)
      .join('text')
      .text((d: any) => d.title)
      .attr('fill', '#ffffff')
      .style('font-size', '0.6rem');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x + 15)
        .attr('y', (d: any) => d.y);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  });
</script>

<div class="mindmap">
  <button class="close-btn" on:click={close}>Close</button>
  <svg bind:this={svgEl}></svg>
</div>

<style>
.mindmap {
  position: absolute;
  top: 5vh;
  left: 5vw;
  right: 5vw;
  bottom: 5vh;
  background: rgba(0, 255, 238, 0.03);
  border: 1px solid #00ffee66;
  color: #00ffee;
  z-index: 1000;
}
.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
svg {
  width: 100%;
  height: 100%;
}
</style>
