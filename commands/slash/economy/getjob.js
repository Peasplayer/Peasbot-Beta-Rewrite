const discord = require("discord.js")

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'getajob',
    description: 'Choose in what branch you want to work',
    options: [
      {
        name: "branch",
        description: "The branch you are going to work in",
        type: "STRING",
        required: true,
        choices: [
          {
            "name": "Restaurant",
            "value": "restaurant"
          },
          {
            "name": "Hospital",
            "value": "hospital"
          },
          {
            "name": "Office",
            "value": "office"
          }
        ]
      },
      {
        name: "newjob",
        description: "Do you want to get a new job?",
        type: "BOOLEAN",
        required: false
      }
    ]
  },
  run: async (client, interaction) => {
    const color = config.color

    const branch = interaction.options.getString("branch")
    const newJob = interaction.options.getBoolean("newjob")

    const guildId = interaction.guild.id
    const userId = interaction.user.id

    if (newJob)
      db.set(`${guildId}.${userId}.job`, null)
    else if (db.get(`${guildId}.${userId}.job`) != null)
      return interaction.reply({ embeds: [new error(`You already have a job. Get a new one with \`/getajob newjob: True\`.`)] })

    db.set(`${guildId}.${userId}.joblevel`, 1)
    db.set(`${guildId}.${userId}.timesworked`, 0)

    let embed = new discord.MessageEmbed()
    switch (branch) {
      case "restaurant":
        db.set(`${guildId}.${userId}.job`, 1)

        embed.setTitle("🧑‍🍳 Job")
            .setColor(color)
            .setFooter(config.footer, config.footerImg)
            .setDescription(`You are now working in a **Restaurant**!\n\nYou're current Job is a **Plate Washer**.\n\nTo get promoted you just have to work with the command \`/work\`.`)
        break;
      case "hospital":
        db.set(`${guildId}.${userId}.job`, 2)

        embed.setTitle("🧑‍🍳 Job")
            .setColor(color)
            .setFooter(config.footer, config.footerImg)
            .setDescription(`You are now working in a **Hospital**!\n\nYou're current Job is an **Assistant Doctor**.\n\nTo get promoted you just have to work with the command \`/work\`.`)
        break;
      case "office":
        db.set(`${guildId}.${userId}.job`, 3)

        embed.setTitle("🧑‍🍳 Job")
            .setColor(color)
            .setFooter(config.footer, config.footerImg)
            .setDescription(`You are now working in an **Office**!\n\nYou're current Job is an **Intern**.\n\nTo get promoted you just have to work with the command \`/work\`.`)
        break;
    }
    interaction.reply({ embeds: [embed] })
  }
}

