const { status, activity, activityType, version, privat, color, owner1id, owner2id } = require("../config.json")
const config = require('../config.json')
const discord = require('discord.js')
const prefix = require('../util/prefix.js')

class interaction {
  static async event(client, interaction) {
    if (interaction.isCommand()) {
      let command = client.commands.get(interaction.commandName);
      if (command)
        command.run(client, interaction);
      /*switch (interaction.commandName) {
        case "activity":
          let channel = interaction.options.getChannel("channel")
          let activity = interaction.options.getString("activity")

          if (!channel.isVoice()) return interaction.reply({ content: "You have to specify a voice channel", ephemeral: true })

          let invite = await client.discordTogether.createTogetherCode(channel.id, activity)

          interaction.reply(`Click this link to start the activity: ${invite.code}`)
          break;
      }*/
    }
  }
}

module.exports = interaction