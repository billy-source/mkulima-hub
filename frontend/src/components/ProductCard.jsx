import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authcontext';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleAddToCart = () => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    onAddToCart(product.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {product.image && (
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 font-bold text-lg">
            KSH {product.price}
          </span>
          <span className="text-gray-500 text-sm">
            {product.quantity} {product.unit} available
          </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-3">
          By: {product.farmer_name}
        </p>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;