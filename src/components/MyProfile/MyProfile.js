import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { read_from_ipfs } from '../../Helper/web3storage';
import "./MyProfile.css"
const MyProfile = () => {
    const [visibilityDDW, setVisibilityDDW] = useState(false);
    const [visibilitySBT, setVisibilitySBT] = useState(false);
    // const location = useLocation();
    var wallet = "location.state.userDetails.wallet;"
    const [matches, setMatches] = useState([]);

    useEffect(()=>{
        loadMatchesData(wallet);
    }, []);

    const loadMatchesData = async (wallet) => {
        var likes_info = []
        if(!likes_info) return;
        var matchListOnChain = likes_info.data.matchedListOnChain;
        if(matchListOnChain.length === matches.length) return;
        console.log("matchList", matchListOnChain);
        var matchTimestampOnChain = likes_info.data.matchedTimestampListOnChain;
        console.log("matchTime", matchTimestampOnChain);
        var matchListValue = [];
        for(var index = 0; index < matchListOnChain.length; index++) {
                var match_info = []
                if(!match_info) {
                return;
                }
                console.log("loop index outside onload", index);
                var files = await read_from_ipfs(match_info.data.ipfsCid);
                console.log(files);
                var matchDetails = {};
                let reader = new FileReader();
                reader.readAsText(files[0]);
                reader.onload = async function() {
                matchDetails = JSON.parse(reader.result);
                var match_image_files = await read_from_ipfs(matchDetails.image)
                var match_image_src = window.URL.createObjectURL(match_image_files[0]);
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
    }

  return (
    <>

<div className="containerValue">
        <div className="profile_container">
          <div className="back"></div>
          <div className="profile"></div>
          <div className="profile_infos">
          <h1 className="name">Discord Name</h1>
          <h2 className="occupation">Wallet Address</h2>
          <h2 onClick={()=> setVisibilityDDW(!visibilityDDW)} className="TokenBalance">DDW Token balance </h2>
          <h2 className={visibilityDDW ? "" : "gone" }>balance</h2>
          <h2 onClick={()=> setVisibilitySBT(!visibilitySBT)} className="TokenBalance">SBT Token balance </h2>
          <h2 className={visibilitySBT ? "" : "gone" }>balance</h2>
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