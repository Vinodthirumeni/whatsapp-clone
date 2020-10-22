import React from "react";
import "./Login.css";
import Button from "@material-ui/core/Button";
import { auth, provider } from "./firebase";
import { useStateValue } from "./StateProvider"; // CONTEXT API
import { actionTypes } from "./reducer"; // CONTEXT API
function Login() {
  const [{user}, dispatch] = useStateValue(); //context
  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER, //context
          user: result.user, //context
        });
      })
      .catch((error) => alert(error.message));
  };
  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/597px-WhatsApp.svg.png"
          alt=""
        />
        <h1>Sign in to check this app</h1>
        <p>www.google.com</p>
        <Button onClick={signIn}> Sign IN with google </Button>
      </div>
    </div>
  );
}
export default Login;
