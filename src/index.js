const express = require('express');
const { login, register } = require('./auth.js');
require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/login', (req, res) => login(req, res));

app.post('/register', (req, res) => register(req, res));

app.listen(process.env.PORT || 3000, () => {
    console.log('server on');
});