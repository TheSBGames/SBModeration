const db = require('../database/guild-settings');
const autoresponderDB = require('../database/autoresponder');
const autoroleDB = require('../database/autorole');
const logEvent = require('../utils/logEvent');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const { guild } = member;

    // Welcome message
    const settings = await db.get(guild.id);
    if (settings?.welcomeChannel && settings?.welcomeMessage) {
      const channel = guild.channels.cache.get(settings.welcomeChannel);
      if (channel) {
        const msg = settings.welcomeMessage
          .replace('{user}', `<@${member.id}>`)
          .replace('{server}', guild.name)
          .replace('{membercount}', guild.memberCount.toString());

        channel.send({ content: msg }).catch(() => null);
      }
    }

    // Autorole
    const autoroleConfig = await autoroleDB.get(guild.id);
    if (autoroleConfig?.enabled) {
      let roleId = null;

      if (member.user.bot && autoroleConfig.botRole) {
        roleId = autoroleConfig.botRole;
      } else if (!member.user.bot && autoroleConfig.humanRole) {
        roleId = autoroleConfig.humanRole;
      } else if (autoroleConfig.defaultRole) {
        roleId = autoroleConfig.defaultRole;
      }

      if (roleId) {
        const role = guild.roles.cache.get(roleId);
        if (role) {
          member.roles.add(role).catch(() => null);
        }
      }
    }

    // Autoresponder welcome keyword (if configured)
    const autoresponders = await autoresponderDB.getAll(guild.id);
    for (const responder of autoresponders) {
      if (responder.trigger.toLowerCase() === 'welcome') {
        const channel = guild.systemChannel || guild.channels.cache.find(c => c.isTextBased() && c.permissionsFor(guild.members.me).has('SendMessages'));
        if (channel) {
          channel.send(responder.response.replace('{user}', `<@${member.id}>`)).catch(() => {});
        }
        break;
      }
    }

    // Logging the member join
    logEvent(member.guild, 'memberJoin', {
      description: `📥 **${member.user.tag}** joined the server.`,
      footer: `ID: ${member.id}`,
      color: 0x00ff00
    });
  }
};
