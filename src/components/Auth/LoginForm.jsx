import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Mail, 
  Key, 
  LogIn, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2 
} from "lucide-react";
import useSave from '../backend/Services/useSave';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {saveData} = useSave();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (formSubmitted) validateEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (formSubmitted) validatePassword(e.target.value);
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      setError("L'email est requis.");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setError("Format d'email invalide.");
      return false;
    }
    return true;
  };

  const validatePassword = (value) => {
    if (!value.trim()) {
      setError("Le mot de passe est requis.");
      return false;
    }
    return true;
  };

  const validateForm = () => {

    setError("");
    
    if (!validateEmail(email)) {
      return false;
    }
    
    if (!validatePassword(password)) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      
      //appel de l'api nest
       const response = await saveData("auth/login", { email, password });

      if(response){
        const { user, message, token } = response;

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        setTimeout(()=>{
          navigate("/product");
        }, 2000);
      }      
    } catch (err) {
      setError("Identifiants incorrects. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const blobVariants = {
    initial: {
      scale: 0.8,
      opacity: 0.7,
    },
    animate: {
      scale: [0.8, 1.1, 0.9],
      opacity: [0.7, 0.4, 0.7],
      transition: {
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100 relative overflow-hidden">
      <motion.div
        variants={blobVariants}
        initial="initial"
        animate="animate"
        className="absolute top-20 -left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
      />
      <motion.div
        variants={blobVariants}
        initial="initial"
        animate="animate"
        custom={1}
        className="absolute bottom-20 -right-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md z-10 relative"
      >
        <div className="p-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <LogIn className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-center text-gray-800 mb-6"
          >
            Bienvenue à Edacy Shop
          </motion.h2>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 flex items-center"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </motion.div>
          )}
          
          <motion.form 
            onSubmit={handleSubmit}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mb-6" variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder="Entrez votre email"
                />
              </div>
            </motion.div>
            
            <motion.div className="mb-8" variants={itemVariants}>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all duration-300"
                  placeholder="Entrez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
              </div>
            </motion.div>
            
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex justify-center items-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Se connecter"
              )}
            </motion.button>
            
            <motion.div
              variants={itemVariants}
              className="text-center mt-6 p-2"
            >
              <span className="text-sm text-gray-600">
                Pas encore de compte?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                  S'inscrire
                </Link>
              </span>
            </motion.div>
          </motion.form>
        </div>
        
        {/* Bottom wave decoration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="h-12 bg-gradient-to-r from-blue-500 to-indigo-600 relative"
        >
          <svg className="absolute top-0 w-full transform -translate-y-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
              fill="#ffffff"
              opacity="1">
            </path>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;