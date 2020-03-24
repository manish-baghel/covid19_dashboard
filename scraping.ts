const HtmlTableToJson = require('html-table-to-json');


const cors_proxy = "https://morning-king-2527.corsproxyaccess.workers.dev/?";
const testing_uri = "https://ourworldindata.org/coronavirus-testing-source-data";

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