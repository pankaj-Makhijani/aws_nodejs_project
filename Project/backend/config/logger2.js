const FlexLogger = require('flex-logger')

const mylogger = new FlexLogger('mysql', 'host=database1.c1qjgwutucsh.us-east-1.rds.amazonaws.com;user=admin;password=12345678;dbname=database2;', 'system_logs')

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