import React from 'react'
import "./Button.css"
const Button = (props) => {
  return (
    <>
    <a href={props.link}>
      <div className="button">
        <i className="fa fa-solid fa-play fa-2x"></i>
        <p id = "paragraph">
        {props.buttonText}
      </p>

      </div>
  </a>
    </>
  )
}

export default Button