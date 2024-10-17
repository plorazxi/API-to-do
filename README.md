# API to-do
Este repositório contém o Back-end do To-Do, uma aplicação web criada para ajudar a organizar suas tarefas.

Este projeto foi desenvolvido com node.js, usando o espress como framework.
Por falta de habilidade de utilização de um banco de dados, foi usado um sistema de arquivos (`DB/**`) para representar e servir como um.

Além disso, usa `JWT` para autenticar tdo e qualquer tipo de requisição nas rotas principais.
Usa também `bcrypt` para criar os hash's das senhas e salvar no "Banco de dados" e, ao mesmo tempo, comparar as senhas das requisições com o `DB/`.

Para finalizar, um amigo da faculdade chamado [Paulo Ávila](https://github.com/paulinbrgamer) criou o Front-end deste serviço para a melhor vizualização e teste do projeto. Está salvo no repositório: [Pages-For-API](https://github.com/paulinbrgamer/Pages-For-API) com o seguinte link do [Github Pages](https://paulinbrgamer.github.io/Pages-For-API/).

## Estrutura de pastas
- `DB/` --> É a pasta contendo arquivos JSON para a simulação de um Banco de dados
- `rotas/` --> É a pasta onde contém documentada todas as rotas que este servidor fornece.
- `src/` --> É a pasta que contém todo o codigo fonte do servidor
    - `auth.js` --> Funções para a autenticação do usuário.
    - `global_fct.js` --> Funções globais usadas pelos principais tipos de rotas.
    - `main.js` --> Arquivo contendo o servidor principal.
    - `tasks.js` --> Funções com as pricipais funcionalidades da aplicação.
- `.env.example` --> Arquivo contendo um exemplo de variaveis que precisam conter no `.env`.
- `package.json` --> Arquivo contendo todas as dependências do codigo.

## Rotas do Servidor
Segue as intruções para as utilizações das rotas do servidor.
Para mais informações, as rotas estão devidamente documentadas dentro da pasta `rotas/`.

>Obs.: colocarei 'localhost:3000' para representar uma baseURL.

### Rotas de Autenticação:

#### Para a realização do login:

```http
POST http://localhost:3000/login
```

Pede um body contendo um **email** e uma **senha**.

#### Para realizar um registro novo:

```http
POST http://localhost:3000/register
```

Pede um body com: **nome**, **email**, **data de nascimento** e uma **senha**.

> O response dessas 2 rotas é uma **mensagem** e um **token**.
Este token será necessário para fazer qualquer requisição das rotas principais.

#### Realizar qualquer alteração no usuário:

```http
PUT http://localhost:3000/users/mudar-:tributo
```

Pede, na url, o **tributo a ser mudado** e no body o **nome**, **data de nascimento**, **email** e **senha**.

### Rotas de serviços principais:

#### Pegar as tasks do usuários:

```http
GET http://localhost:3000/:token
```

Pede na url o **token do usuário**.

#### Criar uma task:

```http
POST http://localhost:3000/create-task
```

Pede um body com um **titulo**, **subtitulo**, uma **data de criação** (`data_criação` | opcional) e o **token**.

#### Deletar uma task:

```http
DELETE http://localhost:3000/delete-task
```

Pede um body com o **id da task** e o **token**.

#### Modificar uma task: 

```http
PUT http://localhost:3000/tasks/mudar-:tributo
```
Pede o **tributo a ser modificado** na url e um body com o **id da task**, o **tributo a ser modificado** e o **token**.

## Testando o projeto
Foram criadas diversas formas de testar este projeto, dentre elas:

### Render

Este projeto está rodando em um servidor da Render.
Para acessar, basta utilizar a seguinte url como BaseUrl: https://api-to-do-a5kr.onrender.com.

>Obs.: Por ser um plano gratuito, as requisições tendem a demorar um tempo considerável.

### Pages-For-API

[Paulo Ávila](https://github.com/paulinbrgamer), um estudante de Engenharia de Software da Universidade Estadual do Pará, criou um front-end para esta aplicação.

Segue o link do repositório: https://github.com/paulinbrgamer/Pages-For-API.

Segue o link do Github Pages desse front-end: https://paulinbrgamer.github.io/Pages-For-API/.

>Obs.: Por conta deste repositório usar o back-end pelo Render, as requisições tendem a demorar um tempo considerável também.

### Clonando repositório

Para rodar este projeto em sua máquina, primeiro, clone este repositório.

```bash
git clone https://github.com/plorazxi/API-to-do.git 
```

Instale as dependências.

```bash
npm ci
```

Em seguida, crie o arquivo `.env`, contendo uma porta para o servidor (`PORT`) e uma chave de criptografia para a criação do `JWT` (`SECRETKEY`).
Para criar essa chave, basta rodar o seguinte comando: 

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Agora, basta colocar o projeto para rodar.
Para isso, coloque o seguinte comando.

```bash
npm run start
```