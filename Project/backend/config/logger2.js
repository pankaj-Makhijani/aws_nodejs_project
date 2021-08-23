const FlexLogger = require('flex-logger')
require("dotenv").config("../.env");

const db='mysql';
const host=process.env.DB_HOST;
const user=process.env.DB_USER;
const password=process.env.DB_PASSWORD;
const dbname=process.env.DB_NAME;
const tableName='system_logs'

const mylogger = new FlexLogger(db, `host=${host};user=${user};password=${password};dbname=${dbname};`, tableName)

// mylogger.info('i am super')

module.exports = mylogger;











// const { createLogger,transports,format } = require('winston');
// const SQLTransport = require('winston-sql-transport');


// var options_default = {
//     tableName : "sys_logs_default",
//     client: 'mysql2',
//     connection: {
//       host: 'database1.c1qjgwutucsh.us-east-1.rds.amazonaws.com',
//       user: 'admin',
//       password: '12345678',
//       database: 'database1'
//     }
//   };
  
// //   var logger = new createLogger({
// //   transports: [
// //     new winston_mysql(options_default)
// //   ]
// //   });
// //   var msg = 'test message');
// //   logger.info('first log', {message: msg});

// const logger2 = createLogger({
//     level: 'info',
    
//     transports: [
//       new SQLTransport(options_default),
//     ],
//   });

//     var msg = 'test message';
//   logger2.info('first log');
  
//   module.exports = logger2;