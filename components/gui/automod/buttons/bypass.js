module.exports = async (interaction) => {
  await interaction.reply({
    content: "Please mention the role you want to use as **Bypass Role** for Automod.",
    ephemeral: true
  });

  const filter = (m) => m.author.id === interaction.user.id;
  const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 15000 }).catch(() => {});

  const message = collected?.first();
  if (!message || !message.mentions.roles.first()) {
    return interaction.followUp({ content: "❌ No valid role mentioned.", ephemeral: true });
  }

  const role = message.mentions.roles.first();
  const db = require('../../../database/guild-settings');
  await db.set(interaction.guild.id, {
    $set: { 'automod.bypassRole': role.id }
  });

  await interaction.followUp({ content: `✅ Bypass role set to **${role.name}**.`, ephemeral: true });
};
