const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async function paginateEmbeds(interaction, pages, timeout = 60000) {
    if (!pages || pages.length === 0) return;

    let page = 0;

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('prev').setLabel('◀️').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('next').setLabel('▶️').setStyle(ButtonStyle.Secondary),
    );

    const msg = await interaction.reply({
        embeds: [pages[page]],
        components: pages.length > 1 ? [row] : [],
        fetchReply: true,
        ephemeral: true
    });

    if (pages.length < 2) return;

    const collector = msg.createMessageComponentCollector({ time: timeout });

    collector.on('collect', async i => {
        if (i.user.id !== interaction.user.id) return i.reply({ content: "Only you can interact with this!", ephemeral: true });

        if (i.customId === 'prev') {
            page = page > 0 ? --page : pages.length - 1;
        } else if (i.customId === 'next') {
            page = page + 1 < pages.length ? ++page : 0;
        }

        await i.update({ embeds: [pages[page]], components: [row] });
    });

    collector.on('end', () => {
        msg.edit({ components: [] }).catch(() => {});
    });
};
