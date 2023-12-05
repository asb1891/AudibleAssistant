import { useAuth0 } from '@auth0/auth0-react';
import './index.css';

const LoginComponent = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

  //   const containerStyle = {
  //     display: 'flex',
  //     justifyContent: 'center', // Centers the button horizontally
  //     alignItems: 'center',     // Centers the button vertically
  //     height: 'auto',         // Take up the full viewport height
  // };

  return (
    !isAuthenticated && (
      <div className="container-style">
        <button onClick={() => loginWithRedirect({
          authorizationParams: {
            redirect_uri: window.location.origin
          }
        })}>
          Sign in
        </button>
      </div>
    )
  );

//   return (
//       !isAuthenticated && (
//           <div style={containerStyle}>
//               <button onClick={() => loginWithRedirect({
//                   authorizationParams: {
//                     redirect_uri: window.location.origin
//                   }
//                 })}>
//                   Sign in
//               </button>
//           </div>
//       )
//   );
// }

//     return (
//         !isAuthenticated && (
//             <button onClick={() => loginWithRedirect({
//                 authorizationParams: {
//                   redirect_uri: window.location.origin
//                 }
//               })}>
//                 Sign in
//             </button>
//         )
//     );
// }
      };
export default LoginComponent;
