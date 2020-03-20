import Chart from 'chart.js';
import feather from 'feather-icons';
import Tabulator from 'tabulator-tables';
import './data.ts';

import csv from 'csvtojson';

const total_cases_uri = "https://covid.ourworldindata.org/data/ecdc/total_cases.csv";
const total_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/total_deaths.csv";
const new_confirmed_cases_uri = "https://covid.ourworldindata.org/data/ecdc/new_cases.csv";
const new_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/new_deaths.csv";

let total_cases = []

Promise.all([
  fetch(total_cases_uri),
  fetch(total_deaths_uri),
  fetch(new_confirmed_cases_uri),
  fetch(new_deaths_uri)
]).then(([tcases,tdeaths,ncases,ndeaths]) => {
    const reader1 = tcases.body.getReader();
    const reader2 = tdeaths.body.getReader();
    const reader3 = ncases.body.getReader();
    const reader4 = ndeaths.body.getReader();
    return [ 
      new ReadableStream({
        start(controller){
          return pump();
          function pump(){
            return reader1.read().then(({ done, value }) => {
              if (done) {
                  controller.close();
                  return;
              }
              controller.enqueue(value);
              return pump();
            });
          }
        }  
      }),
      new ReadableStream({
        start(controller){
          return pump();
          function pump(){
            return reader2.read().then(({ done, value }) => {
              if (done) {
                  controller.close();
                  return;
              }
              controller.enqueue(value);
              return pump();
            });
          }
        }  
      }),
      new ReadableStream({
        start(controller){
          return pump();
          function pump(){
            return reader3.read().then(({ done, value }) => {
              if (done) {
                  controller.close();
                  return;
              }
              controller.enqueue(value);
              return pump();
            });
          }
        }  
      }),
      new ReadableStream({
        start(controller){
          return pump();
          function pump(){
            return reader4.read().then(({ done, value }) => {
              // When no more data needs to be consumed, close the stream
              if (done) {
                  controller.close();
                  return;
              }
              // Enqueue the next data chunk into our target stream
              controller.enqueue(value);
              return pump();
            });
          }
        }  
      })
    ]
  })
  .then(streams => [new Response(streams[0]),new Response(streams[1]),new Response(streams[2]),new Response(streams[3])])
  .then(async response => {
    let blobs = [await response[0].blob(),await response[1].blob(),await response[2].blob(),await response[3].blob()]
    return blobs
  })
  .then(async blobs => {
    let texts = [await blobs[0].text(),await blobs[1].text(),await blobs[2].text(),await blobs[3].text()]
    return texts;
  })
  .then(async texts => {
    let tcases = await csv().fromString(texts[0])
    let tdeaths = await csv().fromString(texts[1])
    let ncases = await csv().fromString(texts[2])
    let ndeaths = await csv().fromString(texts[3])
    plotGraph(tcases,tdeaths,ncases,ndeaths)
    buildTable(tcases,tdeaths,ncases,ndeaths)
    
  });

// Graphs
function plotGraph(jsonObj1,jsonObj2,jsonObj3,jsonObj4){
  var ctx = document.getElementById('myChart')
  var labels = []
  var data1 = []
  var data2 = []
  var data3 = []
  var data4 = []
  let i = 0;
  for(i=0;i<jsonObj1.length;i++){
    // console.log(jsonObj[i])
      let lb = new Date(jsonObj1[i]["date"]).toDateString().substr(4,6);
      labels.push(lb);
      data1.push(jsonObj1[i]["World"]);
      data2.push(jsonObj2[i]["World"]);
      data3.push(jsonObj3[i]["World"]);
      data4.push(jsonObj4[i]["World"]);
  }
  var myChart = new Chart(ctx, 
  {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: data1,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          pointBackgroundColor: '#007bff',
          label:"Total Infected"
        },
        {
          data: data2,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#c8465d',
          pointBackgroundColor: '#c8465d',
          label:"Total Deaths"
        },
        {
          data: data3,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#846bbc',
          pointBackgroundColor: '#846bbc',
          label:"New Confirmed Cases"
        },
        {
          data: data4,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#c6a422',
          pointBackgroundColor: '#c6a422',
          label:"New Deaths"
        }
      ]
    },
    options: {
      tooltips: {
            mode: 'index',
            axis: 'y'
      },
      scales: {
        yAxes: [{
          gridLines: {
            display: false
          },
          scaleLabel: {
            display: true,
            labelString: 'No. of cases (logarithmic)',
          },
          type: 'logarithmic',
          ticks: {
            beginAtZero: false
          }
        }],
        xAxes: [{
          gridLines: {
            display: true
          }
        }]
      },
      legend: {
        display: true
      }
    }
  });
}

function buildTable(tcases,tdeaths,ncases,ndeaths){
  let countries = Object.keys(tcases[0]).filter(e => e!=='date')
  let lastIndex = tcases.length - 1;
  let dataArray = []
  for(let c of countries){
    let obj = {
      name:c,
      tcases:tcases[lastIndex][c]
      tdeaths:tdeaths[lastIndex][c]
      ncases:ncases[lastIndex][c]
      ndeaths:ndeaths[lastIndex][c]
    }
    dataArray.push(obj);
  }


  var table = new Tabulator("#example-table", {
    data:dataArray,           //load row data from array
    layout:"fitColumns",      //fit columns to width of table
    responsiveLayout:"hide",  //hide columns that dont fit on the table
    tooltips:true,            //show tool tips on cells
    addRowPos:"top",          //when adding a new row, add it to the top of the table
    history:true,             //allow undo and redo actions on the table
    pagination:"local",       //paginate the data
    paginationSize:7,         //allow 7 rows per page of data
    movableColumns:true,      //allow column order to be changed
    resizableRows:true,       //allow row order to be changed
    initialSort:[             //set the initial sort order of the data
      {column:"tcases", dir:"dsc"},
    ],
    columns:[                 //define the table columns
      {title:"Name", field:"name",headerFilter:"input",headerFilterPlaceholder:"country name ..."},
      {title:"Total Cases", field:"tcases"},
      {title:"Total Deaths", field:"tdeaths"},
      {title:"New Cases", field:"ncases"},
      {title:"New Deaths", field:"ndeaths"}
    ],
  });
}






(function () {
  'use strict'

  feather.replace()
}())