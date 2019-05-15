const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const { PORT } = process.env;

app.get('/', (req, res) => res.send('Hi'));

app.listen(PORT, function () {
    console.log(`Server is up!!!!\nListening on port ${PORT}`);
});