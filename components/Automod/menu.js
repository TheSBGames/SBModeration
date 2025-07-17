const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    sendAutomodPanel: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: "❌ You must be an administrator to use this panel.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('🔧 AutoMod Setup Panel')
            .setDescription(
                `Use the buttons below to configure the server's AutoMod settings.\n\n` +
                `• **Toggle**: Enable or disable AutoMod\n` +
                `• **View**: View current settings\n` +
                `• **Filters**: Configure filter types\n` +
                `• **Bypass Role**: Set role that bypasses AutoMod`
            )
            .setColor('Blurple');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('automod_toggle')
                .setLabel('Toggle')
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('automod_view_settings')
                .setLabel('View Settings')
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId('automod_setup_filters')
                .setLabel('Setup Filters')
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId('automod_set_bypass')
                .setLabel('Bypass Role')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};
