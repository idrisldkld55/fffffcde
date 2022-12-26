const fs = require('fs');
const Discord = require('discord.js');
const { netflixChannel } = require('../config.json');
const db = require('../netflix.json');

module.exports = {
    help: {
        name: 'netflix',
        aliases: []
    },
    run: (message, args) => {
        if (!message.channel.id == netflixChannel) return;

        let codes = require('../codes.json');
        if (!db[message.author.id]) db[message.author] = [];

        let available = codes.filter((value, index) => !db[message.author.id].includes(index));
        if (available.length == 0) return message.channel.send({ content: `You can't generate netflix accounts anymore` }).catch(() => {});

        const code = available[Math.floor(Math.random() * available.length)];
        db[message.author.id].push(available.indexOf(code));

        fs.writeFileSync('./netflix.json', JSON.stringify(db));

        const embed = new Discord.MessageEmbed()
            .setTitle("Netflix account")
            .setDescription(`Your **netflix account** has been succesfully generated in your DM`)
            .setColor('BLURPLE')
            .setImage('https://imgs.search.brave.com/FZs3F07Wp8eb_BiP0BusQ4-Y0dgcQPIKz62MlmJ2cKc/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/cGl4aWxhcnQuY29t/L2ltYWdlcy9hcnQv/NzA1YmE4MzNmOTM1/NDA5LnBuZw')
            
        const dm = new Discord.MessageEmbed()
            .setTitle("<:giveaway:969996226642739240> Here is your netflix account")
            .setDescription(`here is your netflix account generated in ${message.guild.name} : ${code}`)
            .setColor('#2c2c2c')
            .setImage('https://imgs.search.brave.com/FZs3F07Wp8eb_BiP0BusQ4-Y0dgcQPIKz62MlmJ2cKc/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly93d3cu/cGl4aWxhcnQuY29t/L2ltYWdlcy9hcnQv/NzA1YmE4MzNmOTM1/NDA5LnBuZw')
        
        message.delete().catch(() => {});
        message.channel.send({ embeds: [ embed ] }).catch(() => {});
        message.author.send({ embeds: [ dm ] }).catch(() => {});
    }
}