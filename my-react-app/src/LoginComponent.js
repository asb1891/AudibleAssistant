import { useAuth0 } from "@auth0/auth0-react";
import "./index.css";

const LoginComponent = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <div className="flex justify-center items-center h-screen bg-custom-700">
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
              <h2 className="h2-style">
                Clicking the 'Sign In' button will redirect you to a 3rd party
                authentication system
              </h2>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
export default LoginComponent;
