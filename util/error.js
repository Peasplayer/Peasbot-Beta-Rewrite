const discord = require("discord.js")
const config = require("../config.json")

class error {
  constructor(text) {
    let embed = new discord.MessageEmbed()
    .setTitle("Error")
    .setColor("RED")
    .setDescription(config.error + " " + text)
    .setFooter(config.footer.replace("%prefix%help for help", "Try again!"), config.footerImg)
    return embed
  }
}

module.exports = error