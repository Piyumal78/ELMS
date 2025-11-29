import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import HomePage from './Home/HomePage.jsx'
import { Provider } from 'react-redux'
import { Routes,Route,BrowserRouter } from 'react-router-dom'
import RootLayout from './layout/Root.layout.jsx'
import SignUp from './Component/SignUp.jsx'
import Student from './Student/Student'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} path='/'  />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/student' element={<Student />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
