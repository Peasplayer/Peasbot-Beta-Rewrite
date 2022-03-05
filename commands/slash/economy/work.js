const discord = require("discord.js")
const ms = require('parse-ms')

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'work',
    description: 'Work as your chosen job',
    options: []
  },
  run: async (client, interaction) => {
    const color = config.color

    const guildId = interaction.guild.id;
    const userId = interaction.user.id;

    let bal = await db.get(`${guildId}.${userId}.balance`)
    if (bal == null)
      bal = 0

    let job = await db.get(`${guildId}.${userId}.job`)
    let jobLevel = await db.get(`${guildId}.${userId}.joblevel`)

    if (job == null)
      return interaction.reply({ embeds: [new error(`You don't have a job yet! Get one with \`/getajob\`.`)] })

    let lastWorked = await db.get(`${guildId}.${userId}.lastworked`)
    let cooldown = 72000000
    if (lastWorked != null && lastWorked + cooldown > Date.now()) {
      let time = ms(cooldown - (Date.now() - lastWorked));
      return interaction.reply({ embeds: [new error(`You already worked today. Come back in **${time.hours}h ${time.minutes}m ${time.seconds}s**.`)] })
    }
    db.set(`${guildId}.${userId}.lastworked`, Date.now())

    let embed = new discord.MessageEmbed()
        .setFooter(config.footer, config.footerImg)
        .setColor(color)
        .setTitle("Work")

    let jobText = ""
    let jobLevelText = ""

    if (job == 1) {
      jobText = "a Restaurant"

      if (jobLevel == 1)
        jobLevelText = "a Plate Washer"
      else if (jobLevel == 2)
        jobLevelText = "a Driver"
      else if (jobLevel == 3)
        jobLevelText = "a Waiter"
      else if (jobLevel == 4)
        jobLevelText = "a Chef"
      else if (jobLevel == 5)
        jobLevelText = "a Branch Manager"
    } else if (job == 2) {
      jobText = "a Hospital"

      if (jobLevel == 1)
        jobLevelText = "an Assistant Doctor"
      else if (jobLevel == 2)
        jobLevelText = "a Surgical Residant"
      else if (jobLevel == 3)
        jobLevelText = "a Surgeon"
      else if (jobLevel == 4)
        jobLevelText = "a Head of Department"
      else if (jobLevel == 5)
        jobLevelText = "a Head of Surgery"
    } else if (job == 3) {
      jobText = "an Office"

      if (jobLevel == 1)
        jobLevelText = "an Intern"
      else if (jobLevel == 2)
        jobLevelText = "an Office Worker"
      else if (jobLevel == 3)
        jobLevelText = "a Chief of Department"
      else if (jobLevel == 4)
        jobLevelText = "a Administrative Assitant"
      else if (jobLevel == 5)
        jobLevelText = "a Chief Executive Officer"
    }
    let earning = (Math.floor(
        Math.random() * (88 - 55) + 55
    ) + 10) * parseInt(jobLevel)
    console.log(earning)
    embed.setDescription(`You work in **${jobText}** as **${jobLevelText}** and earn \`${earning}\` 💵.\n\nYour current balance is now \`${bal + earning + 0}\` 💵.`)
    interaction.reply({ embeds: [embed] })

    db.add(`${guildId}.${userId}.balance`, earning)

    let workingtimes = db.get(`${guildId}.${userId}.workingtimes`)
    if (workingtimes == null) workingtimes = 0
    db.add(`${guildId}.${userId}.timesworked`, 1)

    if (parseInt(workingtimes) + 1 >= 23 && jobLevel != 5) {
      jobLevel += 1

      db.set(`${guildId}.${userId}.workingtimes`, 0)
      db.add(`${guildId}.${userId}.joblevel`, 1)

      let newJobLevelText = ""
      if (job == 1) {
        if (jobLevel == 1)
          newJobLevelText = "a Plate Washer"
        else if (jobLevel == 2)
          newJobLevelText = "a Driver"
        else if (jobLevel == 3)
          newJobLevelText = "a Waiter"
        else if (jobLevel == 4)
          newJobLevelText = "a Chef"
        else if (jobLevel == 5)
          newJobLevelText = "a Branch Manager"
      } else if (job == 2) {
        if (jobLevel == 1)
          newJobLevelText = "an Assistant Doctor"
        else if (jobLevel == 2)
          newJobLevelText = "a Surgical Residant"
        else if (jobLevel == 3)
          newJobLevelText = "a Surgeon"
        else if (jobLevel == 4)
          newJobLevelText = "a Head of Department"
        else if (jobLevel == 5)
          newJobLevelText = "a Head of Surgery"
      } else if (job == 3) {
        if (jobLevel == 1)
          newJobLevelText = "an Intent"
        else if (jobLevel == 2)
          newJobLevelText = "an Office Worker"
        else if (jobLevel == 3)
          newJobLevelText = "a Chief of Department"
        else if (jobLevel == 4)
          newJobLevelText = "a Administrative Assitant"
        else if (jobLevel == 5)
          newJobLevelText = "a Chief Executive Officer"
      }

      embed = new discord.MessageEmbed()
          .setTitle("Promotion")
          .setDescription(`You got promoted from ${jobLevelText} to ${newJobLevelText}!`)
          .setColor(color)
          .setFooter(config.footer, config.footerImg)

      interaction.followUp({embeds: [embed]})
    }
  }
}
