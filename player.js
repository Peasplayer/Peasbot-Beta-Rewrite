const discord = require('discord.js')
const config = require('./config.json')
const Database = require("@replit/database")
const db = new Database()

module.exports = async (client) => {
  client.player.on('trackStart', async (queue, track) => {
    let _prefix = require('./util/prefix.js')
    let prefix = await new _prefix().getPrefix(db, config, queue.guild.id)
    if(queue.repeatMode || queue.loopMode) return;
    let embed = new discord.MessageEmbed()
    .setTitle("Now playing")
    .setColor(config.color)
    .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
    .setAuthor(track.requestedBy.username, track.requestedBy.avatarURL())
    .setThumbnail(track.thumbnail)
    .setDescription(`[${track.title}](${track.url})\n\n\`Length\`: ${track.duration}\n\n\`Requested by\`: <@${track.requestedBy.id}>`)
    queue.metadata.channel.send({ embeds: [embed] })
  })

  client.player.on('trackAdd', async (queue, track) => {
    let _prefix = require('./util/prefix.js')
    let prefix = await new _prefix().getPrefix(db, config, queue.guild.id)
    if(require('./commands/music/playlist').isAdding) return
    let embed = new discord.MessageEmbed()
    .setTitle("Added to queue")
    .setColor(config.color)
    .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
    .setAuthor(track.requestedBy.username, track.requestedBy.avatarURL())
    .setThumbnail(track.thumbnail)
    .setDescription(`[${track.title}](${track.url})\n\n\`Length\`: ${track.duration}\n\n\`Requested by\`: <@${track.requestedBy.id}>\n\n\`Position in the queue\`: ${queue.tracks.length}`)
    queue.metadata.channel.send({ embeds: [embed] })
  })

  client.player.on('playlistAdd', async (message, queue, playlist) => {
    let _prefix = require('./util/prefix.js')
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    let embed = new discord.MessageEmbed()
    .setTitle("Added to queue")
    .setColor(config.color)
    .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
    .setAuthor(playlist.requestedBy.username, playlist.requestedBy.avatarURL())
    .setThumbnail(playlist.thumbnail)
    .setDescription(`[${playlist.title}](${playlist.url})\n\n\`Requested by\`: <@${playlist.requestedBy.id}>\n\n\`Length of the playlist\`: ${playlist.tracks.length}\n\n\`Position in the queue\`: ${queue.tracks.length-1-playlist.tracks.length}`)
    message.channel.send({ embeds: [embed] })
  })
}