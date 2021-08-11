const User = require("./User");

module.exports =(sequelize,DataTypes) => {
    const card = sequelize.define('card',{
        cardname:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    })

    card.associate = models => {
        // card.belongsTo(models.User,{
        //     foreignKey:{
        //         allowNull:false
        //     },onDelete:'cascade'
        // })

        card.belongsToMany(models.User, { through: 'UserCard' });
    }
    return card;
}