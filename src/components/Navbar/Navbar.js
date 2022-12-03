import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import detectEthereumProvider from '@metamask/detect-provider';
import { accountChangeHandler, chainChangedHandler, checkAndGetAddress, checkCorrectNetwork, ConnectWalletHandler } from "../../Helper/contract";
import { read_from_ipfs } from "../../Helper/web3storage"
import OriginButton from '../../Helper/originButton/OriginButton'
import Button from '../Button/Button'
import "./Navbar.css"
import { shorten_address } from '../../Helper/utilities';
import { app_read_contract_matic } from '../../Helper/polygon/readContract';
import { app_read_contract_eth } from '../../Helper/ethereum/readContract';

const Navbar = () => {
    useEffect(() => {
        handleDiscordData();
      },[]);
      const [discordName, setDiscordName] = useState("Set Discord");
      const [discordId, setDiscordId] = useState(null);
      const [metamaskWalletAddress, setMetamaskWalletAddress] = useState(" Polygon");
      const [ethereumWalletAddress, setEthereumWalletAddress] = useState(" Ethereum");
      const [blockchain, setBlockchain] = useState(null);
      const [discordConnected, setDiscordConnected] = useState(false);
      const [walletConnected, setWalletConnected] = useState(false);
      const navigate = useNavigate();
      const [loginBoolValueChange, setLoginBoolValueChange] = useState(false) 
      const [registerBoolValueChange, setRegisterBoolValueChange] = useState(false)

      function handleDiscordData() {
        const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            if (!params.code) return;
            getInfo(params.code);
      }
      
      async function walletLoginMetamask() {
        if(blockchain==="eth") {
          alert("Can only Register with one Blockchain");
          window.location.reload();
          return;
        }
        await checkCorrectNetwork("matic");
        let returnArray = await ConnectWalletHandler();
        setMetamaskWalletAddress(returnArray[0]);
        setWalletConnected(true);
        setBlockchain("matic");
        return returnArray[0];
      }
    
      async function walletLoginEthereum() {
        if(blockchain==="matic") {
          alert("Can only Register with one Blockchain");
          window.location.reload();
          return;
        }
        await checkCorrectNetwork("eth");
        let returnArray = await ConnectWalletHandler();
        setMetamaskWalletAddress(returnArray[0]);
        setWalletConnected(true);
        setBlockchain("eth");
        return returnArray[0];
      }

      async function loginWithMetamask() {
        let accountAddress = await checkAndGetAddress("matic");
        console.log(accountAddress)
    
        if(!accountAddress) return null;
    
        var resource = await app_read_contract_matic.is_account_registered(accountAddress);
        if(!resource) {
          alert("You are not Registered");
          return;
        }
        var user_details = await app_read_contract_matic.get_user_details(accountAddress);
        var files = await read_from_ipfs(user_details, "userInfo.json");
        if(files[0]) {
          files = files[1]
          console.log(files);
          var userDetails = {};
          let reader = new FileReader();
          reader.readAsText(files[0]);
          reader.onload = function() {
          userDetails = JSON.parse(reader.result);
          console.log(userDetails);
          read_from_ipfs(userDetails.image, "avatar.png").then((image_files) => {
            if(image_files[0])
            navigate("/Userdashboard", {state: {userDetails: userDetails, imageSrc: window.URL.createObjectURL(image_files[1][0])}});
            else
            navigate("/Userdashboard", {state: {userDetails: userDetails, imageSrc: image_files[1]}});
          })
          };
        }
        else {
          userDetails = files[1];
          console.log(userDetails);
          read_from_ipfs(userDetails.image, "avatar.png").then((image_files) => {
            if(image_files[0])
            navigate("/Userdashboard", {state: {userDetails: userDetails, imageSrc: window.URL.createObjectURL(image_files[1][0])}});
            else
            navigate("/Userdashboard", {state: {userDetails: userDetails, imageSrc: image_files[1]}});
          })
        }
      }

      async function loginWithEth() {
        let accountAddress = await checkAndGetAddress("eth");
        console.log(accountAddress)
    
        if(!accountAddress) return null;
    
        var resource = await app_read_contract_eth.is_account_registered(accountAddress);
        if(!resource) {
          alert("You are not Registered");
          return;
        }
        var user_details = await app_read_contract_eth.get_user_details(accountAddress);
        var files = await read_from_ipfs(user_details, "userInfo.json");
        if(files[0]) {
          files = files[1]
          console.log(files);
          var userDetails = {};
          let reader = new FileReader();
          reader.readAsText(files[0]);
          reader.onload = function() {
          userDetails = JSON.parse(reader.result);
          console.log(userDetails);
          read_from_ipfs(userDetails.image, "avatar.png").then((image_files) => {
            if(image_files[0])
            navigate("/Userdashboard", {state: {userDetails: userDetails, imageSrc: window.URL.createObjectURL(image_files[1][0])}});
            else
            navigate("/Userdashboard", {state: {userDetails: userDetails, imageSrc: image_files[1]}});
          })
          };
        }
        else {
          userDetails = files[1];
          console.log(userDetails);
          read_from_ipfs(userDetails.image, "avatar.png").then((image_files) => {
            if(image_files[0])
            navigate("/Userdashboard", {state: {userDetails: userDetails, imageSrc: window.URL.createObjectURL(image_files[1][0])}});
            else
            navigate("/Userdashboard", {state: {userDetails: userDetails, imageSrc: image_files[1]}});
          })
        }
      }
    
    
      async function onProceed() {
        if(walletConnected && discordConnected) {
          navigate("/Profile", { state: { name: discordName, blockchain: blockchain, id: discordId, wallet: blockchain==="matic"?metamaskWalletAddress:ethereumWalletAddress } })
          }
          else
          alert("Connect Wallet and Discord to Proceed");
      }
    
      const getInfo = async (code) => {
        const accessToken = await getToken(code);
        const userInfo = await getUserInfo(accessToken);
        const guildInfo = await getUserGuilds(accessToken);
        console.log({ userInfo, guildInfo });
        setDiscordName(`${userInfo.username}#${userInfo.discriminator}`)
        setDiscordId(userInfo.id)
        var inGuild = false;
        guildInfo.every(element => {
          if(element.id === process.env.REACT_APP_GUILD_ID){
            inGuild = true;
            setDiscordConnected(true);
            console.log("InGuild")
            return false;
          }
          return true;
        });
        if(inGuild === false){
          alert("You are not in the server, first join")
          window.location.reload();
        }
        var mongo_res = await axios.get(process.env.REACT_APP_MONGODB_API_ENDPOINT + `discordName/${userInfo.username}#${userInfo.discriminator}`);
        if(mongo_res.data){
          alert("This Discord Account is Already Registered")
          window.location.reload()
        }
    }
    
    const getToken = async (code) => {
      try {
          const options = new URLSearchParams({
              client_id: process.env.REACT_APP_CLIENT_ID,
              client_secret: process.env.REACT_APP_CLIENT_SECRET,
              code,
              grant_type: 'authorization_code',
              redirect_uri: window.location.href.split('?')[0].slice(0, -1),
              scope: 'identify guilds',
          });
          const result = await axios.post('https://discord.com/api/oauth2/token', options);
          return result;
      } catch (error) {
          console.log(error.message);
      }
    }
    const getUserInfo = async (accessToken) => {
      // console.log(accessToken);
      // console.log(`User ${accessToken.data.token_type} ${accessToken.data.access_token}`);
      try {
          const response = await axios.get('https://discord.com/api/users/@me', {
              headers: {
                  authorization: `${accessToken.data.token_type} ${accessToken.data.access_token}`
              }
          });
          // console.log(response.data);
          return response.data;
      } catch (error) {
          console.log(error.message);
      }
    }
    const getUserGuilds = async (accessToken) => {
      // console.log(`Guild ${accessToken.data.token_type} ${accessToken.data.access_token}`);
      try {
          const response = await axios.get('https://discord.com/api/users/@me/guilds', {
              headers: {
                  authorization: `${accessToken.data.token_type} ${accessToken.data.access_token}`
              }
          });
          // console.log(response.data);
          return response.data;
      } catch (error) {
          console.log(error.message);
      }
    }
    
    detectEthereumProvider().then((provider) => {
      provider.on("accountsChanged", async (newAccount) => {blockchain === "matic"?setMetamaskWalletAddress( await accountChangeHandler(newAccount)):setEthereumWalletAddress(await accountChangeHandler(newAccount))});
      provider.on("chainChanged", chainChangedHandler);
    });

  return (
    <>
    <div className = "navbarContainer">
        <div id = {registerBoolValueChange ? "gone" : ""}  onClick={() => setLoginBoolValueChange(!loginBoolValueChange)}>
        <OriginButton  buttonText = {loginBoolValueChange ? "Close" : "Login"} />
        </div>
        <div id = {loginBoolValueChange ? "" : "gone"}>
        <Button buttonText = " Ethereum" onClick={loginWithEth}/>
        <Button buttonText = " Polygon" onClick={loginWithMetamask}/>
    </div>
    <div id = {loginBoolValueChange ? "gone" : ""} onClick={() => setRegisterBoolValueChange(!registerBoolValueChange)}>
        <OriginButton buttonText = {registerBoolValueChange ? "Close" : "Register"}/>
        </div>
        <div id = {registerBoolValueChange ? "" : "gone"}>
        <Button buttonText = "Join Discord" />
        <Button link = {process.env.REACT_APP_OAUTH_LINK} buttonText = {discordName} />
        <Button buttonText = {shorten_address(metamaskWalletAddress)} onClick={walletLoginMetamask} />
        <Button buttonText = {shorten_address(ethereumWalletAddress)} onClick={walletLoginEthereum} />
        </div>
        <OriginButton onClick={onProceed} buttonText = "Proceed"/>
    </div>
    </>
  )
}

export default Navbar