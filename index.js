/*
 * Title: Pirple Home Assigment #1
 * Description: Simple RESTful JSON API that responds 'hello' and 'bye' to the user
 *  GET /hello -> { message: 'Hello!' } 
 *  GET /hello?name=John -> { message: 'Hello John!' }
 *  POST /bye -> { message: 'Bye!' } 
 *  POST /bye { "name": "John" } -> { message: 'Bye John!' }
 * 
 * Author: Brando Meniconi
 * Date: 05/11/2018
 */

// Dependencies
const https = require('https');
const http = require('http');
const fs = require('fs');
const url = require('url');
const { StringDecoder } = require('string_decoder');

// Request Router and Config
const router = require('./lib/router');
const config = require('./config');

// Main function that handles incoming HTTP requests
var requestHandler = (req, res) => {
    
    console.log( 'Request: ', req.method, req.url );

    // Parse and normalize the request
    let parsedUrl = url.parse(req.url, true);
    let parsedRequest = {
        'method' : req.method.toLowerCase(),
        'path': parsedUrl.pathname.replace(/^\/|\/$/g, ''),
        'query': parsedUrl.query,
        'headers': req.headers,
        'payload': {}
    };

    // Get the matching route from router
    let route = router.getRoute(parsedRequest.method, parsedRequest.path);    

    // Handle request errors
    req.on('error', (err) => {
        console.error(err);
        response.statusCode = 400;
        response.end();
    });

    // Decode the input Stream as UTF-8 and store it into a buffer string
    const decoder = new StringDecoder('utf8');
    let buffer = '';

    req.on('data', (chunk) => {
        buffer += decoder.write(chunk);
    });

    // When request data ends, handle the request
    req.on('end', () => {
        buffer += decoder.end();

        // If buffer contains data, try to decode it as JSON
        if ( buffer ) {
            try {
                parsedRequest.payload = JSON.parse(buffer);
            } catch (err) {
                console.error(err);

                // Return a 400 error
                res.statusCode = 400;
                res.end( JSON.stringify({ error: err.message }) );
                return;
            }
        }

        console.log( 'Routing to: ' +  route.name + ' with body:', parsedRequest.payload);

        // Catch and log response errors
        res.on('error', (err) => { console.error(err); });

        // Set headers for JSON response
        res.setHeader('Content-Type', 'application/json');

        // Send the request to route's handler
        route.handle( parsedRequest, ( statusCode, payload ) => {
            
            // Set the response code, default to 200
            res.statusCode = typeof statusCode == 'number' ? statusCode : 200;
            
            // Output the response content
            payload = typeof payload == 'object' ? payload : {} ;
            res.write( JSON.stringify(payload) );

            res.end();
            
            console.log('Response given: ', statusCode, payload); 
        } );

    });
 
};

let servers = {};

// Create HTTPS server 
servers.https = https.createServer( {
    key: fs.readFileSync(config.https.keyFile),
    cert: fs.readFileSync(config.https.certFile)
  }, requestHandler);

servers.https.listen( config.https.port, () => {
    console.log('HTTPS Server running at ' + config.https.port);
});

// Create HTTP server
servers.http = http.createServer(requestHandler);

servers.http.listen( config.http.port, () => {
    console.log('HTTP Server running at ' + config.http.port);
});

// Add a GET route to the router for the 'hello' path
router.addRoute('get', 'hello', ( req, callback ) => {
    
    // Get the (optional) name from GET query param
    let name = typeof req.query.name == 'string' ? req.query.name : '';
    
    // Callback a http status code, and a payload object
    callback(200, { message: 'Hello' + (name ? ( ' ' + name ) : '') + '!' } );
});

// Add a POST route to the router for the 'bye' path
router.addRoute('post', 'bye', ( req, callback ) => {
    
    // Get the (optional) name from POST body
    let name = typeof req.payload.name == 'string' ? req.payload.name : '';

    // Callback a http status code, and a payload object
    callback(200, { message: 'Bye' + (name ? ( ' ' + name ) : '') + '!' } );
});

// Set the default route to 404
router.setDefaultRoute('404', (req, callback ) => {
    callback(404, { error: 'Not Found!'} );
});