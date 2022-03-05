const discord = require("discord.js")
const error = require('../../util/error.js')
const _prefix = require('../../util/prefix.js')
const YouTube = require("youtube-sr").default;

module.exports = {
  name: "playlist",
  category: "",
  description: "",
  usage: "",
  aliases: [""],
  noPerms: true,
  isAdding: false,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    let footer = config.footer.replace("%prefix%", prefix)
    
    let playlist = await db.get(`playlist_${message.author.id}`)

    if (playlist == null) playlist = []

    if (args[0] == "add") {
      if (args[1] == null)
        return message.channel.send({ embeds: new error("You need to specify a song") })
      let video = await YouTube.searchOne(args.slice(2).join(' '))
      playlist.push({title: video.title, url: "https://www.youtube.com/watch?v="+video.id})
      message.channel.send(`\`${video.title}\` has been added to your playlist.`)
      db.set(`playlist_${message.author.id}`, playlist)
    } else if (args[0] == "play") {
      if(playlist.length == 0) 
        return message.channel.send({ embeds: new error("Your playlist is empty") })
      if(client.player.isPlaying(message))
        client.player.stop(message)
      playlist.forEach(song => {
        client.player.play(message, song.url, true)
        if (client.player.getQueue(message) != null && !client.player.getQueue(message).loopMode)
          this.isAdding = true
      })
      setTimeout(() => { client.player.setLoopMode(message, false) }, 3000)
      message.channel.send("Your playlist is now being played.")
    } else if (args[0] == "list" || args[0] == null) {
      let embed = new discord.MessageEmbed()
      .setColor(color)
      .setFooter(footer, config.footerImg)
      .setTitle("Your Playlist")
      if(playlist.length != 0) 
        embed.setDescription(`__Your Playlist__:`)
      else 
        return message.channel.send({ embeds: new error("Your playlist is empty") })
      let i = 0
      playlist.forEach(track => {
        if(i == 0) {
          embed.setDescription(embed.description + `\n`)
        } else {
          embed.setDescription(embed.description + `\n\n`)
        }
        embed.setDescription(embed.description + `\`${playlist.indexOf(track)+1}\`. [${track.title}](${track.url})`)
        i++
      })
      message.channel.send({ embeds: embed })
    } else if (args[0] == "remove") {
      if(playlist.length == 0) 
        return message.channel.send({ embeds: new error("Your playlist is empty") })
      if (args[1] == null)
        return message.channel.send({ embeds: new error("You need to specify a song in your playlist") })
      let song = playlist[args[1]-1]
      if(song == null) 
        return message.channel.send({ embeds: new error("You need to specify a song in your playlist") })
      playlist = playlist.filter(_song => {_song.title == song.title})
      db.set(`playlist_${message.author.id}`, playlist)
      message.channel.send(`\`${video.title}\` has been removed to your playlist.`)
    }
  }
}
