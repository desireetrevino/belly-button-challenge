// Read samples.json with D3 library
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let samplesdata = {}

d3.json(url).then(function(data){
    // Store data as variables
    const names = Object.values(data.names);
    const metadata = data.metadata;
    const samples = data.samples.sort((a,b)=> b.sample_values-a.sample_values);
    samplesdata = {names, metadata, samples}
    console.log(samplesdata)
    init(names, metadata, samples)
});

// Define how we setup the page
function init(names, metadata, samples) {
    let i = 0;
// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual. 
    barchart(samples, i);
// Create a bubble chart that displays each sample.
    bubblechart(samples, i);
// Display a sample metadata
    demographics(metadata, i);
// Initialize dropdown menu
names.map(item => d3.select('#selDataset').append('option').attr('value',item).text(item));
    }

// Bar Chart Function
function barchart(samples, i) {
    let bardata = [{
        // Use sample_values as the values for the bar chart.
        x: samples[i].sample_values.slice(0,10).reverse(),
        // Use otu_ids as the labels for the bar chart.
        y: samples[i].otu_ids.slice(0,10).map(object => `OTU ${object}`).reverse(),
        // Use otu_labels as the hovertext for the chart.
        text: samples[i].otu_labels.slice(0,10).reverse(),
        type:'bar',
        orientation: 'h'}];  
    Plotly.newPlot('bar', bardata);
}

// Bubble Chart Function
function bubblechart(samples, i) {
    let bubbledata = [{
        // Use otu_ids for the x values.
        x: samples[i].otu_ids,
        // Use sample_values for the y values.
        y: samples[i].sample_values,
        // Use otu_labels for the text values.
        text: samples[i].otu_labels,
        mode: 'markers',
        marker: {
            // Use otu_ids for the marker colors.
            color: samples[i].otu_ids,
            // Use sample_values for the marker size.
            size: samples[i].sample_values
                }
        }]
    Plotly.newPlot('bubble', bubbledata)
    }

// Display the sample metadata, i.e., an individual's demographic information.
function demographics(metadata, i) {
    // Display each key-value pair from the metadata JSON object somewhere on the page.
    let demdata = [];
    d3.selectAll('tbody').remove()
    demdata = Object.entries(metadata[i]);
    let userinfo = demdata.map( ([key,val] = entry) => {
        d3.select('#sample-metadata').append('tbody').text(`${key}: ${val}`);
    });   
}


// Update all the plots when a new sample is selected (Event listener)
d3.selectAll("#selDataset").on("change", optionChanged(this.value));

function optionChanged(new_id) {
    //console.log(Object.values(samplesdata.names))
    let namesarray = Object.values(samplesdata.names)
    let j = namesarray.findIndex((x) => x === new_id);
    console.log(`new id is ${new_id} and j is ${j}`);
    barchart(samplesdata.samples, j);
    bubblechart(samplesdata.samples, j);
    demographics(samplesdata.metadata, j);
}

// Tell the page to start 
init();