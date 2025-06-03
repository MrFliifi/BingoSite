import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import reportWebVitals from "./reportWebVitals";

//import pages
import BingoPage from "./pages/bingoField.js";
import HomePage from "./pages/homePage.js";
import NotFoundPage from "./pages/notFoundPage.js";
import Footer from "./pages/footer.js";
import Empty from "./pages/empty.js";
import ChallengeEditor from "./pages/challengeEditor.js"

// React Components like HomePage or BingoSite Function HAVE to be in Pascal Case!!!

// Creates the router for the frontend
const router = createBrowserRouter([
  {
    //This is the Homepage the player first lands on.
    path: "/",
    element: (
      <>
        <HomePage />
        <Footer />
      </>
    ),
    errorElement: <NotFoundPage />,
  },
  {
    path: "/bingoLockout",
    element: (
      <>
        <BingoPage />
        <Footer />
      </>
    ),
  },
  {
    path: "/bingoNonLockout",
    element: (
      <>
        <BingoPage />
        <Footer />
      </>
    ),
  },
  {
    path: "/bingoNonLockoutHighscore",
    element: (
      <>
        <BingoPage />
        <Footer />
      </>
    ),
  },
  {
    path: "/challengeEditor",
    element: (
      <>
        <ChallengeEditor />
        <Footer />
      </>
    ),
  },
  //The following routes are just for testing/placeholder pages
  {
    path: "/impressum",
    element: (
      <>
        <Empty />
        <Footer />
      </>
    ),
  },
  {
    path: "/privacy",
    element: (
      <>
        <Empty />
        <Footer />
      </>
    ),
  },
  {
    path: "/contact",
    element: (
      <>
        <Empty />
        <Footer />
      </>
    ),
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
// Instead of Rendering the App Component, it renders the Router, that in itself has all the different pages
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
