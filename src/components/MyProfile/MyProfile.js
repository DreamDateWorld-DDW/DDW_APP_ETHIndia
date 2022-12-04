import React, { useState, useEffect } from 'react'
import { createDDWAppWriteContractMatic, createDDWTokenWriteContractMatic } from '../../Helper/polygon/writeContract';
import { createDDWAppWriteContractEth, createDDWTokenWriteContractEth } from '../../Helper/ethereum/writeContract';
import { read_from_ipfs } from '../../Helper/web3storage';
import "./MyProfile.css"
import { app_token_read_contract_eth, ddw_token_read_contract_eth } from '../../Helper/ethereum/readContract';
import { app_token_read_contract_matic, ddw_token_read_contract_matic } from '../../Helper/polygon/readContract';
import { shorten_address } from '../../Helper/utilities';
import { ethers } from 'ethers';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { app_read_contract_eth } from '../../Helper/ethereum/readContract';
import { app_read_contract_matic } from '../../Helper/polygon/readContract';
import { isWalletCorrect } from '../../Helper/contract'
// import ENS, { getEnsAddress } from '@ensdomains/ensjs'

const MyProfile = ({location}) => {
    const [visibilityDDW, setVisibilityDDW] = useState(false);
    const navigate = useNavigate();
    const [visibilitySBT, setVisibilitySBT] = useState(false);
    var wallet = location.state.userDetails.wallet;
    var blockchain = location.state.userDetails.blockchain;
    const [DDWToken, setDDWToken] = useState(0);
    const [APPToken, setAPPToken] = useState(0);
    const [searchValue, setsearchValue] = useState();
    const [DDWSendToken, setDDWSendToken] = useState();
    const [receiverDDW, setReceiverDDW] = useState();
    const [APPamount, setAPPAmount] = useState();

    const handleAPPTokenAmountChange = (e) => {
        setAPPAmount(e.target.value);
    }
    const onTokenClaimTransactionSubmit = async (e) => {
        e.preventDefault();
        if(!Number.isInteger(parseInt(APPamount))){
            alert("Enter correct number in the field");
            return}
        if(blockchain === "eth") {
          var isItRightWallet = await isWalletCorrect(wallet, "eth");
          if(!isItRightWallet) {
              alert(`Wrong Wallet. You should switch to ${wallet}`);
              return;
          }
          var Contract = createDDWAppWriteContractEth();
          try {
              let nftTx = await Contract.exchange_approval_and_claim_coin(ethers.utils.parseEther(APPamount));
              console.log("Mining....", nftTx.hash);
              } catch (error) {
              console.log("Error APP token xchange", error);
              return;
              }
        }
        else if(blockchain === "matic") {
            var isItRightWallet = await isWalletCorrect(wallet, "matic");
            if(!isItRightWallet) {
                alert(`Wrong Wallet. You should switch to ${wallet}`);
                return;
            }
            var Contract = createDDWAppWriteContractMatic();
            try {
                let nftTx = await Contract.exchange_approval_and_claim_coin(ethers.utils.parseEther(APPamount));
                console.log("Mining....", nftTx.hash);
                } catch (error) {
                console.log("Error APP token xchange", error);
                return;
                }
        }
        document.getElementById("inputVal").value = "";
        setAPPAmount("");
        alert("Tokens Claimed");

    }

    const handleDDWTokenAmountChange = async (e) => {
        setDDWSendToken(e.target.value);
    }

    const handleRecDDWTokenAddressChange = async (e) => {
        setReceiverDDW(e.target.value);
    }
    const handlesearchchange = async(e) =>{
        setsearchValue(e.target.value);
    }

    const onDDWTokenTransactionSubmit = async (e) => {
      e.preventDefault();
      if(!Number.isInteger(parseInt(DDWSendToken))){
          alert("Enter correct number in the field");
          return}
      if(blockchain === "eth") {
        var isItRightWallet = await isWalletCorrect(wallet, "eth");
        if(!isItRightWallet) {
            alert(`Wrong Wallet. You should switch to ${wallet}`);
            return;
        }
        var Contract = createDDWTokenWriteContractEth();
        try {
            let nftTx = await Contract.transfer(receiverDDW, ethers.utils.parseEther(DDWSendToken));
            console.log("Mining....", nftTx.hash);
            } catch (error) {
            console.log("Error DDW token transfer", error);
            return;
            }
      }
      else if(blockchain === "matic") {
          var isItRightWallet = await isWalletCorrect(wallet, "matic");
          if(!isItRightWallet) {
              alert(`Wrong Wallet. You should switch to ${wallet}`);
              return;
          }
          var Contract = createDDWTokenWriteContractMatic();
          try {
              let nftTx = await Contract.transfer(receiverDDW, ethers.utils.parseEther(DDWSendToken));
              console.log("Mining....", nftTx.hash);
              } catch (error) {
              console.log("Error DDW token transfer", error);
              return;
              }
      }
      document.getElementById("enteredAmt").value = "";
      document.getElementById("recipientAddress").value = "";
      setDDWSendToken("")
      setReceiverDDW("");
      alert("Tokens Sent");
  }

    const ensResolver = async (address) => {
          try {
              const { ethereum } = window;
              if (ethereum) {
                const provider = new ethers.providers.AlchemyProvider("homestead", "4wlQK3465FOi2-e6cVdJ9Keieb3ztXli")
                                  const resAddress = await provider.resolveName(address);
                  return resAddress
              }
          } catch (error) {
              console.log(error);
              return null
          }
    }

    const sendSearchValue =async(e) => {
      e.preventDefault();
      var address = await ensResolver(searchValue)
      console.log(searchValue)
      console.log(address)
      if(!address){
        var mongo_res = await axios.get(process.env.REACT_APP_MONGODB_API_ENDPOINT + `discordName/${searchValue}`);
        if(!mongo_res.data){
          alert("This Discord Account is not Registered")
          document.getElementById("searchDiscord").value = "";
          setsearchValue("")
          return;
        }
        address = mongo_res.data.walletAddress;
      }
      var search_ipfsCid = "";
      if(mongo_res.data.blockchain === "eth")
      {  
        if(!(await app_read_contract_eth.is_account_registered(address))) return;
        search_ipfsCid = await app_read_contract_eth.get_user_details(address);
      }
      else if(mongo_res.data.blockchain === "matic")
      {
        if(!(await app_read_contract_matic.is_account_registered(address))) return;
        search_ipfsCid = await app_read_contract_matic.get_user_details(address);
      }
      if(search_ipfsCid === "") return;
      var files = await read_from_ipfs(search_ipfsCid, "userInfo.json");
      if(files[0]) {
        files = files[1];
      console.log(files);
      var searchDetails = {};
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = function() {
      searchDetails = JSON.parse(reader.result);
      console.log(searchDetails);
      read_from_ipfs(searchDetails.image, "avatar.png").then((search_image_files) => {
          var search_image_src = null;
          if(search_image_files[0])
          search_image_src = window.URL.createObjectURL(search_image_files[1][0]);
          else
          search_image_src = search_image_files[1];
          searchDetails.src = search_image_src;
          navigate('/Searchprofile', {state: {searchData: searchDetails, userDetails: location.state.userDetails, imageSrc: location.state.imageSrc}})
        })
      }
      }
      else {
        var searchDetails = files[1];
        console.log(searchDetails);
        read_from_ipfs(searchDetails.image, "avatar.png").then((search_image_files) => {
          var search_image_src = null;
          if(search_image_files[0])
          search_image_src = window.URL.createObjectURL(search_image_files[1][0]);
          else
          search_image_src = search_image_files[1];
          searchDetails.src = search_image_src;
          navigate('/Searchprofile', {state: {searchData: searchDetails, userDetails: location.state.userDetails, imageSrc: location.state.imageSrc}})
        })
      }
    }

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
          <input  type="text" placeholder="Username" onChange={handlesearchchange}/>
          </div>
          <button className="slide buttonContainer" onClick={sendSearchValue}>&nbsp;</button>
          </div>
          <span>Claim DDW Tokens</span>
          <div className='inputContainer'>
          <div className="input-group input">
          <input  type="text" id="inputVal" placeholder="Enter Approval Token Amount" onChange={handleAPPTokenAmountChange}/>
          </div>
          <button className="slide buttonContainer" onClick={onTokenClaimTransactionSubmit}>&nbsp;</button>
          </div>
          <span>Send DDW Tokens</span>
          <div id='inputContainer'>
          <div className='inputContainer'>
          <div className="input-group input">
          <input  type="text" id="enteredAmt" placeholder="Enter DDW Token Amount" onChange={handleDDWTokenAmountChange}/>
          </div>
          </div>
          <div className='inputContainer'>
          <div className="input-group input">
          <input  type="text" id="recipientAddress" placeholder="Enter Recipient address" onChange={handleRecDDWTokenAddressChange} />
          </div>
          <button className="slide buttonContainer" onClick={onDDWTokenTransactionSubmit}>&nbsp;</button>
          </div>
          </div>
        </div>
        </div>
      </div> </>
  )
}

export default MyProfile