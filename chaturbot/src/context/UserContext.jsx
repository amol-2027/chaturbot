import React, { createContext, useState } from "react";
export const dataContext = React.createContext();

export const user = {
  data: null,
  mime_type: null,
  imgUrl: null,
};
export const prevUser = {
  data: null,
  mime_type: null,
  prompt: null,
  imgUrl: null,
};

function UserContext({ children }) {
  const [startRes, setStartRes] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [input, setInput] = useState("");
  const [feature, setFeature] = useState("chat");
  const [showResult, setShowResult] = useState("");
  const [prevFeature, setPrevFeature] = useState("chat");
  const [genImgUrl, setGenImgUrl] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const value = {
    startRes,
    setStartRes,
    popUp,
    setPopUp,
    input,
    setInput,
    feature,
    setFeature,
    showResult,
    setShowResult,
    prevFeature,
    setPrevFeature,
    genImgUrl,
    setGenImgUrl,
    darkMode,
    setDarkMode,
    toggleDarkMode,
  };

  return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
}
export default UserContext;
