import csv from 'csvtojson';

const total_cases_uri = "https://covid.ourworldindata.org/data/ecdc/total_cases.csv";
const total_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/total_deaths.csv";
const new_confirmed_cases_uri = "https://covid.ourworldindata.org/data/ecdc/new_cases.csv";
const new_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/new_deaths.csv";

let total_cases = []

fetch(total_cases_uri)
	.then(resp => {
		const reader = resp.body.getReader();
		return new ReadableStream({
		    start(controller){
		      return pump();
		      function pump(){
		        return reader.read().then(({ done, value }) => {
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
	})
	.then(stream => new Response(stream))
	.then(response => response.blob())
	.then(blob => blob.text())
	.then(text => {
		csv()
			.fromString(text)
			.then(jsonObj => {
				console.log(jsonObj);
			})
	});
