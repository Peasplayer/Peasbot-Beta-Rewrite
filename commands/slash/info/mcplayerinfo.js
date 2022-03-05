const discord = require("discord.js")
const mcapi = require("minecraft-lookup")

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'mcplayerinfo',
    description: 'Get info about a minecraft player',
    options: [
      {
        name: "player",
        description: "The name of the player you want to get info about",
        type: "STRING",
        required: true
      }
    ]
  },
  run: async (client, interaction) => {
    const color = config.color

    const player = interaction.options.getString("player")

    let rawNames = await mcapi.nameHistory("username", player)
    let names = []
    rawNames.forEach(name => {
      names.push(name.name)
    })

    let data = {
      name: (await mcapi.user(player)).name,
      id: (await mcapi.user(player)).id,
      avatar: (await mcapi.head(player)).helmhead,
      skin: (await mcapi.skin(player)).view,
      names: names
    }

    let embed = new discord.MessageEmbed()
        .setColor(color)
        .setFooter(config.footer, config.footerImg)
        .setTitle(player)
        .setThumbnail(data.avatar)
        .setDescription(`Info about the player:\n\n\`Player\`: ${data.name}\r\n\`Skin\`: [Click here to view it](${data.skin})\n\`UUID\`: ${data.id}\n\`Former names\`: ${data.names}`)
    interaction.reply({ embeds: [embed] })
  }
}
