const express = require('express')
const {defaultroute,isSignedIn, finduserbyid,isAuthenticated,getuser, isAdmin, deleteuserbyidunauth, updateuserbyidunauth, advancedsignup, updateanyuserbyid, getcardbyid, getapplogs, getactivitylogs, getsystemlogs} = require('../controllers/user')
const { createcard,deletecardbyid,getallcards,addcard, removecard } = require("../controllers/card")
const router = express.Router()
const { getuserbyid,deleteuserbyid,updateuserbyid,findallusersbyfname,signup,findallusers,signin,signout } = require("../controllers/user")
const { user } = require('../models/user')
// const upload = require("../controllers/upload")
const { upload,getpresignedurl,sets3params } = require("../services/s3upload")
const { route } = require('./cardroutes')
const { sqs } = require('../services/sqs')

//default route
router.get('/',defaultroute);

router.get("/getcardbyid/:id",getcardbyid)
//Open API for swaggerr
router.post('/',signup)
router.get('/findonebyid/:id',getuserbyid);
router.delete('/deleteuserbyid/:id',deleteuserbyidunauth)
router.put('/updateuserbyid',updateuserbyidunauth)
router.post('/createcard',createcard)
router.post('/:id/removecard',removecard)
router.post('/:id/addcard',addcard)
router.post('/deletecardbyid',deletecardbyid)
router.get('/getallcards',getallcards)

//Extract user id from params
router.param('id',finduserbyid)

// Auth Routes for signup,sigin,signout
router.post('/signup',signup,sqs);
router.post('/signin',signin)
router.get('/:id/signout',signout)



// user Protected Routes
router.get("/user/:id", isSignedIn, isAuthenticated, getuser);
router.post('/updateuserbyid/:id',isSignedIn,isAuthenticated,updateuserbyid);

router.post('/upload/:id', isSignedIn, isAuthenticated,sets3params,upload.array('image', 1),getpresignedurl);

router.post('/tempupdateuserbyid/:id',updateuserbyid);
router.delete('/tempdeleteuser/:id',deleteuserbyidunauth);

router.get('/gettestpresignedurl',getpresignedurl);

//Admin Protected Routes
//check admin role then if authorized show him all users
router.post('/deleteuser/:id',isSignedIn,isAuthenticated,isAdmin,deleteuserbyid);
router.get('/:id/findallusers',isSignedIn,isAuthenticated,isAdmin,findallusers);
router.post('/:id/updateanyuserbyid',updateanyuserbyid)
router.post('/advancedsignup',advancedsignup)
router.get('/getsystemlogs',getsystemlogs)
router.get('/getactivitylogs',getactivitylogs)

//you can delete this not required
router.get('/findallbyfname/:fname',findallusersbyfname);

module.exports=router;