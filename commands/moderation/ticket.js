const discord = require("discord.js")
const error = require('../../util/error.js')
const _prefix = require('../../util/prefix.js')

module.exports = {
  name: "ticket",
  category: "",
  description: "",
  usage: "",
  aliases: [""],
  noPerms: true,
  run: async (client, message, args, config, db) => {
    let color = config.color
    let prefix = await new _prefix().getPrefix(db, config, message.guild.id)
    let footer = config.footer.replace("%prefix%", prefix)
    let pl = require('../../plugins/supportmanager.json')
    if (await db.get(pl.id.replace("%id%", message.guild.id)) != "on") return message.channel.send({ embeds: [new error("This is not available on this server.")] })
    if (args[0] == "setup") {
      let embed = new discord.MessageEmbed()
        .setTitle("Ticket")
        .setDescription(args.slice(1).join(" "))
        .setColor(color)
        .setFooter(config.footer.replace("%prefix%", prefix), config.footerImg)
      let msg = await message.channel.send({ embeds: [embed] })
      msg.react("✅")
      db.set(`ticketmsg_${message.guild.id}`, msg.id)
    } else if (args[0] == "close") {
      if (message.mentions.users.first() != null) {
        if (message.guild.channels.resolve(await db.get(`ticket_${message.mentions.users.first().id}_${message.guild.id}`)) == null) return message.channel.send({ embeds: [new error("You do not have an open ticket!")] })
        setTimeout(async function() {
          message.guild.channels.resolve(await db.get(`ticket_${message.mentions.users.first().id}_${message.guild.id}`)).delete()
          db.set(`ticket_${message.mentions.users.first().id}_${message.guild.id}`, null)
        }, 3000)
        message.channel.send("Ticket will be closed")
      }
      else {
        if (message.guild.channels.resolve(await db.get(`ticket_${message.author.id}_${message.guild.id}`)) == null) return message.channel.send({ embeds: [new error("You do not have an open ticket!")] })
        setTimeout(async function() {
          message.guild.channels.resolve(await db.get(`ticket_${message.author.id}_${message.guild.id}`)).delete()
          db.set(`ticket_${message.author.id}_${message.guild.id}`, null)
        }, 3000)
        message.channel.send("Ticket is closed")
      }
    } else if (args[0] == "create") {
      let color = require('../../config.json').color
      try {
        if (message.guild.channels.resolve(await db.get(`ticket_${message.author.id}_${message.guild.id}`)) != null) return message.author.send({ embeds: [new error("You already have an open ticket!")] })
      } catch (e) { }
      let ticket = await message.guild.channels.create(`ticket-${message.member.user.username}`)
      ticket.setParent(await db.get(`ticket_category_${message.guild.id}`))
      ticket.setPosition(0)
      ticket.permissionOverwrites.create(message.member.user, {
        VIEW_CHANNEL: true
      })
      if (message.guild.roles.resolve(await db.get(`supporter_role_${message.guild.id}`)) != null)
        ticket.permissionOverwrites.create(message.guild.roles.resolve(await db.get(`supporter_role_${message.guild.id}`)), {
          VIEW_CHANNEL: true
        })
      if (message.guild.roles.resolve(await db.get(`moderator_role_${message.guild.id}`)) != null)
        ticket.permissionOverwrites.create(message.guild.roles.resolve(await db.get(`moderator_role_${message.guild.id}`)), {
          VIEW_CHANNEL: true
        })
      ticket.permissionOverwrites.create(message.guild.roles.everyone, {
        VIEW_CHANNEL: false
      })
      db.set(`ticket_${message.author.id}_${message.guild.id}`, ticket.id)
      let embed = new discord.MessageEmbed()
        .setTitle("Ticket")
        .setColor(color)
        .setDescription(`Hello <@${message.author.id}>,\n\nPlease describe your concern in more detail in this ticket. Our team will take care of it as soon as possible.\n\nUse the command \`ticket close\` to close the Ticket.`)
      ticket.send({ embeds: [embed] })
      let ping = await ticket.send(`<@${message.author.id}>`)
      ping.delete()
    }
  },
  open: async (member, db) => {
    let color = require('../../config.json').color
    try {
      if (member.guild.channels.resolve(await db.get(`ticket_${member.user.id}_${member.guild.id}`)) != null) return member.user.send({ embeds: [new error("You already have an open ticket!")] })
    } catch (e) { }
    let ticket = await member.guild.channels.create(`ticket-${member.user.username}`)
    ticket.setParent(await db.get(`ticket_category_${member.guild.id}`))
    ticket.setPosition(0)
    ticket.permissionOverwrites.create(member.user, {
      VIEW_CHANNEL: true
    })
    if (member.guild.roles.resolve(await db.get(`supporter_role_${member.guild.id}`)) != null)
      ticket.permissionOverwrites.create(member.guild.roles.resolve(await db.get(`supporter_role_${member.guild.id}`)), {
        VIEW_CHANNEL: true
      })
    if (member.guild.roles.resolve(await db.get(`moderator_role_${member.guild.id}`)) != null)
      ticket.permissionOverwrites.create(member.guild.roles.resolve(await db.get(`moderator_role_${member.guild.id}`)), {
        VIEW_CHANNEL: true
      })
    ticket.permissionOverwrites.create(member.guild.roles.everyone, {
      VIEW_CHANNEL: false
    })
    db.set(`ticket_${member.user.id}_${member.guild.id}`, ticket.id)
    let embed = new discord.MessageEmbed()
      .setTitle("Ticket")
      .setColor(color)
      .setDescription(`Hello <@${member.user.id}>,\n\nPlease describe your concern in more detail in this ticket. Our team will take care of it as soon as possible.\n\nUse the command \`ticket close\` to close the Ticket.`)
    ticket.send({ embeds: [embed] })
    let ping = await ticket.send(`<@${member.user.id}>`)
    ping.delete()
  }
}