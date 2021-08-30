const { card,usercard,user } = require('../models');
const logger = require('../config/logger')
const S3 = require("aws-sdk/clients/s3");
require('dotenv').config('./.env');
const path = require('path')
const db = require('../models');
const fs = require('fs');
const activitylog=require("../config/logger3")

const port = process.env.PORT || 3000;

exports.addcard = async (req,res) => {
		tmp=await card.findOne({
		where:{
			id:req.body.cid
			}
		})

			if(tmp){
				await usercard.create({
							cardid:req.body.cid,
							// userid:req.params.id,
							userid:req.params.id,
						}).catch((error) => {
								// return res.json({error})
								return res.json({"msg":"certificate already Exists in your Profile"})
						}).then(card => {
						// logger.log('info',card)
						activitylog.info("user id "+ req.params.id + "added card id" + req.body.cid + " in their profile") 
						return res.json({"msg":"certificate added to your Profile Successfully"})
					})
			}

			else if(tmp==null)
			{
				return res.json({"msg":"certificate does not exists"})
			}

}

exports.removecard = (req,res) => {
	card.findOne({
	where:{
		id:req.body.cid
		}
	}).catch((err) => {
		return res.json({"msg":" Error occured while removing certificate "})
	}).then((data) => {
		if(data==null)
		{
			return res.json({"msg":"No such certificate exists"})
		}
		user.findOne({
			where:{
				id:req.params.id
				}
			}).catch((err) => {
				return res.json({"msg":"Error occured while removing certificate from user profile "})
			}).then((user) => {
				if(user==null){
					return res.json({"msg":"No such user exists"})
				}
				usercard.destroy({
					where: {
						cardid:req.body.cid,
						userid:req.params.id
					}
				}).catch((error) => {
						// return res.json({error})
						console.log(error)
						return res.json({"msg":"Error occured while removing certificate"})
				}).then(card => {
					if(card==0)
					{
						return res.json({"msg":"No such certificate exists in your Profile"})
					}
				// logger.log('info',card)
				activitylog.info("user id "+ req.params.id + "removed card id" + req.body.cid + " from their profile") 
				return res.json({"msg":"certificate removed successfully"})
			})
			})

	})
}

exports.createcard = (req,res) => {
	card.create({
		cardname:req.body.cname
	}).catch((error) => {
			// return res.json({error})
			return res.json({"msg":"error creating certificate"})
	}).then(card => {
	// logger.log('info',card)
	activitylog.info("card created with name " + req.body.cname) 
	return res.json({'msg':'certificate created successfully'})
})
	 logger.log('info',`Post request on create card route http://localhost:${port}/api-cards/createcard`,' IP address ',req.ip);
}

// exports.getcardbyid = (req,res) => {
// 	db.card.findAll({
// 		where:{
// 			userid:req.params.id,
// 		},
// 		include:[db.user]
// 	}).catch((error) => { return res.json(error)})
// 	.then((card) => {return res.json(card)})
// 	logger.log('info',`Get request on getcardbyid route http://localhost:${port}/api-cards/findcardbyid/:id`,' IP address ',req.ip);
// }

exports.deletecardbyid = (req,res) => {
	card.findOne({
		where:{
			id:req.body.cardid
		}
	}).then((card) => {
		if(card==null){
			return res.json({'msg':'No such certificate exists'})
		}
		card.destroy({
			where: {
				id:req.body.cardid
			}
		}).then(card => {
		activitylog.info("card deleted with id " + req.body.cardid) 
			return res.json({'msg':'certificate deleted successfully'})
		 }).catch((error) => { 
			 console.log(error)
			logger.log('error',error);
			return res.json({'msg':'certificate delete action unsuccessful'})
		 })
	}).catch((error) => {
		return res.json({'mesg':'Error while deletiing certificate'})
	})

	 logger.log('info',`delete request on deletecard route http://localhost:${port}/api-cards/deletecardbyid/:id`,' IP address ',req.ip);
}

// exports.updatecard = (req,res) => {
// 	var {uid,cname,cnumber} =req.body;
// 	var records = [[cname,cnumber,uid]];
// 	if(records[0][0]!=null)
// 	{
// 		card.update(
// 		{
// 			cardnumber:req.body.cnumber
// 		},
// 		{
// 			where : { 
// 			userid:req.body.uid,
// 			cardname:req.body.cname
// 			}
// 		}
// 		).then((card) => {
// 			res.json({'msg':'data updated successfully'})
// 			// res.json(user)

// 		}).catch((error) => {
// 			return res.json({'error':'data updation failed'})
// 		})
// 	}
// 	logger.log('info',`Post request on updatecard route http://localhost:${port}/api-cards/updatecard`,' IP address ',req.ip);
// }

// exports.getallcards = (req,res) => {
// 	card.findAll().catch((error) => {
// 		logger.log('error',error);
// 		return res.json({'error':'No data exists'})
// 	}).then(users => { res.json(users) })
// 	logger.log('info',`Get request on find all users route http://localhost:${port}/api-cards/getallcards`,' IP address ',req.ip)
// }

exports.getonecard = (req,res) => {
	card.findAll({
		where:{
			id:req.params.cardid
		},
		include:[
			{
				model:user,
				as:'users',
				attributes:["id","firstname","lastname","email"],
				through:{
					attributes:[],
				}
			}
		]
	})
	.then((cards) => {
	activitylog.info("Admin fetched all cards") 
		return res.send(cards);
	  })
	  .catch((err) => {
		  console.log(err)
		return res.send({"error":"error retrieving certificate data"})
	  });
}

exports.getallcards = (req,res) => {
	card.findAll({
		include:[
			{
				model:user,
				as:'users',
				attributes:["id","firstname","lastname","email"],
				through:{
					attributes:[],
				}
			}
		]
	})
	.then((cards) => {
	activitylog.info("Admin fetched all cards") 
		return res.send(cards);
	  })
	  .catch((err) => {
		  console.log(err)
		return res.send({"error":"error retrieving certificate data"})
	  });
}

// exports.findallcardsbyname = (req,res) => {
//     card.findAll({
//         where:{
//             cardname:req.params.cname
//         }
//     }).catch((error) => { return res.json(error)})
// 	.then((card) => {return res.send(card)})
// 	logger.log('info',`Get request on find all cards by fname route http://localhost:${port}/api-cards/findallcardbyname/:cname`,' IP address ',req.ip);
// }