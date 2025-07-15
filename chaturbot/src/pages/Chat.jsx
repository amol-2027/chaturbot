import React, { useContext, useEffect, useRef, useState } from "react";
import { dataContext, prevUser } from "../context/UserContext";
function LoadingDots() {
  return (
    <span className="loading-dots">
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </span>
  );
}

function formatTimestamp(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function Chat() {
  let {
    input,
    setInput,
    showResult,
    setShowResult,
    feature,
    setFeature,
    prevFeature,
    setPrevFeature,
    genImgUrl,
    setGenImgUrl,
  } = useContext(dataContext);

  // Chat history state
  const [chatHistory, setChatHistory] = useState([]);
  const prevShowResult = useRef("");
  const prevPrompt = useRef("");

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chaturbot_chat_history");
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("chaturbot_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Add user message to history when input changes and is sent
  useEffect(() => {
    if (prevPrompt.current !== prevUser.prompt && prevUser.prompt) {
      setChatHistory((history) => [
        ...history,
        {
          sender: "User",
          message: prevUser.prompt,
          timestamp: new Date(),
        },
      ]);
      prevPrompt.current = prevUser.prompt;
    }
  }, [prevUser.prompt]);

  // Add bot message to history when showResult changes
  useEffect(() => {
    if (prevShowResult.current !== showResult && showResult) {
      setChatHistory((history) => [
        ...history,
        {
          sender: "ChaturBot",
          message: showResult,
          timestamp: new Date(),
        },
      ]);
      prevShowResult.current = showResult;
    }
  }, [showResult]);

  // Download chat as .txt
  function downloadChatAsTxt() {
    let content = chatHistory
      .map(
        (msg) =>
          `[${formatTimestamp(msg.timestamp)}] ${msg.sender}: ${msg.message}`
      )
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chaturbot_chat.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="chat-page">
      <button
        className="download-chat-btn"
        onClick={downloadChatAsTxt}
        style={{ alignSelf: "flex-end", marginBottom: 8 }}
      >
        Download Chat (.txt)
      </button>
      <div className="user">
        {prevFeature == "upimg" ? (
          <>
            {" "}
            <img src={prevUser.imgUrl} alt="" />
            <span>{prevUser.prompt}</span>{" "}
          </>
        ) : (
          <span>{prevUser.prompt}</span>
        )}
      </div>
      <div className="ai">
        {prevFeature == "genimg" ? (
          <>
            {!(genImgUrl || prevUser.imgUrl) ? (
              <span className="typing-indicator">
                ChaturBot is typing
                <LoadingDots />
              </span>
            ) : (
              <img
                src={genImgUrl || prevUser.imgUrl}
                alt="Generated AI"
                className="ai-image"
                style={{ maxWidth: "300px", borderRadius: "20px" }}
              />
            )}
          </>
        ) : !showResult ? (
          <span className="typing-indicator">
            ChaturBot is typing
            <LoadingDots />
          </span>
        ) : (
          <span>{showResult}</span>
        )}
      </div>
    </div>
  );
}
export default Chat;
