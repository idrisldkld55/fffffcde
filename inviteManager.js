const { Collection, Client, User, Guild, GuildMember } = require('discord.js');
const fs = require('fs');

let cache = new Collection();
class InviteManager {
    /**
     * @param {Client} client 
     * @param {{ joinChannel: String, joinMessage: String, joinEnable: Boolean, leaveChannel: String, leaveMessage: String, leaveEnable: Boolean, guildID: String }} data
     */
    constructor(client, data) {
        this.client = client;
        this.invites = require('./invites.json');
        this.invited = require('./invited.json');
        this.joinChannel = data.joinChannel;
        this.joinMessage = data.joinMessage;
        this.joinEnable = data.joinEnable || false;
        this.leaveChannel = data.leaveChannel;
        this.leaveMessage = data.leaveMessage;
        this.leaveEnable = data.leaveEnable || false;
        this.guild = data.guildID;
    }
    save() {
        fs.writeFileSync('./invites.json', JSON.stringify(this.invites));
        fs.writeFileSync('./invited.json', JSON.stringify(this.invited));
    }
    alreadyInvited(invited) {
        let isInvited = false;

        Object.keys(this.invited).forEach((key) => {
            if (this.invited[key].includes(invited)) isInvited = true;
        });

        return isInvited;
    }
    addInvite(inviter, invited) {
        if (!this.invites[inviter]) this.invites[inviter] = {total: 0, fakes: 0, bonus: 0, invites: 0, leaves: 0};

        let newData = this.invites[inviter];
        newData.total++;
        if (this.alreadyInvited(invited)) newData.fakes++;
        else newData.invites++;

        this.invites[inviter] = newData;
        if (!this.invited[inviter]) this.invited[inviter] = [];
        this.invited[inviter].push(invited);

        this.save();
        return this.invites[inviter].total;
    }
    removeInvite(inviter) {
        if (!this.invites[inviter]) return;

        let newData = this.invites[inviter];
        newData.leaves++;

        this.invites[inviter] = newData;
        this.save();
    }
    /**
     * @returns {{ total: Number, fakes: Number, bonus: Number, invites: Number, leaves: Number }}
     */
    displayInvites(inviter) {
        return this.invites[inviter] || { total: 0, fakes: 0, bonus: 0, invites: 0, leaves: 0 };
    }
    addBonus(inviter) {
        if (!this.invites[inviter]) this.invites[inviter] = { total: 0, fakes: 0, bonus, invites: 0, leaves: 0 };
        this.invites[inviter].bonus++;
        this.invites[inviter].total++;

        this.save();
        return this.invites[inviter].bonus;
    }
    resetInvites(save) {
        this.invites = {};
        if (save == true) this.save();
    }
    resetInvited(save) {
        this.invited = {};
        if (save == true) this.save();
    }
    resetAll() {
        this.resetInvites(false);
        this.resetInvited(false);

        this.save();
    }
    resetUser(userID) {
        if (this.invites[userID]) delete this.invites[userID];
        if (this.invited[userID]) delete this.invited[userID];

        this.save();
    }
    /**
     * @param {{ inviter: User, invited: User, guild: Guild }} data
     */
    sendJoinMessage(data) {
        if (!this.joinEnable) return;

        const invites = this.invites[data.inviter.id] || { total: 1 };

        let message = this.joinMessage;
        message = message.replace(/{inviter.name}/g, data.inviter ? data.inviter.username : "Inconnu");
        message = message.replace(/{inviter.id}/g, data.inviter ? data.inviter.id : "Inconnu");
        message = message.replace(/{inviter.mention}/g, data.inviter ? `<@${data.inviter.id}>` : 'Inconnu');
        message = message.replace(/{user.name}/g, data.invited ? data.invited.username : "Inconnu");
        message = message.replace(/{user.id}/g, data.invited ? data.invited.id : "Inconnu");
        message = message.replace(/{user.mention}/g, data.invited ? `<@${data.invited.id}>` : 'Inconnu');
        message = message.replace(/{invites}/g, invites.total);

        const channel = this.client.channels.cache.get(this.joinChannel);
        if (!channel) return;

        channel.send({ content: message }).catch(() => {});
    }
    
    /**
     * @param {{ inviter: User, invited: User, guild: Guild }} data
     */
    sendLeaveMessage(data) {
        if (!this.leaveEnable) return;

        const invites = this.invites[data.inviter.id] || { total: 1 };

        let message = this.leaveMessage;
        message = message.replace(/{inviter.name}/g, data.inviter ? data.inviter.username : "Inconnu");
        message = message.replace(/{inviter.id}/g, data.inviter ? data.inviter.id : "Inconnu");
        message = message.replace(/{inviter.mention}/g, data.inviter ? `<@${data.inviter.id}>` : 'Inconnu');
        message = message.replace(/{user.name}/g, data.invited ? data.invited.username : "Inconnu");
        message = message.replace(/{user.id}/g, data.invited ? data.invited.id : "Inconnu");
        message = message.replace(/{user.mention}/g, data.invited ? `<@${data.invited.id}>` : 'Inconnu');
        message = message.replace(/{invites}/g, invites.total);

        const channel = this.client.channels.cache.get(this.leaveChannel);
        if (!channel) return;

        channel.send({ content: message }).catch(() => {});
    }
    /**
     * @param {GuildMember} member 
     */
    async onMemberRemove(member) {
        if (!member.guild.id == this.guild) return;
        const guild = member.guild;

        let inviterID = "null";
        Object.keys(this.invited).forEach((key) => {
            let array = this.invited[key];
            if (array.includes(member.id)) inviterID = key;
        });

        const inviter = await this.client.users.fetch(inviterID);
        if (!inviter) return this.sendLeaveMessage({ guild: guild, invited: member.user });
 
        this.sendLeaveMessage({ guild: guild, inviter: inviter, invited: member.user });
    }
    /**
     * @param {GuildMember} member 
     */
    async onMemberAdd(member) {
        if (!member.guild.id == this.guild) return;
        const guild = member.guild;

        const newInvites = await member.guild.invites.fetch();
        const oldInvites = cache.get(member.guild.id);

        const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
        if (!invite) return this.sendJoinMessage({ guild: guild, invited: member.user });
        const inviter = await this.client.users.fetch(invite.inviter.id);
 
        this.sendJoinMessage({ guild: guild, inviter: inviter, invited: member.user });
    }
    init() {
        this.client.on('guildMemberAdd', this.onMemberAdd);
        this.client.on('guildMemberRemove', this.onMemberRemove)
    }
};

module.exports = InviteManager;