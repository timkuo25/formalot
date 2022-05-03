import React, { useState } from "react";

const ButtonGroup = ({ buttons, btnFunc, defaultvalue}) => {
  let stateval = -1
  for(let i=0; i<buttons.length; i++){
    if(defaultvalue===buttons[i]){
      stateval=i
    }
  }
  const [clickedId, setClickedId] = useState(stateval);
  const handleClick = (event, id) => {
    setClickedId(id);
    btnFunc(event);
  };
  return (
    <>
      {buttons.map((buttonLabel, i) => (
        <button 
          key={i}
          name={buttonLabel}
          onClick={(event) => handleClick(event, i)}
          className={i === clickedId ? "BtnGroup BtnGroupActive" : "BtnGroup"}
        >
          {buttonLabel}
        </button>
      ))}
    </>
  );
};

export { ButtonGroup };