module.exports =(sequelize,DataTypes) => {
    const system_logs = sequelize.define('system_logs',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        message:{
            type:DataTypes.TEXT,
        },
        level: {
            type:DataTypes.NUMBER,
        },
        date: {
            type:DataTypes.DATE,
        }
    },
    {
        timestamps: false
})
    return system_logs;
}