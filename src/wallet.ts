import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4, TonClient, fromNano } from "@ton/ton";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = process.env.MNEMONIC; // your 24 secret words
  if (!mnemonic) {
    throw new Error("MNEMONIC is not set");
  }
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  // print wallet address
  console.log(wallet.address.toString({ testOnly: true }));
  // print wallet workchain
  console.log("workchain:", wallet.address.workChain);

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // query balance from chain
  const balance = await client.getBalance(wallet.address);
  console.log("balance:", fromNano(balance)); // from NanoTON to TON

  // query seqno from chain
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  console.log("seqno:", seqno);
}

main();
