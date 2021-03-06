const express= require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config('./.env');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const userroutes = require('./routes/userroutes');
const cardroutes = require('./routes/cardroutes');
const roleroutes = require('./routes/roleroutes')
const db = require('./models');
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 3000;
const app=express();
const activitylog=require("./config/logger3")

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/api',userroutes)
app.use('/api',roleroutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-cards',cardroutes)

db.sequelize.sync()
	.then(() => {
		console.log('Database connection successful')
	activitylog.info('Database connection successful')
	app.listen(port,()=>{
	console.log(`Server is up and running on Port ${port}`)
	activitylog.info(`Server is up and running on Port ${port}`)
		})
})
.catch(() => { 
	console.log("Database connection error")
	activitylog.error("Database connection error")
})