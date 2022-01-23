import * as anchor from "@project-serum/anchor";
import { Program, Provider } from "@project-serum/anchor";
import { ConfirmOptions } from "@solana/web3.js";
const stakeIdl = require("./nft_staker.json");
import fs from "fs";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";

const idl = stakeIdl as anchor.Idl;

async function main(args: any) {
  const keyPair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(args[0]).toString()))
  );

  const wallet = new NodeWallet(keyPair);

  const opts = {
    preflightCommitment: "processed" as ConfirmOptions,
  };
  const endpoint = "https://api.mainnet-beta.solana.com";
  const network = endpoint;
  const connection = new anchor.web3.Connection(
    network,
    opts.preflightCommitment
  );

  const provider = new Provider(connection, wallet, opts.preflightCommitment);
  const shillCityCapital = new anchor.web3.PublicKey(
    "AH8QQSG2frNPYo9Ckqo9jzrPUixCQGJgL2jsApS3Kvkx"
  );
  // console.log("shillCityCapital", shillCityCapital);
  // console.log("shillCityCapital", shillCityCapital.toString());
  const program = new Program(idl, shillCityCapital.toString(), provider);

  let stakedPubKeys = [] as any;
  const newStakedNFTs = await program.account.stake.all([]);
  newStakedNFTs.map((stake) => {
    if (stake.account.withdrawn === false) {
      stakedPubKeys.push(stake.account.authority.toString());
    }
  });
  // console.log("My pubKey", stakedPubKeys);
  fs.writeFileSync("stakedPubKeys.json", JSON.stringify(stakedPubKeys));
}

if (require.main) main(process.argv.slice(2)).catch(console.error);
