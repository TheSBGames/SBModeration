const { EmbedBuilder } = require('discord.js');

module.exports = function createEmbed({ title, description, color = '#2b2d31', footer, timestamp = true }) {
    const embed = new EmbedBuilder().setColor(color);

    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (footer) embed.setFooter({ text: footer });
    if (timestamp) embed.setTimestamp();

    return embed;
};
