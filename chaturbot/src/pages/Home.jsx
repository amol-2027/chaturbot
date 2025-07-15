import React, { useContext, useRef, useEffect } from "react";
import { RiAiGenerate2 } from "react-icons/ri";
import { LuImagePlus } from "react-icons/lu";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import "../App.css";
import { dataContext, prevUser, user } from "../context/UserContext.jsx";
import Chat from "./Chat";
import { generateResponse } from "../gemini.js";
import { query } from "../huggingFace.js";

function VoiceInput({ onResult, formRef }) {
  const [listening, setListening] = React.useState(false);
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setListening(false);
      // Submit the form after speech recognition ends and text is filled
      setTimeout(() => {
        if (formRef && formRef.current && transcript) {
          formRef.current.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
        }
      }, 100); // slight delay to ensure input is set
    };
    recognition.onerror = (event) => {
      alert("Speech recognition error: " + event.error);
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.start();
  };
  return (
    <button
      type="button"
      aria-label="Voice input"
      onClick={handleVoiceInput}
      className={listening ? "mic-listening" : ""}
      style={{
        background: listening ? "#a259ff" : "#2c3c3c",
        border: "none",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: "8px",
        cursor: "pointer",
        color: listening ? "#fff" : "#a259ff",
        fontSize: "22px",
        boxShadow: listening ? "0 0 16px 4px #a259ff88" : "none",
        transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
      }}
    >
      <FaMicrophone className={listening ? "mic-animate" : ""} />
    </button>
  );
}

function Home() {
  let {
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
    toggleDarkMode,
  } = useContext(dataContext);
  const formRef = useRef();
  const inputRef = useRef();
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);
  async function handleSubmit(e) {
    setStartRes(true);
    setPrevFeature(feature);

    setShowResult("");
    prevUser.data = user.data;
    prevUser.mime_type = user.mime_type;
    prevUser.imgUrl = user.imgUrl;
    prevUser.prompt = input;
    user.data = null;
    user.mime_type = null;

    user.imgUrl = null;
    setInput("");
    // Hardcoded funny replies
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("who made you")) {
      setShowResult("My master is Amol Rathod, the true genius 😎");
      setFeature("chat");
      return;
    }
    if (lowerInput.includes("are you single")) {
      setShowResult("I'm in a complicated relationship with amol!");
      setFeature("chat");
      return;
    }
    if (lowerInput.includes("tell me a joke")) {
      setShowResult(
        "Why did the developer go broke? Because he used up all his cache!"
      );
      setFeature("chat");
      return;
    }
    let result = await generateResponse();
    setShowResult(result);
    setFeature("chat");
  }

  function handleImage(e) {
    setFeature("upimg");
    let file = e.target.files[0];
    if (!file || !(file instanceof Blob)) {
      // Optionally, show an error or just return silently
      return;
    }
    let reader = new FileReader();
    reader.onload = (event) => {
      let base64 = event.target.result.split(",")[1];
      user.data = base64;
      user.mime_type = file.type;
      user.imgUrl = `data:${user.mime_type};base64,${user.data}`;
    };

    reader.readAsDataURL(file);
  }

  async function handleGenerateImg() {
    setStartRes(true);
    setPrevFeature("genimg");
    setGenImgUrl("");
    prevUser.prompt = input;
    try {
      let result = await query({ inputs: input });
      console.log("Blob type:", result.type);
      if (!result.type.startsWith("image/")) {
        result.text().then((text) => {
          console.log("Blob content (not an image):", text);
        });
      }
      let url = URL.createObjectURL(result);
      setGenImgUrl(url);
      prevUser.imgUrl = url; // Store image URL for chat persistence
      console.log("Image generated successfully:", url);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    setInput("");
    // setFeature("chat"); // keep this commented out
  }
  return (
    <div className={`home${darkMode ? " dark" : ""}`}>
      <nav>
        <div
          className="logo"
          onClick={() => {
            setFeature("chat");
            setStartRes(false);
          }}
        >
          Chatur - Smart AI bot
        </div>
        <button
          style={{
            marginLeft: "auto",
            padding: "8px 16px",
            borderRadius: "20px",
            border: "none",
            background: darkMode ? "#333" : "#eee",
            color: darkMode ? "#fff" : "#222",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "16px",
          }}
          onClick={toggleDarkMode}
        >
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </nav>
      <input
        type="file"
        accept="image/*"
        hidden
        id="inputImg"
        onChange={handleImage}
      />
      {!startRes ? (
        <div className="hero">
          <span id="tag">Kya main aapki help kar sakta hoon ?</span>
          <div className="cate">
            <div
              className="upImg"
              onClick={() => {
                document.getElementById("inputImg").click();
              }}
            >
              <LuImagePlus />
              <span>Upload Image</span>
            </div>
            <div className="genImg" onClick={() => setFeature("genimg")}>
              <RiAiGenerate2 />
              <span>Generate Image</span>
            </div>
            <div className="chat" onClick={() => setFeature("chat")}>
              <IoChatbubbleEllipsesOutline />
              <span>let's Chat</span>
            </div>
          </div>
        </div>
      ) : (
        <Chat />
      )}

      <form
        ref={formRef}
        className="input-box"
        onSubmit={(e) => {
          e.preventDefault();
          if (input) {
            if (feature == "genimg") {
              handleGenerateImg(e);
            } else {
              handleSubmit(e);
            }
            setInput(""); // Clear input after submit
          }
        }}
      >
        <VoiceInput onResult={setInput} formRef={formRef} />
        <img src={user.imgUrl} alt="" id="im" />
        {popUp ? (
          <div className="pop-up">
            <div
              className="select-up"
              onClick={() => {
                setPopUp(false);
                setFeature("chat");
                document.getElementById("inputImg").click();
              }}
            >
              <LuImagePlus />
              <span>Upload Image</span>
            </div>
            <div
              className="select-gen"
              onClick={() => {
                setPopUp(false);
                setFeature("genimg");
              }}
            >
              <RiAiGenerate2 />
              <span>Genrate Image</span>
            </div>
          </div>
        ) : null}

        <div id="add" onClick={() => setPopUp((prev) => !prev)}>
          {feature == "genimg" ? <RiAiGenerate2 id="genimg" /> : <FaPlus />}
        </div>
        <input
          type="text"
          placeholder="kuch puchna chaoge..?"
          onChange={(e) => setInput(e.target.value)}
          value={input}
          name="chatInput"
          ref={inputRef}
        />
        {input ? (
          <button id="submit">
            <FaArrowUp />
          </button>
        ) : null}
      </form>
    </div>
  );
}
export default Home;
