import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "./firebase";
import { Link } from "react-router-dom";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

function SidebarChat({ addNewChat, key, id, name }) {
  const [seed, setSeed] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessage(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  const createChat = () => {
    const roomName = prompt("Please enter name of the Chat");
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };

  const deleteRoom = (e) => {
    e.preventDefault();
    if (id) {
      db.collection("rooms").doc(id).delete();
    }
  };

  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2> {name} </h2>
          <p>{message[0]?.message}</p>
        </div>
        <DeleteOutlineIcon
          className="sidebarChat__delete"
          onClick={deleteRoom}
        />
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2> Add New Chat </h2>
    </div>
  );
}
export default SidebarChat;
