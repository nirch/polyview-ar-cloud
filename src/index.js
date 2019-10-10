require('dotenv').config(); // loading env variables from .env
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('/', express.static('public'));

app.listen(process.env.PORT, () => console.log(`Polyview AR Cloud app listening on port ${process.env.PORT}!`))