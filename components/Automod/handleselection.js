const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } = require('discord.js');
const db = require('../../schemas/automodConfig'); // Assumes your automod config is stored here

module.exports = {
    async handleAutomodSelection(interaction) {
        const selected = interaction.values[0];
        const guildId = interaction.guild.id;

        // Fetch or create settings
        let settings = await db.findOne({ guildId });
        if (!settings) {
            settings = new db({ guildId });
            await settings.save();
        }

        let responseEmbed = new EmbedBuilder().setColor('Blue');

        switch (selected) {
            case 'toggle':
                settings.enabled = !settings.enabled;
                await settings.save();
                responseEmbed.setTitle('🔁 AutoMod Toggled').setDescription(`AutoMod is now **${settings.enabled ? 'Enabled' : 'Disabled'}**.`);
                break;

            case 'filter_links':
                settings.filters.links = !settings.filters.links;
                await settings.save();
                responseEmbed.setTitle('🔗 Link Filter').setDescription(`Link filtering is now **${settings.filters.links ? 'Enabled' : 'Disabled'}**.`);
                break;

            case 'filter_badwords':
                settings.filters.badwords = !settings.filters.badwords;
                await settings.save();
                responseEmbed.setTitle('🚫 Bad Word Filter').setDescription(`Bad word filtering is now **${settings.filters.badwords ? 'Enabled' : 'Disabled'}**.`);
                break;

            case 'filter_spam':
                settings.filters.spam = !settings.filters.spam;
                await settings.save();
                responseEmbed.setTitle('📨 Spam Filter').setDescription(`Spam filtering is now **${settings.filters.spam ? 'Enabled' : 'Disabled'}**.`);
                break;

            case 'set_action': {
                const actionButtons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('action_timeout').setLabel('Timeout').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('action_kick').setLabel('Kick').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('action_ban').setLabel('Ban').setStyle(ButtonStyle.Secondary)
                );
                return await interaction.update({
                    content: 'Choose a punishment method for AutoMod violations:',
                    components: [actionButtons],
                    embeds: []
                });
            }

            case 'set_bypass': {
                const roleSelector = new RoleSelectMenuBuilder()
                    .setCustomId('select_bypass')
                    .setMinValues(1)
                    .setMaxValues(1);
                const roleRow = new ActionRowBuilder().addComponents(roleSelector);
                return await interaction.update({
                    content: 'Please select a role to bypass AutoMod:',
                    components: [roleRow],
                    embeds: []
                });
            }

            case 'external_apps':
                settings.filters.externalApps = !settings.filters.externalApps;
                await settings.save();
                responseEmbed.setTitle('🎮 Anti-External Apps')
                    .setDescription(`Detection of external apps is now **${settings.filters.externalApps ? 'Enabled' : 'Disabled'}**.`);
                break;

            default:
                responseEmbed.setTitle('❓ Unknown Option');
        }

        await interaction.update({ embeds: [responseEmbed], components: [] });
    }
};
