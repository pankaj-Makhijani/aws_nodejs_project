const user = require("./user");

module.exports =(sequelize,DataTypes) => {
    const card = sequelize.define('card',{
        cardname:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    })
    return card;
}