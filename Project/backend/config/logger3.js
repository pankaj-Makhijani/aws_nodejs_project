//File for storing activity logs in mysql using flexlogger npm package

const FlexLogger = require('flex-logger')
require("dotenv").config("../.env");

const db='mysql';
const host=process.env.DB_HOST;
const user=process.env.DB_USER;
const password=process.env.DB_PASSWORD;
const dbname=process.env.DB_NAME;
const tableName='activity_logs'

const activitylog = new FlexLogger(db, `host=${host};user=${user};password=${password};dbname=${dbname};`, tableName)

module.exports = activitylog;