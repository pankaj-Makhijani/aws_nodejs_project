const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config('./.env');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const logger = require('./config/logger')
const userroutes = require('./routes/userroutes');
const cardroutes = require('./routes/cardroutes');
const db = require('./models');
const port = process.env.PORT || 3000;
const app=express();

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/api',userroutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-cards',cardroutes)

db.sequelize.sync()
	.catch(() => { logger.log('error','Database Connection error'); })
	.then(() => {
	logger.log('info',"Database connection successful");
	app.listen(port,()=>{
		// console.log("Server is up and running on Port 3000");
		// console.info("Server is up and running on Port 3000");
		logger.log('info',`Server is up and running on Port ${port}`);
		})
}) 