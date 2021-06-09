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

    const svg = d3.select('.visContainer')
                  .append('svg')
                  .attr('width', width)
                  .attr('height', height);
                  
}