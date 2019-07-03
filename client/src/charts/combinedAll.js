import * as d3 from 'd3';

export default function combinedAll(data) {
  const margin = { top: 20, right: 30, bottom: 30, left: 30 },
    width = 1500,
    height = 550;

  const svg = d3.select(`#chart`).style('background-color', 'lightyellow');

  if (data) {
    const { temps, precip } = data;

    const yAxisTemp = d3
      .scaleLinear()
      .domain([d3.min(temps, d => +d.low), d3.max(temps, d => +d.high) + 5])
      .range([height - margin.bottom, margin.top]);

    const yAxisPrecip = d3
      .scaleLinear()
      .domain([
        d3.min(precip, d => +d.precip),
        d3.max(precip, d => +d.precip) + 5
      ])
      .range([height - margin.bottom, margin.top]);

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(
        d3.axisLeft(yAxisTemp).tickSize(-(width - margin.right - margin.left))
      )
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 5)
          .attr('dy', 15)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .attr('font-size', '.85rem')
          .text('°C')
      )
      .selectAll('.tick:not(:first-child) line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');

    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(d3.axisRight(yAxisPrecip))
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', -5)
          .attr('dy', -40)
          .attr('text-anchor', 'end')
          .attr('font-weight', 'bold')
          .attr('font-size', '.85rem')
          .text('mm')
      );

    const xAxis = d3
      .scaleTime()
      .domain(d3.extent(temps, d => new Date(d.date)))
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

    const area = d3
      .area()
      .curve(d3.curveStep)
      .x(d => xAxis(new Date(d.date)))
      .y0(d => yAxisTemp(+d.low))
      .y1(d => yAxisTemp(+d.high));

    svg
      .append('path')
      .datum(temps)
      .attr('fill', '#f50057')
      .attr('d', area);

    svg
      .selectAll('rect')
      .data(precip)
      .join('rect')
      .attr('x', d => xAxis(new Date(d.date)))
      .attr('y', d => yAxisPrecip(+d.precip))
      .attr('height', d => height - margin.bottom - yAxisPrecip(+d.precip))
      .attr('width', (width - margin.left - margin.right) / precip.length)
      .attr('fill', '#3f51b5');
  }
}
