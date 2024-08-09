import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./routes/homepage/Homepage";
import DashboardPage from "./routes/dashboardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import RootLayout from "./layouts/rootLayout/RootLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
import SignInPage from "./routes/signInPage/signInPage";
import SignUpPage from "./routes/signUpPage/signUpPage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// import React from "react";
// import "./index.css";
// import ReactDOM from "react-dom/client";
// import { HashRouter, Routes, Route } from "react-router-dom";
// import Homepage from "./routes/homepage/Homepage";
// import DashboardPage from "./routes/dashboardPage/DashboardPage";
// import ChatPage from "./routes/chatPage/ChatPage";
// import RootLayout from "./layouts/rootLayout/RootLayout";
// import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";
// import SignInPage from "./routes/signInPage/signInPage";
// import SignUpPage from "./routes/signUpPage/signUpPage";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <HashRouter>
//       <Routes>
//         <Route path="/" element={<RootLayout />}>
//           <Route index element={<Homepage />} />
//           <Route path="/sign-in/*" element={<SignInPage />} />
//           <Route path="/sign-up/*" element={<SignUpPage />} />
//           <Route path="/dashboard" element={<DashboardLayout />}>
//             <Route index element={<DashboardPage />} />
//             <Route path="chats/:id" element={<ChatPage />} />
//           </Route>
//         </Route>
//       </Routes>
//     </HashRouter>
//   </React.StrictMode>
// );
