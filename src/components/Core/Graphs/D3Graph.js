import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const D3Graph = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return; // Wait until data is available

    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Define the zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])  // Set zoom limits
      .on('zoom', zoomed);

    svg.call(zoom); // Apply zoom behavior to SVG

    // Map nodes by their id for easy lookup
    const nodeMap = new Map(data.nodes.map(d => [d.id, d]));

    // Create links using nodeMap to ensure correct source/target reference
    const links = data.links.map(link => ({
      source: nodeMap.get(link.src_node_id),
      target: nodeMap.get(link.dst_node_id),
      label: link.label,
      bidirectional: link.bidirectional
    }));

    // Set up the force simulation
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create link (edge) elements
    const link = svg.append('g')
      .selectAll('.link')
      .data(links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2);

    // Create node (circle) elements
    const node = svg.append('g')
      .selectAll('.node')
      .data(data.nodes)
      .enter().append('circle')
      .attr('class', 'node')
      .attr('r', 20)
      .attr('fill', d => d.type === 'subject' ? '#0077cc' : '#ff5722')
      .call(d3.drag()
        .on('start', dragStart)
        .on('drag', dragged)
        .on('end', dragEnd));

    // Add labels to the nodes
    const label = svg.append('g')
      .selectAll('.label')
      .data(data.nodes)
      .enter().append('text')
      .attr('class', 'label')
      .attr('dx', 25)
      .attr('dy', '.35em')
      .text(d => d.label);

    // Update positions on each simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Zoom behavior function (for panning and zooming)
    function zoomed(event) {
      svg.selectAll('g')
        .attr('transform', event.transform); // Apply the transform (zoom/pan) to the group
    }

    // Dragging behavior
    function dragStart(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnd(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Clean up when component unmounts
    return () => {
      svg.selectAll('*').remove(); // Clean up previous SVG elements
    };

  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default D3Graph;
