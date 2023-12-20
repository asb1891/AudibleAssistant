import { useAuth0 } from "@auth0/auth0-react";
import "./index.css";

const LoginComponent = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <div className="flex justify-center items-center h-screen your-class">
        <div className="mockup-window border bg-base-300 custom-window">
          <div className="flex flex-col justify-center px-4 py-5 bg-base-50">
            <div className="flex justify-center">
              <button
                className="btn"
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: {
                      redirect_uri: window.location.origin,
                    },
                  })
                }
              >
                Sign in
              </button>
            </div>
            <div className="text-center mt-4 text-lg text-white">
              <h2 className="chat-bubble chat-bubble-third text-black p-3 rounded-lg max-w-xs mb-2">
                Welcome to Audible Assistant! A app designed to lend an ear
              </h2>
              <h3  className="chat-bubble chat-bubble-secondary bg-yellow-300 p-3 rounded-lg max-w-xs mb-2">
              Clicking the 'Sign In' button will redirect you to a 3rd party
                authentication system
              </h3>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
export default LoginComponent;
