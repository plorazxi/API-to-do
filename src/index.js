const express = require('express');
const jwt = require('jsonwebtoken');
const bc = require('bcrypt');
const { randomInt } = require('node:crypto');
const { login, register } = require('./auth.js');
require('dotenv').config();

const app = express();

app.use(express.json());

app.get('/login', (req, res) => login(req, res));

app.post('/register', (req, res) => register(req, res));

app.get('/cript', (req, res) => {
    res.send(jwt.sign(req.body, process.env.SECRETKEY,{ 
        algorithm: 'HS256',
        expiresIn: '1m'
    }));
});

app.get('/verify', (req, res) => {
    res.send(jwt.verify(req.body.token, process.env.SECRETKEY));
});

app.get('/descript', (req, res) => {
    res.send(jwt.decode(req.body.token));
});

app.get('/hash', async (req, res) => {
    const senha = req.body.senha;
    const salt = randomInt(10, 16);
    const hash = await bc.hash(senha, salt);
    res.send(hash);
});

app.get('/compare', async (req, res) => {
    const hash = req.body.hash;
    const senha = req.body.senha;
    res.send(await bc.compare(senha, hash));
})

app.listen(process.env.PORT || 3000, () => {
    console.log('server on');
});