const express = require('express')
const {defaultroute} = require('../controllers/user')
const router = express.Router()
const { createcard,getcardbyid,deletecardbyid,updatecard,getallcards,findallcardsbyname } = require("../controllers/card")
const { User } = require('../models/User')

router.post('/createcard',createcard)
router.post('/updatecard',updatecard)
router.delete('/deletecardbyid/:id',deletecardbyid)
router.get('/findcardbyid/:id',getcardbyid);
router.get('/getallcards',getallcards)
router.post('/findallcardbyname/:cname',findallcardsbyname)

module.exports=router;