const express    = require('express');
const mongoose   = require('mongoose');
const bluebird   = require('bluebird');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const cors       = require('cors');
const expressJWT = require('express-jwt');
const app        = express();
const config     = require('./config/config');
const routes     = require('./config/routes');
const dest       = `${__dirname}/public`;
const enviroment = app.get('env');

mongoose.connect(config.db[enviroment]);
mongoose.Promise = bluebird;

if (app.get('env') !== 'production') app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(dest));

app.use('/api', expressJWT({ secret: config.secret })
  .unless({
    path: [
      { url: '/api/login', methods: ['POST'] },
      { url: '/api/register', methods: ['POST'] }
    ]
  })
);

app.use(jwtErrorHandler);

function jwtErrorHandler(err, req, res, next) {
  if (err.name !== 'UnauthorizedError') return next();

  return res.status(401).json({ message: 'Unauthorized request'});
}

app.use('/api', routes);
app.get('/*', (req, res) => res.sendFile(`${dest}/index.html`));

app.listen(config.port, () => console.log(`Express has started on port: ${config.port}`));

module.exports = app;
