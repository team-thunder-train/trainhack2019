import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { installClient } from "./routes_backend/client";

installClient("https://alge.se/trainhack");

// Connect to a local python backend by uncommenting the lines below,
// replacing the domain as necessary.
// installClient("http://localhost:1337");

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
