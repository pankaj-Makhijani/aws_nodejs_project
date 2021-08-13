const user = require("./user");

module.exports =(sequelize,DataTypes) => {
    const card = sequelize.define('card',{
        cardname:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    })

    // card.associate = models => {
    //     // card.belongsTo(models.User,{
    //     //     foreignKey:{
    //     //         allowNull:false
    //     //     },onDelete:'cascade'
    //     // })

    //     card.belongsToMany(models.user, { through: 'usercard',as:'cardid' });
    // }
    return card;
}