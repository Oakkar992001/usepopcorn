import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import StarComponent from "./StarComponent";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarComponent
      maxRating={5}
      color="#fcc419"
      size={48}
      arrayRating={["terrible", "notBad", "Average", "good", "great"]}
    /> */}
    {/* <StarComponent maxRating={3} /> */}
    {/* <StarComponent maxRating={"hello"} color={10} /> */}
  </React.StrictMode>
);
