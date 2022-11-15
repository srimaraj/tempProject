import React, { useState } from "react";
import COLORS from "../../Utils/colors";
import useIsMobile from "../../Utils/isMobile";
import "./style.css";

function Card({ userData, userInput, index, focusedIndex, setFocusedIndex }) {
  const [isHover, setIsHover] = useState(false);
  const { name, address, pincode, id, items } = userData;
  const isMobile = useIsMobile();

  //FUNCTION TO HIGHLIGHT THE "MATCHED" SECTION
  const getHighlightedText = (text, highlight = userInput) => {
    if (typeof text !== "string") {
      //checking for items: which is an array
      for (let item of text) {
        if (item.includes(text) && highlight !== "") {
          return (
            <p style={{ justifyContent: "center", alignItems: "center" }}>
              {`● "${highlight}" found in Items`}
            </p>
          );
        }
      }
      return;
    }
    //IF USER INPUT(AFTER TRIM) IS EMPTY , SHOW THE TEXT AS IS, WITHOUT ANY HIGHLIGHT
    if (highlight === "") {
      return <p>{text}</p>;
    }
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { fontWeight: "bold", color: COLORS.DARK_BLUE }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  function MouseOver(event) {
    setIsHover(true);
    //IF USER IS HOVERING: MOUSE TAKES PRORITY: RESET THE FOCUSEDINDEX
    setFocusedIndex(-1);
  }
  function MouseOut(event) {
    setIsHover(false);
  }

  return (
    <div
      className={"card-container"}
      style={{
        backgroundColor:
          index === focusedIndex || isHover
            ? COLORS.LIGHT_YELLOW
            : COLORS.LIGHT_GREY,
      }}
      key={id}
      // THE IDEA IS , IF WEB: HIGHLIGHT THE CARD ON MOUSE HOVER/ KEYBOARD PRESS(UP/DOWN). FOR MOBILE: HIGHLIGHT ON TOUCH(START END)
      onTouchStart={(e) => {
        if (isMobile) {
          MouseOver(e);
        }
      }}
      onTouchEnd={(e) => {
        if (isMobile) {
          MouseOver(e);
        }
      }}
      onMouseOver={MouseOver}
      onMouseOut={MouseOut}
    >
      <h4>{getHighlightedText(id)}</h4>
      <p style={{ fontStyle: "italic" }}> {getHighlightedText(name)}</p>
      <p>{getHighlightedText(items)}</p>
      <p>{getHighlightedText(address + ", " + pincode)}</p>
    </div>
  );
}

export default Card;
