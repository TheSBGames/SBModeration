const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("✅ SB Moderation bot is alive! TheSBGames");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Keep-alive web server running on port ${PORT}`);
});
