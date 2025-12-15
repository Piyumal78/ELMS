import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import HomePage from './Home/HomePage.jsx'
import { Provider } from 'react-redux'
import { Routes,Route,BrowserRouter } from 'react-router-dom'
import RootLayout from './layout/Root.layout.jsx'
import SignUp from './Component/SignUp.jsx'
import DashboardLayout from './layout/Dashboard.layout.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} path='/'  />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/studentdashboard' element={<DashboardLayout />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
