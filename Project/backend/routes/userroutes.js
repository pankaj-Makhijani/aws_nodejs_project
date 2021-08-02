const express = require('express')
const {defaultroute} = require('../controllers/user')
const router = express.Router()
const { getuserbyid,deleteuserbyid,updateuserbyid,findallusersbyfname,createuser,findallusers } = require("../controllers/user")
const { User } = require('../models/User')
const logger = require('../config/logger')
const S3 = require("aws-sdk/clients/s3");
require('dotenv').config('./.env');
var multer=require('multer')
const multerS3=require('multer-s3')

//Creating S3 bucket object
const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'REGION'});



router.get('/',defaultroute);
router.post('/',createuser);
router.put('/updateuserbyid',updateuserbyid);
router.delete('/deleteuser/:id',deleteuserbyid);
router.post('/findonebyid/:id',getuserbyid);
router.get('/findallusers',findallusers);
router.get('/findallbyfname/:fname',findallusersbyfname);

module.exports=router;