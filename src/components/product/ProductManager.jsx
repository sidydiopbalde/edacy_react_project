import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, Edit, Trash2, Save, X, Search, 
  RefreshCw, ChevronDown, ChevronUp, Package, DollarSign, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Add useNavigate for logout
import useFetch from '../backend/Services/useFetch.js';
import useSave from '../backend/Services/useSave.js';
import './ProductManager.css';

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Casque Audio', price: 99.99, quantity: 15 },
  { id: 2, name: 'Clavier Mécanique', price: 129.99, quantity: 8 },
  { id: 3, name: 'Souris Gaming', price: 49.99, quantity: 23 }
];

const ProductManager = () => {
  const navigate = useNavigate(); // Add navigate for logout
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for deletion modal
  const [productToDelete, setProductToDelete] = useState(null); // Track product to delete
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false); 

  const { data: fetchedData, loading, error: fetchError } = useFetch(`product`);
  const { saveData } = useSave();

  useEffect(() => {
    fetchProducts();
  }, [fetchedData]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      if (fetchedData && fetchedData.data) {
        setProducts(fetchedData.data);
        setError(null);
        setIsOfflineMode(false);
      } else {
        console.log('API inaccessible, utilisation des données par défaut');
        setProducts(DEFAULT_PRODUCTS);
        setError('Impossible de se connecter à l\'API. Mode hors ligne activé.');
        setIsOfflineMode(true);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err);
      setProducts(DEFAULT_PRODUCTS);
      setError('Erreur lors du chargement des produits. Mode hors ligne activé.');
      setIsOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toString().includes(searchTerm) ||
    product.price.toString().includes(searchTerm) ||
    product.quantity.toString().includes(searchTerm)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) return null;
    return sortConfig.direction === 'ascending' 
      ? <ChevronUp size={16} className="inline ml-1" /> 
      : <ChevronDown size={16} className="inline ml-1" />;
  };

  const toggleProductExpand = (id) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await saveData(`product/${id}`, {}, "DELETE");
      setProducts(products.filter(product => product.id !== id));
      showNotification('Produit supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      showNotification('Erreur lors de la suppression du produit', 'error');
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };

  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  return (
    <div className="bg-gray-100 dark:bg-background-dark min-h-screen p-4 sm:p-6 font-sans">
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-xl ${
              notification.type === 'error' ? 'bg-red-600' : 'bg-green-600'
            } text-white flex items-center text-sm font-medium`}
          >
            {notification.type === 'error' ? (
              <X className="mr-2" size={18} />
            ) : (
              <Save className="mr-2" size={18} />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                  <Package className="mr-2" size={24} /> Gestion des Produits
                </h1>
                <p className="text-indigo-100 text-sm mt-2">
                  Gérez votre inventaire avec simplicité et efficacité
                </p>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setEditingProduct(null);
                    setShowAddModal(true);
                  }}
                  className="bg-white dark:bg-gray-700 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg shadow-md hover:shadow-lg flex items-center font-semibold transition-all"
                >
                  <PlusCircle className="mr-2" size={18} />
                  Nouveau Produit
                </motion.button>
              
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 flex items-center font-semibold transition-all"
                >
                  <LogOut className="mr-2" size={18} />
                  Déconnexion
                </motion.button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-indigo-700/40 text-white placeholder-indigo-300 border border-indigo-500/50 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-600 dark:text-red-400">
                <p className="text-lg font-medium">{error}</p>
                <button 
                  onClick={fetchProducts}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all dark:bg-indigo-700 dark:hover:bg-indigo-800"
                >
                  Réessayer
                </button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                {searchTerm ? (
                  <p className="text-lg">Aucun produit ne correspond à votre recherche</p>
                ) : (
                  <div>
                    <p className="text-xl mb-4">Aucun produit disponible</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingProduct(null);
                        setShowAddModal(true);
                      }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-all flex items-center mx-auto dark:bg-indigo-700 dark:hover:bg-indigo-800"
                    >
                      <PlusCircle className="mr-2" size={18} />
                      Ajouter un produit
                    </motion.button>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      {['id', 'name', 'price', 'quantity'].map((key) => (
                        <th 
                          key={key}
                          scope="col" 
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
                          onClick={() => requestSort(key)}
                        >
                          {key.charAt(0).toUpperCase() + key.slice(1)} {getSortIcon(key)}
                        </th>
                      ))}
                      <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider dark:text-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    <AnimatePresence>
                      {sortedProducts.map((product) => (
                        <React.Fragment key={product.id}>
                          <motion.tr
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`hover:bg-indigo-50 cursor-pointer transition-colors duration-200 dark:hover:bg-gray-700 ${
                              expandedProductId === product.id ? 'bg-indigo-50 dark:bg-gray-700' : ''
                            }`}
                            onClick={() => toggleProductExpand(product.id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-200">#{product.id}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{product.name}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-200 flex items-center">
                                <DollarSign size={16} className="text-green-600 mr-1 dark:text-green-400" /> 
                                {product.price.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                product.quantity > 10 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                  : product.quantity > 0 
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' 
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                              }`}>
                                {product.quantity} en stock
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditProduct(product)}
                                  className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-100 transition-colors dark:text-indigo-300 dark:hover:text-indigo-200 dark:hover:bg-gray-600"
                                >
                                  <Edit size={18} />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => confirmDeleteProduct(product)} // Replace window.confirm with modal
                                  className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-gray-600"
                                >
                                  <Trash2 size={18} />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                          <AnimatePresence>
                            {expandedProductId === product.id && (
                              <motion.tr
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                <td colSpan={5} className="px-6 py-4 bg-indigo-50 dark:bg-gray-700">
                                  <motion.div 
                                    initial={{ y: -20 }}
                                    animate={{ y: 0 }}
                                    className="text-sm text-gray-700 border-l-4 border-indigo-500 pl-4 dark:text-gray-300 dark:border-indigo-400"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-bold text-indigo-800 mb-2 dark:text-indigo-300">Détails du produit</h4>
                                        <p><span className="font-medium">Code:</span> {product.id}</p>
                                        <p><span className="font-medium">Nom:</span> {product.name}</p>
                                        <p><span className="font-medium">Prix:</span> ${product.price.toFixed(2)}</p>
                                        <p><span className="font-medium">Quantité:</span> {product.quantity}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-indigo-800 mb-2 dark:text-indigo-300">Actions rapides</h4>
                                        <div className="flex space-x-2">
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleEditProduct(product);
                                            }}
                                            className="bg-indigo-600 text-white px-3 py-1 rounded flex items-center text-sm hover:bg-indigo-700 transition-colors dark:bg-indigo-700 dark:hover:bg-indigo-800"
                                          >
                                            <Edit size={14} className="mr-1" /> Éditer
                                          </motion.button>
                                          <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              confirmDeleteProduct(product); // Replace window.confirm with modal
                                            }}
                                            className="bg-red-600 text-white px-3 py-1 rounded flex items-center text-sm hover:bg-red-700 transition-colors dark:bg-red-700 dark:hover:bg-red-800"
                                          >
                                            <Trash2 size={14} className="mr-1" /> Supprimer
                                          </motion.button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </motion.tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <ProductFormModal
            product={editingProduct}
            onClose={() => setShowAddModal(false)}
            onSave={(savedProduct) => {
              if (editingProduct) {
                setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
                showNotification('Produit modifié avec succès');
              } else {
                setProducts([...products, savedProduct]);
                showNotification('Produit ajouté avec succès');
              }
              setShowAddModal(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && productToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Confirmer la suppression
                </h2>
                <button 
                  className="text-white hover:bg-red-800 p-1 rounded-full transition-colors"
                  onClick={() => setShowDeleteModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Êtes-vous sûr de vouloir supprimer le produit <span className="font-semibold">{productToDelete.name}</span> ?
                  Cette action est irréversible.
                </p>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteProduct(productToDelete.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center font-medium dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <Trash2 size={18} className="mr-2" />
                    Supprimer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Confirmer la déconnexion
                </h2>
                <button 
                  className="text-white hover:bg-red-800 p-1 rounded-full transition-colors"
                  onClick={() => setShowLogoutModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Êtes-vous sûr de vouloir vous déconnecter ?
                </p>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center font-medium dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    <LogOut size={18} className="mr-2" />
                    Déconnexion
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function handleEditProduct(product) {
    setEditingProduct({ ...product });
    setShowAddModal(true);
  }
};

const ProductFormModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    quantity: product?.quantity || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { saveData } = useSave();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Le nom du produit est requis';
    }
    
    if (!formData.price) {
      errors.price = 'Le prix est requis';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      errors.price = 'Le prix doit être un nombre positif';
    }
    
    if (!formData.quantity) {
      errors.quantity = 'La quantité est requise';
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0 || !Number.isInteger(parseFloat(formData.quantity))) {
      errors.quantity = 'La quantité doit être un nombre entier positif';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      let response;
      if (product) {
        response = await saveData(`product/${product.id}`, payload, "PATCH");
      } else {
        response = await saveData("product", payload, "POST");
      }

      onSave(response.data);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setFormErrors({ submit: 'Une erreur est survenue lors de la sauvegarde' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            {product ? 'Modifier le produit' : 'Ajouter un produit'}
          </h2>
          <button 
            className="text-white hover:bg-indigo-800 p-1 rounded-full transition-colors"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {formErrors.submit && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm dark:bg-red-900 dark:text-red-300">
              {formErrors.submit}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Nom du produit
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-gray-200`}
              placeholder="ex: Casque audio"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Prix
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full pl-9 p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                  formErrors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } dark:bg-gray-700 dark:text-gray-200`}
                placeholder="0.00"
              />
            </div>
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.price}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Quantité en stock
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                formErrors.quantity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-gray-200`}
              placeholder="0"
            />
            {formErrors.quantity && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.quantity}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Annuler
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center font-medium dark:bg-indigo-700 dark:hover:bg-indigo-800"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  {product ? 'Modifier' : 'Ajouter'}
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};


export default ProductManager;