import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import SignInPage from './pages/SignInPage';
import TodosPage from './pages/TodosPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/todos" element={<TodosPage />} />
    </Routes>
  );
}

export default App;
