import fs from "fs";

const ls = window.localStorage;

export async function getJson(){
	let json = await fetch("https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-3/slim-3.json").
		then(resp => resp.json());
	return json;
}


export async function makeDictionary(){
	let cdict = {};
	let cobj = await getJson();
	for(var country of cobj){
		let name = country.name;
		let id = country["alpha-3"];
		if(name.trim().toLowerCase()=="united states of america") name = "united states";
		else if(name.trim().toLowerCase()=="russian federation") name = "russia";
		else if(name.trim().toLowerCase()=="united kingdom of great britain and northern ireland") name = "united kingdom";
		else if(name.trim().toLowerCase()=="bolivia (plurinational state of)") name = "bolivia"; 
		cdict[name.trim().toLowerCase()] = id;
	}
	return cdict;
}

export async function getCountrySeries(){
	let dict = await makeDictionary();
	let tcases = JSON.parse(ls.getItem("tcases"));
	// console.log("tcases in getCountrySeries", tcases);
	let countries = Object.keys(tcases[0]).filter(e => (e!=='date' && e!=='World'))
	let lastIndex = tcases.length - 1;
	let series = []
	for(let c of countries){
		let value = tcases[lastIndex][c];
		let id = dict[c.trim().toLowerCase()]
		// console.log(value,id);
		series.push([id,value])
	}
	return series;
}


export function getWorldData(){
	let tcases = JSON.parse(ls.getItem("tcases"));
	let tdeaths = JSON.parse(ls.getItem("tdeaths"));
	let ncases = JSON.parse(ls.getItem("ncases"));
	let ndeaths = JSON.parse(ls.getItem("ndeaths"));
	let lastIndex = tcases.length - 1;

	let tcn,tdn,ndn,ncn = 0;
	tcn = tcases[lastIndex]["World"];
	ncn = ncases[lastIndex]["World"];
	tdn = tdeaths[lastIndex]["World"];
	ndn = ndeaths[lastIndex]["World"];

	return {tcn,tdn,ncn,ndn};
}