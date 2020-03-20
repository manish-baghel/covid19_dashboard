import Chart from 'chart.js';
import feather from 'feather-icons';
import Tabulator from 'tabulator-tables';
import './data.ts';

import csv from 'csvtojson';

const ls = window.localStorage;

const total_cases_uri = "https://covid.ourworldindata.org/data/ecdc/total_cases.csv";
const total_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/total_deaths.csv";
const new_confirmed_cases_uri = "https://covid.ourworldindata.org/data/ecdc/new_cases.csv";
const new_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/new_deaths.csv";

let total_cases = []

async function getData(){
    return Promise.all([
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
        // plotGraph(tcases,tdeaths,ncases,ndeaths)
        // buildTable(tcases,tdeaths,ncases,ndeaths)
        return [tcases,tdeaths,ncases,ndeaths];
        
      });
}



// Graphs
async function plotGraph(){
  var data1 = []
  var data2 = []
  var data3 = []
  var data4 = []
  if(!ls.getItem('tcases')){
    // let resp = await getData();
    console.log("fetching data");
    [data1,data2,data3,data4] = await getData();
    ls.setItem('updated_at',Date.now());
    ls.setItem('tcases',JSON.stringify(data1))
    ls.setItem('tdeaths',JSON.stringify(data2))
    ls.setItem('ncases',JSON.stringify(data3))
    ls.setItem('ndeaths',JSON.stringify(data4))
  }else{
    data1 = JSON.parse(ls.getItem('tcases'))
    data2 = JSON.parse(ls.getItem('tdeaths'))
    data3 = JSON.parse(ls.getItem('ncases'))
    data4 = JSON.parse(ls.getItem('ndeaths'))
  }
  var ctx = document.getElementById('myChart')
  var labels = []
  let tcases = [],
      tdeaths = [],
      ncases = [],
      ndeaths = []
  for(let i=0; i< data1.length; ++i){
    // console.log(i,data1[i]["date"]);
      let lb = new Date(data1[i]["date"]).toDateString().substr(4,6);
      labels.push(lb);
      tcases.push(data1[i]["World"]);
      tdeaths.push(data2[i]["World"]);
      ncases.push(data3[i]["World"]);
      ndeaths.push(data4[i]["World"]);
  }
  var myChart = new Chart(ctx, 
  {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: tcases,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          pointBackgroundColor: '#007bff',
          label:"Total Infected"
        },
        {
          data: tdeaths,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#c8465d',
          pointBackgroundColor: '#c8465d',
          label:"Total Deaths"
        },
        {
          data: ncases,
          lineTension: 0,
          backgroundColor: 'transparent',
          borderColor: '#846bbc',
          pointBackgroundColor: '#846bbc',
          label:"New Confirmed Cases"
        },
        {
          data: ndeaths,
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


  var table = new Tabulator("#main-data-table", {
    data:dataArray,           //load row data from array
    layout:"fitColumns",      //fit columns to width of table
    responsiveLayout:"hide",  //hide columns that dont fit on the table
    tooltips:true,            //show tool tips on cells
    addRowPos:"top",          //when adding a new row, add it to the top of the table
    history:true,             //allow undo and redo actions on the table
    pagination:"local",       //paginate the data
    paginationSize:10,         //allow 7 rows per page of data
    movableColumns:false,      //allow column order to be changed
    resizableRows:false,
    resizableColumns:false,       //allow row order to be changed
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
  if(ls.getItem('updated_at')){
    let ut = ls.getItem('updated_at');
    let ct = Date.now();
    let diff = 60*60*1000;
    if(ct - parseInt(ut) > diff){
      console.log("Clearing ls");
      ls.clear();
    }
  }
  plotGraph()
}())