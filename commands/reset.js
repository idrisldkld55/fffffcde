const Discord = require('discord.js');

module.exports = {
    help: {
        name: 'reset',
        aliases: ['invite-reset'],
    },
    /**
     * @param {Discord.Message} message 
     * @param {Array} args 
     */
    run: async(message, args) => {
        const { guildID, prefix } = require('../config.json');
        if (message.guild.id !== guildID || !message.member.permissions.has('ADMINISTRATOR')) return;

        await message.guild.members.fetch();

        let user = (message.mentions.members.first() || message.guild.members.cache.get(args[0]));
        let subCommand = (args.shift() || 'help').toLowerCase();

        if (subCommand == 'all') {
            message.client.InviteManager.resetAll();
            message.channel.send({ content: `All the invitations have been reset.` }).catch(() => {});
        } else if (user) {
            message.client.InviteManager.resetUser(user.id);
            message.channel.send({ content: `Invites of <@${user.id}> have been reset` }).catch(() => {});
        } else {
            message.channel.send({ content: `Use \`${prefix}reset all\` or \`${prefix}reset <user>\`` }).catch(() => {});
        }
    }
}