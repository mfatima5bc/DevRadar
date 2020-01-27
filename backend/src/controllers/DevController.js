const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response){
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            //Filtrar as connections que estão no máximo há 10km de distancia
            // e que o novo dev tenha pelo menos uma das tecnologias filtradas
            
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            );
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }      
    
        return response.json(dev);
    },

    async update(request, response){
        const { dev_id } = request.params;
        const { bio, techs } = request.body;
        const { _id } = request.query;

        let dev = await Dev.findOne({ _id });
        const techsArray = parseStringAsArray(techs);

        // atualizar a location também
        if(dev) {
            dev = await Dev.update({
                bio,
                techs: techsArray,
            });
        }

        console.log(dev_id,bio, _id)
        return response.json(dev_id);
        //continuar em casa
    },

    async destroy(){

    },
};