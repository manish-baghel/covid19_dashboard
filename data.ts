import csv from 'csvtojson';

const ls = window.localStorage;
const total_cases_uri = "https://covid.ourworldindata.org/data/ecdc/total_cases.csv";
const total_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/total_deaths.csv";
const new_confirmed_cases_uri = "https://covid.ourworldindata.org/data/ecdc/new_cases.csv";
const new_deaths_uri = "https://covid.ourworldindata.org/data/ecdc/new_deaths.csv";

const us_state_wise = "https://covidtracking.com/api/states";
const us_total = "https://covidtracking.com/api/us";

const indiaAlpha2s = [{"name":"Andaman and Nicobar Islands","code":"AN"},{"name":"Andhra Pradesh","code":"AP"},{"name":"Arunachal Pradesh","code":"AR"},{"name":"Assam","code":"AS"},{"name":"Bihar","code":"BR"},{"name":"Chandigarh","code":"CG"},{"name":"Chhattisgarh","code":"CH"},{"name":"Dadra and Nagar Haveli","code":"DH"},{"name":"Daman and Diu","code":"DD"},{"name":"Delhi","code":"DL"},{"name":"Goa","code":"GA"},{"name":"Gujarat","code":"GJ"},{"name":"Haryana","code":"HR"},{"name":"Himachal Pradesh","code":"HP"},{"name":"Jammu and Kashmir","code":"JK"},{"name":"Jharkhand","code":"JH"},{"name":"Karnataka","code":"KA"},{"name":"Kerala","code":"KL"},{"name":"Ladakh","code":"LA"},{"name":"Lakshadweep","code":"LD"},{"name":"Madhya Pradesh","code":"MP"},{"name":"Maharashtra","code":"MH"},{"name":"Manipur","code":"MN"},{"name":"Meghalaya","code":"ML"},{"name":"Mizoram","code":"MZ"},{"name":"Nagaland","code":"NL"},{"name":"Odisha","code":"OR"},{"name":"Puducherry","code":"PY"},{"name":"Punjab","code":"PB"},{"name":"Rajasthan","code":"RJ"},{"name":"Sikkim","code":"SK"},{"name":"Tamil Nadu","code":"TN"},{"name":"Telangana","code":"TS"},{"name":"Tripura","code":"TR"},{"name":"Uttar Pradesh","code":"UP"},{"name":"Uttarakhand","code":"UK"},{"name":"West Bengal","code":"WB"}];
const worldAlpha3s = [{"name":"Afghanistan","alpha-3":"AFG","country-code":"004"},{"name":"Åland Islands","alpha-3":"ALA","country-code":"248"},{"name":"Albania","alpha-3":"ALB","country-code":"008"},{"name":"Algeria","alpha-3":"DZA","country-code":"012"},{"name":"American Samoa","alpha-3":"ASM","country-code":"016"},{"name":"Andorra","alpha-3":"AND","country-code":"020"},{"name":"Angola","alpha-3":"AGO","country-code":"024"},{"name":"Anguilla","alpha-3":"AIA","country-code":"660"},{"name":"Antarctica","alpha-3":"ATA","country-code":"010"},{"name":"Antigua and Barbuda","alpha-3":"ATG","country-code":"028"},{"name":"Argentina","alpha-3":"ARG","country-code":"032"},{"name":"Armenia","alpha-3":"ARM","country-code":"051"},{"name":"Aruba","alpha-3":"ABW","country-code":"533"},{"name":"Australia","alpha-3":"AUS","country-code":"036"},{"name":"Austria","alpha-3":"AUT","country-code":"040"},{"name":"Azerbaijan","alpha-3":"AZE","country-code":"031"},{"name":"Bahamas","alpha-3":"BHS","country-code":"044"},{"name":"Bahrain","alpha-3":"BHR","country-code":"048"},{"name":"Bangladesh","alpha-3":"BGD","country-code":"050"},{"name":"Barbados","alpha-3":"BRB","country-code":"052"},{"name":"Belarus","alpha-3":"BLR","country-code":"112"},{"name":"Belgium","alpha-3":"BEL","country-code":"056"},{"name":"Belize","alpha-3":"BLZ","country-code":"084"},{"name":"Benin","alpha-3":"BEN","country-code":"204"},{"name":"Bermuda","alpha-3":"BMU","country-code":"060"},{"name":"Bhutan","alpha-3":"BTN","country-code":"064"},{"name":"Bolivia (Plurinational State of)","alpha-3":"BOL","country-code":"068"},{"name":"Bonaire, Sint Eustatius and Saba","alpha-3":"BES","country-code":"535"},{"name":"Bosnia and Herzegovina","alpha-3":"BIH","country-code":"070"},{"name":"Botswana","alpha-3":"BWA","country-code":"072"},{"name":"Bouvet Island","alpha-3":"BVT","country-code":"074"},{"name":"Brazil","alpha-3":"BRA","country-code":"076"},{"name":"British Indian Ocean Territory","alpha-3":"IOT","country-code":"086"},{"name":"Brunei Darussalam","alpha-3":"BRN","country-code":"096"},{"name":"Bulgaria","alpha-3":"BGR","country-code":"100"},{"name":"Burkina Faso","alpha-3":"BFA","country-code":"854"},{"name":"Burundi","alpha-3":"BDI","country-code":"108"},{"name":"Cabo Verde","alpha-3":"CPV","country-code":"132"},{"name":"Cambodia","alpha-3":"KHM","country-code":"116"},{"name":"Cameroon","alpha-3":"CMR","country-code":"120"},{"name":"Canada","alpha-3":"CAN","country-code":"124"},{"name":"Cayman Islands","alpha-3":"CYM","country-code":"136"},{"name":"Central African Republic","alpha-3":"CAF","country-code":"140"},{"name":"Chad","alpha-3":"TCD","country-code":"148"},{"name":"Chile","alpha-3":"CHL","country-code":"152"},{"name":"China","alpha-3":"CHN","country-code":"156"},{"name":"Christmas Island","alpha-3":"CXR","country-code":"162"},{"name":"Cocos (Keeling) Islands","alpha-3":"CCK","country-code":"166"},{"name":"Colombia","alpha-3":"COL","country-code":"170"},{"name":"Comoros","alpha-3":"COM","country-code":"174"},{"name":"Congo","alpha-3":"COG","country-code":"178"},{"name":"Congo, Democratic Republic of the","alpha-3":"COD","country-code":"180"},{"name":"Cook Islands","alpha-3":"COK","country-code":"184"},{"name":"Costa Rica","alpha-3":"CRI","country-code":"188"},{"name":"Côte d'Ivoire","alpha-3":"CIV","country-code":"384"},{"name":"Croatia","alpha-3":"HRV","country-code":"191"},{"name":"Cuba","alpha-3":"CUB","country-code":"192"},{"name":"Curaçao","alpha-3":"CUW","country-code":"531"},{"name":"Cyprus","alpha-3":"CYP","country-code":"196"},{"name":"Czechia","alpha-3":"CZE","country-code":"203"},{"name":"Denmark","alpha-3":"DNK","country-code":"208"},{"name":"Djibouti","alpha-3":"DJI","country-code":"262"},{"name":"Dominica","alpha-3":"DMA","country-code":"212"},{"name":"Dominican Republic","alpha-3":"DOM","country-code":"214"},{"name":"Ecuador","alpha-3":"ECU","country-code":"218"},{"name":"Egypt","alpha-3":"EGY","country-code":"818"},{"name":"El Salvador","alpha-3":"SLV","country-code":"222"},{"name":"Equatorial Guinea","alpha-3":"GNQ","country-code":"226"},{"name":"Eritrea","alpha-3":"ERI","country-code":"232"},{"name":"Estonia","alpha-3":"EST","country-code":"233"},{"name":"Eswatini","alpha-3":"SWZ","country-code":"748"},{"name":"Ethiopia","alpha-3":"ETH","country-code":"231"},{"name":"Falkland Islands (Malvinas)","alpha-3":"FLK","country-code":"238"},{"name":"Faroe Islands","alpha-3":"FRO","country-code":"234"},{"name":"Fiji","alpha-3":"FJI","country-code":"242"},{"name":"Finland","alpha-3":"FIN","country-code":"246"},{"name":"France","alpha-3":"FRA","country-code":"250"},{"name":"French Guiana","alpha-3":"GUF","country-code":"254"},{"name":"French Polynesia","alpha-3":"PYF","country-code":"258"},{"name":"French Southern Territories","alpha-3":"ATF","country-code":"260"},{"name":"Gabon","alpha-3":"GAB","country-code":"266"},{"name":"Gambia","alpha-3":"GMB","country-code":"270"},{"name":"Georgia","alpha-3":"GEO","country-code":"268"},{"name":"Germany","alpha-3":"DEU","country-code":"276"},{"name":"Ghana","alpha-3":"GHA","country-code":"288"},{"name":"Gibraltar","alpha-3":"GIB","country-code":"292"},{"name":"Greece","alpha-3":"GRC","country-code":"300"},{"name":"Greenland","alpha-3":"GRL","country-code":"304"},{"name":"Grenada","alpha-3":"GRD","country-code":"308"},{"name":"Guadeloupe","alpha-3":"GLP","country-code":"312"},{"name":"Guam","alpha-3":"GUM","country-code":"316"},{"name":"Guatemala","alpha-3":"GTM","country-code":"320"},{"name":"Guernsey","alpha-3":"GGY","country-code":"831"},{"name":"Guinea","alpha-3":"GIN","country-code":"324"},{"name":"Guinea-Bissau","alpha-3":"GNB","country-code":"624"},{"name":"Guyana","alpha-3":"GUY","country-code":"328"},{"name":"Haiti","alpha-3":"HTI","country-code":"332"},{"name":"Heard Island and McDonald Islands","alpha-3":"HMD","country-code":"334"},{"name":"Holy See","alpha-3":"VAT","country-code":"336"},{"name":"Honduras","alpha-3":"HND","country-code":"340"},{"name":"Hong Kong","alpha-3":"HKG","country-code":"344"},{"name":"Hungary","alpha-3":"HUN","country-code":"348"},{"name":"Iceland","alpha-3":"ISL","country-code":"352"},{"name":"India","alpha-3":"IND","country-code":"356"},{"name":"Indonesia","alpha-3":"IDN","country-code":"360"},{"name":"Iran (Islamic Republic of)","alpha-3":"IRN","country-code":"364"},{"name":"Iraq","alpha-3":"IRQ","country-code":"368"},{"name":"Ireland","alpha-3":"IRL","country-code":"372"},{"name":"Isle of Man","alpha-3":"IMN","country-code":"833"},{"name":"Israel","alpha-3":"ISR","country-code":"376"},{"name":"Italy","alpha-3":"ITA","country-code":"380"},{"name":"Jamaica","alpha-3":"JAM","country-code":"388"},{"name":"Japan","alpha-3":"JPN","country-code":"392"},{"name":"Jersey","alpha-3":"JEY","country-code":"832"},{"name":"Jordan","alpha-3":"JOR","country-code":"400"},{"name":"Kazakhstan","alpha-3":"KAZ","country-code":"398"},{"name":"Kenya","alpha-3":"KEN","country-code":"404"},{"name":"Kiribati","alpha-3":"KIR","country-code":"296"},{"name":"Korea (Democratic People's Republic of)","alpha-3":"PRK","country-code":"408"},{"name":"Korea, Republic of","alpha-3":"KOR","country-code":"410"},{"name":"Kuwait","alpha-3":"KWT","country-code":"414"},{"name":"Kyrgyzstan","alpha-3":"KGZ","country-code":"417"},{"name":"Lao People's Democratic Republic","alpha-3":"LAO","country-code":"418"},{"name":"Latvia","alpha-3":"LVA","country-code":"428"},{"name":"Lebanon","alpha-3":"LBN","country-code":"422"},{"name":"Lesotho","alpha-3":"LSO","country-code":"426"},{"name":"Liberia","alpha-3":"LBR","country-code":"430"},{"name":"Libya","alpha-3":"LBY","country-code":"434"},{"name":"Liechtenstein","alpha-3":"LIE","country-code":"438"},{"name":"Lithuania","alpha-3":"LTU","country-code":"440"},{"name":"Luxembourg","alpha-3":"LUX","country-code":"442"},{"name":"Macao","alpha-3":"MAC","country-code":"446"},{"name":"Madagascar","alpha-3":"MDG","country-code":"450"},{"name":"Malawi","alpha-3":"MWI","country-code":"454"},{"name":"Malaysia","alpha-3":"MYS","country-code":"458"},{"name":"Maldives","alpha-3":"MDV","country-code":"462"},{"name":"Mali","alpha-3":"MLI","country-code":"466"},{"name":"Malta","alpha-3":"MLT","country-code":"470"},{"name":"Marshall Islands","alpha-3":"MHL","country-code":"584"},{"name":"Martinique","alpha-3":"MTQ","country-code":"474"},{"name":"Mauritania","alpha-3":"MRT","country-code":"478"},{"name":"Mauritius","alpha-3":"MUS","country-code":"480"},{"name":"Mayotte","alpha-3":"MYT","country-code":"175"},{"name":"Mexico","alpha-3":"MEX","country-code":"484"},{"name":"Micronesia (Federated States of)","alpha-3":"FSM","country-code":"583"},{"name":"Moldova, Republic of","alpha-3":"MDA","country-code":"498"},{"name":"Monaco","alpha-3":"MCO","country-code":"492"},{"name":"Mongolia","alpha-3":"MNG","country-code":"496"},{"name":"Montenegro","alpha-3":"MNE","country-code":"499"},{"name":"Montserrat","alpha-3":"MSR","country-code":"500"},{"name":"Morocco","alpha-3":"MAR","country-code":"504"},{"name":"Mozambique","alpha-3":"MOZ","country-code":"508"},{"name":"Myanmar","alpha-3":"MMR","country-code":"104"},{"name":"Namibia","alpha-3":"NAM","country-code":"516"},{"name":"Nauru","alpha-3":"NRU","country-code":"520"},{"name":"Nepal","alpha-3":"NPL","country-code":"524"},{"name":"Netherlands","alpha-3":"NLD","country-code":"528"},{"name":"New Caledonia","alpha-3":"NCL","country-code":"540"},{"name":"New Zealand","alpha-3":"NZL","country-code":"554"},{"name":"Nicaragua","alpha-3":"NIC","country-code":"558"},{"name":"Niger","alpha-3":"NER","country-code":"562"},{"name":"Nigeria","alpha-3":"NGA","country-code":"566"},{"name":"Niue","alpha-3":"NIU","country-code":"570"},{"name":"Norfolk Island","alpha-3":"NFK","country-code":"574"},{"name":"North Macedonia","alpha-3":"MKD","country-code":"807"},{"name":"Northern Mariana Islands","alpha-3":"MNP","country-code":"580"},{"name":"Norway","alpha-3":"NOR","country-code":"578"},{"name":"Oman","alpha-3":"OMN","country-code":"512"},{"name":"Pakistan","alpha-3":"PAK","country-code":"586"},{"name":"Palau","alpha-3":"PLW","country-code":"585"},{"name":"Palestine, State of","alpha-3":"PSE","country-code":"275"},{"name":"Panama","alpha-3":"PAN","country-code":"591"},{"name":"Papua New Guinea","alpha-3":"PNG","country-code":"598"},{"name":"Paraguay","alpha-3":"PRY","country-code":"600"},{"name":"Peru","alpha-3":"PER","country-code":"604"},{"name":"Philippines","alpha-3":"PHL","country-code":"608"},{"name":"Pitcairn","alpha-3":"PCN","country-code":"612"},{"name":"Poland","alpha-3":"POL","country-code":"616"},{"name":"Portugal","alpha-3":"PRT","country-code":"620"},{"name":"Puerto Rico","alpha-3":"PRI","country-code":"630"},{"name":"Qatar","alpha-3":"QAT","country-code":"634"},{"name":"Réunion","alpha-3":"REU","country-code":"638"},{"name":"Romania","alpha-3":"ROU","country-code":"642"},{"name":"Russian Federation","alpha-3":"RUS","country-code":"643"},{"name":"Rwanda","alpha-3":"RWA","country-code":"646"},{"name":"Saint Barthélemy","alpha-3":"BLM","country-code":"652"},{"name":"Saint Helena, Ascension and Tristan da Cunha","alpha-3":"SHN","country-code":"654"},{"name":"Saint Kitts and Nevis","alpha-3":"KNA","country-code":"659"},{"name":"Saint Lucia","alpha-3":"LCA","country-code":"662"},{"name":"Saint Martin (French part)","alpha-3":"MAF","country-code":"663"},{"name":"Saint Pierre and Miquelon","alpha-3":"SPM","country-code":"666"},{"name":"Saint Vincent and the Grenadines","alpha-3":"VCT","country-code":"670"},{"name":"Samoa","alpha-3":"WSM","country-code":"882"},{"name":"San Marino","alpha-3":"SMR","country-code":"674"},{"name":"Sao Tome and Principe","alpha-3":"STP","country-code":"678"},{"name":"Saudi Arabia","alpha-3":"SAU","country-code":"682"},{"name":"Senegal","alpha-3":"SEN","country-code":"686"},{"name":"Serbia","alpha-3":"SRB","country-code":"688"},{"name":"Seychelles","alpha-3":"SYC","country-code":"690"},{"name":"Sierra Leone","alpha-3":"SLE","country-code":"694"},{"name":"Singapore","alpha-3":"SGP","country-code":"702"},{"name":"Sint Maarten (Dutch part)","alpha-3":"SXM","country-code":"534"},{"name":"Slovakia","alpha-3":"SVK","country-code":"703"},{"name":"Slovenia","alpha-3":"SVN","country-code":"705"},{"name":"Solomon Islands","alpha-3":"SLB","country-code":"090"},{"name":"Somalia","alpha-3":"SOM","country-code":"706"},{"name":"South Africa","alpha-3":"ZAF","country-code":"710"},{"name":"South Georgia and the South Sandwich Islands","alpha-3":"SGS","country-code":"239"},{"name":"South Sudan","alpha-3":"SSD","country-code":"728"},{"name":"Spain","alpha-3":"ESP","country-code":"724"},{"name":"Sri Lanka","alpha-3":"LKA","country-code":"144"},{"name":"Sudan","alpha-3":"SDN","country-code":"729"},{"name":"Suriname","alpha-3":"SUR","country-code":"740"},{"name":"Svalbard and Jan Mayen","alpha-3":"SJM","country-code":"744"},{"name":"Sweden","alpha-3":"SWE","country-code":"752"},{"name":"Switzerland","alpha-3":"CHE","country-code":"756"},{"name":"Syrian Arab Republic","alpha-3":"SYR","country-code":"760"},{"name":"Taiwan, Province of China","alpha-3":"TWN","country-code":"158"},{"name":"Tajikistan","alpha-3":"TJK","country-code":"762"},{"name":"Tanzania, United Republic of","alpha-3":"TZA","country-code":"834"},{"name":"Thailand","alpha-3":"THA","country-code":"764"},{"name":"Timor-Leste","alpha-3":"TLS","country-code":"626"},{"name":"Togo","alpha-3":"TGO","country-code":"768"},{"name":"Tokelau","alpha-3":"TKL","country-code":"772"},{"name":"Tonga","alpha-3":"TON","country-code":"776"},{"name":"Trinidad and Tobago","alpha-3":"TTO","country-code":"780"},{"name":"Tunisia","alpha-3":"TUN","country-code":"788"},{"name":"Turkey","alpha-3":"TUR","country-code":"792"},{"name":"Turkmenistan","alpha-3":"TKM","country-code":"795"},{"name":"Turks and Caicos Islands","alpha-3":"TCA","country-code":"796"},{"name":"Tuvalu","alpha-3":"TUV","country-code":"798"},{"name":"Uganda","alpha-3":"UGA","country-code":"800"},{"name":"Ukraine","alpha-3":"UKR","country-code":"804"},{"name":"United Arab Emirates","alpha-3":"ARE","country-code":"784"},{"name":"United Kingdom of Great Britain and Northern Ireland","alpha-3":"GBR","country-code":"826"},{"name":"United States of America","alpha-3":"USA","country-code":"840"},{"name":"United States Minor Outlying Islands","alpha-3":"UMI","country-code":"581"},{"name":"Uruguay","alpha-3":"URY","country-code":"858"},{"name":"Uzbekistan","alpha-3":"UZB","country-code":"860"},{"name":"Vanuatu","alpha-3":"VUT","country-code":"548"},{"name":"Venezuela (Bolivarian Republic of)","alpha-3":"VEN","country-code":"862"},{"name":"Viet Nam","alpha-3":"VNM","country-code":"704"},{"name":"Virgin Islands (British)","alpha-3":"VGB","country-code":"092"},{"name":"Virgin Islands (U.S.)","alpha-3":"VIR","country-code":"850"},{"name":"Wallis and Futuna","alpha-3":"WLF","country-code":"876"},{"name":"Western Sahara","alpha-3":"ESH","country-code":"732"},{"name":"Yemen","alpha-3":"YEM","country-code":"887"},{"name":"Zambia","alpha-3":"ZMB","country-code":"894"},{"name":"Zimbabwe","alpha-3":"ZWE","country-code":"716"}];

