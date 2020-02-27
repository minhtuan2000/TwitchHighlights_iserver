const express = require('express');
const app = express();

app.use(express.json());
app.use('/api', require('./api/api'));

app.get('/', function (req, res) {
    res.sendFile("./index.html");
});

export default app;