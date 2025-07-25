module.exports = {
  name: "setstatus",
  description: "🎛️ Set the bot's status (Owner only)",
  usage: "&setstatus <type> <message>",
  category: "owner",

  async execute(message, args, client) {
    if (message.author.id !== "1186506712040099850") {
      return message.reply("❌ Only the bot owner can use this command.");
    }

    const type = args[0];
    const statusMsg = args.slice(1).join(" ");

    if (!type || !statusMsg) {
      return message.reply("❌ Usage: &setstatus <Playing|Listening|Watching|Competing> <message>");
    }

    const validTypes = ["Playing", "Listening", "Watching", "Competing"];
    if (!validTypes.includes(type)) {
      return message.reply(`❌ Invalid type. Choose one of: ${validTypes.join(", ")}`);
    }

    try {
      await client.user.setActivity(statusMsg, { type });
      return message.reply(`✅ Status set to **${type} ${statusMsg}**`);
    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to set status.");
    }
  }
};
