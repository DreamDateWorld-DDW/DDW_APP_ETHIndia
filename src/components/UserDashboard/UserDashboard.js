import React from 'react'
import { useLocation } from 'react-router-dom';
import MyProfile from '../MyProfile/MyProfile'
import "./UserDashboard.css"
const UserDasBoard = () => {

  const location = useLocation();
    
  return (
    <>
    <div className='wrapContent'>
      <div id='borderContainer'>
      <MyProfile location={location}/>
      <div id='imageTagContainer'>
        <h1>Matches</h1>
      <img id='profile-pic' className="profile-pic"
      src="https://cdn.discordapp.com/attachments/963207924656795680/1027005573499199609/3982230923_Gigachad.png"
      alt='profile-image' />

      </div>
      </div>
    </div>
    </>
  )
}

export default UserDasBoard