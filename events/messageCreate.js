const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const db = require('../utils/database');
const chatgpt = require('../utils/chatgpt');
const automod = require('../utils/automod');

module.exports = async (message, client) => {
  // Ignore bot messages
  if (message.author.bot) return;

  const isDM = !message.guild;

  // =======================
  // 💌 MODMAIL SYSTEM (DM)
  // =======================
  if (isDM) {
    const modmailInboxId = db.get(`modmail_inbox_${client.user.id}`);
    if (!modmailInboxId) return;

    const inboxChannel = await client.channels.fetch(modmailInboxId).catch(() => null);
    if (!inboxChannel) return;

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.tag,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })
      .setDescription(message.content || '*No text provided.*')
      .setColor('Blurple')
      .setFooter({ text: `User ID: ${message.author.id}` })
      .setTimestamp();

    inboxChannel.send({ embeds: [embed] });
    return;
  }

  const guildId = message.guild.id;

  // =========================
  // 🧠 CHATGPT AUTO CHANNEL
  // =========================
  const chatChannels = db.get(`chatgpt_channels_${guildId}`) || [];
  if (chatChannels.includes(message.channel.id)) {
    await message.channel.sendTyping();
    try {
      const reply = await chatgpt.ask(message.content, message.author.id);
      return message.reply({ content: reply });
    } catch (e) {
      console.error(e);
      return message.reply('❌ Error while talking to ChatGPT.');
    }
  }

  // =====================
  // 🤖 AUTORESPONDER
  // =====================
  const responders = db.get(`autoresponders_${guildId}`) || [];
  const msgLower = message.content.toLowerCase();
  for (const { trigger, response } of responders) {
    if (trigger && response && trigger.toLowerCase() === msgLower) {
      return message.channel.send({ content: response });
    }
  }

  // =============================
  // 🚫 AUTOMODERATION SYSTEM
  // =============================
  const settings = db.get(`automod_${guildId}`) || {};
  const member = message.member;

  // Bypass check
  const bypassRole = settings.bypassRole;
  const isBypassed = (
    message.member?.permissions.has(PermissionsBitField.Flags.Administrator) ||
    (bypassRole && member.roles.cache.has(bypassRole))
  );

  if (!isBypassed) {
    // === Block links ===
    if (settings.blockLinks && /(https?:\/\/[^\s]+)/gi.test(message.content)) {
      const result = await automod.takeAction(client, message, settings.linkAction || 'timeout');
      if (result === 'deleted') return;
    }

    // === Block words ===
    if (settings.badWords?.length) {
      const words = settings.badWords.map(w => w.toLowerCase());
      for (const word of words) {
        if (msgLower.includes(word)) {
          const result = await automod.takeAction(client, message, settings.wordAction || 'timeout');
          if (result === 'deleted') return;
        }
      }
    }

    // === Anti-External Apps (VC Status/Spotify) ===
    if (settings.antiApps) {
      const activities = message.member.presence?.activities || [];
      const flagged = activities.find(a =>
        ['Spotify', 'FiveM', 'Custom'].some(app => a.name?.toLowerCase()?.includes(app.toLowerCase()))
      );
      if (flagged) {
        const result = await automod.takeAction(client, message, settings.appAction || 'timeout');
        if (result === 'deleted') return;
      }
    }
  }
};
