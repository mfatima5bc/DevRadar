const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculeteDistance = require('./utils/calculeteDistance');

const connections = [];
let io;

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculeteDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item));
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(element => {
        io.to(element.id).emit(message, data);
    });
};