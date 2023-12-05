import { useAuth0 } from "@auth0/auth0-react";
import "./index.css";

const LoginComponent = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <div className="container-style">
        <button
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
    )
  );
};
export default LoginComponent;
