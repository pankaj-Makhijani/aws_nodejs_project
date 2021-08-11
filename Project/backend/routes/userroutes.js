const express = require('express')
const {defaultroute,isSignedIn, finduserbyid,isAuthenticated,getUser, isAdmin, deleteuserbyidunauth, updateuserbyidunauth, putpresignedurl, getpresignedurl} = require('../controllers/user')
const router = express.Router()
const { getuserbyid,deleteuserbyid,updateuserbyid,findallusersbyfname,signup,findallusers,signin,signout } = require("../controllers/user")
const { User } = require('../models/User')
const upload = require("../controllers/upload")

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
router.get('/signout',signout)

//Extract user id from params
router.param('id',finduserbyid)

// User Protected Routes
router.get("/user/:id", isSignedIn, isAuthenticated, getUser);
router.post('/updateuserbyid/:id',isSignedIn,isAuthenticated,updateuserbyid);

router.post('/upload/:id', isSignedIn, isAuthenticated,upload.array('image', 1),getpresignedurl);

// router.post('/upload/:id', isSignedIn, isAuthenticated,upload.array('image', 1), (req, res) => {
//     /* This will be th 8e response sent from the backend to the frontend */
//     res.send({ image: req.file });
//    });

router.post('/tempupdateuserbyid/:id',updateuserbyid);
router.delete('/tempdeleteuser/:id',deleteuserbyid);

router.put('/puttestpresignedurl',putpresignedurl);
router.get('/gettestpresignedurl',getpresignedurl);

//Admin Protected Routes
//check admin role then if authorized show him all users
router.post('/deleteuser/:id',isSignedIn,isAuthenticated,isAdmin,deleteuserbyid);
router.get('/:id/findallusers',isSignedIn,isAuthenticated,isAdmin,findallusers);


//you can delete this not required
router.get('/findallbyfname/:fname',findallusersbyfname);

// router.post('/testsignup',testsignup)

module.exports=router;