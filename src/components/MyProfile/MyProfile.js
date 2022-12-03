import React, { useState, useEffect } from 'react'
import { createDDWAppWriteContractMatic } from '../../Helper/polygon/writeContract';
import { createDDWAppWriteContractEth } from '../../Helper/ethereum/writeContract';
import { read_from_ipfs } from '../../Helper/web3storage';
import "./MyProfile.css"
import { app_token_read_contract_eth, ddw_token_read_contract_eth } from '../../Helper/ethereum/readContract';
import { app_token_read_contract_matic, ddw_token_read_contract_matic } from '../../Helper/polygon/readContract';
import { shorten_address } from '../../Helper/utilities';
import { ethers } from 'ethers';
const MyProfile = ({location}) => {
    const [visibilityDDW, setVisibilityDDW] = useState(false);
    const [visibilitySBT, setVisibilitySBT] = useState(false);
    var wallet = location.state.userDetails.wallet;
    var blockchain = location.state.userDetails.blockchain;
    const [DDWToken, setDDWToken] = useState(0);
    const [APPToken, setAPPToken] = useState(0);

    const getDDWBalance = async ()=> {
      if(blockchain === "eth")
      {
        var balance = await ddw_token_read_contract_eth.balanceOf(wallet);
        var denom = ethers.utils.parseUnits('1', 18);
        var value = balance.div(denom).toNumber();
        setDDWToken(value);
      }
      else if(blockchain === "matic")
      {
        var balance = await ddw_token_read_contract_matic.balanceOf(wallet);
        var denom = ethers.utils.parseUnits('1', 18);
        var value = balance.div(denom).toNumber();
        setDDWToken(value);
      }
    }

    const getAPPBalance = async ()=> {
      if(blockchain === "eth")
      {
        var balance = await app_token_read_contract_eth.balanceOf(wallet);
        var denom = ethers.utils.parseUnits('1', 18);
        var value = balance.div(denom).toNumber();
        setAPPToken(value);
      }
      else if(blockchain === "matic")
      {
        var balance = await app_token_read_contract_matic.balanceOf(wallet);
        var denom = ethers.utils.parseUnits('1', 18);
        var value = balance.div(denom).toNumber();
        setAPPToken(value);
      }
    }

  return (
    <>

<div className="containerValue">
        <div className="profile_container">
          <div className="back"></div>
          <div className="profile">
            <img id='profile-pic' className="profile-pic" src={location.state.imageSrc} height={150} width={150} style={{borderRadius: "100%"}}/>
          </div>
          <div className="profile_infos">
          <h1 className="name">{location.state.userDetails.name}</h1>
          <h2 className="occupation">{shorten_address(location.state.userDetails.wallet)}</h2>
          <h2 onClick={async ()=> {if(!visibilityDDW) await getDDWBalance(); setVisibilityDDW(!visibilityDDW)}} className="TokenBalance">DDW Token balance </h2>
          <h2 className={visibilityDDW ? "" : "gone" }>{DDWToken}</h2>
          <h2 onClick={async ()=> {if(!visibilitySBT) await getAPPBalance(); setVisibilitySBT(!visibilitySBT)}} className="TokenBalance">SBT Token balance </h2>
          <h2 className={visibilitySBT ? "" : "gone" }>{APPToken}</h2>
          <span>Enter Username</span>
          <div className='inputContainer'>
          <div className="input-group input">
          <input  type="text" placeholder="Username" />
          </div>
          <button className="slide buttonContainer">&nbsp;</button>
          </div>
          <span>Claim DDW Tokens</span>
          <div className='inputContainer'>
          <div className="input-group input">
          <input  type="text" placeholder="Enter Approval Token Amount" />
          </div>
          <button className="slide buttonContainer">&nbsp;</button>
          </div>
          <span>Send DDW Tokens</span>
          <div id='inputContainer'>
          <div className='inputContainer'>
          <div className="input-group input">
          <input  type="text" placeholder="Enter DDW Token Amount" />
          </div>
          <button className="slide buttonContainer">&nbsp;</button>
          </div>
          <div className='inputContainer'>
          <div className="input-group input">
          <input  type="text" placeholder="Enter Recipient address" />
          </div>
          <button className="slide buttonContainer">&nbsp;</button>
          </div>
          </div>
        </div>
        </div>
      </div> </>
  )
}

export default MyProfile