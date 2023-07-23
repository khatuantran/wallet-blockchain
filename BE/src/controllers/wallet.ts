import "dotenv/config";
import express from "express";
import { Chain, Wallet } from "../models";
import elliptic from "elliptic";
import { getChain } from "../utils";
import { BlockChain, Transaction, getPublicKey } from "../class";

const EC = elliptic.ec;
const ec = new EC("secp256k1");
// import 'express-async-errors';
export const getWallet = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const password = req.body.password;
    const userName = req.body.userName;
    if (!userName) {
      return next(new Error("User name is required"));
    }

    if (!password) {
      return next(new Error("Password is required"));
    }

    const wallet = await Wallet.findOne({ where: { password, userName } });

    if (!wallet) {
      return next(new Error("Wallet not found"));
    }

    const key = ec.keyFromPrivate(wallet.privateKey);
    return res.json({
      userName: wallet.userName,
      privateKey: key.getPrivate("hex"),
      publicKey: key.getPublic("hex"),
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      error: {
        code: "bad_request",
        message: err.message,
      },
    });
  }
};

export const createWallet = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const key = ec.genKeyPair();
    const privateKey = key.getPrivate("hex");
    const publicKey = key.getPublic("hex");
    const { userName, password } = req.body;
    await Wallet.create({ privateKey, password, userName });

    return res.json({
      userName,
      publicKey,
      privateKey,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      error: {
        code: "bad_request",
        message: err,
      },
    });
  }
};

export const getAllTransaction = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const blockChain = await getChain();
    const wallets = await Wallet.findAll({});
    const w = await Wallet.findOne({
      where: { userName: req.query.userName as string },
    });
    const publicKey = getPublicKey(w.privateKey);
    const txs: Transaction[] =
      blockChain.getAllTransactionsForWallet(publicKey);

    return res.json({
      transaction: txs.map((t) => {
        const isSend = t.from === publicKey;
        return {
          isSend,
          timestamp: t.timestamp,
          amount: t.amount,
          userName:
            wallets.find(
              (w) => getPublicKey(w.privateKey) === (isSend ? t.to : t.from)
            )?.userName || "",
        };
      }),
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      error: {
        code: "bad_request",
        message: err,
      },
    });
  }
};

export const getWalletBalance = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const blockChain = await getChain();

    if (!req.query.userName) {
      return next(new Error("User name not found"));
    }

    const wallet = await Wallet.findOne({
      where: { userName: req.query.userName as string },
    });

    if (!wallet) {
      return next(new Error("Wallet not found"));
    }

    const balance = blockChain.getBalance(getPublicKey(wallet.privateKey));

    return res.status(200).json({
      publicKey: getPublicKey(wallet.privateKey),
      privateKey: wallet.privateKey,
      balance,
      block: blockChain.chain.length,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: {
        code: "bad_request",
        message: err,
      },
    });
  }
};

export const sendCoin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const blockChain = await getChain();

    const { fromUser, toUser, amount } = req.body;
    if (!fromUser || !toUser || !amount) {
      return next(new Error("Please input all data needed"));
    }

    if (fromUser === toUser) {
      return next(new Error("Cannot send coin for yourself"));
    }

    if (amount <= 0) {
      return next(new Error("invalid coin"));
    }
    
    const wallet = await Wallet.findOne({ where: { userName: fromUser } });
    const desUser = await Wallet.findOne({ where: { userName: toUser } });

    console.log(wallet);

    if (!wallet || !desUser) {
      return next(new Error("Wallet not found"));
    }

    const tx = new Transaction(
      Number(amount),
      getPublicKey(wallet.privateKey),
      getPublicKey(desUser.privateKey),
      Date.now()
    );
    const key = ec.keyFromPrivate(wallet.privateKey);
    tx.sign(key);
    blockChain.addTransaction(tx);
    blockChain.minePendingTransaction("");

    await Chain.update(
      {
        blockchain: blockChain,
      },
      { where: {} }
    );

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: 400,
      error: {
        code: "bad_request",
        message: err.message,
      },
    });
  }
};
