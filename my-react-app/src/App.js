
import React from "react";
import "./App.css";
import RecordingComponent from "./RecordingComponent";
import ResponseComponent from "./ResponseComponent";
import LoginComponent from "./LoginComponent";
import LogoutComponent from "./LogoutComponent";
import { useAuth0 } from "@auth0/auth0-react";
import "./index.css";
import Header from "./Header";

function App() {

  const { isAuthenticated } = useAuth0();

  return (
    <div className={isAuthenticated ? "" : ""}>
      {!isAuthenticated ? (
        <main>
          <h1 className="flex-1 px-2 mx-2 text-lg font-bold text-center">
            Audible Assistant
          </h1>
          <LoginComponent />
        </main>
      ) : (
        <>
          <div></div>
          <Header />
          {/* <RecordingComponent ws={ws} startRecording={startRecording} /> */}
          <ResponseComponent />
          
        </>
      )}
    </div>
  );
}

export default App;
