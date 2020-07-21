

const moment = require('moment');
const db = require('./modules/dbcontroller');
const config = require('./modules/readConfig')().init();

let getAndStoreSensorData = null;

if(config.env == 'prod'){
  const bmp180 = require('bmp180-sensor');
  async function readBmp180() {
    return new Promise (async resolve => {
      const sbmp = await bmp180({
        address: 0x77,
        mode: 1,
    })

    const data = await sbmp.read()
    sensorData = data;

    await sbmp.close()
    resolve ({pressure : data.pressure, temperature : data.temperature})
    }) 
  }

  const dht22 = require("node-dht-sensor");
  async function readDht22() {
    return new Promise(async resolve => {
      dht22.read(22, 4, function(err, temperature, humidity) {
        if (!err) {
          resolve ({humidity : humidity, temperature : temperature})
        }
      });
    })
    
  }

  getAndStoreSensorData = async function() {
    let bmpData = await readBmp180();
    let dhtData = await readDht22();
    let sensorData = {
      timestamp : moment().format("YYYY-MM-DD hh:mm:ss"),
      temperature1 : bmpData.temperature,
      temperature2 : dhtData.temperature,
      humidity : dhtData.humidity,
      pressure : bmpData.pressure
    }
    console.log(sensorData)
    db.writeToDB(sensorData)
  }

  
}else{

  console.log('Start application in DEV mode.');
  console.log('Interval: ' + config.sensorInterval/1000 + ' seconds.');

  getAndStoreSensorData = async function() {
    let sensorData = {
      timestamp : moment().format("YYYY-MM-DD hh:mm:ss"),
      temperature1 : -1,
      temperature2 : -1,
      humidity : -1,
      pressure : -1
    }
    console.log(sensorData)
    db.writeToDB(sensorData)
  }
}

getAndStoreSensorData ()
setInterval(()=>{
getAndStoreSensorData ()
},config.sensorInterval);








