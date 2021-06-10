const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
xhr.send();
xhr.onload = () => {
    const json = JSON.parse(xhr.responseText);
    const dataset = json;
    scatterPlot(dataset);
}

function scatterPlot(dataset){
    const height = 400;
    const width = 800;
    const padding = 60;
    
    let timeFormat = d3.timeFormat('%M:%S');

    const years = dataset.map((data) => data.Year);
    const times = dataset.map((data) => {
        let parsedTime = data.Time.split(':');
        return new Date(2021, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });
    console.log('years:', years);
    console.log('times:', times);

    const xScale = d3.scaleLinear()
                     .domain([d3.min(years) -1 , d3.max(years) + 1])
                     .range([padding, width - padding]);

    const yScale = d3.scaleTime()
                     .domain(d3.extent(times))
                     .range([padding, height - padding]);
    
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
    console.log(xScale(years[5]));
    console.log(yScale(times[5]));

    const svg = d3.select('.visContainer')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);
    
    svg.selectAll('circle')
       .data(dataset)
       .enter()
       .append('circle')
       .attr('class', 'dot')
       .attr('data-xvalue',(d) => d.Year)
       .attr('data-yvalue',(d) => d.Time)
       .attr('cx', (d) => xScale(d.Year))
       .attr('cy', (d, i) => yScale(times[i]))
       .attr('r', 5);
    
    svg.append('g')
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0,' + (height - padding) + ')')
       .call(xAxis);

    svg.append('g')
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + padding + ', 0)')
       .call(yAxis);
};