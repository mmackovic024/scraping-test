import * as d3 from 'd3';
import getYear from '../helpers/getYear';

export default function combinedYears(
  data,
  filteredTemps,
  filteredPrecip,
  years
) {
  const margin = { top: 40, right: 30, bottom: 40, left: 30 },
    width = 1500,
    height = 550;

  if (data) {
    const { temps, precip } = data;

    const daysAbove30 = filteredTemps.filter(day => day.high >= 30).length;

    const daysBelowNeg5 = filteredTemps.filter(day => day.low <= -5).length;

    const tempsByYear = years.map(year => ({
      high: d3.max(
        filteredTemps
          .filter(day => getYear(day.date) === year)
          .map(el => +el.high)
      ),
      low: d3.min(
        filteredTemps
          .filter(day => getYear(day.date) === year)
          .map(el => +el.low)
      )
    }));

    const precipDays = filteredPrecip.filter(day => +day.precip > 0).length;

    const noPrecipDays = filteredPrecip.filter(day => +day.precip === 0).length;

    const precipByYear = years.map(year =>
      filteredPrecip.reduce((acc, el) => {
        const y = getYear(el.date);
        if (year === y) {
          acc += +el.precip;
        }
        return Math.round(acc);
      }, 0)
    );

    const svg = d3.select(`#chart`).style('background-color', 'lightyellow');

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

    svg.select(`#yAxisTemp`).remove();

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .attr('id', 'yAxisTemp')
      .call(
        d3.axisLeft(yAxisTemp).tickSize(-(width - margin.right - margin.left))
      )
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', 3)
          .attr('dy', 20)
          .attr('text-anchor', 'start')
          .attr('font-weight', 'bold')
          .attr('font-size', '.85rem')
          .text('°C')
      )
      .selectAll('.tick:not(:first-child) line')
      .attr('stroke', '#777')
      .attr('stroke-dasharray', '2,2');

    svg.select(`#yAxisPrecip`).remove();

    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right},0)`)
      .attr('id', 'yAxisPrecip')
      .call(d3.axisRight(yAxisPrecip))
      .call(g =>
        g
          .select('.tick:last-of-type text')
          .clone()
          .attr('x', -3)
          .attr('dy', 5)
          .attr('text-anchor', 'end')
          .attr('font-weight', 'bold')
          .attr('font-size', '.85rem')
          .text('mm')
      );

    const xAxis = d3
      .scaleTime()
      .domain(d3.extent(temps, d => new Date(d.date)))
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
            filteredTemps.length +
          margin.left
      )
      .y0(d => yAxisTemp(+d.low))
      .y1(d => yAxisTemp(+d.high));

    svg.selectAll('path:not(.domain)').remove();

    svg
      .append('path')
      .datum(filteredTemps)
      .attr('fill', '#f50057')
      .attr('opacity', 0.5)
      .attr('d', area);

    svg.selectAll('rect').remove();

    svg
      .selectAll('rect')
      .data(filteredPrecip)
      .join('rect')
      .attr(
        'x',
        (d, i) =>
          ((i + 1) * (width - margin.left - margin.right)) /
            filteredPrecip.length +
          margin.left
      )
      .attr('y', d => yAxisPrecip(+d.precip))
      .attr('height', d => height - margin.bottom - yAxisPrecip(+d.precip))
      .attr(
        'width',
        (width - margin.left - margin.right) / filteredPrecip.length
      )
      .attr('fill', '#3f51b5')
      .attr('opacity', 0.5)
      .exit();

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

    svg.selectAll(`.tempInfo`).remove();

    svg
      .selectAll(`.tempInfo`)
      .data(tempsByYear)
      .join('text')
      .attr('class', `tempInfo`)
      .attr('x', (d, i) => labelScale(i) + width / years.length / 2)
      .attr('y', margin.top + 25)
      .attr('text-anchor', 'middle')
      .text(d => `↑${d.high}°C  ↓${d.low}°C`)
      .style('font-size', '1rem');

    svg.selectAll(`.precipInfo`).remove();

    svg
      .selectAll(`.precipInfo`)
      .data(precipByYear)
      .join('text')
      .attr('class', `precipInfo`)
      .attr('x', (d, i) => labelScale(i) + width / years.length / 2)
      .attr('y', margin.top + 60)
      .attr('text-anchor', 'middle')
      .text(d => d + 'mm')
      .style('font-size', '1.25rem');

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
            filteredTemps.length
          } days  - 🥵 ${daysAbove30} above 30°C - 🥶 ${daysBelowNeg5} below -5°C - 💧 ${precipDays} with precipitation - 🌞 ${noPrecipDays} without precipitation`
        )
        .style('font-size', '1.25rem');
    }
  }
}
