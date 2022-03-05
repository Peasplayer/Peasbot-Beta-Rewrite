const discord = require("discord.js")

class prefix {

  static async getPrefix(db, config, id) {
    /*let default_prefix = config.prefix
    db.get("prefix_" + id).then(_prefix => {
      //console.log(_prefix)
      //let _prefix = await db.get("prefix_" + id)
      console.log("_prefix" + _prefix + ";")
      console.log("default" + default_prefix)
      if(_prefix == " ") {
        console.log("1")
        return default_prefix;
      } else if( _prefix == default_prefix) {
         console.log("2")
        return default_prefix;
      } else {
        console.log("3")
        return _prefix;
      }
      //this.db.get(`prefix_714162073805914142`)
      //console.log(db.get("prefix_" + id))
      
    });*/
    let default_prefix = config.prefix
    let _prefix = await db.get(`prefix_${id}`)
    if(_prefix == null || _prefix == " ") _prefix = default_prefix;
    return _prefix;
  }
}

module.exports = prefix