import "./scss/MainPage.scss";
import GoogleButton from "react-google-button";
import { useMyContext } from "./Context";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { backendUrl } from "../env";
const backendurl = backendUrl;
const socket = io(`${backendurl}/`);

const MainPage = () => {
  const { state, dispatch } = useMyContext();
  const { user } = state;
  const containerRef = useRef(null);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [msg, setMsg] = useState("");

  //user auth
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    if (user?.currentToken && !state.user.status) {
      navigate(
        `/jwtverify/${user.currentToken.replace(/\./g, "jemaliBidzia")}`,
      );
      return;
    }
    axios
      .get(`${backendurl}/oauth/messages/${0}`, {
        headers: { Authorization: user?.token },
      })
      .then((res) => {
        if (res.data?.msg) return alert(res.data.msg);
        dispatch({ type: "FIRSTLY_FETCHED_MESSAGES", payload: res.data });
        setTimeout(scrollToBottom, 100);
      })
      .catch((err) => console.log(err));
  }, [user.status]);
  //socket handler
  useEffect(() => {
    function handleChatMessage(data) {
      dispatch({ type: "NEW_MESSAGE", payload: data });
      setTimeout(scrollToBottom, 100);
    }
    socket.on("chatMessage", handleChatMessage);
    return () => {
      socket.off("chatMessage", handleChatMessage);
    };
  }, []);
  //fetch on scroll
  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  //auth buttons
  function navigate(url) {
    window.location.href = url;
  }

  async function auth() {
    const response = await fetch(`${backendurl}/oauth/request`, {
      method: "post",
    });
    const data = await response.json();
    navigate(data.url);
  }
  function logout() {
    localStorage.removeItem("User");
    dispatch({ type: "USER_LOGOUT" });
  }
  //fetching on scroll
  //
  function handleScroll() {
    if (containerRef.current.scrollTop == 0 && !noMoreMessages) {
      axios
        .get(`${backendurl}/oauth/messages/${state.messages.length}`, {
          headers: { Authorization: user.token },
        })
        .then((res) => {
          if (res.data?.msg) {
            setNoMoreMessages(true);
            return alert(res.data.msg);
          }
          dispatch({ type: "FETCHED_MESSAGES", payload: res.data });
        })
        .catch((err) => console.log(err));
    }
  }

  function scrollToBottom() {
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
  }

  //socket handlers which are done :)

  function SendingMessage(e) {
    e.preventDefault();
    socket.emit("sendingMessage", {
      name: user.name,
      mail: user.mail,
      message: msg,
      photo: user.photo,
    });
    setMsg("");
  }

  return (
    <div className="container">
      <div className="chatContainer">
        <div className="mainSection" ref={containerRef}>
          {state?.messages?.length > 0 &&
            state.messages.map((msg, index) => {
              return msg.mail == user.mail ? (
                <div className="usersMessage" key={index}>
                  <div className="leftSection">
                    <img src={msg.photo} alt="" />
                  </div>
                  <div className="rightSection">
                    <p className="message">{msg.message}</p>
                  </div>
                </div>
              ) : (
                <div className="someonesMessage" key={index}>
                  <div className="leftSection">
                    <img src={msg.photo} alt="" />
                  </div>
                  <div className="rightSection">
                    <p className="message">{msg.message}</p>
                  </div>
                </div>
              );
            })}
        </div>
        {user.status ? (
          <form className="typingSection" onSubmit={SendingMessage}>
            <img src={user.photo} alt="Avatar" />
            <input
              type="text"
              placeholder="Send Message From Here Buddy"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        ) : (
          <form className="typingSection" onSubmit={SendingMessage}>
            <GoogleButton onClick={auth} />
          </form>
        )}
      </div>
      {user.status && (
        <button onClick={logout} className="logoutBtn">
          logout
        </button>
      )}
    </div>
  );
};

export default MainPage;
