const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = async function paginate(interaction, pages, timeout = 60000) {
    let page = 0;

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('prev')
            .setLabel('◀')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('next')
            .setLabel('▶')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId('stop')
            .setLabel('⏹')
            .setStyle(ButtonStyle.Danger)
    );

    const currentPage = await interaction.reply({
        embeds: [pages[page]],
        components: [row],
        fetchReply: true,
        ephemeral: true
    });

    const collector = currentPage.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.user.id,
        time: timeout,
    });

    collector.on('collect', async (i) => {
        if (!i.isButton()) return;

        switch (i.customId) {
            case 'prev':
                page = page > 0 ? --page : pages.length - 1;
                break;
            case 'next':
                page = page + 1 < pages.length ? ++page : 0;
                break;
            case 'stop':
                collector.stop();
                return i.update({ components: [] });
        }

        await i.update({
            embeds: [pages[page]],
            components: [row],
        });
    });

    collector.on('end', () => {
        if (currentPage.editable) {
            currentPage.edit({ components: [] }).catch(() => {});
        }
    });
};
