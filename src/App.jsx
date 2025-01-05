import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route } from "react-router";
import Body from './components/Body';


function App() {
  const [count, setCount] = useState(0)

  return (
    //implementing router here
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Body/>}>
        </Route>
      </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
