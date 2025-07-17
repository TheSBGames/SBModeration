const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const autoresponderSchema = require('../../models/autoresponder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-responder')
    .setDescription('Delete an autoresponder by its trigger')
    .addStringOption(opt =>
      opt.setName('trigger')
        .setDescription('The trigger text to delete')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute(interaction) {
    const trigger = interaction.options.getString('trigger');
    const deleted = await autoresponderSchema.findOneAndDelete({
      guildId: interaction.guild.id,
      trigger
    });

    if (deleted) {
      await interaction.reply({ content: `🗑️ Deleted autoresponder for trigger: \`${trigger}\``, ephemeral: true });
    } else {
      await interaction.reply({ content: `⚠️ No autoresponder found with that trigger.`, ephemeral: true });
    }
  }
};
