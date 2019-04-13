require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const auth = require('../auth/autorizacao');

const app = express();
app.use(cors(), express.json(), morgan('dev'));

// middleware da conexao com o banco de dados mysql
pool = require('./pool-factory')
connectionMiddleware = require('./connection-middleware');
app.use(connectionMiddleware(pool));

// middleware de tratamento de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.toString() });
});

// middleware de log da requisicao
app.use((req, res, next) => {
    console.log("Body da requisicao: ");
    console.error(req.body);
    next();
});

app.get('/', (req, res) => {
    res.json({
        message: "😎👌"
    })
});

app.use('/login', require('../routes/login.js'));
app.use('/signup', require('../routes/signup.js'));

app.use(auth.checkToken);

app.use('/test', require('../routes/test.js'));

module.exports = app;