const bmp180 = require('bmp180-sensor');
const sensor = require("node-dht-sensor");
const moment = require('moment');
const db = require('./dbController/dbcontroller');

const { writeToDB } = require('./dbController/dbcontroller');

async function readBmp180() {
  return new Promise (resolve => {
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

async function readDht22() {
  return new Promise(resolve => {
    sensor.read(22, 4, function(err, temperature, humidity) {
      if (!err) {
        resolve ({humidity : humidity, temperature : temperature})
      }
    });
  })
  
}

async function getAndStoreSensorData () {
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
  writeToDB(sensorData)
}

getAndStoreSensorData ()
setInterval(()=>{
  getAndStoreSensorData ()
},10000);






