import React, { useState, useEffect } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import EmojiEmotionsOutlinedIcon from "@material-ui/icons/EmojiEmotionsOutlined";
import MicOutlinedIcon from "@material-ui/icons/MicOutlined";
import { useParams } from "react-router-dom";
import db from "./firebase";
import { useStateValue } from "./StateProvider"; // CONTEXT API
import firebase from "firebase";
import { storage } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    // backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function Chat() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = (e) => {
    setImage(e.target.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams("");
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue(); // CONTEXT API this can be used any whare for user params
  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              doc: doc.data(),
            }))
          )
        );
    }
  }, [roomId]);
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const deleteChat = (e) => {
    e.preventDefault();
    const chatId = e.target.id;
    alert(chatId);
    if (chatId) {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .doc(chatId)
        .delete();
    }
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("rooms").doc(roomId).collection("messages").add({
              user: user.displayName,
              message: input,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              imageURL: url,
            });
            setProgress(0);
            setImage(null);
            setInput("");
          });
      }
    );
    // db.collection("rooms").doc(roomId).collection("messages").add({
    //   user: user.displayName,
    //   message: input,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    // });
    // setInput("");
  };
  return (
    <div className="chat">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <img className="chat__attachedImagePreview" src={image} alt="" />
          </div>
        </Fade>
      </Modal>

      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3> {roomName} </h3>
          <p>
            last seen {""}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileOutlinedIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages?.map((message) => (
          <p
            className={`chat__message ${
              user.displayName === message.doc.user && "chat__receiver"
            }`}
          >
            <span className="chat__name">{message.doc.user}</span>
            <img
              onClick={handleOpen}
              className="chat__attachedImage"
              id={message.doc.imageURL}
              src={message.doc.imageURL}
              alt=""
            />

            <DeleteOutlineIcon
              className="chat__DeleteChat"
              id={message.id}
              onClick={deleteChat}
            />

            <br />
            <span className="chat__chatMessage">{message.doc.message}</span>
            <span className="chat__timestamp">
              {new Date(message.doc.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <EmojiEmotionsOutlinedIcon />
        <form>
          <input
            value={input}
            type="text"
            placeholder="Type a message"
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" onClick={sendMessage}>
            Send a message
          </button>
          <input type="file" onChange={handleChange} />
        </form>
        <MicOutlinedIcon />
      </div>
    </div>
  );
}
export default Chat;
