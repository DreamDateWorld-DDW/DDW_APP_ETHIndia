import React from 'react'
import "./LogoStyle.css"
import LogoImage from "../../Helper/Logo.png"
const Logo = () => {
  return (
    <>
        <span id='LogoSpan'>
        <img height={100} width={100} src={LogoImage} alt="Logo" />
        </span>
    </>
  )
}

export default Logo