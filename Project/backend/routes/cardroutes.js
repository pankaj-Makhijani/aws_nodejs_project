const express = require('express')

const router = express.Router()
const { createcard,getcardbyid,deletecardbyid,updatecard,getallcards,findallcardsbyname, addcard, removecard, getonecard, getallcardsbyhr } = require("../controllers/card")
const { finduserbyid, isSignedIn, isAuthenticated, isHr } = require('../middleware/auth')
const { user } = require('../models/user')

router.post('/createcard',createcard)
router.post('/:id/addcard',addcard)
router.post('/:id/removecard',removecard)

// router.post('/updatecard',updatecard)
router.post('/deletecardbyid',deletecardbyid)
// router.get('/findcardbyid/:id',getcardbyid);
router.get('/getallcards',getallcards)
//Extract user id from params
router.param('id',finduserbyid)
router.get('/:id/getallcardsbyhr',isSignedIn,isAuthenticated,isHr,getallcardsbyhr)
router.get('/:cid/getonecard',getonecard)

// router.post('/findallcardbyname/:cname',findallcardsbyname)


router.post('/testaddcard',addcard)
module.exports=router;