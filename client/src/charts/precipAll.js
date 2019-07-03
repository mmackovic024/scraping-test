import * as d3 from 'd3';

export default function tempAll(data) {
  const margin = { top: 20, right: 20, bottom: 30, left: 30 },
    width = 1500,
    height = 550;

  const svg = d3.select(`#chart`).style('background-color', 'lightyellow');

  if (data) {
    const avgPrecip = Math.round(d3.mean(data.map(d => d.precip)) * 30);

    const yAxis = d3
      .scaleLinear()
      .domain([d3.min(data, d => +d.precip), d3.max(data, d => +d.precip) + 5])
      .range([height - margin.bottom, margin.top]);

    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(d3.axisLeft(yAxis).tickSize(width - margin.right - margin.left))
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', -(width - margin.left - margin.right - 5))
          .attr('dy', -40)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .attr('font-size', '.85rem')
          .text('mm')
      )
      .selectAll('.tick:not(:first-child) line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');

    const xAxis = d3
      .scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)))
      .range([margin.left, width - margin.right]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(xAxis).tickSize(-(height - margin.top - margin.bottom))
      )
      .selectAll('.tick:not(:first-child) line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');

    svg
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => xAxis(new Date(d.date)))
      .attr('y', d => yAxis(+d.precip))
      .attr('height', d => height - margin.bottom - yAxis(+d.precip))
      .attr('width', (width - margin.left - margin.right) / data.length)
      .attr('fill', '#3f51b5');

    svg
      .append('text')
      .attr('x', (width - margin.left - margin.bottom) / 2)
      .attr('y', margin.top + 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '1.25rem')
      .text(`Average monthly precipitation ${avgPrecip}mm`);
  }
}
