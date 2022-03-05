const discord = require("discord.js")
const error = require('../../util/error.js')
const _prefix = require('../../util/prefix.js')

module.exports = {
  name: "resume",
  category: "",
  description: "",
  usage: "",
  aliases: [""],
  noPerms: true,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    let footer = config.footer.replace("%prefix%", prefix)
    let vc = message.member.voice.channel
    if(!vc) return message.channel.send({ embeds: new error("You must be in a voice channel!") })
    if(!client.player.isPlaying(message)) return message.channel.send({ embeds: new error("Nothing is being played!") });
    client.player.resume(message)
    message.channel.send("⏯️ Continued!")
  }
}
