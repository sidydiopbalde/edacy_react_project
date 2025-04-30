import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Key, 
  Home, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import useSave from '../backend/Services/useSave';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    adresse: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const {saveData} = useSave();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    validateField(name, value);
    
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    
    switch (name) {
      case "firstname":
        if (!value.trim()) {
          fieldErrors[name] = "Le prénom est requis.";
        } else {
          delete fieldErrors[name];
        }
        break;
        
      case "lastname":
        if (!value.trim()) {
          fieldErrors[name] = "Le nom est requis.";
        } else {
          delete fieldErrors[name];
        }
        break;
        
      case "adresse":
        if (!value.trim()) {
          fieldErrors[name] = "L'adresse est requise.";
        } else {
          delete fieldErrors[name];
        }
        break;
        
      case "email":
        if (!value.trim()) {
          fieldErrors[name] = "L'email est requis.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          fieldErrors[name] = "Format d'email invalide.";
        } else {
          delete fieldErrors[name];
        }
        break;
        
      case "password":
        if (!value.trim()) {
          fieldErrors[name] = "Le mot de passe est requis.";
        } else if (value.length < 8) {
          fieldErrors[name] = "Le mot de passe doit contenir au moins 8 caractères.";
        } else {
          delete fieldErrors[name];
          
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            fieldErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
          } else if (formData.confirmPassword) {
            delete fieldErrors.confirmPassword;
          }
        }
        break;
        
      case "confirmPassword":
        if (!value.trim()) {
          fieldErrors[name] = "Veuillez confirmer votre mot de passe.";
        } else if (value !== formData.password) {
          fieldErrors[name] = "Les mots de passe ne correspondent pas.";
        } else {
          delete fieldErrors[name];
        }
        break;
        
      default:
        break;
    }
    
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const validateStep = (currentStep) => {
    let isValid = true;
    const newTouched = { ...touched };
    const fieldsToValidate = [];
    
    if (currentStep === 1) {
      fieldsToValidate.push("firstname", "lastname", "adresse");
    } else if (currentStep === 2) {
      fieldsToValidate.push("email", "password", "confirmPassword");
    }
    
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    setTouched(newTouched);
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const userData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        adresse: formData.adresse,
        email: formData.email,
        password: formData.password
      };
      const response = await saveData('auth/register', userData);

      console.log("Submitting user data:", userData);
      if(response){
        setSuccess(true);
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);

      }
            
    } catch (err) {
      setErrors({
        general: "Une erreur est survenue lors de l'inscription."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = () => {
    if (success) return 100;
    return step === 1 ? 50 : 90;
  };

  const renderField = (name, label, type, icon) => {
    const Icon = icon;
    const hasError = touched[name] && errors[name];
    
    return (
      <motion.div className="mb-4" variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${hasError ? 'text-red-400' : 'text-blue-500'} h-5 w-5`} />
          
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all duration-300 ${
              hasError 
                ? 'border-red-400 focus:border-red-500 bg-red-50' 
                : touched[name]
                  ? 'border-green-400 focus:border-green-500 bg-green-50'
                  : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder={label}
          />
          
          {touched[name] && !errors[name] && (
            <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
          )}
          
          {hasError && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs mt-1 flex items-center"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors[name]}
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  };

  if (success) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md"
        >
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, rotate: 360 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="mx-auto mb-6 bg-green-100 p-3 rounded-full w-20 h-20 flex items-center justify-center"
          >
            <CheckCircle className="text-green-500 h-10 w-10" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Inscription réussie!</h2>
          <p className="text-gray-600 mb-6">Vous allez être redirigé vers la page de connexion...</p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2 }}
            className="h-2 bg-green-500 rounded-full"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md"
      >
        {/* Progress bar */}
        <div className="h-2 w-full bg-gray-200">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-blue-500"
          />
        </div>
        
        <div className="p-8">
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-center text-gray-800 mb-6"
          >
            {step === 1 ? "Commençons par les informations personnelles" : "Finalisez votre inscription"}
          </motion.h2>
          
          {errors.general && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 flex items-center"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              {errors.general}
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {renderField("firstname", "Prénom", "text", User)}
                {renderField("lastname", "Nom", "text", User)}
                {renderField("adresse", "Adresse", "text", Home)}
                
                <motion.div 
                  variants={itemVariants}
                  className="flex justify-end mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleNextStep}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center"
                  >
                    Suivant
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
            
            {step === 2 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {renderField("email", "Email", "email", Mail)}
                {renderField("password", "Mot de passe", "password", Key)}
                {renderField("confirmPassword", "Confirmer le mot de passe", "password", Key)}
                
                <motion.div 
                  variants={itemVariants}
                  className="flex justify-between items-center mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Retour
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        S'inscrire
                        <CheckCircle className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
            
            <motion.div
              variants={itemVariants}
              className="text-center text-sm text-gray-600 mt-8"
            >
              <p>
                Vous avez déjà un compte ?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-700 font-medium">
                  Se connecter
                </Link>
              </p>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;