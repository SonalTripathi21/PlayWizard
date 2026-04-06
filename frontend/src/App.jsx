import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Builder from './pages/Builder';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CategorySelection from './pages/CategorySelection';
import SharedGame from './pages/SharedGame';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/categories" element={<CategorySelection />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/share/:id" element={<SharedGame />} />
      </Routes>
    </Router>
  );
}

export default App;
