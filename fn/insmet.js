const axios = require("axios");
var cheerio = require('cheerio');  

exports.handler = (event, context, callback) => {
	let response, body;

    axios
        .get(`http://www.insmet.cu/asp/link.asp?PRONOSTICO`)
        .then( response => {
            let $ = cheerio.load( response.data );
            let reDate = /Fecha:\s(\d+\s.+\d{4}).+Hora:\s(\d+:\d{2}\s[a|p]\.m)/;
            let dateToday = $('table.contenidoPagina').text().match( reDate );
            callback(null, {
                headers: { 
                    'Content-Type':'application/json' , 
                    'Access-Control-Allow-Origin': '*'
                },    	
                statusCode: 200,
        	    body: JSON.stringify({
                    updated_at: dateToday[1]+" "+dateToday[2],
                    content: $today('table.contenidoPagina').text().replace(/\s{2,}/g,'')
                })
            })
        })
        .catch( e => callback(JSON.stringify(err.response.data)) );

}