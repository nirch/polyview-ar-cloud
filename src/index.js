require('dotenv').config(); // loading env variables from .env
const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const path = require('path')

const app = express();
app.use(cors());
app.use(morgan('tiny'));
app.use(require('prerender-node').set('prerenderToken', '5dXyDG2XnoirJXnU8ncs'));
app.use(express.static("public")); 
// app.use('/', express.static('public'));

app.get('*', function(req, res){ 
    res.sendFile(path.join(__dirname, '../public/index.html')); 
});

app.listen(process.env.PORT, () => console.log(`Polyview AR Cloud app listening on port ${process.env.PORT}!`))