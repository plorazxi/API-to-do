const express = require('express');
const { login, register, mudar } = require('./auth.js');
const { exibir, criar, deletar, alterar_task } = require('./tasks.js')
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: '*'
}))

app.use(express.json());

// Rotas principais : serviço to-do
app.get('/:token', (req, res) => exibir(req, res));

app.post('/create-task', (req, res) => criar(req, res));

app.delete('/delete-task', (req, res) => deletar(req, res));

app.put('/tasks/mudar-:tributo', (req, res) => alterar_task(req, res));

// Rotas de autenticacao
app.post('/login', (req, res) => login(req, res));

app.post('/register', (req, res) => register(req, res));

app.put('/users/mudar-:tributo', (req, res) => mudar(req, res));

// Listen
app.listen(process.env.PORT || 3000, () => {
    console.log('server on');
});