import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Body from './components/Body';
import HomePage from './components/HomePage';
import Ide from './components/Ide';


function App() {
  const [count, setCount] = useState(0)

  return (
    //implementing router here
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Body/>}>
        <Route index element={<HomePage />} />
          <Route path='guest' element={<Ide/>}></Route>
        </Route>
      </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
