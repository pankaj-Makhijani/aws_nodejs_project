module.exports =(sequelize,DataTypes) => {
    const card = sequelize.define('card',{
        cardname:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        cardnumber:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    })

    card.associate = models => {
        card.belongsTo(models.User,{
            foreignKey:{
                allowNull:false
            },onDelete:'cascade'
        })
    }
    return card;
}