export async function getAlpha3Json(){
	let json = await fetch("https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-3/slim-3.json").
		then(resp => resp.json());
	return json;
}


export function makeDictionary(){
	let cdict = {};
	let cobj = worldAlpha3s;
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

export function getCountrySeries(){
	let dict = makeDictionary();
	let tcases = JSON.parse(ls.getItem("tcases"));
	let countries = Object.keys(tcases[0]).filter(e => (e!=='date' && e!=='World'))
	let lastIndex = tcases.length - 1;
	let series = []
	for(let c of countries){
		let value = tcases[lastIndex][c];
		let id = dict[c.trim().toLowerCase()]
		series.push([id,value])
	}
	return series;
}

export function getIndiaSeries(){
	let sdict = {};
	let sobj = indiaAlpha2s;
	for(let state of sobj){
		if(state["name"].trim().toLowerCase()=="odisha") sdict[state["name"].trim().toLowerCase()] = "OD";
		else if(state["name"].trim().toLowerCase()=="chhattisgarh") sdict[state["name"].trim().toLowerCase()] = "CT";
		else sdict[state["name"].trim().toLowerCase()] = state["code"];
	}
	let indCases = JSON.parse(ls.getItem("indStateWise"));
	let indTotal = indCases[0];
	let states = indCases.slice(1,indCases.length);
	let series = []
	for(let s of states) series.push([sdict[s.state.trim().toLowerCase()],s.confirmed]);
	return series;
}

export function getUSSeries(){
	let usStates = JSON.parse(ls.getItem("usStateWise"));
	let series = []
	for(let s of usStates) series.push([s.state.trim(),s.positive]);
	return series;
}

export function getWorldHighlights(){
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

export function getIndiaHighlights(){
	let stateWise = JSON.parse(ls.getItem("indStateWise"));
	let newCases = JSON.parse(ls.getItem("indNewCases"));	
	let tested = JSON.parse(ls.getItem("indTested"));
	let tcn = stateWise[0]["confirmed"];
	let tdn = stateWise[0]["deaths"];
	let ncn = newCases[0]["confirmeddelta"];
	let ndn = newCases[0]["deceaseddelta"];
	let ttest = tested[tested.length-1]["totalindividualstested"];
	let utest = tested[tested.length-1]["updatetimestamp"];
	return {tcn,tdn,ncn,ndn,ttest,utest};
}

export function getUSHighlights(){
	let usTotal = JSON.parse(ls.getItem("usTotal"));	
	let tcn = usTotal[0]["positive"];
	let tdn = usTotal[0]["death"];
	let ncn = usTotal[0]["hospitalized"];
	let ndn = usTotal[0]["totalTestResults"];
	return {tcn,tdn,ncn,ndn};
}

export async function getData(){
    return Promise.all([
      fetch(total_cases_uri),
      fetch(total_deaths_uri),
      fetch(new_confirmed_cases_uri),
      fetch(new_deaths_uri)
    ])
      .then(async response => {
        let blobs = [await response[0].text(),await response[1].text(),await response[2].text(),await response[3].text()]
        return blobs
      })
      .then(async texts => {
        let tcases = await csv().fromString(texts[0])
        let tdeaths = await csv().fromString(texts[1])
        let ncases = await csv().fromString(texts[2])
        let ndeaths = await csv().fromString(texts[3])
        ls.setItem('updated_at',Date.now());
		ls.setItem('tcases',JSON.stringify(tcases));
		ls.setItem('tdeaths',JSON.stringify(tdeaths));
		ls.setItem('ncases',JSON.stringify(ncases));
		ls.setItem('ndeaths',JSON.stringify(ndeaths));
      });
}

export function getIndiaData(){
	return fetch('https://api.covid19india.org/data.json')
				.then(resp => resp.json())
				.then(json => {
					let timeSeries = json.cases_time_series;
					let stateWise = json.statewise;
					let newCases = json.key_values;
					let tested = json.tested;
					ls.setItem("indStateWise",JSON.stringify(stateWise));
					ls.setItem("indTimeSeries",JSON.stringify(timeSeries));
					ls.setItem("indNewCases",JSON.stringify(newCases));
					ls.setItem("indTested",JSON.stringify(tested));
				});
}


export function getUSData(){
	return Promise.all([
		fetch(us_state_wise),
		fetch(us_total)
	])
	.then(async resp => {
		let objs = [await resp[0].json(),await resp[1].json()]
		return objs;
	})
	.then(jsonObjs => {
		ls.setItem("usStateWise",JSON.stringify(jsonObjs[0]));
		ls.setItem("usTotal",JSON.stringify(jsonObjs[1]));
	});
}