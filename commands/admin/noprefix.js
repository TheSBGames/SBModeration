const { SlashCommandBuilder } = require('discord.js');
const NoPrefix = require('../../database/noprefix');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('np')
    .setDescription('Manage no-prefix access (Bot Owner only)')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Give a user no-prefix access')
        .addUserOption(opt =>
          opt.setName('user').setDescription('User to add').setRequired(true))
        .addStringOption(opt =>
          opt.setName('duration').setDescription('Duration (e.g., 10m, 1d, permanent)').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Remove no-prefix access')
        .addUserOption(opt =>
          opt.setName('user').setDescription('User to remove').setRequired(true))),

  async execute(interaction) {
    if (interaction.user.id !== config.ownerId) {
      return interaction.reply({ content: 'Only the bot owner can manage no-prefix users.', ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();
    const user = interaction.options.getUser('user');

    if (sub === 'add') {
      const duration = interaction.options.getString('duration');
      await NoPrefix.add(user.id, duration);
      return interaction.reply({ content: `✅ ${user.tag} added to no-prefix list for ${duration}`, ephemeral: true });
    }

    if (sub === 'remove') {
      await NoPrefix.remove(user.id);
      return interaction.reply({ content: `✅ ${user.tag} removed from no-prefix list`, ephemeral: true });
    }
  }
};
