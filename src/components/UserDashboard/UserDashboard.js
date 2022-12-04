import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { app_read_contract_eth } from '../../Helper/ethereum/readContract';
import { createDDWAppWriteContractEth } from '../../Helper/ethereum/writeContract';
import { app_read_contract_matic } from '../../Helper/polygon/readContract';
import { createDDWAppWriteContractMatic } from '../../Helper/polygon/writeContract';
import { read_from_ipfs } from '../../Helper/web3storage';
import Matchelement from '../MatchElement/MatchElement';
import MatchList from '../MatchList/MatchList';
import MyProfile from '../MyProfile/MyProfile'
import "./UserDashboard.css"
const UserDasBoard = () => {

  useEffect(()=>{
    loadMatchesData(wallet);
  }, []);

  const location = useLocation();
  var wallet = "location.state.userDetails.wallet";
  var blockchain = "location.state.userDetails.blockchain";
  const [matches, setMatches] = useState([]);

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
    else if(blockchain==="metamask")
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
            else if(blockchain === "metamask") {
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
    <div className='wrapContent'>
      <div id='borderContainer'>
      <MyProfile location={location}/>
      <div id='imageTagContainer'>
        <h1>Matches</h1>
      <MatchList matches={matches} userDetails={"location.state.userDetails"} imageSrc={"location.state.imageSrc"} />
      </div>
      </div>
    </div>
    </>
  )
}

export default UserDasBoard