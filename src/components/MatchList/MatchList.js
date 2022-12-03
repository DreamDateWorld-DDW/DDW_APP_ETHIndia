import React from 'react'
import Matchelement from '../MatchElement/MatchElement';
import { useNavigate } from 'react-router-dom';

const MatchList = (props) => {
    const navigate = useNavigate();
    const handleOnClick = (matchData) => {
    navigate('/Matchprofile', { state: {matchData: matchData, userDetails: props.userDetails, imageSrc: props.imageSrc} })
    }
  return (
    <>
        <div className='match' style={{overflowY: "scroll"}}>
        {props.matches.map(c => <Matchelement key={c.id} name={c.name} src={c.src} lastseen={c.lastseen} onClick={[c, handleOnClick]} />)}
        </div>
    </>
  )
}

export default MatchList