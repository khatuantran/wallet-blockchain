import crypto from "crypto";
export class Transaction {
  public amount: number;
  public senderPublicKey: string;
  public receiverPublicKey: string;
  constructor(
    amount: number,
    senderPublicKey: string,
    receiverPublicKey: string
  ) {
    this.amount = amount;
    this.senderPublicKey = senderPublicKey;
    this.receiverPublicKey = receiverPublicKey;
  }
  toString() {
    return JSON.stringify(this);
  }
}

export class Block {
  public previousHash: string;
  public transaction: Transaction[];
  public timestamp: number;
  public hash: string;
  public nonce: number;
  constructor(
    previousHash: string,
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
      this.timestamp +
      this.previousHash +
      this.nonce;
    const hash = crypto.createHash("SHA256");
    hash.update(data).end();
    const hex = hash.digest("hex");
    return hex;
  }

  mine(difficulty: number) {
    while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
      this.nonce++;
      this.hash = this.getHash();
    }
  }
}

export class BlockChain {
  public chain: Block[];
  public difficulty: number;
  public blockTime: number;
  // initializing our chain with no records
  constructor() {
    this.chain = [new Block("", [], Date.now())];
    this.difficulty = 1;
    this.blockTime = 30000;
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

  isValidBlock(blockChain = this) {
    for (let i = 1; i < blockChain.chain.length; i++) {
      const currBlock = blockChain.chain[i];
      const prevBlock = blockChain.chain[i - 1];
      if (
        currBlock.hash !== currBlock.getHash() ||
        prevBlock.hash !== prevBlock.getHash()
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
  public balance: number;
  // initializing our chain with no records
  constructor() {
    const keys = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    this.privateKey = keys.privateKey;
    this.publicKey = keys.publicKey;
    this.balance = 0;
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
