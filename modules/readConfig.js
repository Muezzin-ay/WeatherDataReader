let fs = require('fs');

module.exports = function(){

  let configModule = {
    init: function (){
      try {
        /**
         * Read local config at startup
         */
        console.log('Config reader Reading local config.json')

        let configRaw = fs.readFileSync(__dirname +'/../config.json', {encoding:'utf8', flag:'r'});
          
        let config = JSON.parse(configRaw);
        
        console.log('Main Local config.json has been parsed and is available.');
        return config;
      } catch (error) {
        console.log(error)
      }
      
    }

  }

  return configModule;
}