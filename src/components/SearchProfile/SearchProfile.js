import React, {useState} from 'react'
import OriginButton from '../../Helpers/originButton/OriginButton'
import { useLocation, useNavigate } from 'react-router-dom'
import "./SearchProfile.css"

const SearchProfile = () => {
    // const navigate = useNavigate();
    // const location = useLocation();
    const [searchDetails, setSearchDetails] = useState("location.state.searchData");
    const [userDetails, setuserDetails] = useState("location.state.userDetails");
    const [classNameValue, setClassNameValue] = useState("")

    const handleClassNameValueLike = () =>{
        setClassNameValue("rotateProfileElement")
    }
    const handleClassNameValueSuperLike = () => {
        setClassNameValue("rotateProfileElementEaseInOut")
    }

    const onLike = async() => {
        var isItRightWallet = true;
        if(!isItRightWallet) {
            alert(`Wrong Wallet. You should switch to ${userDetails.wallet}`);
            return;
        }
        alert("Liked, now see if they like you back ;)");
        // navigate('/Userdashboard', {state: {userDetails: userDetails, imageSrc: "location.state.imageSrc"}});

    }

    const onSuperLike = async() => {
        var isItRightWallet = true;
        if(!isItRightWallet) {
            alert(`Wrong Wallet. You should switch to ${userDetails.wallet}`);
            return;
        }
        alert("Super Liked, now see if they like you back ;)");
        // navigate('/Userdashboard', {state: {userDetails: userDetails, imageSrc: location.state.imageSrc}});

    }
  return (
    <>
    
    <div style={{marginTop: "6em", display : "flex", justifyContent : "center", alignItems : "center"}} id='containingsearchprofile'>
              <img style={{marginRight: "9em"}} id='profile-pic' className="profile-pic hoverStyle"
      src="https://cdn.discordapp.com/attachments/963207924656795680/1027005573499199609/3982230923_Gigachad.png"
      alt='profile-image' />
      <h1>
          Bio <span>{`Bio : ${searchDetails.bio}`} </span>
      </h1>
      <h1>
          Gender <span>{`Gender : ${searchDetails.gender}`}</span>
      </h1>
      <h1>
          Interest <span>{`Interest : ${searchDetails.interest}`}</span>
      </h1>
      <div className='containerbuttonvalue'>
    <OriginButton buttonText = "Like"/>
    <OriginButton buttonText = "back"/>
    <OriginButton buttonText = "Super Like"/>
    </div>
    </div>
    </>
  )
}

export default SearchProfile