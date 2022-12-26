const Discord = require('discord.js');
const data = require('../config.json');

module.exports = {
    event: 'guildMemberAdd',
    /**
     * @param {Discord.GuildMember} member 
     */
    execute: (member) => {
        if (member.guild.id !== data.guildID) return;
        member.guild.channels.fetch(data.greatChannel, { cache: true }).then((channel) => {
            channel.send({ content: `<@${member.id}>` }).then((sent) => {
                sent.delete().catch(() => {});
            }).catch(() => {});
        }).catch(() => {});
    }
}