const db = require('../database/guild-settings');
const autoresponderDB = require('../database/autoresponder');
const logEvent = require('../utils/logEvent');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const { guild } = member;

    // Leave message system
    const settings = await db.get(guild.id);
    if (settings?.leaveChannel && settings?.leaveMessage) {
      const channel = guild.channels.cache.get(settings.leaveChannel);
      if (channel) {
        const msg = settings.leaveMessage
          .replace('{user}', member.user.tag)
          .replace('{mention}', `<@${member.id}>`)
          .replace('{server}', guild.name)
          .replace('{membercount}', guild.memberCount.toString());

        channel.send({ content: msg }).catch(() => {});
      }
    }

    // Autoresponder leave keyword
    const autoresponders = await autoresponderDB.getAll(guild.id);
    for (const responder of autoresponders) {
      if (responder.trigger.toLowerCase() === 'leave') {
        const channel = guild.systemChannel || guild.channels.cache.find(c => c.isTextBased() && c.permissionsFor(guild.members.me).has('SendMessages'));
        if (channel) {
          channel.send(responder.response.replace('{user}', member.user.tag)).catch(() => {});
        }
        break;
      }
    }

    // Logging the member leave
    logEvent(member.guild, 'memberLeave', {
      description: `📤 **${member.user.tag}** left the server.`,
      footer: `ID: ${member.id}`,
      color: 0xff3333
    });
  }
};
