import Chart from 'chart.js';
import feather from 'feather-icons';
import Tabulator from 'tabulator-tables';
import './data.ts';
import csv from 'csvtojson';
import Datamap from 'datamaps';
import * as d3 from 'd3';

const ls = window.localStorage;

const total_cases_uri = "https://covid.ourworldindata.org/data/ecdc/total_cases.csv";
const total_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/total_deaths.csv";
const new_confirmed_cases_uri = "https://covid.ourworldindata.org/data/ecdc/new_cases.csv";
const new_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/new_deaths.csv";

let total_cases = []

// fetch Data from apis

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
  global.myChart = myChart;
}

// Data Maps
function generateWorldMap(){
  let elem = document.getElementById('world-map-container');
  if(elem.children.length==0){
    var wmap = new Datamap({
      element: elem
    });
  }
}


function generateIndia(){
  let elem = document.getElementById('india-map-container');
  if(elem.children.length==0){
    var indmap = new Datamap({
      element: elem,
      scope: 'india',
      geographyConfig: {
          popupOnHover: true,
          highlightOnHover: true,
          borderColor: '#444',
          borderWidth: 0.5,
          dataUrl: 'https://rawgit.com/Anujarya300/bubble_maps/master/data/geography-data/india.topo.json'
          //dataJson: topoJsonData
      },
      fills: {
          'MAJOR': '#306596',
          'MEDIUM': '#0fa0fa',
          'MINOR': '#bada55',
          defaultFill: '#dddddd'
      },
      data: {
          'JH': { fillKey: 'MINOR' },
          'MH': { fillKey: 'MINOR' }
      },
      setProjection: function (element) {
          var projection = d3.geoMercator()
              .center([78.9629, 23.5937]) // always in [East Latitude, North Longitude]
              .scale(1000);
          var path = d3.geoPath().projection(projection);
          return { path: path, projection: projection };
      }
    });
  }
}

function generateUsa(){
  let elem = document.getElementById('usa-map-container');
  if(elem.children.length==0){
    var usmap = new Datamap({
      element:elem,
      scope:'usa'
    });
  }
}


// Event Listeners

let linbtn = document.getElementById("linearScale");
let logbtn = document.getElementById("logScale");

linbtn.addEventListener("click", () => {
  let chart = global.myChart;
  logbtn.classList.remove("active");
  linbtn.classList.add("active");
  chart.options.scales.yAxes[0] = {
      type: 'linear'
  };
  chart.update();
});

logbtn.addEventListener("click", () => {
  let chart = global.myChart;
  logbtn.classList.add("active");
  linbtn.classList.remove("active");
  chart.options.scales.yAxes[0] = {
      type: 'logarithmic'
  };
  chart.update();
});

function routeHelper(elem){
  let main = document.getElementById("main");
  let children = Array.from(main.children);
  children = children.filter(k => k!=elem);
  for(let child of children){
    child.classList.remove("d-flex")
    child.classList.add("d-none");
  }
  if(!elem.id=="chart-container") elem.classList.add("d-flex");
}

function listHelper(ev){
  let e = document.getElementById("link-list");
  let elem = ev.target.parentNode;
  let children = Array.from(e.children);
  children = children.filter(k => k!=elem);
  for(let child of children){
    child.children[0].classList.remove("active");
  }
  elem.children[0].classList.add("active");
}

async function chartHelper(){
  if(ls.getItem('updated_at')){
    let ut = ls.getItem('updated_at');
    let ct = Date.now();
    let diff = 60*60*1000;
    if(ct - parseInt(ut) > diff){
      console.log("Clearing ls");
      ls.clear();
    }
  }
  await plotGraph();
  buildTable();
}

let dashbtn = document.getElementById('dashbtn');
let worldbtn = document.getElementById('worldbtn');
let abtbtn = document.getElementById('abtbtn');
let indbtn = document.getElementById('indbtn');
let usabtn = document.getElementById('usabtn');

worldbtn.addEventListener("click",(ev) => {
  let elem = document.getElementById("world-map-container");
  routeHelper(elem);
  listHelper(ev);
  if(elem.classList.contains("d-none")){
    elem.classList.remove("d-none");
    generateWorldMap();
  }
});

dashbtn.addEventListener("click",(ev) => {
  let elem = document.getElementById("chart-container");
  routeHelper(elem);
  listHelper(ev);
  if(elem.classList.contains("d-none")){
    elem.classList.remove("d-none");
    chartHelper();
  }
});

indbtn.addEventListener("click",(ev) => {
  let elem = document.getElementById("india-map-container");
  routeHelper(elem);
  listHelper(ev);
  if(elem.classList.contains("d-none")){
    elem.classList.remove("d-none");
    generateIndia();
  }
});

usabtn.addEventListener("click",(ev) => {
  let elem = document.getElementById("usa-map-container");
  routeHelper(elem);
  listHelper(ev);
  if(elem.classList.contains("d-none")){
    elem.classList.remove("d-none");
    generateUsa();
  }
});


// Table related functions

function buildTable(){
  let tcases = JSON.parse(ls.getItem('tcases')),
    tdeaths = JSON.parse(ls.getItem('tdeaths')),
    ncases = JSON.parse(ls.getItem('ncases')),
    ndeaths = JSON.parse(ls.getItem('ndeaths'));
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




// on document load IIFE
(async function () {
  'use strict'

  feather.replace();
  chartHelper();
}())