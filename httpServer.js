const http = require('http');
// const url = require('url');
const express = require('express')
// const myModule = require('./math.js');
const hostname = ('127.0.0.1');
const port = 3000;
const app = express();


app.get('/stations', (req, res) => {
    res.status(200).send('Hello World!');
});
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});

app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});