const Discord = require('discord.js');
const configs = require('../config.json');

module.exports = {
    event: 'ready',
    /**
     * @param {Discord.Client} client 
     */
    execute: (client) => {
        client.user.setUsername(configs.name);
        client.user.setActivity({
            name: 'Free nitro',
            type: 'STREAMING'
        });

        console.log("Ready !");
    }
}