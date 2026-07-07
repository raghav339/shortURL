import { useState } from 'react'
import{BrowserRouter,Routes,Route} from 'react-router-dom';
import Homepage from './homepage.jsx';
import Signin from './signin.jsx';
import Signup from './signup.jsx';
import Logout from './logout';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/logout" element={<Logout/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
