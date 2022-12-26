const Discord = require('discord.js');

module.exports = {
    help: {
        name: 'gen',
        aliases: ['nitro']
    },
    /**
     * @param {Discord.Message} message
     */
    run: (message) => {
        const channels = require('../channels.json');

        let one = channels.sixty;
        let two = channels.ninetyheight;

        let ids = (one.join(' ') + ' '+ two.join(' ')).split(' ')

        const { gen } = require('../functions');
        const classic = gen({  });
        const boost = gen({ length: 24 });

        const percent = (one.includes(message.channel.id) ? '60' : two.includes(message.channel.id) ? '98' : '0') + '%';
        let isBoost = one[1] == message.channel.id || two[1] == message.channel.id;

        const embed = new Discord.MessageEmbed()
            .setTitle(isBoost ? "Nitro Boost" : "Nitro classic")
            .setDescription(`Your **nitro ${isBoost ? 'boost': 'classic'}** has been succesfully generated in your DM`)
            .setFooter({ text: `${percent} checked` })
            .setColor('BLURPLE')
            .setImage('https://media.discordapp.net/attachments/895551038772346901/977963697328754788/6a0104ba30c01bff32b9e19c49fec1b5.gif')
            
        const dm = new Discord.MessageEmbed()
            .setTitle("<:giveaway:969996226642739240> Here is your nitro")
            .setDescription(`${isBoost ? '<a:nitroboost:977864176078815252>' : '<a:nitrocl:977864250787782746>'} here is your nitro generated in ${message.guild.name} : ${isBoost ? boost : classic}`)
            .setColor('#2c2c2c')
            .setFooter({ text: `${percent} checked` })
            .setImage('https://media.discordapp.net/attachments/895551038772346901/977963697328754788/6a0104ba30c01bff32b9e19c49fec1b5.gif')
            
        message.channel.send({ embeds: [ embed ] }).catch(() => {});
        message.author.send({ embeds: [ dm ] }).then((sent) => {
            setTimeout(() => {
                sent.delete().catch(() => {});
            }, 60000);
        }).catch(() => {});
           
        message.delete().catch(() => {});
    }
}
