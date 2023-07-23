import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import path from "path";
import { configSequelize, configAssociation } from "./utils";
import {
  createWallet,
  getAllTransaction,
  getWallet,
  getWalletBalance,
  sendCoin,
} from "./controllers";
import { Chain, Wallet } from "./models";
import elliptic from "elliptic";
import { BlockChain } from "./class";
import "dotenv/config";
const EC = elliptic.ec;
const ec = new EC("secp256k1");

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/login-wallet", getWallet);
app.post("/create-wallet", createWallet);
app.get("/wallet-balance", getWalletBalance);
app.post("/send-coin", sendCoin);
app.get("/transaction", getAllTransaction);

app.use((req, res) => {
  return res.status(404).json({
    error: {
      status: 404,
      message: "Not found",
    },
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({ error: err.message });
});

const connectDBAndStartServer = async () => {
  const port = process.env.PORT || 3000;
  try {
    const sequelize = configSequelize();
    configAssociation();
    await sequelize.authenticate();

    let chain = await Chain.findOne();
    if (!chain) {
      const blockChain = new BlockChain();
      await Wallet.findOrCreate({
        where: { userName: process.env.WALLET_USER },
        defaults: {
          userName: process.env.WALLET_USER,
          privateKey: process.env.WALLET_PRIVATE_KEY,
          password: process.env.WALLET_PASSWORD,
        },
      });

      await Chain.create({
        blockchain: blockChain,
      });
    }

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
connectDBAndStartServer();
