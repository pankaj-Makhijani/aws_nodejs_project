const { card } = require('../models');
const logger = require('../config/logger')
const S3 = require("aws-sdk/clients/s3");
require('dotenv').config('./.env');
const path = require('path')
const db = require('../models');
const fs = require('fs');

const port = process.env.PORT || 3000;


exports.createcard = (req,res) => {
	card.create({
		cardname:req.body.cname,
		cardnumber:req.body.cnumber,
		UserId:req.body.uid
	}).catch((error) => {
			logger.log('error',error.errors[0].message);
			return res.json({error})
	}).then(card => {
	logger.log('info',card)
	res.json({'msg':'card created successfully'})
})
	 logger.log('info',`Post request on create card route http://localhost:${port}/api-cards/createcard`,' IP address ',req.ip);
}

exports.getcardbyid = (req,res) => {
	db.card.findAll({
		where:{
			UserId:req.params.id,
		},
		include:[db.User]
	}).catch((error) => { return res.json(error)})
	.then((card) => {return res.json(card)})
	logger.log('info',`Get request on getcardbyid route http://localhost:${port}/api-cards/findcardbyid/:id`,' IP address ',req.ip);
}

exports.deletecardbyid = (req,res) => {
	card.destroy({
		where: {
			UserId:req.params.id
		}
	}).then(card => {
		res.json({'msg':'card deleted successfully'})
	 }).catch((error) => { 
		logger.log('error',error);
		return res.json({'error':'delete action unsuccessful'})
	 })
	 logger.log('info',`delete request on deletecard route http://localhost:${port}/api-cards/deletecardbyid/:id`,' IP address ',req.ip);
}

exports.updatecard = (req,res) => {
	var {uid,cname,cnumber} =req.body;
	var records = [[cname,cnumber,uid]];
	if(records[0][0]!=null)
	{
		card.update(
		{
			cardnumber:req.body.cnumber
		},
		{
			where : { 
			UserId:req.body.uid,
			cardname:req.body.cname
			}
		}
		).then((card) => {
			res.json({'msg':'data updated successfully'})
			// res.json(User)

		}).catch((error) => {
			return res.json({'error':'data updation failed'})
		})
	}
	logger.log('info',`Post request on updatecard route http://localhost:${port}/api-cards/updatecard`,' IP address ',req.ip);
}

exports.getallcards = (req,res) => {
	card.findAll().catch((error) => {
		logger.log('error',error);
		return res.json({'error':'No data exists'})
	}).then(Users => { res.json(Users) })
	logger.log('info',`Get request on find all users route http://localhost:${port}/api-cards/getallcards`,' IP address ',req.ip)
}

exports.findallcardsbyname = (req,res) => {
    card.findAll({
        where:{
            cardname:req.params.cname
        }
    }).catch((error) => { return res.json(error)})
	.then((card) => {return res.json(card)})
	logger.log('info',`Get request on find all cards by fname route http://localhost:${port}/api-cards/findallcardbyname/:cname`,' IP address ',req.ip);
}