const discord = require("discord.js")
const error = require('../../../util/error.js')
const _prefix = require('../../../util/prefix.js')
const googleTTS = require('google-tts-api');

module.exports = {
  name: "tts",
  category: "",
  description: "",
  usage: "",
  aliases: [""],
  noPerms: true,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    if(message.author.id != config.owner1id && message.author.id != config.owner2id && message.author.id != config.owner3id) return message.channel.send(new error("This command is only for the owner of this bot"))
    if(!message.member.voice.channel) return message.channel.send(new error("You must be in a voice channel!"))
    if(!args[0]) return message.channel.send(new error("You must specify a language!"))
    if(!args[1]) return message.channel.send(new error("You must specify a text!"))
    let url = googleTTS.getAllAudioUrls(args.slice(1).join(" "), {
      lang: args[0],
      slow: false,
      host: 'https://translate.google.com',
    })
    let connection = await message.member.voice.channel.join()
    let dispatcher = connection.play(url[0].url)
    connection.voice.setSelfDeaf(true)
    dispatcher.on('finish', () => {
      message.member.voice.channel.leave()
    });
  }
}