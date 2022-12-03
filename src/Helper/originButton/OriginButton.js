import React from 'react'
import "./OriginButton.css"
const OriginButton = (props) => {
  return (
    <>
  <ul id={props.idValue} className='topListing' >
    <h1 className='secondListing' style={{fontWeight : "15em"}}>
      {props.buttonText}
      <span></span><span></span><span></span><span></span>
    </h1>
  </ul>
    </>
  )
}

export default OriginButton