const { card,usercard,user } = require('../models');
// const logger = require('../config/logger')
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
							userid:req.params.id,
						}).catch((error) => {
								return res.json({"msg":"certificate already Exists in your Profile"})
						}).then(card => {
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
						return res.json({"msg":"Error occured while removing certificate"})
				}).then(card => {
					if(card==0)
					{
						return res.json({"msg":"No such certificate exists in your Profile"})
					}
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
			return res.json({"msg":"error creating certificate"})
	}).then(card => {
	activitylog.info("card created with name " + req.body.cname) 
	return res.json({'msg':'certificate created successfully'})
})
}


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
			return res.json({'msg':'certificate delete action unsuccessful'})
		 })
	}).catch((error) => {
		return res.json({'mesg':'Error while deletiing certificate'})
	})
}

exports.getonecard = (req,res) => {
	card.findOne({
		where:{
			id:req.params.cid
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
		// if()
	activitylog.info("Admin fetched all cards") 
		return res.send(cards);
	  })
	  .catch((err) => {
		return res.json({"error":"error retrieving certificate data"})
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
		return res.send({"error":"error retrieving certificate data"})
	  });
}

exports.getallcardsbyhr = (req,res) => {
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
		return res.send({"error":"error retrieving certificate data"})
	  });
}

