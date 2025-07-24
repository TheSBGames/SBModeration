const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const Ticket = require('../../models/Ticket');

module.exports = async (interaction, client) => {
    const customId = interaction.customId;

    if (!customId.startsWith("ticket_")) return;

    const [_, action, categoryId] = customId.split("_");

    if (action === "create") {
        const existingTicket = await Ticket.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (existingTicket) {
            return interaction.reply({ content: "You already have an open ticket.", ephemeral: true });
        }

        const category = interaction.guild.channels.cache.get(categoryId);
        if (!category || category.type !== ChannelType.GuildCategory) {
            return interaction.reply({ content: "Ticket category is misconfigured.", ephemeral: true });
        }

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            parent: category,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
            ]
        });

        await Ticket.create({
            userId: interaction.user.id,
            guildId: interaction.guild.id,
            channelId: channel.id
        });

        const closeBtn = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("ticket_close")
                .setLabel("Close Ticket")
                .setStyle(ButtonStyle.Danger)
        );

        await channel.send({
            content: `${interaction.user}, thank you for opening a ticket!`,
            components: [closeBtn]
        });

        interaction.reply({ content: `Ticket created: ${channel}`, ephemeral: true });
    }

    if (action === "close") {
        const ticket = await Ticket.findOne({ channelId: interaction.channel.id });
        if (!ticket) return interaction.reply({ content: "This channel is not a ticket.", ephemeral: true });

        await Ticket.deleteOne({ channelId: interaction.channel.id });

        await interaction.channel.send("Ticket will be deleted in 5 seconds...");
        setTimeout(() => interaction.channel.delete().catch(() => null), 5000);
    }
};
