import "dotenv/config";
import express from "express";
import { Chain, Wallet } from "../models";
import elliptic from "elliptic";
import { getChain } from "../utils";
import { Transaction, getPublicKey } from "../class";
import { StatusCodes } from "http-status-codes";

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
    next(err);
  }
};

export const createWallet = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
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
    next(err);
  }
};

export const getAllTransaction = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
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
    next(err);
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
    next(err);
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
    // blockChain.minePendingTransaction("");

    await Chain.update(
      {
        blockchain: blockChain,
      },
      { where: {} }
    );

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    next(err);
  }
};

export const getAllPendingTransaction = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const [blockChain, wallets] = await Promise.all([
      getChain(),
      Wallet.findAll(),
    ]);

    const walletRecord = wallets.reduce((p, c) => {
      const publicKey = getPublicKey(c.privateKey);
      c["publicKey"] = publicKey;
      p[publicKey] = c;
      return p;
    }, {});

    return res.status(200).json({
      transaction: blockChain.getAllPendingTransaction().map((t) => ({
        from: t.from,
        to: t.to,
        amount: t.amount,
        date: t.timestamp,
        fromUser: walletRecord[t.from]?.userName,
        toUser: walletRecord[t.to]?.userName,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const mine = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!req.body.userName) {
      return next(new Error("User name invalid"));
    }

    const user = await Wallet.findOne({
      where: { userName: req.body.userName },
    });

    if (!user) {
      return next(new Error("User not found"));
    }

    const blockChain = await getChain();

    if (blockChain.pendingTransactions.length === 0) {
      return next(new Error("Current chain have not any pending transaction"));
    }

    blockChain.minePendingTransaction(getPublicKey(user.privateKey));

    await Chain.update(
      {
        blockchain: blockChain,
      },
      { where: {} }
    );

    return res.status(200).json({
      transaction: [],
      message: "success",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllBlock = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const blockChain = await getChain();

    return res.status(200).json({
      block: blockChain.chain.map((b, index) => ({
        index,
        hash: b.hash,
        previousHash: b.previousHash,
        nonce: b.nonce,
        date: b.timestamp,
      })),
    });
  } catch (err) {
    next(err);
  }
};

export const getBlockTransaction = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!req.query.index) {
      return next(new Error("Index invalid"));
    }

    const [blockChain, wallets] = await Promise.all([
      getChain(),
      Wallet.findAll(),
    ]);

    if (Number(req.query.index) >= blockChain.chain.length) {
      return next(new Error(`Index must be <= ${blockChain.chain.length - 1}`));
    }

    const walletRecord = wallets.reduce((p, c) => {
      const publicKey = getPublicKey(c.privateKey);
      c["publicKey"] = publicKey;
      p[publicKey] = c;
      return p;
    }, {});

    return res.status(200).json({
      transaction: blockChain.chain[Number(req.query.index)].transaction.map(
        (t) => ({
          from: t.from,
          to: t.to,
          amount: t.amount,
          date: t.timestamp,
          fromUser: walletRecord[t.from]?.userName,
          toUser: walletRecord[t.to]?.userName,
        })
      ),
    });
  } catch (err) {
    next(err);
  }
};
