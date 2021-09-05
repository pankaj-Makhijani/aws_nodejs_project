const express = require('express')
const { updateanyuserbyid, getroles, getrolebyuserid, deleterole, createrole, removerolefromuser } = require('../controllers/role')
const router = express.Router()

router.post('/:id/updateanyuserbyid',updateanyuserbyid)
router.get('/getroles',getroles)
router.post('/:id/deleterole',deleterole)
router.post('/:id/createrole',createrole)
router.post('/:id/removerolefromuser',removerolefromuser)
router.get('/:id/getrolebyuserid',getrolebyuserid)

module.exports=router;