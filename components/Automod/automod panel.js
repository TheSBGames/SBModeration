const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    async sendAutomodPanel(interaction, settings) {
        const embed = new EmbedBuilder()
            .setTitle('🛡️ AutoMod Configuration')
            .setDescription('Use the menu below to configure AutoMod settings for your server.')
            .setColor('Blue');

        const menu = new StringSelectMenuBuilder()
            .setCustomId('automod-select')
            .setPlaceholder('Select a filter or action to configure')
            .addOptions([
                {
                    label: 'Enable/Disable AutoMod',
                    description: 'Toggle the AutoMod system on or off.',
                    value: 'toggle',
                    emoji: '🔁'
                },
                {
                    label: 'Filter: Links',
                    description: 'Enable or disable link filtering.',
                    value: 'filter_links',
                    emoji: '🔗'
                },
                {
                    label: 'Filter: Bad Words',
                    description: 'Enable or disable bad word filtering.',
                    value: 'filter_badwords',
                    emoji: '🚫'
                },
                {
                    label: 'Filter: Spam',
                    description: 'Enable or disable spam detection.',
                    value: 'filter_spam',
                    emoji: '📨'
                },
                {
                    label: 'Action: Punishment',
                    description: 'Set what happens when a rule is broken.',
                    value: 'set_action',
                    emoji: '⚒️'
                },
                {
                    label: 'Bypass Role',
                    description: 'Set a role that can bypass AutoMod.',
                    value: 'set_bypass',
                    emoji: '🛑'
                },
                {
                    label: 'Anti-External Apps',
                    description: 'Detect apps like Spotify/FiveM in status/VC.',
                    value: 'external_apps',
                    emoji: '🎮'
                }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        const saveButton = new ButtonBuilder()
            .setCustomId('save_automod')
            .setLabel('💾 Save Settings')
            .setStyle(ButtonStyle.Success);

        const cancelButton = new ButtonBuilder()
            .setCustomId('cancel_automod')
            .setLabel('❌ Cancel')
            .setStyle(ButtonStyle.Danger);

        const buttons = new ActionRowBuilder().addComponents(saveButton, cancelButton);

        await interaction.reply({
            embeds: [embed],
            components: [row, buttons],
            ephemeral: true
        });
    }
};
