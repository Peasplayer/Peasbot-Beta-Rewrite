const discord = require("discord.js")

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'balance',
    description: 'Get the balance of someone',
    options: [
      {
        name: "user",
        description: "The user you want to get the balance of",
        type: "USER",
        required: false
      }
    ]
  },
  run: async (client, interaction) => {
    const color = config.color

    let user = interaction.options.getUser("user")
    if (!user)
      user = interaction.user
    let key = `${interaction.guild.id}.${interaction.user.id}.balance`
  console.log(key)
    let bal = db.get(key)
    if (!bal)
      bal = 0

    interaction.reply(`${user.username}'s current balance is ${bal} 💵.`)
  }
}
