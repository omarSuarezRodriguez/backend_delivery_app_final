const express = require ('express');
const app = express();
const http = require ('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');

/*
* IMPORTAR RUTAS
*/

const usersRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-podered-by');

app.set('port', port);

/*
* IMPORTAR RUTAS
*/

usersRoutes(app);


server.listen(3000, '192.168.20.22' || 'localhost', function() {
    console.log('Aplicacion de NodeJS ' + port + ' Iniciada...')
});

app.get('/', (req, res) => {
    res.send('Ruta raiz del backend');
});

app.get('/test', (req, res) => {
    res.send('Esta es la ruta Test');
});

// Error Handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});


// 200 - Es una respuesta exitosa
// 404 - Significa que la URL no existe
// 500 - Error interno del servidor
