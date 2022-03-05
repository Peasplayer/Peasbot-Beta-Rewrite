const discord = require("discord.js")

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: '',
    description: '',
    options: []
  },
  run: async (client, interaction) => {
    const color = config.color
  }
}
