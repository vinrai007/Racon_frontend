// import { SignIn } from "@clerk/clerk-react";
// import "./signInPage.css";

// const SignInPage = () => {
//   return (
//     <div className="signInPage">
//       <SignIn
//         path="/sign-in"
//         signUpUrl="/sign-up"
//         forceRedirectUrl="/dashboard"
//       />
//     </div>
//   );
// };

// export default SignInPage;

import { SignIn } from "@clerk/clerk-react";
import "./signInPage.css";

const SignInPage = () => {
  return (
    <div className="signInPage">
      <SignIn
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/" // Redirects to the homepage
      />
    </div>
  );
};

export default SignInPage;
