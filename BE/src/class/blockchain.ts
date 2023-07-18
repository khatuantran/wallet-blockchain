import crypto from "crypto";
import elliptic from "elliptic";
const SHA256 = (message) =>
  crypto.createHash("sha256").update(message).digest("hex");
const EC = elliptic.ec;
const ec = new EC("secp256k1");
export class Transaction {
  public amount: number;
  public from: string;
  public to: string;
  public signature: string;
  constructor(amount: number, from: string, to: string) {
    this.amount = amount;
    this.from = from;
    this.to = to;
  }
  sign(keyPair: elliptic.ec.KeyPair) {
    if (keyPair.getPublic("hex") === this.from) {
      this.signature = keyPair
        .sign(SHA256(this.from + this.to + this.amount.toString()), "base64")
        .toDER("hex");
    }
  }

  isValid(tx: Transaction, chain: BlockChain) {
    return (
      tx.from &&
      tx.to &&
      tx.amount &&
      chain.getBalance(tx.from) >= tx.amount &&
      ec
        .keyFromPublic(tx.from, "hex")
        .verify(SHA256(tx.from + tx.to), tx.signature)
    );
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
      this.nonce.toString();
    const hex = SHA256(data);
    return hex;
  }

  mine(difficulty: number) {
    while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
      this.nonce++;
      this.hash = this.getHash();
    }
  }

  isValidTransactions(chain: BlockChain) {
    return this.transaction.every((t) => t.isValid(t, chain));
  }
}

export class BlockChain {
  public chain: Block[];
  public difficulty: number;
  public blockTime: number;
  public transactions: Transaction[];
  public reward: number;
  // initializing our chain with no records
  constructor() {
    this.chain = [new Block("", [], Date.now())];
    this.difficulty = 1;
    this.blockTime = 30000;
    this.transactions = [];
    this.reward = 200;
  }

  getPreviousBlock() {
    // sending the entire block itself
    return this.chain[this.chain.length - 1];
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
    if (transaction.isValid(transaction, this)) {
      this.transactions.push(transaction);
    }
  }

  mineTransaction() {
    this.addBlock(
      new Block(
        "",
        [new Transaction(CREATE_REWARD_ADDRESS), ...this.transactions],
        Date.now()
      )
    );
    this.transactions = [];
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

  isValidBlock(blockChain = this) {
    for (let i = 1; i < blockChain.chain.length; i++) {
      const currBlock = blockChain.chain[i];
      const prevBlock = blockChain.chain[i - 1];
      if (
        currBlock.hash !== currBlock.getHash() ||
        prevBlock.hash !== prevBlock.getHash() ||
        currBlock.isValidTransactions(blockChain)
      ) {
        return false;
      }
    }
    return true;
  }
}

export class Wallet {
  public privateKey: string;
  public publicKey: string;
  // initializing our chain with no records
  constructor() {
    const key = ec.genKeyPair();
    this.privateKey = key.getPrivate("hex");
    this.publicKey = key.getPublic("hex");
  }

  send(amount: number, receiverPublicKey: string) {
    const transaction = new Transaction(
      amount,
      this.publicKey,
      receiverPublicKey
    );
    const shaSign = crypto.createSign("SHA256");
    // add the transaction json
    shaSign.update(transaction.toString()).end();
    // sign the SHA with the private key
    const signature = shaSign.sign(this.privateKey);
    Chain.instance.insertBlock(transaction, this.publicKey, signature);
  }
}
