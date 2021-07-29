const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const fs = require('fs');
require('dotenv').config('./.env');
const S3 = require("aws-sdk/clients/s3");
const path = require('path')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require('./config/logger')
const userroutes = require('./routes/userroutes');
const cardroutes = require('./routes/cardroutes');
const db = require('./models');
const { User,card } = require('./models');
const { createcard } = require('./controllers/card');
const port = process.env.PORT || 3000;
const app=express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/api',userroutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-cards',cardroutes)

db.sequelize.sync()
	.catch((req) => { logger.log('error','Database Connection error'); })
	.then((req) => {
	logger.log('info',"Database connection successful");
	app.listen(port,()=>{
		// console.log("Server is up and running on Port 3000");
		// console.info("Server is up and running on Port 3000");
		logger.log('info',`Server is up and running on Port ${port}`);
		})
}) 