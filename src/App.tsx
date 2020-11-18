import React from "react";
import logo from "./images/oboito.png";
import { SessionPage } from "./Views/SessionPage";

function App() {
  return (
    <div>
      <header className="flex-row flex-center color-header font-xl">
        <img src={logo} className="image-height-l margin-16" alt="logo" />
        <div>Unsayo</div>
      </header>
      <section className="padding-16">
        <SessionPage />
      </section>
    </div>
  );
}

export default App;
