import React, { useState, useEffect } from 'react'
// import { useNavigate } from "react-router-dom";
import axios from 'axios';
import detectEthereumProvider from '@metamask/detect-provider';
import { accountChangeHandler, chainChangedHandler, checkCorrectNetwork, ConnectWalletHandler } from "../../Helpers/contract";
import { read_from_ipfs } from "../../Helpers/web3storage"
import OriginButton from '../../Helpers/originButton/OriginButton'
import Button from '../Button/Button'
import "./Navbar.css"

const Navbar = () => {
    useEffect(() => {
        handleDiscordData();
      },[]);
      const [discordName, setDiscordName] = useState("Set Discord");
      const [discordId, setDiscordId] = useState(null);
      const [metamaskWalletAddress, setMetamaskWalletAddress] = useState(" Metamask");
      const [blockchain, setBlockchain] = useState(null);
      const [discordConnected, setDiscordConnected] = useState(false);
      const [walletConnected, setWalletConnected] = useState(false);
    //   const navigate = useNavigate();
      const [loginBoolValueChange, setLoginBoolValueChange] = useState(false) 
      const [registerBoolValueChange, setRegisterBoolValueChange] = useState(false)

      function handleDiscordData() {
        const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            if (!params.code) return;
            getInfo(params.code);
      }
      
      async function walletLoginMetamask() {
        if(blockchain==="ethereum") {
          alert("Can only Register with one Blockchain");
          window.location.reload();
          return;
        }
        await checkCorrectNetwork();
        let returnArray = await ConnectWalletHandler();
        setMetamaskWalletAddress(returnArray[0]);
        setWalletConnected(true);
        setBlockchain("metamask");
        return returnArray[0];
      }
    
    
    
      async function onProceed() {
        if(walletConnected && discordConnected) {
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
      provider.on("accountsChanged", async (newAccount) => {setMetamaskWalletAddress( await accountChangeHandler(newAccount))});
      provider.on("chainChanged", chainChangedHandler);
    });

  return (
    <>
    <div className = "navbarContainer">
        <div id = {registerBoolValueChange ? "gone" : ""}  onClick={() => setLoginBoolValueChange(!loginBoolValueChange)}>
        <OriginButton  buttonText = {loginBoolValueChange ? "Close" : "Login"} />
        </div>
        <div id = {loginBoolValueChange ? "" : "gone"}>
        <Button buttonText = " Ethereum" />
        <Button buttonText = " Metamask" />
    </div>
    <div id = {loginBoolValueChange ? "gone" : ""} onClick={() => setRegisterBoolValueChange(!registerBoolValueChange)}>
        <OriginButton buttonText = {registerBoolValueChange ? "Close" : "Register"}/>
        </div>
        <div id = {registerBoolValueChange ? "" : "gone"}>
        <Button buttonText = "Join Discord" />
        <Button link = {process.env.REACT_APP_OAUTH_LINK} buttonText = {discordName} />
        <Button buttonText = {metamaskWalletAddress} onClick={walletLoginMetamask} />
        <Button buttonText = {metamaskWalletAddress} onClick={walletLoginMetamask} />
        </div>
        <OriginButton onClick={onProceed} buttonText = "Proceed"/>
    </div>
    </>
  )
}

export default Navbar