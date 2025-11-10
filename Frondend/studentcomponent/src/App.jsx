import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Student from './Component/Student.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Student/>
    </>
  )
}

export default App
