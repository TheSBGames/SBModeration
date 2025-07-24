// commands/admin/np-remove.js
const { SlashCommandBuilder } = require('discord.js');
const NoPrefix = require('../../schemas/noPrefix');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('npremove')
    .setDescription('Remove a user from the no-prefix list')
    .addUserOption(opt => opt.setName('user').setDescription('User to remove').setRequired(true)),

  async execute(interaction) {
    if (interaction.user.id !== '1186506712040099850') {
      return interaction.reply({ content: 'Only the bot owner can use this.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    await NoPrefix.deleteOne({ userId: user.id });

    interaction.reply(`❌ ${user.tag} has been removed from No Prefix mode.`);
  }
};
