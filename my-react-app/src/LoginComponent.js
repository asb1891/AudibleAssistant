import { useAuth0 } from '@auth0/auth0-react';

const LoginComponent = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
        !isAuthenticated && (
            <button onClick={() => loginWithRedirect({
                authorizationParams: {
                  redirect_uri: window.location.origin
                }
              })}>
                Sign in
            </button>
        )
    );
}

export default LoginComponent;
