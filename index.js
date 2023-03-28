// imports
const { timeStamp } = require('console');
const express = require('express');
const Datastore = require('nedb');

// setup and run an express server
const app = express();
app.listen(3000, () => console.log('listening at 3000'));

// method in express that serves up a web page that we put in the public folder
app.use(express.static('public'));

// set up the express server to receive and respond to  
// data (requests) by setting up an api endpoint

// hsve the express server package interpret request data as JSON and limit incoming data to 1mb to protect server from being flooded with hostile data
app.use(express.json({limit:'1mb'}));

// setup database
const database = new Datastore('database.db');
database.loadDatabase();
 
// set up routing endpoint for my api

// set up responses to requests that use my endpoint
// in other wrods, set up responses to posted requests
app.post('/api', (request, response) => {
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.insert(data);
    //console.log(database);
    // politely lets sender know the request was received
    //response.end();
    // send back a response with the request json data mirrored back to them
    response.json({
        status: "success",
        timestamp: timestamp,
        x: data.x,
        y: data.y
    });
}); 

// set up data to be retrieved using my endpoint
// in other wrods, set up response to get requests
app.get('/api',(request,response) => {
    const query = { timestamp: 1678918533574 };
    database.find(query, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

// to post data to api and get a response
/*
const data = { x: 1, y: 2 }; // javascript object
const postOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
};
fetch('/api', postOptions)
    .then(response => response.json())
    .then(data => {
        // do something with the parsed data
        console.log(data);
        console.log(data.status,data.x,data.y);
    })
    .catch(error => {
        // handle any errors
    });
    */

    // to get data from api
    /*
`   async function getData() {
        const response = await fetch('/api');
        const data = await response.json();
        console.log(data);
    }
    getData();
    */