const { createLogger,transports,format } = require('winston');
const SQLTransport = require('winston-sql-transport');


const logger = createLogger({
    
    transports:[
        new transports.Console({
            level:'info',
            format : format.combine(format.timestamp(),format.json()) // This can be used if you want to print timestamps
            // OUTPUT {"level":"info","message":"Server is up and running on Port 3000","timestamp":"2021-07-23T11:45:55.863Z"}
            // format : format.combine(format.timestamp(),format.simple()) // This can be used if you want to print timestamps
            // OUTPUT info: Server is up and running on Port 3000 {"timestamp":"2021-07-23T11:48:45.066Z"}
        }),
        
        new transports.File({
            filename:'./config/info.log',
            level:'info',
            format : format.combine(format.timestamp(),format.json()) // This can be used if you want to print timestamps
            // OUTPUT {"level":"info","message":"Server is up and running on Port 3000","timestamp":"2021-07-23T11:45:55.863Z"}
            // format : format.combine(format.timestamp(),format.simple()) // This can be used if you want to print timestamps
            // OUTPUT info: Server is up and running on Port 3000 {"timestamp":"2021-07-23T11:48:45.066Z"}
        }),
        new transports.File({
            filename:'./config/errorinfo.log',
            level:'error',
            format : format.combine(format.timestamp(),format.json()) // This can be used if you want to print timestamps
            // OUTPUT {"level":"info","message":"Server is up and running on Port 3000","timestamp":"2021-07-23T11:45:55.863Z"}
            // format : format.combine(format.timestamp(),format.simple()) // This can be used if you want to print timestamps
            // OUTPUT info: Server is up and running on Port 3000 {"timestamp":"2021-07-23T11:48:45.066Z"}
        })

    ]
})

module.exports = logger;