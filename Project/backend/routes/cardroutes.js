const express = require('express')
const {defaultroute} = require('../controllers/user')
const router = express.Router()
const { createcard,getcardbyid,deletecardbyid,updatecard,getallcards,findallcardsbyname, addcard, removecard, getonecard } = require("../controllers/card")
const { user } = require('../models/user')

router.post('/createcard',createcard)
router.post('/:id/addcard',addcard)
router.post('/:id/removecard',removecard)

// router.post('/updatecard',updatecard)
router.post('/deletecardbyid',deletecardbyid)
// router.get('/findcardbyid/:id',getcardbyid);
router.get('/getallcards',getallcards)
router.get('/:cardid/getallcards',getonecard)

// router.post('/findallcardbyname/:cname',findallcardsbyname)


router.post('/testaddcard',addcard)
module.exports=router;