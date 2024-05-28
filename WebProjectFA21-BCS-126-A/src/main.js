// const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
// const path = require('path');

// const fileUpload=require('express-fileupload')
// const session=require('express-session')
// const cookieparser=require('cookie-parser')
// const flash=require('connect-flash')
// require('dotenv').config();
// const bcrypt = require('bcryptjs');

// const app = express();
// const PORT = process.env.PORT;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('./public')); // for listing imgs like /imgs not full
// app.use(expressLayouts);
// app.set('layout', './layouts/main1.ejs'); 
// app.use(express.static('./views/partials'));
// app.set('view engine', 'ejs');
// app.use(express.json());


// app.use(cookieparser('CookBook'))
// app.use(session({
//   secret:'CookbookSecretSession',
//   saveUninitialized:true,
//   resave:false, 
//   cookie: { secure: false }
// }));
//  app.use(flash());
//  app.use(fileUpload())

// const routes = require('./routes/reciperoutes.js');
// app.use('/', routes);

// app.listen(PORT, () => {
//   console.log(`Listening to port ${PORT}`);
// });
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/Users.js'); // Adjust the path as necessary
const methodOverride = require('method-override');



// Middleware to handle method override

const app = express();
const PORT = process.env.PORT;

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(expressLayouts);
app.set('layout', './layouts/main1.ejs');
app.use(express.static('./views/partials'));
app.set('view engine', 'ejs');
app.use(express.json());

app.use(cookieParser('CookBook'));
app.use(session({
  secret: 'CookbookSecretSession',
  saveUninitialized: true,
  resave: false,
  cookie: { secure: false }
}));
app.use(flash());
app.use(fileUpload());

const routes = require('./routes/reciperoutes.js');
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

