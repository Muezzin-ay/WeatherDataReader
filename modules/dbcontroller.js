const mariadb = require('mariadb');
const moment = require('moment');
const config = require('./readConfig')().init();

const pool = mariadb.createPool({host: config.dbHost, user: config.dbUser, connectionLimit: 5, password: config.dbPassword});

module.exports = {
  writeToDB: function(sensorData){
    try {
      pool.getConnection()
      .then(conn => {
        conn.query("INSERT INTO raspisensor.measures (timestamp, temperature1, temperature2, humidity, pressure, env) value (?, ?, ?, ?, ?, ?)", [sensorData.timestamp, sensorData.temperature1, sensorData.temperature2, sensorData.humidity, sensorData.pressure, config.env])
          .then(res => { // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
            console.log(res);
            conn.release(); // release to pool
          })
          .catch(err => {
            console.log(err);
            conn.release(); // release to pool
          })
          
      }).catch(err => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
    
  }
}