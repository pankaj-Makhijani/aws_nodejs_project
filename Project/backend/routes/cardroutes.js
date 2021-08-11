const express = require('express')
const {defaultroute} = require('../controllers/user')
const router = express.Router()
const { createcard,getcardbyid,deletecardbyid,updatecard,getallcards,findallcardsbyname, addcard, removecard } = require("../controllers/card")
const { User } = require('../models/User')

router.post('/createcard',createcard)
router.post('/:id/addcard',addcard)
router.post('/createcard',removecard)

// router.post('/updatecard',updatecard)
router.delete('/deletecardbyid/:id',deletecardbyid)
// router.get('/findcardbyid/:id',getcardbyid);
router.get('/getallcards',getallcards)
// router.post('/findallcardbyname/:cname',findallcardsbyname)


router.post('/testaddcard',addcard)
module.exports=router;