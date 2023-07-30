import crypto from "crypto";
import elliptic from "elliptic";
import "dotenv/config";
const EC = elliptic.ec;
const ec = new EC("secp256k1");

const SHA256 = (message: string) =>
  crypto.createHash("sha256").update(message).digest("hex");

export class Transaction {
  public amount: number;
  public from: string;
  public to: string;
  public timestamp: number;
  public signature: string;

  constructor(amount: number, from: string, to: string, timestamp: number) {
    this.amount = amount;
    this.from = from;
    this.to = to;
    this.timestamp = timestamp;
  }

  sign(keyPair: elliptic.ec.KeyPair) {
    if (keyPair.getPublic("hex") !== this.from) {
      throw new Error("You cannot sign transactions for other wallets!");
    }

    // Calculate the hash of this transaction, sign it with the key
    // and store it inside the transaction object
    const hashTx = this.calculateHash();
    const sig = keyPair.sign(hashTx, "base64");

    this.signature = sig.toDER("hex");
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(this.from + this.to + this.amount + this.timestamp)
      .digest("hex");
  }

  isValid() {
    // Reward transaction
    if (this.from === "") {
      return true;
    }

    if (!this.signature || this.signature.length === 0) {
      throw new Error("No signature in this transaction");
    }

    const publicKey = ec.keyFromPublic(this.from, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
export class Block {
  public previousHash: string;
  public transaction: Transaction[];
  public timestamp: number;
  public hash: string;
  public nonce: number;
  constructor(
    previousHash = "",
    transaction: Transaction[] = [],
    timestamp = Date.now()
  ) {
    this.previousHash = previousHash;
    this.transaction = transaction;
    this.timestamp = timestamp;
    this.hash = this.getHash();
    this.nonce = 0;
  }

  getHash() {
    const data =
      JSON.stringify(this.transaction) +
      this.timestamp.toString() +
      this.previousHash +
      this.nonce;
    const hex = SHA256(data);
    return hex;
  }

  mine(difficulty: number) {
    while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
      this.nonce++;
      this.hash = this.getHash();
    }
    console.log("Block mined: ", this.hash);
  }

  isValidTransactions() {
    for (const tx of this.transaction) {
      if (!tx.isValid()) {
        return false;
      }
    }

    return true;
  }
}

export class BlockChain {
  public chain: Block[];
  public difficulty: number;
  public blockTime: number;
  public pendingTransactions: Transaction[];
  public reward: number;
  // initializing our chain with no records

  constructor(chain?: BlockChain) {
    this.chain = chain?.chain || [
      new Block(
        "",
        [
          new Transaction(
            100000,
            "",
            getPublicKey(process.env.WALLET_PRIVATE_KEY),
            Date.now()
          ),
        ],
        Date.now()
      ),
    ];
    this.difficulty = chain?.difficulty || 1;
    this.blockTime = chain?.blockTime || 30000;
    this.pendingTransactions = chain?.pendingTransactions || [];
    this.reward = chain?.reward || 200;
  }
  getPreviousBlock() {
    // sending the entire block itself
    return this.chain[this.chain.length - 1];
  }

  minePendingTransaction(rewardAddress: string) {
    const rewardTx = new Transaction(
      this.reward,
      "",
      rewardAddress,
      Date.now()
    );
    this.pendingTransactions.push(rewardTx);

    const block = new Block("", this.pendingTransactions, Date.now());
    block.mine(this.difficulty);

    console.log("Block successfully mined!");
    this.chain.push(block);

    this.pendingTransactions = [];
  }

  addBlock(block: Block) {
    block.previousHash = this.getPreviousBlock().hash;
    block.hash = block.getHash();
    block.mine(this.difficulty);
    this.chain.push(block);
    this.difficulty +=
      Date.now() - this.getPreviousBlock().timestamp < this.blockTime ? 1 : -1;
  }

  addTransaction(transaction: Transaction) {
    if (transaction.from === null || !transaction.to) {
      throw new Error("Transaction must include from and to address");
    }

    // Verify the transactiion
    if (!transaction.isValid()) {
      throw new Error("Cannot add invalid transaction to chain");
    }

    if (transaction.amount <= 0) {
      throw new Error("Transaction amount should be higher than 0");
    }

    // Making sure that the amount sent is not greater than existing balance
    const walletBalance = this.getBalance(transaction.from);
    if (walletBalance < transaction.amount) {
      throw new Error("Not enough balance");
    }

    // Get all other pending transactions for the "from" wallet
    const pendingTxForWallet = this.pendingTransactions.filter(
      (tx) => tx.from === transaction.from
    );

    // If the wallet has more pending transactions, calculate the total amount
    // of spend coins so far. If this exceeds the balance, we refuse to add this
    // transaction.
    if (pendingTxForWallet.length > 0) {
      const totalPendingAmount = pendingTxForWallet
        .map((tx) => tx.amount)
        .reduce((prev, curr) => prev + curr);

      const totalAmount = totalPendingAmount + transaction.amount;
      if (totalAmount > walletBalance) {
        throw new Error(
          "Pending transactions for this wallet is higher than its balance."
        );
      }
    }

    this.pendingTransactions.push(transaction);
  }

  getBalance(address: string) {
    let balance = 0;

    this.chain.forEach((block) => {
      block.transaction.forEach((t) => {
        if (t.from === address) {
          balance -= t.amount;
        }

        if (t.to === address) {
          balance += t.amount;
        }
      });
    });

    return balance;
  }
  getAllTransactionsForWallet(address: string) {
    const txs = [];

    for (const block of this.chain) {
      for (const tx of block.transaction) {
        if (tx.from === address || tx.to === address) {
          txs.push(tx);
        }
      }
    }

    console.log("get transactions for wallet count: %s", txs.length);
    return txs;
  }

  isValidBlockChain(blockChain = this) {
    for (let i = 1; i < blockChain.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (previousBlock.hash !== currentBlock.previousHash) {
        return false;
      }

      if (!currentBlock.isValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.getHash()) {
        return false;
      }
    }
    return true;
  }

  getAllPendingTransaction() {
    return this.pendingTransactions;
  }
}

export const getPublicKey = (privateKey: string) => {
  const key = ec.keyFromPrivate(privateKey);
  return key.getPublic("hex");
};
