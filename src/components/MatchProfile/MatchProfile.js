import {React, useState} from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
import "./MatchProfile.css"
import OriginButton from '../../Helpers/originButton/OriginButton'

const MatchProfile = () => {
    const [matchDetails, setMatchDetails] = useState("location.state.matchData");
    const [userDetails, setuserDetails] = useState("location.state.userDetails");
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

    const startVC = async () => {
        if(!Number.isInteger(parseInt(VCTime))){
        alert("Enter correct number in the field");
        return}
        var isItRightWallet = true
        if(!isItRightWallet) {
            alert(`Wrong Wallet. You should switch to ${userDetails.wallet}`);
            return;
        }
          
          document.getElementById("VCTime").value = "";
          setVCTime("")
          alert("Private VC Created, check the Discord Server ;)");
    }


  return (
    <>
    <div className = "main">
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
    <p className='gapClassName' >matchDetails.interest</p>
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
    <OriginButton buttonText = "Back" />
  </div>

        </div>
    </>
  )
}

export default MatchProfile

