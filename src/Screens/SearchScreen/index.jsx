import React, { useEffect, useRef, useState } from "react";
import Card from "../../Components/Card";
import STRING_VALUES from "../../Utils/strings";
import "./style.css";

function SearchScreen() {
  const [usersList, setUsersList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const myRef = useRef();
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const url = "http://www.mocky.io/v2/5ba8efb23100007200c2750c";

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!myRef.current) return;
    myRef.current.scrollIntoView({ block: "center" });
  }, [focusedIndex]);

  //GET USER DATA FROM MOCK API:SHOW LOADING TILL DATA IS FETCHED
  const fetchUserData = async () => {
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //INITIALLY . SINCE SEARCH TEXT IS "", SET FILTERED DATA SAME AS THE USERES LIST
        setFilteredData(data);
        setUsersList(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  //FILTER USERSLIST AS PER THE USER ENTERD TEXT VALUE
  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    setUserInput(lowercasedValue);
    if (lowercasedValue === "") {
      setFilteredData(usersList);
    } else {
      const filteredList = usersList.filter((item) => {
        return Object.keys(item).some((key) =>
          item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });
      setFilteredData(filteredList);
    }
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    let nextFocusIndex = 0;
    if (key === "ArrowDown") {
      nextFocusIndex = focusedIndex + 1;
    } else if (key === "ArrowUp") {
      nextFocusIndex = focusedIndex - 1;
    } else if (key === "Enter") {
      //RESET FOCUS HEN ENTER IS PRESSED
      nextFocusIndex = -1;
    } else if (key === "Backspace" && userInput?.length === 1) {
      //RESET FOCUS IF USER INPUT IS CLEARED (TO "") , (CLEARED WITH BACKSAPCE)
      nextFocusIndex = -1;
    }
    setFocusedIndex(nextFocusIndex);
  };
  //SHOW LOADING TILL DATA IS FETCHED
  if (loading) {
    return <p>{STRING_VALUES.LOADING}</p>;
  }
  return (
    <div>
      <div
        tabIndex={1}
        onKeyDown={handleKeyDown}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <input
          className={"search"}
          type="text"
          onChange={(e) => {
            filterData(e.target.value);
          }}
          placeholder={STRING_VALUES.SEARCH_PLACEHOLDER}
        />
        <div ref={myRef}>
          {filteredData?.length ? (
            filteredData.map((user, index) => {
              return (
                <Card
                  ref={index === focusedIndex ? myRef : null}
                  userData={user}
                  userInput={userInput}
                  index={index}
                  focusedIndex={focusedIndex}
                  setFocusedIndex={setFocusedIndex}
                />
              );
            })
          ) : (
            // SHOW EMPTY FILTERED DATA
            <p>{STRING_VALUES.NO_USER_FOUND}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchScreen;
