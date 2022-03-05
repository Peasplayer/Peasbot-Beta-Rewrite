const discord = require('discord.js')

const hook = new discord.WebhookClient({ id: '716582143551209493', token: 'Gs9G2nbIvFkS1_rFR9ujoghyV4_oKLnti2UdNwKAFioatSPsuXhcySTEDEIU7AUz8V8u' })
let green = "#ff756"

class log {
  static async login(client) {
    let embed = new discord.MessageEmbed()
    .setTitle("Bot login event")
    .setColor(green)
    .setDescription("A bot of the network has logged in")
    .addField("__Name__", client.user.username)
    .setThumbnail(client.user.avatarURL())
    .setFooter("Bot Log | Part of the Network")
    .setTimestamp(Date.now())
    //hook.send({ embeds: embed })
  }
  static async error(client, error) {
    let embed = new discord.MessageEmbed()
    .setTitle("Bot error event")
    .setColor("RED")
    .setDescription("A bot of the network has an error!")
    .addField("__Name__", client.user.username)
    .addField("__Fehler__", error.message)
    .addField("__Position__", error.stack)
    .setThumbnail(client.user.avatarURL())
    .setFooter("Bot Log | Part of the Network")
    .setTimestamp(Date.now())
    console.log(error)
    //hook.send({ embeds: embed })
  }
  static async guildJoin(client, guild) {
    let embed = new discord.MessageEmbed()
    .setTitle("Bot join event")
    .setColor("YELLOW")
    .setDescription("A bot of the network has entered a server")
    .addField("__Name__", client.user.username)
    .addField("__Server__", guild.name)
    .setThumbnail(client.user.avatarURL())
    .setFooter("Bot Log | Part of the Network")
    .setTimestamp(Date.now())
    //if(invite) embed.addField("__Einladung__", invite.url)
    //hook.send({ embeds: embed })
  }
  static async guildLeave(client, guild) {
    let embed = new discord.MessageEmbed()
    .setTitle("Bot Leave Event")
    .setColor("YELLOW")
    .setDescription("A bot of the network has an error!")
    .addField("__Name__", client.user.username)
    .addField("__Server__", guild.name)
    .setThumbnail(client.user.avatarURL())
    .setFooter("Bot Log | Part of the Network")
    .setTimestamp(Date.now())
    //hook.send({ embeds: embed })
  }
}

module.exports = log