import { BlockChain } from "../class";
import { Chain } from "../models";
export const configAssociation = () => {};

export const getChain = async () => {
  try {
    const chain = await Chain.findOne();
    return new BlockChain(chain.blockchain as BlockChain);
  } catch (error) {
    return Promise.reject(error);
  }
};
