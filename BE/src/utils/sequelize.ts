import "dotenv/config";
import { Sequelize } from "sequelize-typescript";
import { Chain, Wallet } from "../models";
export const configSequelize = () => {
  const env = process.env.ENV;
  if (env === "local") {
    return new Sequelize({
      host: "localhost",
      database: "wallet-blockchain",
      dialect: "postgres",
      username: "postgres",
      password: process.env.LOCAL_DATABASE_PASSWORD,
      models: [Wallet, Chain],
    });
  } else {
    return new Sequelize({
      host: process.env.HOST,
      port: 5432,
      database: process.env.DATABASE_NAME,
      dialect: "postgres",
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      models: [Wallet, Chain],
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  }
};
