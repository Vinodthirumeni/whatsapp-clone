import React from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";
import { useStateValue } from "./StateProvider"; // CONTEXT API
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
function App() {
  //const[user,setUser]=useState(null); this is ignored becaouse we using context api for capture user
  // Add two files called StateProvider.js and reducer.js
  // change in appropriate index.js and app.js
  const [{ user }, dispatch] = useStateValue(); // CONTEXT API this can be used any whare for user params
  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <Router>
            <Sidebar />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
}
export default App;
