const { EmbedBuilder } = require('discord.js');
const db = require('../database.js');

module.exports = async function sendModLog(guild, logData) {
    const settings = await db.get(`modlog_${guild.id}`);
    if (!settings || !settings.channelId) return;

    const channel = guild.channels.cache.get(settings.channelId);
    if (!channel) return;

    const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle(logData.title || 'Moderation Log')
        .setDescription(logData.description || '')
        .setTimestamp();

    if (logData.footer) embed.setFooter({ text: logData.footer });

    channel.send({ embeds: [embed] }).catch(() => {});
};
