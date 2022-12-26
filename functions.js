const { Message } = require('discord.js');
const { prefix } = require('./config.json');

module.exports = {
    /**
     * @param {{ length: Number }} data 
     */
    gen: (data) => {
        let length = (data.length || 16);

        const characts = "abcdefghijklmnopqrstuvwxyz1234567980" + ('abcdefghijklmnopqrstuvwxyz').toUpperCase();

        let result = "";        
        
        for (let i = 0; i < length; i++) {
            let index = Math.floor(Math.random() * characts.length);
            result+=characts[index];
        };

        return 'https://discord.gift/' + result;
    },
    /**
     * @param {Message} message 
     */
    message: (message) => {
        if (!message.guild) return;
        let cmds = message.client.commands;
        
        const args = message.content.slice(prefix.length).split(' ');
        let commandName = args.shift().toLowerCase();

        let channels = require('./channels.json');
        const cmd = cmds.get(commandName) || cmds.find(x => x.help.aliases && x.help.aliases.map(y => y.toLowerCase()).includes(commandName));
        
        if (channels.channels.includes(message.channel.id) && (message.author.id !== message.client.user.id)) message.delete().catch(() => {});
        if (!cmd) return;

        let perms = cmd.help.perms;
        if (perms && perms.length > 0) {
            perms = perms.map(x => x.toUpperCase());

            perms.forEach((perm) => {
                if (!message.member.permissions.has(perm)) return message.channel.send({ content: `Vous n'avez pas les permissions suffisantes` }).catch(() => {});
            });
        };

        const run = new Promise((resolve, reject) => resolve(cmd.run(message, args)));
        run.catch(error => {
            message.channel.send({ content: `Une erreur a eu lieu lors de l'exécution de la commande.`, reply:{ messageReference: message } }).catch(() => {});
            console.log(error);
        });
    }
};