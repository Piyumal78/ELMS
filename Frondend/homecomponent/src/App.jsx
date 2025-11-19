import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navigation from './Component/Navigation.jsx'
import Home from './Component/Home.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navigation />
      <Home />
    </>
  )
}

export default App
