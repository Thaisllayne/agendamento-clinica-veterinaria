require('dotenv').config();

const express = require('express');
const cors = require('cors');
const knex = require('./database/db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/pet', async (req, res) => {
  await knex('pet')
    .insert({
      nome: req.body.nome,
      data_nascimento: req.body.data_nascimento, 
      id_especie: req.body.id_especie, 
      id_raca: req.body.raca, 
      sexo: req.body.sexo,
      porte: req.body.porte,
      peso: parseInt(req.body.peso),
      castrado: req.body.castrado,
      id_responsavel: req.body.id_responsavel,
    });

  res.send({
    retorno: true
  });
});

app.post('/responsavel', async (req, res) => {

  const [ lastInsertedId ] = await knex('responsavel').insert({
    nome: req.body.nome,
    cpf: req.body.cpf,
    email: req.body.email,
    ddd: req.body.ddd,
    telefone: req.body.telefone,
  });
  
  res.send({ id: lastInsertedId });
});

app.get('/responsavel', async (req, res) => {
  const responsaveis = await knex('responsavel')
  const pets = await knex('pet')
    .join('responsavel', 'pet.id_responsavel', 'responsavel.id')
    .select('pet.*');

  responsaveis.forEach(responsavel => {
    responsavel['pets'] = pets.filter(pet => pet.id_responsavel === responsavel.id) || [];
  });
  
  res.send(responsaveis);
});

app.get('/raca/:idRaca', async (req, res) => {
  if(!req.params.idRaca){
    res.sendStatus(400);
  }
  
  const racas = await knex('raca')
    .where('id_especie', '=', req.params.idRaca);

  res.send(racas);
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Example app listening on port ${process.env.BACKEND_PORT}`);
});