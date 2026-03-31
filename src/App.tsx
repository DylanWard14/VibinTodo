import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import TodosPage from './pages/TodosPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/todos" element={<TodosPage />} />
    </Routes>
  )
}

export default App
