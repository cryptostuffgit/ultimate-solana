import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-nextjs-toast';
import Button from '@mui/material/Button';
import * as anchor from '@project-serum/anchor';
import useProgram from "../../hooks/useProgram";
import Contract from 'components/Contract';
import Getter from 'components/Getter';

const MainView = ({connected}) => {
  const wallet = useWallet();

  const [program, setProgram] = useState(null);
  const [idl, setIdl] = useState(null);
  const [programAddress, setProgramAddress] = useState("");
  const [validProgramAddress, setValidProgramAddress] = useState(false);
  
  const storeProgramAddress = (event: any) => {
    setProgramAddress(event.target.value)
    console.log(event.target.value);
  }
  
  const findProgramAddress = async () => {
    try {
      anchor.web3.PublicKey.isOnCurve(programAddress);
      setValidProgramAddress(true);
      const [p, i] = await useProgram(programAddress, wallet);
      setProgram(p);
      setIdl(i);
    } catch (error) {
      toast.notify("Invalid Program Address", {
        duration: 5,
        type: "error",
        title: "Error"
      })
    }
  }

  return (
    <div className="main-container">
      <ToastContainer className={"toast-container"} align={"right"} position={"bottom"} />
      <h1 className="heading">
        Ultimate Solana Frontend
      </h1>
      <div className='program-address'>
        <input className="program-address-input" placeholder='Enter a Program Address' onKeyUp={storeProgramAddress}/>
        <Button className="program-address-button" variant="contained" onClick={findProgramAddress}>Find Program</Button>
      </div>
      {program && idl && <Contract program={program} idl={idl}/>}
      <br/>
      {program && idl && <Getter program={program} idl={idl}/>}
    </div>
  );
};

export default MainView;
