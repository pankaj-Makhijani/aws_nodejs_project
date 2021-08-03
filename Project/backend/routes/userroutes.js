const express = require('express')
const {defaultroute,isSignedIn, finduserbyid,isAuthenticated,getUser, isAdmin, deleteuserbyidunauth, updateuserbyidunauth} = require('../controllers/user')
const router = express.Router()
const { getuserbyid,deleteuserbyid,updateuserbyid,findallusersbyfname,signup,findallusers,signin,signout } = require("../controllers/user")
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

//default route
router.get('/',defaultroute);

//Open API for swaggerr
router.post('/',signup)
router.get('/findonebyid/:id',getuserbyid);
router.delete('/deleteuserunauth/:id',deleteuserbyidunauth)
router.put('/updateuserbyidunauth',updateuserbyidunauth)

// Auth Routes for signup,sigin,signout
router.post('/signup',signup);
router.post('/signin',signin)
router.post('/signout',signout)

//Extract user id from params
router.param('id',finduserbyid)

// User Protected Routes
router.get("/user/:id", isSignedIn, isAuthenticated, getUser);
router.put('/updateuserbyid/:id',isSignedIn,isAuthenticated,updateuserbyid);
router.delete('/deleteuser/:id',isSignedIn,isAuthenticated,deleteuserbyid);


//Admin Protected Routes
//check admin role then if authorized show him all users
router.get('/:id/findallusers',isSignedIn,isAuthenticated,isAdmin,findallusers);

//you can delete this not required
router.get('/findallbyfname/:fname',findallusersbyfname);

module.exports=router;