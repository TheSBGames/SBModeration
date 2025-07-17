utils
const { EmbedBuilder } = require('discord.js');

module.exports = function createEmbed({ title, description, color = '#2f3136', footer, image, timestamp = true }) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(description || '');

    if (title) embed.setTitle(title);
    if (footer) embed.setFooter({ text: footer.text, iconURL: footer.iconURL });
    if (image) embed.setImage(image);
    if (timestamp) embed.setTimestamp();

    return embed;
};
