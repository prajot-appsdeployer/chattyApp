import "./App.css";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";
import addNotification from "react-push-notification";

//this goes in .env file
const socket = io.connect("http://localhost:5000/");
const userName = nanoid(4);

function App() {
  const [user, setUser] = useState();

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  // const [notification, setNotification] = useState([]);

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat", { userName, message });
    socket.emit("send-notification", {
      senderName: user,
      message: message,
    });
    setMessage("");
  };

  useEffect(() => {
    socket.on("newUser", user);
    setUser(userName);
  }, [user]);

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload]);
    });
  });

  useEffect(() => {
    socket.on("get-notification", (data) => {
      // setNotification((prev) => [...prev, data]);
      console.log(data);
      addNotification({
        title: `Message from ${data.senderName} `,
        message: data.message,
        theme: "darkblue",
        onClick: () => (window.location = "https://www.google.com/"),
        native: true, // when using native, your OS will handle theming.
      });
    });
  }, []);

  return (
    <div className="App">
      <h1>Chatty App</h1>

      {chat.map((payload, index) => {
        return (
          <p key={index}>
            <span> id: {payload.userName} </span> : {payload.message}
          </p>
        );
      })}

      <form onSubmit={sendChat}>
        <input
          type="text"
          name="chat"
          placeholder="send text"
          autoComplete="off"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button type="submit">Send</button>
      </form>
      <h4>Your username: {userName}</h4>
    </div>
  );
}

export default App;
