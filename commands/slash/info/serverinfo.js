/*const discord = require("discord.js")
const error = require('../../../util/error.js')
const _prefix = require('../../../util/prefix.js')

module.exports = {
  name: "serverinfo",
  category: "",
  description: "",
  usage: "",
  aliases: [""],
  noPerms: true,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    let footer = config.footer.replace("%prefix%", prefix)
    
    let embed = new discord.MessageEmbed()
    .setAuthor(message.guild.name, message.guildd.iconURL())
    .setTitle("Serverinfo")
    .setColor(color)
    .setDescription(``)

  }
}*/
const discord = require("discord.js")

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'serverinfo',
    description: 'Get information about this server',
    options: []
  },
  run: async (client, interaction) => {
    const color = config.color

    const guild = interaction.guild

    let onlineCount = 0;
    guild.members.cache.forEach(member => {
      if(member.presence) onlineCount++
    })

    let botCount = 0;
    let userCount = 0;
    guild.members.cache.forEach(member => {
      if(member.user.bot) {
        botCount++
      } else {
        userCount++
      }
    })

    let embed = new discord.MessageEmbed()
        .setColor(color)
        .setAuthor("Serverinfo")
        //.setDescription(`__SERVER__\n\n(👔)|\`Owner\`~ ${guild.owner.user}\n(💬)|\`Server Name\`~ **${guild.name}**\n(🆔)|\`ID\`: ${guild.id}\n\n__ACTIVITY__\n\n(👥)|\`Members\`: ${guild.memberCount}\n(🗣️)|\`Online\`: ${onlineCount}\n\n__IMPORTANT CHANNELS__\n\n(<a:A6:772092096474906634>)|<#767805711794176051> \n(<a:A6:772092096474906634>)|<#767795996280619058> \n(<a:A6:772092096474906634>)|<#767810023244955709> \n(<a:A6:772092096474906634>)|<#781798837026684948> \n\n__STAFF ROLES__\n\n(<a:A6:772092096474906634>)|<@&768144313498337340> \n(<a:A6:772092096474906634>)|<@&768142990857207818> \n(<a:A6:772092096474906634>)|<@&768141908928495657> \n(<a:A6:772092096474906634>)|<@&768059975293468674> \n`)
    .addField("Owner", (await guild.fetchOwner()).user.username, true)
    .addField("Partnered", guild.partnered ? "<:verified:889145119469600778>" : "❌", true)
    .addField("Boosts", guild.premiumSubscriptionCount.toString(), true)
    .addField("Channels", guild.channels.cache.size.toString(), true)
    .addField("Members", guild.members.cache.size.toString(), true)
    .addField("Emojis", guild.emojis.cache.size.toString(), true)
    .addField("Stages", guild.stageInstances.cache.size.toString(), true)
    .addField("Created at", `<t:${guild.createdTimestamp}>`, true)//guild.createdAt.toString().replace("GMT+0000 (Coordinated Universal Time)", "GMT")
    if (guild.description)
      embed.addField("Description", guild.description.toString(), true)
    if (guild.rulesChannel)
      embed.addField("Rules-Channel", "<#"+guild.rulesChannel.id+">", true)
    if (guild.vanityURLCode)
      embed.addField("Vanity-URL", "<#"+guild.vanityURLCode+">", true)
    if (guild.icon)
      embed.setThumbnail(guild.iconURL())
    embed.setFooter(config.footer, config.footerImg)
    interaction.reply({ embeds: [embed] })
  }
}
