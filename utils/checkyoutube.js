const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const db = require('../database/youtube-schema'); // adjust path to match your DB

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

module.exports = async (client) => {
  const subscriptions = await db.find();

  for (const sub of subscriptions) {
    const { channelId, guildId, notifyChannelId, latestVideoId } = sub;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=1&type=video&key=${YOUTUBE_API_KEY}`;

    try {
      const res = await axios.get(url);
      const video = res.data.items[0];

      if (!video || video.id.videoId === latestVideoId) continue;

      const newVideoId = video.id.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${newVideoId}`;

      const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(video.snippet.title)
        .setDescription(`New video uploaded by **${video.snippet.channelTitle}**`)
        .setThumbnail(video.snippet.thumbnails.default.url)
        .setURL(videoUrl)
        .setTimestamp();

      const guild = client.guilds.cache.get(guildId);
      if (!guild) continue;

      const notifyChannel = guild.channels.cache.get(notifyChannelId);
      if (notifyChannel && notifyChannel.isTextBased()) {
        notifyChannel.send({ embeds: [embed] });

        // Save the latest video ID
        await db.findOneAndUpdate({ guildId, channelId }, { latestVideoId: newVideoId });
      }
    } catch (err) {
      console.error(`[YouTube] Error checking channel ${channelId}:`, err.message);
    }
  }
};
