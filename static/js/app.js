function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sampleData) {
    console.log(sampleData);
  
    // Use d3 to select the panel with id of `#sample-metadata`
    var md = d3.select('#sample-metadata');
  
  // Use `.html("") to clear any existing metadata
    md.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
    Object.entries(sampleData).forEach(([key, value]) => {
      md.append('p').text(`${key}, ${value}`);
    })

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    console.log("Bonus Answer: Nah, I can't figure this part out. Might circle back.")
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function (chartData) {
    
    // Testing to see if the d3 call was correct
    // console.log(chartData);
    // console.log(chartData.otu_ids);
    // console.log(chartData.otu_labels);
    // console.log(chartData.sample_values);
    
    // Creating multiple consts to refer to frequently used values
    const otu_ids = chartData.otu_ids;
    const otu_labels = chartData.otu_labels;
    const sample_values = chartData.sample_values;
  
  
    // @TODO: Build a Bubble Chart using the sample data
  var bubData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
    }
  }];    

  var bubLayout = {
    margin: { t: 0 },
    hovertext: otu_labels,
    hoverinfo: 'hovertext',
    xaxis: {title: 'OTU ID'},
  };

  Plotly.plot('bubble', bubData, bubLayout);


  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).

  var pieData = [{
    // using slice to get values 0-10 (tried 0-9, remember to ask why we start at 0 if 0 isn't the 1st row of values)
    values: sample_values.slice(0,10),
    labels: otu_ids.slice(0,10),
    hovertext: otu_labels.slice(0,10,),
    hoverinfo: 'hovertext',
    type: 'pie'
  }];

  var pieLayout = {
    margin: {t: 0, l: 0}
  }

  Plotly.plot('pie', pieData, pieLayout); 

});  
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
