import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ButtonGroup = ({ buttons, btnFunc, defaultvalue}) => {
  const { t, i18n } = useTranslation();
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
          {t(buttonLabel)}
        </button>
      ))}
    </>
  );
};

export { ButtonGroup };