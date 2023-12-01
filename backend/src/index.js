require('dotenv').config();

const express = require('express');
const cors = require('cors');
const knex = require('./database/db');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/pet', async (req, res) => {
  const [ lastInsertedId ] = await knex('pet')
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
    retorno: true,
    id: lastInsertedId
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

app.get('/servicos', async (req, res) => {
  const servicos = await knex('servico');
  res.send(servicos);
});

app.get('/raca/:idRaca', async (req, res) => {
  if(!req.params.idRaca){
    res.sendStatus(400);
  }
  
  const racas = await knex('raca')
    .where('id_especie', '=', req.params.idRaca);

  res.send(racas);
});

app.post('/agendamentos', async (req, res) => {
  const [ lastInsertedId ] = await knex('agenda').insert({
    id_servico: req.body.idServico,
    id_pet: req.body.idPet,
    agendamento: req.body.agendamento,
    observacao: req.body.observacao || "",
  });
  
  res.send({ id: lastInsertedId });
});

app.get('/agendamentos', async (req, res) => {
  const agendamentos = await knex.from('agenda')
    .join('pet', 'agenda.id_pet', 'pet.id')
    .join('responsavel', 'pet.id_responsavel', 'responsavel.id')
    .select(
      'agenda.id',
      'agenda.id_servico', 
      'agenda.observacao', 
      'agenda.agendamento', 
      'pet.nome',
      'responsavel.ddd',
      'responsavel.telefone'
    );
  res.send(agendamentos);
});

app.get('/agendamentos/:id', async (req, res) => {
  const id = req.params.id;
  const [agendamento] = await knex('agenda').where('id', id);
  res.send(agendamento);
});

app.put('/agendamentos/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  await knex('agenda').where('id', id).update(body);
  res.sendStatus(204);
});

app.get('/agendamentos/:id/cancelar', async (req, res) => {
  const id = req.params.id;
  await knex('agenda').where('id', id).del();
  res.sendStatus(204);
});

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Example app listening on port ${process.env.BACKEND_PORT}`);
});
