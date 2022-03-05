const discord = require("discord.js")
const covid = require('corona-info')

const error = require('../../../util/error.js')
const config = require("../../../config.json")

const db = require('quick.db')

module.exports = {
  info: {
    name: 'covid',
    description: 'Get statistics about the covid-19 virus',
    options: [
      {
        name: "country",
        description: "The country you want to get statistics about",
        type: "STRING",
        required: false
      }
    ]
  },
  run: async (client, interaction) => {
    const color = config.color

    const country = interaction.options.getString("country")

    let embed = new discord.MessageEmbed()
        .setTitle("Covid-19 Information")
        .setColor(color)
        .setFooter(config.footer)

    let data = await covid.findData({ country: "all" });
    if (country) {
      try {
        data = await covid.findData({ country: country });
      } catch(err) {
        return interaction.reply({ embeds: [new error("Country not found or it doesn't have any cases.")] })
      }

      embed.setThumbnail(data.countryFlag)
      embed.setTitle("Covid-19 Information for " + data.countryName)
    }

    let fields = [
        {name: "Updated at", value: data.updatedDate.toString()},
        {name: "Cases", value: data.cases.toString()},
        {name: "Today's Cases", value: data.todayCases.toString()},
        {name: "Deaths", value: data.deaths.toString()},
        {name: "Today's Deaths", value: data.todayDeaths.toString()},
        {name: "Recovered", value: data.recovered.toString()},
        {name: "Today's Recovered", value: data.todayRecovered.toString()},
        {name: "Active Cases", value: data.active.toString()}
    ]
    embed.addFields(fields)
    embed.setDescription("These numbers are not 100% accurate. Sometimes cases or deaths are not getting reported because it's a weekend or a holiday.")

    interaction.reply({ embeds: [embed] })
  }
}

