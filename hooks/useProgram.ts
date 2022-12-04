import { AnchorProvider, Program } from '@project-serum/anchor';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor'
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-nextjs-toast';
import { BN } from "@project-serum/anchor";

const systemProgram = new PublicKey(
  '11111111111111111111111111111111',
);

const useProgram = async (programAddress: string, wallet: any) => {
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC, 'processed');
  const provider = new AnchorProvider(
    connection, wallet, {commitment: 'processed'},
  );

  const programAddressKey = new PublicKey(programAddress);
  const idl = await anchor.Program.fetchIdl(programAddressKey, provider);
  const program = new anchor.Program(idl, programAddress, provider);

  return [program, idl];
}

export const useMethods = () => {
  const wallet = useWallet();

  const submitTransaction = async (
    args: any, 
    program: anchor.Program<anchor.Idl>, 
    method: any, 
    fields: any
  ) => {
    const params = {}
    const accounts = {}
    
    fields.forEach(element => {
      let a = args[element.name];
      if (element.type == "u64") {
        params[element.name] = new BN(a);
      } else if (element.type == "u32") {
        params[element.name] = Number(a);
      } else if (element.type == "bool") {
        params[element.name] = a == "true";
      } else if (element.type == "publicKey") {
        params[element.name] = new PublicKey(a);
      } else if (element.type == "string") {
        params[element.name] = a
      } else {
        params[element.name] = a
      }
    });
    method.accounts.forEach(element => {
      if (element.name == "systemProgram") {
        accounts[element.name] = systemProgram;
      } else {
        accounts[element.name] = new PublicKey(args[element.name]);
      }
    })
    
    try {
      const tx = await program.methods[method.name](params)
        .accounts(accounts)
        .rpc()
        .catch(e => {
          console.log(e);
          if (e.error.errorCode.code) {
            toast.notify(e.error.errorMessage, {
              duration: 5,
              type: "error",
              title: e.error.errorCode.code.replace(/([A-Z])/g, ' $1').trim()
            })
          } else if (e.logs[3].includes("insufficient lamports")) {
            toast.notify('Insufficient SOL to join this draw.', {
              duration: 5,
              type: "error",
              title: "Insufficient Funds"
            })
          }
        })
        console.log('tx=', tx);
        toast.notify(`Transaction ${tx}`, {
          duration: 5,
          type: "success",
          title: `${method.name} Submitted!`
        })
    } catch (e) {
      console.log(e);
    }
  }

  return { submitTransaction }
}

export default useProgram