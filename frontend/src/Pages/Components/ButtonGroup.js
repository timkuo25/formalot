import React, { useState } from "react";

const ButtonGroup = ({ buttons, btnFunc}) => {
  const [clickedId, setClickedId] = useState(-1);
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