import { Routes, Route, Navigate } from 'react-router-dom';
import ProductManager from './components/product/ProductManager.jsx';
import LoginForm from './components/Auth/LoginForm.jsx';
import RegisterForm from './components/Auth/RegisterForm.jsx';

function App() {
  return (
    <Routes>
    
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="/login" element={<LoginForm />} />
     
      <Route path="/product" element={<ProductManager />} /> 

      <Route path="/register" element={<RegisterForm />} /> 
      
      <Route path="*" element={<h1>404 - Page Non trouvée</h1>} />
      
    </Routes>
  );
}

export default App;