require('dotenv').config();

const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world');
})

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Example app listening on port ${port}`);
});