import React, {useState} from 'react'
import OriginButton from '../../Helper/originButton/OriginButton'
import { useLocation, useNavigate } from 'react-router-dom'
import "./SearchProfile.css"
import { createDDWAppWriteContractMatic } from '../../Helper/polygon/writeContract'
import { createDDWAppWriteContractEth } from '../../Helper/ethereum/writeContract'
import { isWalletCorrect } from '../../Helper/contract'

const SearchProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchDetails, setSearchDetails] = useState(location.state.searchData);
    const [userDetails, setuserDetails] = useState(location.state.userDetails);
    const [classNameValue, setClassNameValue] = useState("")
    const [textChange, setTextChange] = useState(false)
    const handleClassNameValueLike = () =>{
        setClassNameValue("rotateProfileElement")
    }
    const handleClassNameValueSuperLike = () => {
        setClassNameValue("rotateProfileElementEaseInOut")
    }

    const onLike = async() => {
        if(userDetails.blockchain === "eth") {
            var isItRightWallet = await isWalletCorrect(userDetails.wallet, "eth");
            if(!isItRightWallet) {
                alert(`Wrong Wallet. You should switch to ${userDetails.wallet}`);
                return;
            }
            var Contract = createDDWAppWriteContractEth();
            try {
                let nftTx = await Contract.like_on_chain(searchDetails.wallet);
                console.log("Mining....", nftTx.hash);
                } catch (error) {
                console.log("Error like on chain", error);
                return;
                }
        }
        else if(userDetails.blockchain === "matic") {
            var isItRightWallet = await isWalletCorrect(userDetails.wallet, "matic");
            if(!isItRightWallet) {
                alert(`Wrong Wallet. You should switch to ${userDetails.wallet}`);
                return;
            }
            var Contract = createDDWAppWriteContractMatic();
            try {
                let nftTx = await Contract.like_on_chain(searchDetails.wallet);
                console.log("Mining....", nftTx.hash);
                } catch (error) {
                console.log("Error like on chain", error);
                return;
                }
        }
        alert("Liked, now see if they like you back ;)");
        navigate('/Userdashboard', {state: {userDetails: userDetails, imageSrc: location.state.imageSrc}});

    }

    const onSuperLike = async() => {
        var isItRightWallet = true;
        if(!isItRightWallet) {
            alert(`Wrong Wallet. You should switch to ${userDetails.wallet}`);
            return;
        }
        alert("Super Liked, now see if they like you back ;)");
        navigate('/Userdashboard', {state: {userDetails: userDetails, imageSrc: location.state.imageSrc}});

    }

    const API_KEY = "ckey_9511551458cd4d2bbc47f1f1a15"
    const [apiRespArray, setApiRespArray] = useState([])
    const getPortfolio = async () => {
    const url = `https://api.covalenthq.com/v1/1/address/0x797eF74d45DaAEbD7ad0567E4b1BB5a03F51b31d/portfolio_v2/?key=${API_KEY}` ;
    let response = await fetch(url);
    let data = await response.json()
    setApiRespArray(data.data.items)
    setTextChange(!textChange)
    }

  return (
    <>    
    <div style={{marginTop: "6em", display : "flex", justifyContent : "center", alignItems : "center"}} id='containingsearchprofile'>
              <img style={{marginRight: "9em"}} id='profile-pic' className="profile-pic hoverStyle"
      src={location.state.imageSrc}
      alt='profile-image' />
      <h1>
           <span>{`Bio : ${searchDetails.bio}`} </span>
      </h1>
      <h1>
           <span>{`Gender : ${searchDetails.gender}`}</span>
      </h1>
      <h1>
           <span>{`Interest : ${searchDetails.interest}`}</span>
      </h1>
      <div className='containerbuttonvalue'>
    <OriginButton buttonText = "Like" onClick={onLike}/>
    <OriginButton buttonText = "back" onClick={(e) => navigate('/Userdashboard', {state: {userDetails: userDetails, imageSrc: location.state.imageSrc}})}/>
    <OriginButton buttonText = "Super Like" onClick={onSuperLike}/>
    </div>
    <OriginButton buttonText = {!textChange ? "Show Dashboard" : "Close"} onClick = {() => getPortfolio()}/>
    </div>
    <div style={{visibility:textChange ? "visible" : "hidden"}}  id='columnContainerValue'>
    {apiRespArray.map((element) => {
                return (
                    <>
                <div key={element.logo_url}>
                    <img height={80} width={80} 
                        id='mapImages'
                    src={element.logo_url
                            ? element.logo_url
                            : "www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png"} alt="" />
                    <span style={{color: "white"}}><h1> {(element.balance / Math.pow(10, 18)).toFixed(4)}</h1></span>
                </div>
                </>
                )
                })}
    </div>

    </>
  )
}

export default SearchProfile