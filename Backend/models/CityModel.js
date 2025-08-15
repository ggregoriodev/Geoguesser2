import { Sequelize } from "sequelize";
import db from "../configs/db";

const { DataTypes } = Sequelize;

const City = db.define("City", {

        latitude: DataTypes.DECIMAL(8, 6),
        longitude: DataTypes.DECIMAL(9, 6),
        name: DataTypes.STRING(255),
},
{
    freezeTableName: true, 
    timestamps: false,
  }
    
);
export default City;

(async () => {
    await db.sync();
    console.log("Tabela criada com sucesso!");
})();