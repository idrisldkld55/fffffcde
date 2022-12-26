const Discord = require('discord.js');
const functions = require('../functions');

module.exports = {
    help:{
        name: 'invites',
        aliases: []
    },
    /**
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async(message, args) => {
        await message.guild.members.fetch();
        let user = (message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member).user;

        const data = message.client.InviteManager.displayInvites(message.author)
        // { total: 0, fakes: 0, bonus: 0, invites: 0, leaves: 0 }

        const embed = new Discord.MessageEmbed()
            .setTitle('Invites')
            .setColor(message.guild.me.displayHexColor)
            .setDescription(`Total : ${data.total}
Fakes : ${data.fakes}
Bonus : ${data.bonus}
Leaves : ${data.leaves}
True invites : ${data.invites}`)

        message.channel.send({ embeds: [ embed ] }).catch(() => {});
    }
}