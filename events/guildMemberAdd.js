const discord = require("discord.js")
const _prefix = require('../util/prefix.js')

class guildMemberAdd {
  static async event(member, db, config, client) {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, member.guild.id)
    let pl = require('../plugins/welcomer.json')
    if (await db.get(pl.id.replace("%id%", member.guild.id)) != "on") return
    let msg = await db.get(`joinmsg_${member.guild.id}`)
    let chx = client.channels.cache.get(await db.get(`joinchannel_${member.guild.id}`))
    if (await db.get(`welhook_${member.guild.id}`) == "true") chx = new discord.WebhookClient(await db.get(`welhookid_${member.guild.id}`), await db.get(`welhooktoken_${member.guild.id}`));
    if (!msg || !chx) return
    let embed = new discord.MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL())
      .setColor(color)
      .setThumbnail(member.user.avatarURL())
      .setTitle(msg.replace(/%username%/g, member.user.username))
      .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
      .addField("You are member number", member.guild.memberCount, true)
    if (member.guild.rulesChannel) embed.addField("Rules of this server", member.guild.rulesChannel, true)
    chx.send(embed)
    try {
      let scoreboard = await db.get(`memscorechan_${member.guild.id}`)
      if (scoreboard !== null) {
        let channel = client.channels.cache.get(scoreboard)
        channel.edit({ name: `Members: ${channel.guild.memberCount}` })
      }
    } catch { }
    let joindm = await db.get(`joindm_${member.guild.id}`)
    if (joindm) member.send(joindm).catch(() => member);
  }
}

module.exports = guildMemberAdd