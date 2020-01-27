const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebsocket(server);

app.use(express.json());

mongoose.connect('mongodb+srv://omnistack10:omnistack10@cluster0-61oqx.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.use(cors());
app.use(routes);
app.use(express.json());

server.listen(3333);

//Tipos de parametros:

/*
    - Query params: request.query (Filtros, ordenção, paginação, ...)
    - Route params: request.params (Identificar um recurso na alteração ou remoção)
    - Body: request.body (Dados para criação ou alteração de um registro)
*/