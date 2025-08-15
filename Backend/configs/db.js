import { Sequelize } from "sequelize";
const db = new Sequelize(
  "cidadesbd",     // nome do banco
  "root",          // usuário
  "password",              // senha (vazia se não tiver)
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    logging: false
  }
);


  export default db;
  
    







