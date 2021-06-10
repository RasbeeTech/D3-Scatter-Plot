const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
xhr.send();
xhr.onload = () => {
    const json = JSON.parse(xhr.responseText);
    const dataset = json;
    scatterPlot(dataset);
}

function scatterPlot(dataset){
    console.log(dataset);

    const height = 400;
    const width = 800;
    const padding = 60;
    
    let timeFormat = d3.timeFormat('%M:%S');
    const years = dataset.map((data) => {
        console.log(typeof data.Year);
        return data.Year;
    });
    const xScale = d3.scaleLinear()
                     .domain(d3.min(years), d3.max(years))
                     .range([padding, width - padding]);
    
    const times = dataset.map((data) => {
        return data.Time;
    });
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
    const yScale = d3.scaleTime()
                     .domain(d3.min(times), d3.max(times))
                     .range([padding, height - padding]);
    
    var yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
    console.log(years);
    console.log(times);

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
       .attr('cy', (d) => yScale(d.Time))
       .attr('r', 5);
                  
}