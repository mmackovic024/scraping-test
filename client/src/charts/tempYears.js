import * as d3 from 'd3';
import getYear from '../helpers/getYear';

export default function tempYears(data, filteredData, years) {
  const margin = { top: 40, right: 20, bottom: 40, left: 30 },
    width = 1500,
    height = 550;

  if (data) {
    const daysAbove30 = filteredData.filter(day => day.high >= 30).length;

    const daysBelowNeg5 = filteredData.filter(day => day.low <= -5).length;

    const tempsByYear = years.map(year => ({
      high: d3.max(
        filteredData
          .filter(day => getYear(day.date) === year)
          .map(el => +el.high)
      ),
      low: d3.min(
        filteredData
          .filter(day => getYear(day.date) === year)
          .map(el => +el.low)
      )
    }));

    const svg = d3.select(`#chart`).style('background-color', 'lightyellow');

    const yAxis = d3
      .scaleLinear()
      .domain([d3.min(data, d => +d.low), d3.max(data, d => +d.high) + 5])
      .range([height - margin.bottom, margin.top]);

    svg.select(`#yAxis`).remove();

    svg
      .append('g')
      .attr('id', `yAxis`)
      .attr('transform', `translate(${width - margin.right},0)`)
      .call(d3.axisLeft(yAxis).tickSize(width - margin.right - margin.left))
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', -(width - margin.left - margin.right - 5))
          .attr('dy', 15)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .attr('font-size', '.85rem')
          .text('°C')
      )
      .selectAll('.tick:not(:first-child) line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');

    const xAxis = d3
      .scaleTime()
      .domain(d3.extent(filteredData, d => new Date(d.date)))
      .range([margin.left, width - margin.right]);

    svg.select(`#xAxis`).remove();

    svg
      .append('g')
      .attr('id', `xAxis`)
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xAxis).ticks(0));

    const area = d3
      .area()
      .curve(d3.curveStep)
      .x(
        (d, i) =>
          ((i + 1) * (width - margin.left - margin.right)) /
            filteredData.length +
          margin.left
      )
      .y0(d => yAxis(+d.low))
      .y1(d => yAxis(+d.high));

    svg.selectAll('path:not(.domain)').remove();

    svg
      .append('path')
      .datum(filteredData)
      .attr('fill', '#f50057')
      .attr('opacity', 0.5)
      .attr('d', area);

    svg.selectAll('.divider').remove();

    svg
      .selectAll('.divider')
      .data(years)
      .join('line')
      .attr('class', 'divider')
      .attr(
        'x1',
        (d, i) =>
          (i * (width - margin.left - margin.right)) / years.length +
          margin.left
      )
      .attr('y1', margin.top)
      .attr(
        'x2',
        (d, i) =>
          (i * (width - margin.left - margin.right)) / years.length +
          margin.left
      )
      .attr('y2', height - margin.bottom + 6)
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');

    svg.selectAll(`.label`).remove();

    const labelScale = d3
      .scaleLinear()
      .domain([0, years.length])
      .range([margin.left, width - margin.right]);

    svg
      .selectAll(`.label`)
      .data(years)
      .join('text')
      .attr('class', `label`)
      .attr('x', (d, i) => labelScale(i) + width / years.length / 2)
      .attr('y', height - margin.bottom / 2.5)
      .attr('text-anchor', 'middle')
      .text(d => d)
      .style('font-size', '1.25rem')
      .exit();

    svg.selectAll(`.info`).remove();

    svg
      .selectAll(`.info`)
      .data(tempsByYear)
      .join('text')
      .attr('class', `info`)
      .attr('x', (d, i) => labelScale(i) + width / years.length / 2)
      .attr('y', margin.top + 25)
      .attr('text-anchor', 'middle')
      .text(d => `↑${d.high}°C  ↓${d.low}°C`)
      .style('font-size', '1rem');

    svg.selectAll(`.comment`).remove();

    if (years.length > 0) {
      svg
        .append('text')
        .attr('class', `comment`)
        .attr('x', (width - margin.top - margin.bottom) / 2)
        .attr('y', margin.top / 1.5)
        .attr('text-anchor', 'middle')
        .text(
          `Total shown ${
            filteredData.length
          } days  - 🥵 ${daysAbove30} with high temp above 30°C - 🥶 ${daysBelowNeg5} with low temp below -5°C`
        )
        .style('font-size', '1.25rem');
    }
  }
}
