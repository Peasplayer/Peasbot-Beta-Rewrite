const discord = require("discord.js")
const error = require('../../util/error.js')
const _prefix = require('../../util/prefix.js')

module.exports = {
  name: "queue",
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
    let queue = client.player.getQueue(message.guild)
    if(!queue) return message.channel.send({ embeds: new error("There is no queue!") })
    let nowPlaying = queue.tracks[0]
    let embed = new discord.MessageEmbed()
    .setColor(color)
    .setFooter(footer, config.footerImg)
    .setTitle("🕓 Queue 🕓")
    .setDescription(`__Now Playing__:\n[${nowPlaying.title}](${nowPlaying.url})\n\`Requested by\`: <@${nowPlaying.requestedBy.id}>`)
    if(queue.tracks.length != 0) embed.setDescription(embed.description + `\n\n__Entire queue__:`)
    let i = 0
    queue.tracks.forEach(track => {
      if(i == 0) {
        embed.setDescription(embed.description + `\n`)
      } else {
        embed.setDescription(embed.description + `\n\n`)
      }
      embed.setDescription(embed.description + `\`${queue.tracks.indexOf(track)+1}\`. [${track.title}](${track.url})\n\`Requested by\`: <@${nowPlaying.requestedBy.id}>`)
      i++
    })
    message.channel.send({ embeds: [embed] })
  }
}
