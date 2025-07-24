const { google } = require('googleapis');
const YoutubeSettings = require('../../database/youtube-settings');
const { EmbedBuilder } = require('discord.js');

const youtube = google.youtube('v3');
const apiKey = 'AIzaSyCTe5EWBmnRcp2EUeEV2yC6T_f6X4xrywI'; // Replace with your API key

module.exports = async (client) => {
  setInterval(async () => {
    const settings = await YoutubeSettings.find();

    for (const config of settings) {
      try {
        const response = await youtube.search.list({
          key: apiKey,
          channelId: config.youtubeChannelId,
          part: 'snippet',
          order: 'date',
          maxResults: 1,
        });

        const latest = response.data.items[0];
        if (!latest || latest.id.videoId === config.lastVideoId) continue;

        const embed = new EmbedBuilder()
          .setTitle(latest.snippet.title)
          .setDescription(latest.snippet.description)
          .setURL(`https://www.youtube.com/watch?v=${latest.id.videoId}`)
          .setImage(latest.snippet.thumbnails.high.url)
          .setTimestamp()
          .setColor('#FF0000')
          .setFooter({ text: 'New YouTube upload' });

        const channel = await client.channels.fetch(config.channelId).catch(() => {});
        if (channel) await channel.send({ embeds: [embed] });

        config.lastVideoId = latest.id.videoId;
        await config.save();

      } catch (err) {
        console.error(`YouTube Notifier Error: ${err.message}`);
      }
    }
  }, 3 * 60 * 1000); // Every 3 minutes
};
