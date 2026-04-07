import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import SignInPage from './pages/SignInPage';
import TodosPage from './pages/TodosPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/todos" element={<TodosPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
