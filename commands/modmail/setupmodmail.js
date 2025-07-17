const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const ModMailConfig = require('../../models/ModMailConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setupmodmail')
    .setDescription('Configure ModMail inbox and logging')
    .addChannelOption(option =>
      option.setName('inbox')
        .setDescription('Inbox channel for ModMail messages')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('category')
        .setDescription('Category to create ModMail threads under')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false)
    )
    .addChannelOption(option =>
      option.setName('logchannel')
        .setDescription('Channel to log ModMail replies')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),

  async slashExecute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: '❌ You need Administrator permission to run this command.', ephemeral: true });
    }

    const inbox = interaction.options.getChannel('inbox');
    const category = interaction.options.getChannel('category');
    const logChannel = interaction.options.getChannel('logchannel');

    await ModMailConfig.findOneAndUpdate(
      { guildId: interaction.guild.id },
      {
        guildId: interaction.guild.id,
        inboxChannelId: inbox.id,
        inboxCategoryId: category?.id || null,
        logChannelId: logChannel?.id || null,
      },
      { upsert: true }
    );

    await interaction.reply({ content: '✅ ModMail configured successfully!', ephemeral: true });
  }
};
