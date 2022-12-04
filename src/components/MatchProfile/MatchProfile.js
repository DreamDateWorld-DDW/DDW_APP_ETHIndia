import {React, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import "./MatchProfile.css"
import OriginButton from '../../Helper/originButton/OriginButton'
import { HuddleIframe, IframeConfig } from "@huddle01/huddle01-iframe";
import { Chat } from "@pushprotocol/uiweb";
import { createDDWAppWriteContractMatic, createDDWTokenWriteContractMatic } from '../../Helper/polygon/writeContract';
import { createDDWAppWriteContractEth, createDDWTokenWriteContractEth } from '../../Helper/ethereum/writeContract';
import { isWalletCorrect } from '../../Helper/contract'
import { app_read_contract_eth } from '../../Helper/ethereum/readContract';
import { app_read_contract_matic } from '../../Helper/polygon/readContract';

const MatchProfile = () => {

  const iframeConfig = {
    roomUrl: "https://iframe.huddle01.com/qazwsxedc",
    height: "130%",
    width: "100%",
    noBorder: true
  };
    const navigate = useNavigate();
    const location = useLocation();
    const [isChatAndVcVisible, setisChatAndVcVisible] = useState(false);
    const [matchDetails, setMatchDetails] = useState(location.state.matchData);
    const [userDetails, setuserDetails] = useState(location.state.userDetails);
    const [VCTime, setVCTime] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseOver = () => {
      setIsHovering(true);
    };
  
    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const handleTimeEntry = async (e) => {
        setVCTime(e.target.value);
    }

    const countDownTimer = (VCTime) =>{
      let countDownInterval = setInterval(function(){
      console.log(VCTime);
      VCTime--
      if (VCTime === 0) {
        console.log("Cleared");
        setisChatAndVcVisible(false);
        clearInterval(countDownInterval);
      }
      }, 1000);
    }

    const startVC = async () => {
      setisChatAndVcVisible(true);

        if(!Number.isInteger(parseInt(VCTime))){
        alert("Enter correct number in the field");
        return}
        if(userDetails.blockchain === "eth") {
          var isItRightWallet = await isWalletCorrect(userDetails.wallet, "eth");
          if(!isItRightWallet) {
              alert(`Wrong Wallet. You should switch to ${userDetails.wallet}`);
              return;
          }
          var DDWContract = createDDWTokenWriteContractEth();
          try {
              let COINS_PER_MIN = await app_read_contract_eth.COINS_PER_MINUTE_OF_PRIVATE_SPACE();
              let nftTx = await DDWContract.increaseAllowance(process.env.REACT_APP_DDWAPP_CONTRACT_ADDRESS, COINS_PER_MIN.mul(parseInt(VCTime)));
              console.log("Mining....", nftTx.hash);
              } catch (error) {
              console.log("Error increase allowance", error);
              return;
              }
          var Contract = createDDWAppWriteContractEth();
          try {
              let nftTx = await Contract.create_private_space_on_chain(matchDetails.wallet, parseInt(VCTime));
              console.log("Mining....", nftTx.hash);
              } catch (error) {
              console.log("Error create private space", error);
              return;
              }
      }
      else if(userDetails.blockchain === "matic") {
          var isItRightWallet = await isWalletCorrect(userDetails.wallet, "matic");
          if(!isItRightWallet) {
              alert(`Wrong Wallet. You should switch to ${userDetails.wallet}`);
              return;
          }
          var DDWContract = createDDWTokenWriteContractMatic();
          try {
              let COINS_PER_MIN = await app_read_contract_matic.COINS_PER_MINUTE_OF_PRIVATE_SPACE();
              let nftTx = await DDWContract.increaseAllowance(process.env.REACT_APP_DDWAPP_CONTRACT_ADDRESS, COINS_PER_MIN.mul(parseInt(VCTime)));
              console.log("Mining....", nftTx.hash);
              } catch (error) {
              console.log("Error increase allowance", error);
              return;
              }
          var Contract = createDDWAppWriteContractMatic();
          try {
              let nftTx = await Contract.create_private_space_on_chain(matchDetails.wallet, parseInt(VCTime));
              console.log("Mining....", nftTx.hash);
              } catch (error) {
              console.log("Error create private space", error);
              return;
              }
      }
          // document.getElementById("VCTime").value = "";
          setVCTime("")
          alert("Private VC Created, check the Discord Server ;)");
          countDownTimer(VCTime*60);
    }


  return (
    <>

    {!isChatAndVcVisible && (<div id = {isChatAndVcVisible ? "gone" : ""} className = "main">

    <img className="profile-pic"
      src="https://cdn.discordapp.com/attachments/963207924656795680/1027005573499199609/3982230923_Gigachad.png"
      alt='profile-image' 
      onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}/>
      {isHovering && (
        <div id='mouseOverId'>
        <h3>name {matchDetails.name}</h3>
        <h3>lastseen={matchDetails.lastseen}</h3>
        </div>
      )}
    <h2 className='gapClassName' >Interests</h2>
    <p className='gapClassName' >{matchDetails.interest.join(', ')}</p>
    <h2 className='gapClassName' >Bio</h2>
    <p className='gapClassName' >{matchDetails.bio}</p>
    <h2 className='gapClassName' >Gender</h2>
    <p className='gapClassName' >{matchDetails.gender}</p>

        <div className='' id = "containerStyling">
        <h2 id='vcHeading'>Enter VC time</h2>
		<div className="input-group input">
			<input  type="text" placeholder="time in min" onChange={handleTimeEntry}/>
		</div>
        </div>
        <div className="section">
    <OriginButton buttonText = "Start VC" onClick={startVC} />
    <OriginButton buttonText = "Back" onClick={(e) => navigate('/Userdashboard', {state: {userDetails: userDetails, imageSrc: location.state.imageSrc}})}/>
  </div>

        </div>)}
        {isChatAndVcVisible && (<div id = "visibleHuddle">
            <HuddleIframe config={iframeConfig} />
        </div>)}
            {isChatAndVcVisible && (<Chat
   account={userDetails.wallet}
   supportAddress={matchDetails.wallet}
   apiKey={process.env.REACT_APP_PUSH_API_KEY}
    env="staging"
 />)}

    </>
  )
}

export default MatchProfile

