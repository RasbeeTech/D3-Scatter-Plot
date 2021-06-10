const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
xhr.send();
xhr.onload = () => {
    const json = JSON.parse(xhr.responseText);
    const dataset = json;
    scatterPlot(dataset);
}

function scatterPlot(dataset){
    // SVG constants.
    const height = 400;
    const width = 800;
    const padding = 60;
    
    const timeFormat = d3.timeFormat('%M:%S');
    
    const keys = ['Doping allegations', 'No doping Allegations'];
    const colors = d3.scaleOrdinal()
                   .domain(keys)
                   .range(d3.schemeSet1);

    // Data constants.
    const years = dataset.map((data) => data.Year);
    const times = dataset.map((data) => {
        let parsedTime = data.Time.split(':');
        return new Date(2021, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });
    
    // Create x and y scales.
    const xScale = d3.scaleLinear()
                     .domain([d3.min(years) -1 , d3.max(years) + 1])
                     .range([padding, width - padding]);

    const yScale = d3.scaleTime()
                     .domain(d3.extent(times))
                     .range([padding, height - padding]);
    
    // Set x and y axis displays.
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    // Tooltip
    const tooltip = d3.select('.visContainer')
                      .append('div')
                      .attr('id', 'tooltip')
                      .style('opacity', 0)
                      .attr('data-year', 2021);

    // Create SVG.
    const svg = d3.select('.visContainer')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);
    
    // Add Title.
    svg.append('text')
       .attr('id', 'title')
       .attr('x', width / 2)
       .attr('y', 0 + padding/2)
       .attr('text-anchor', 'middle')
       .attr('font-size', '30px')
       .text('Doping in professionl biking');
    
    // Plot data.
    svg.selectAll('circle')
       .data(dataset)
       .enter()
       .append('circle')
       .attr('class', 'dot')
       .attr('data-xvalue',(d) => d.Year)
       .attr('data-yvalue',(d, i) => times[i])
       .attr('cx', (d) => xScale(d.Year))
       .attr('cy', (d, i) => yScale(times[i]))
       .attr('r', 5)
       .style('fill', (d) => {
          return colors(
              d.Doping === '' ? keys[0] : keys[1]
          );
       })
       // Implement tooltips when hover of plot point.
       .on('mouseover', (event, data) => {
           tooltip.transition().duration(200).style('opacity', 0.9);
           tooltip
                  .html(
                    data.Name + ': ' + 
                    data.Nationality + '<br>' + 
                    'Year: ' + data.Year +  '<br>' +
                    'Time: ' + data.Time
                  )
                  .attr('data-year', data.Year)
                  .style('left', (event.pageX) + 'px')
                  .style('top', (event.pageY) + 'px')
       })
       .on('mouseout', () => {
           tooltip.transition().duration(200).style('opacity', 0);
       });
    
    // Display x and y 
    svg.append('g')
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0,' + (height - padding) + ')')
       .call(xAxis);

    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')
       .call(yAxis);
    
    // Legend
    const legendContainer = svg.append('g').attr('id', 'legend');
    legendContainer.selectAll('rect')
                   .data(keys)
                   .enter()
                   .append('rect')
                   .attr('x', width - padding * 3)
                   .attr('y', (d, i) => 20 * i + 100)
                   .attr('width', 10)
                   .attr('height', 10)
                   .style('fill', (d) => colors(d));
    legendContainer.selectAll('text')
          .data(keys)
          .enter()
          .append('text')
          .attr('x', width - (padding * 3) + 15)
          .attr('y', (d, i) => 20 * i + 105)
          .style('fill', (d) => colors(d))
          .text((d) => d)
          .attr('text-anchor', 'left')
          .style('alignment-baseline', 'middle');
};