import HomePage from './Home/HomePage.jsx'
import { Routes,Route,BrowserRouter } from 'react-router-dom'
import RootLayout from './layout/Root.layout.jsx'
import SignUp from './Component/SignUp.jsx'
import Student from './Student/Student'
import Lab from './Lab/Lab'
import LabDetails from './Lab/LabDetail'
import LabSubmission from './Lab/LabSubmission'
import LabAssistantDashboard from '../../Lab Assistant/Frontend/Lab_Assistant/src/pages/LabAssistantDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} path='/'  />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/student' element={<Student />} />
          <Route path='/lab1' element={<LabDetails />} />
          <Route path='/lab2' element={<Lab />} />
          <Route path='/lab3' element={<Lab />} />
          <Route path='/lab4' element={<Lab />} />
          <Route path='/lab5' element={<Lab />} />
          <Route path='/lab6' element={<Lab />} />
          <Route path='/lab7' element={<Lab />} />
          <Route path='/submission' element={<LabSubmission />} />
        </Route>
        <Route path='/lab-assistant' element={<LabAssistantDashboard user={{name: "Lab Assistant"}} onLogout={() => window.location.href='/'} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
