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

Pede um body contendo um **email** e uma **senha**

#### Para realizar um registro novo:

```http
POST http://localhost:3000/register
```

Pede um body com: **nome**, **email**, **data de nascimento** e uma **senha**

#### Realizar qualquer alteração no usuário:

```http
PUT http://localhost:3000/users/mudar-:tributo
```

Pede, na url, o **tributo a ser mudado** e no body o **nome**, **data de nascimento**, **email** e **senha**

### Rotas de serviços principais:

## Testando o projeto
Foram criadas diversas formas de testar este projeto: