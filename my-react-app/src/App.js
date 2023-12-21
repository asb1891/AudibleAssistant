
import React from "react";
import "./App.css";
import ResponseComponent from "./ResponseComponent";
import LoginComponent from "./LoginComponent";
import { useAuth0 } from "@auth0/auth0-react";
import "./index.css";
import Header from "./Header";

function App() {

  const { isAuthenticated } = useAuth0();

  return (
    <div className={isAuthenticated ? "" : ""}>
      {!isAuthenticated ? (
        <main>
          <div className="flex-1 px-2 mx-2 text-lg font-bold text-center mt-3 mb-3">
            Audible Assistant
          </div>
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
