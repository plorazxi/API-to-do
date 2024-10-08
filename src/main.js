const express = require('express');
const { login, register, mudar } = require('./auth.js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: '*'
}))

app.use(express.json());

app.post('/login', (req, res) => login(req, res));

app.post('/register', (req, res) => register(req, res));

app.put('/mudar-:tributo', (req, res) => mudar(req, res));

app.listen(process.env.PORT || 3000, () => {
    console.log('server on');
});