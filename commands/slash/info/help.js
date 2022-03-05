const discord = require("discord.js")

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'help',
    description: 'Get a list of available commands',
    options: [{
      name: "category",
      description: "The category you want to get a list of commands from",
      type: "STRING",
      required: true,
      choices: [
        {
          "name": "Economy",
          "value": "economy"
        },
        {
          "name": "Info",
          "value": "info"
        },
        {
          "name": "Miscellaneous",
          "value": "misc"
        },
        {
          "name": "Moderation",
          "value": "mod"
        },
        {
          "name": "Music",
          "value": "music"
        }
      ]
    }

    ]
  },
  run: async (client, interaction) => {
    const color = config.color

    const category = interaction.options.getString("category")

    let embed = new discord.MessageEmbed()
        .setColor(color)
        .setFooter("() = required; [] = optional; * = special authorization\n" + config.footer, config.footerImg)

    switch(category) {
      case "economy":
        embed.setTitle("👮 [__Moderation__] 👮")
            .setDescription("Commands to moderate and manage the server")
            .addField(`🧩 \`/plugins\` [Plugin] [on/off/setup]*`, "Manage the plugins of the bot")
            .addField(`⚙️ \`/settings\` [Setting] [Value]*`, "Manage the settings of the bot")
            .addField(`🎫 \`/ticket\` (create/close/setup*)`, "Manage support tickets")
        break;
      case "info":
        embed.setTitle("📄 [__Info__] 📄")
            .setDescription("Commands to inform yourself")
            .addField(`❓ \`/about\``, "Get information about the bot")
            .addField(`❓ \`/help\``, "Shows a list of all the commands of this bot")
            .addField(`<:mcsteve:795300135277559859> \`/mcplayerinfo\``, "Shows information about a Minecraft player")
            .addField(`<:mcip:795286363485241365> \`/mcserverinfo\``, "Shows information about a Minecraft server")
            .addField(`🏓 \`/ping\``, "Shows the time the bot needs to respond")
        break;
      case "misc":
        embed.setTitle("🎮 [__Miscellaneous__] 🎮")
            .setDescription("Various useful commands")
        break;
      case "mod":
        embed.setTitle("👮 [__Moderation__] 👮")
            .setDescription("Commands to moderate and manage the server")
            .addField(`🧩 \`/plugins\` [Plugin] [on/off/setup]*`, "Manage the plugins of the bot")
            .addField(`⚙️ \`/settings\` [Setting] [Value]*`, "Manage the settings of the bot")
            .addField(`🎫 \`/ticket\` (create/close/setup*)`, "Manage support tickets")
        break;
      case "music":
        embed.setTitle("🎵 [__Music__] 🎵")
            .setDescription(`Commands to listen to music`)
            .addField(`🔂 \`/loop\``, "Repeats the current song")
            .addField(`🔁 \`/loopqueue\``, "Repeats the current playlist")
            .addField(`⏸️ \`/pause\``, "Pauses the playback")
            .addField(`▶️ \`/play\``, "Plays a song from YouTube")
            .addField(`🕓 \`/queue\``, "Displays the queue of songs")
            .addField(`⏯️ \`/resume\``, "Resumes playback")
            .addField(`⏩ \`/skip\``, "Skips the current song")
            .addField(`⏹️ \`/stop\``, "Stops playback")
            .addField(`🔈 \`/volume\``, "Changes the volume of the player")
        break;
    }

    interaction.reply({ embeds: [embed] })
  }
}