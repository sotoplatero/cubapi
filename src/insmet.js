var cheerio = require('cheerio');  
var rp = require('request-promise');

exports.handler = (event, context, callback) => {
	let response, body;

    rp('http://www.insmet.cu/asp/link.asp?PRONOSTICO')
        .then( html => {
            let $ = cheerio.load( html );
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
                    content: $('table.contenidoPagina').text().replace(/\s{2,}/g,'')
                })
            })
        })
        .catch( e => {
            callback(JSON.stringify(e.data))
        } );

}