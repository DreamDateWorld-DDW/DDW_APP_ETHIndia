import React from "react";

const Matchelement = (props) => {
  const handleOnClick = (e) => {
    e.preventDefault();
    props.onClick[1](props.onClick[0]);
  };

  return (
    <div onClick={handleOnClick} className="matches">
        <img
          id='profile-pic' className="profile-pic"
          src={props.src}
        />
        <h5 hidden={props.lastseen === "" ? true : false}>{props.lastseen}</h5>
        <h3>{props.name}</h3>
    </div>
  );
};

export default Matchelement;
