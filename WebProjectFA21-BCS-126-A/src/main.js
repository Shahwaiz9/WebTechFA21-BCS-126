const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public')); // for listing imgs like /imgs not full
app.use(expressLayouts);
app.set('layout', './layouts/main1.ejs'); 
app.use(express.static('./views/partials'));
app.set('view engine', 'ejs');

const routes = require('./routes/reciperoutes.js');
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
