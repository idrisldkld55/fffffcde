const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ],
    partials: ['GUILD_MEMBER']
});
client.commands = new Discord.Collection();

fs.readdirSync('./commands').filter(x => x.endsWith('.js')).forEach((x) => {
    const props = require(`./commands/${x}`);

    client.commands.set(props.help.name, props);
});

fs.readdirSync('./events').filter(x => x.endsWith('.js')).forEach((x) => {
    const props = require(`./events/${x}`);

    client.on(props.event, props.execute);
});

// const InviteManager = require('./inviteManager');
// const data = require('./config.json');
// const manager = new InviteManager(client, data);
// manager.init();

// client.InviteManager = manager;

const { token } = require('./config.json');
client.login(token).catch((e) => {
    throw e;
})