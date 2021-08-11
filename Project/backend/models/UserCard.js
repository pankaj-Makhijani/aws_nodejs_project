module.exports =(sequelize,DataTypes) => {
    const UserCard = sequelize.define('UserCard',{
        cardId:DataTypes.STRING,
        UserId:DataTypes.INTEGER,
    },{timestamps:false})
    return UserCard;
}