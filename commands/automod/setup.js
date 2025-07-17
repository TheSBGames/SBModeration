const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('automod-setup')
    .setDescription('Configure the auto-moderation system using a GUI panel (Admin only)'),

  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '❌ You need Administrator permission to use this.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('AutoModeration Setup Panel')
      .setDescription('Choose an option to configure:')
      .setColor('#0099ff');

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('automod_setup_select')
      .setPlaceholder('Select a setting to configure')
      .addOptions([
        {
          label: '⚠️ Enable/Disable AutoMod',
          value: 'toggle_automod'
        },
        {
          label: '🕒 Set Timeout Action',
          value: 'set_timeout'
        },
        {
          label: '🔇 Set Mute Action',
          value: 'set_mute'
        },
        {
          label: '🚫 Set Ban Action',
          value: 'set_ban'
        },
        {
          label: '⚔️ Set Kick Action',
          value: 'set_kick'
        },
        {
          label: '🔤 Blocked Words List',
          value: 'blocked_words'
        },
        {
          label: '🔗 Block Links',
          value: 'block_links'
        },
        {
          label: '🚫 Anti External Apps',
          value: 'block_external_apps'
        },
        {
          label: '🛡️ Set Bypass Role',
          value: 'bypass_role'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
