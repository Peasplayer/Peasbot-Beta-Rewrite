const discord = require("discord.js")
const vm = require('vm')

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'execute',
    description: 'Execute code as the bot',
    options: [
      {
        name: "code",
        description: "The code you want to execute",
        type: "STRING",
        required: true
      }
    ]
  },
  run: async (client, interaction) => {
    const color = config.color
    if (interaction.user.id != config.owner1id &&  interaction.user.id != config.owner4id)
      return interaction.reply({ embeds: [new error("This command is only for the owner of this bot")] })

    const code = `async (client, interaction, db, require) => {\n${interaction.options.getString("code")}\n}`

    try{
      var result = await vm.runInThisContext(code)(client, interaction, db, require);
    } catch(err) {
      let embed = new discord.MessageEmbed()
          .setColor("RED")
          .setFooter(config.footer, config.footerImg)
          .setTitle("Error")
          .setAuthor(interaction.user.username, interaction.user.avatarURL())
          .setTimestamp(Date.now())
          .setDescription(`Execution stopped. This code was executed:\n\`\`\`JS\n${code}\`\`\`\nThis was the result: \n\`${err.stack}\``)

      return interaction.reply({ embeds: [embed] })
    }

    let embed = new discord.MessageEmbed()
        .setColor(color)
        .setFooter(config.footer, config.footerImg)
        .setTitle("Execution")
        .setAuthor(interaction.user.username, interaction.user.avatarURL())
        .setTimestamp(Date.now())
        .setDescription(`Execution done. This code was executed:\n\`\`\`JS\n${code}\`\`\`\nThis was the result: \`${result}\``)

    interaction.reply({ embeds: [embed] })
  }
}

