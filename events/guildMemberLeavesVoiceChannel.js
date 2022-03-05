const discord = require('discord.js')

class guildMemberLeavesVoiceChannel {
  static async event(member, channel, db) {
    async function support() {
      let supvcs = await db.get(`supportvcs_${member.guild.id}`)
      if(!supvcs) return;
      let supvc = supvcs.filter(vc => vc.channel == channel.id)
      if(!supvc[0]) return
      if(supvc[0].user != member.user.id) return
      let _supvcs = []
      supvcs.forEach(vc => {
        if(vc.channel == supvc[0].channel) return
        _supvcs.push(vc)
      })
      db.set(`supportvcs_${member.guild.id}`, _supvcs)
      channel.delete()
      let log = member.guild.channels.cache.get(await db.get(`supportlog_${member.guild.id}`))
      if(!log) return
      log.send(`<@${member.user.id}>s Support channel has been deleted.`)
    }
    support()
  }
}

module.exports = guildMemberLeavesVoiceChannel