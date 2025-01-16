import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Body from "./components/Body";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import CodeEditor from "./components/CodeEditor";

function App() {

  return (
    //implementing router here
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<HomePage />} />
            <Route path="signup" element={<LoginPage />}></Route>
            <Route path="ide" element={<CodeEditor />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
