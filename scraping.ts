import csv from 'csvtojson';

const HtmlTableToJson = require('html-table-to-json');


const cors_proxy = "https://morning-king-2527.corsproxyaccess.workers.dev/?";
const testing_uri = "https://ourworldindata.org/coronavirus-testing-source-data";
const new_testing_uri = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/testing/covid-testing-all-observations.csv";

export async function readTestData(){
	let fetch_uri = cors_proxy + testing_uri;
	let respText = await fetch(fetch_uri)
						.then(resp => resp.text())
						.then(text => {return text});
	let table = respText.split('<table class>')
	table = table[1].split('</table>')[0];
	table = '<table>'+table+'</table>';
	let json = HtmlTableToJson.parse(table);
	return json.results;
}

function processTestingJson(json){
	let test_data = JSON.parse(json);
	let jsonOut = {};
	for(let obj of test_data){
		let country = obj["Entity"].split("-")[0].trim();
		let count = obj["Cumulative total"];
		if(jsonOut.hasOwnProperty(country)) jsonOut[country] = Math.max(jsonOut[country],count);
		else jsonOut[country] = count;
	}
	let arr = [];
	for (let [k,v] of Object.entries(jsonOut)){
		let obj = {};
		obj["name"] = k;
		obj["Total tests"] = v;
		arr.push(obj);
	}
	return JSON.stringify(arr);

}

export async function getNewTestingData(){
	let fetch_uri = new_testing_uri;
	let tdata = await fetch(fetch_uri)
						.then(resp => resp.text())
						.then(async text => {
							let test_data = await csv().fromString(text);
							let final_json = processTestingJson(JSON.stringify(test_data));
							return final_json;
						});
	return tdata;
}