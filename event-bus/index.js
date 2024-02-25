const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];


//each request has a catch block here so that an individual failure
//doesn't ruin the whole thing. This is helpful when we're depending
//on many services
app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    axios.post('http://posts-srv:4000/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://comments-srv:4001/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://query-srv:4002/events', event).catch((err) => {
        console.log(err.message);
    });
    axios.post('http://moderation-srv:4003/events', event).catch((err) => {
        console.log(err.message);
    });

    app.get('/events', (req, res) => {
        res.send(events);
    });

    res.send({status: 'OK' });
});

app.listen(4005, ()=>{
    console.log('Listening on 4005');
})