import React, { useState, useEffect } from 'react'
import { createDDWAppWriteContractMatic } from '../../Helper/polygon/writeContract';
import { createDDWAppWriteContractEth } from '../../Helper/ethereum/writeContract';
import { read_from_ipfs } from '../../Helper/web3storage';
import "./MyProfile.css"
import { app_read_contract_eth, app_token_read_contract_eth, ddw_token_read_contract_eth } from '../../Helper/ethereum/readContract';
import { app_read_contract_matic, app_token_read_contract_matic, ddw_token_read_contract_matic } from '../../Helper/polygon/readContract';
import { shorten_address } from '../../Helper/utilities';
import { ethers } from 'ethers';
const MyProfile = ({location}) => {
    const [visibilityDDW, setVisibilityDDW] = useState(false);
    const [visibilitySBT, setVisibilitySBT] = useState(false);
    var wallet = location.state.userDetails.wallet;
    var blockchain = location.state.userDetails.blockchain;
    const [matches, setMatches] = useState([]);
    const [DDWToken, setDDWToken] = useState(0);
    const [APPToken, setAPPToken] = useState(0);

    useEffect(()=>{
        loadMatchesData(wallet);
    }, []);

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

    const loadMatchesData = async (wallet) => {
      var matchListOnChain = [];
      var matchTimestampOnChain = [];
      if(blockchain==="eth")
      {
        var Contract = createDDWAppWriteContractEth();
        var likes_info = await Contract.get_matches();
        if(likes_info[0].length === 0) return;
        matchListOnChain = likes_info[0];
        if(matchListOnChain.length === matches.length) return;
        console.log("matchList", matchListOnChain);
        matchTimestampOnChain = likes_info[1];
        console.log("matchTime", matchTimestampOnChain);
      }
      else if(blockchain==="matic")
      {
          var Contract = createDDWAppWriteContractMatic();
          var likes_info = await Contract.get_matches();
          if(likes_info[0].length === 0) return;
          matchListOnChain = likes_info[0];
          if(matchListOnChain.length === matches.length) return;
          console.log("matchList", matchListOnChain);
          matchTimestampOnChain = likes_info[1];
          console.log("matchTime", matchTimestampOnChain);
      }
      var matchListValue = [];
      for(var index = 0; index < matchListOnChain.length; index++) {
              var user_ipfs_cid = "";
              if(blockchain === "eth") {
                if(!(await app_read_contract_eth.is_account_registered(matchListOnChain[index]))) continue;
                user_ipfs_cid = await app_read_contract_eth.get_user_details(matchListOnChain[index]);
              }
              else if(blockchain === "matic") {
                  if(!(await app_read_contract_matic.is_account_registered(matchListOnChain[index]))) continue;
                  user_ipfs_cid = await app_read_contract_matic.get_user_details(matchListOnChain[index]);
              }
              if(user_ipfs_cid === "") continue;   
              console.log("loop index outside onload", index);
              var files = await read_from_ipfs(user_ipfs_cid, "userInfo.json");
              if(files[0]) {
                  files = files[1];
                  console.log(files);
                  var matchDetails = {};
                  let reader = new FileReader();
                  reader.readAsText(files[0]);
                  reader.onload = async function() {
                      matchDetails = JSON.parse(reader.result);
                      var match_image_files = await read_from_ipfs(matchDetails.image, "avatar.png");
                      var match_image_src = null;
                      if(match_image_files[0])
                      match_image_src = window.URL.createObjectURL(match_image_files[1][0]);
                      else
                      match_image_src = match_image_files[1];
                      var matched_date = (new Date(parseInt(matchTimestampOnChain[index-1])*1000)).toUTCString();
                      matchDetails.src = match_image_src;
                      matchDetails.lastseen = `Matched on ${matched_date}`
                      matchDetails.Id = matchDetails.id;
                      matchDetails.id = index;
                      matchListValue.push(matchDetails);
                      console.log("loop index inside onload", index);
                      if(matchListValue.length === matchListOnChain.length) {
                              
                          setMatches(matchListValue);
                          console.log("set matches", matchListValue);
                      }
                  }
              }
              else {
                  matchDetails = files[1];
                  var match_image_files = await read_from_ipfs(matchDetails.image, "avatar.png");
                  var match_image_src = null;
                  if(match_image_files[0])
                  match_image_src = window.URL.createObjectURL(match_image_files[1][0]);
                  else
                  match_image_src = match_image_files[1];
                  var matched_date = (new Date(parseInt(matchTimestampOnChain[index])*1000)).toUTCString();
                  matchDetails.src = match_image_src;
                  matchDetails.lastseen = `Matched on ${matched_date}`
                  matchDetails.Id = matchDetails.id;
                  matchDetails.id = index;
                  matchListValue.push(matchDetails);
                  console.log("loop index inside onload", index);
                  if(matchListValue.length === matchListOnChain.length) {
                          
                      setMatches(matchListValue);
                      console.log("set matches", matchListValue);
                  }
              }
          }
  }

  return (
    <>

<div className="containerValue">
        <div className="profile_container">
          <div className="back"></div>
          <div className="profile">
            <img src={location.state.imageSrc} height={150} width={150} style={{borderRadius: "100%"}}/>
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