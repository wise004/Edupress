import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard,
  Lock,
  ArrowLeft,
  Star,
  Clock,
  BookOpen
} from 'lucide-react';

interface CartItem {
  id: number;
  title: string;
  instructor: string;
  price: number;
  discountedPrice?: number;
  thumbnailUrl: string;
  rating: number;
  totalLessons: number;
  duration: number; // in hours
  quantity: number;
}

const CartPage = () => {
  const { t } = useTranslation();
  
  // Mock cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "Complete React & TypeScript Development",
      instructor: "Sarah Instructor",
      price: 149.99,
      discountedPrice: 99.99,
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
      rating: 4.8,
      totalLessons: 120,
      duration: 45,
      quantity: 1
    },
    {
      id: 2,
      title: "Data Science with Python & Machine Learning",
      instructor: "Sarah Instructor",
      price: 199.99,
      discountedPrice: 129.99,
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      rating: 4.9,
      totalLessons: 85,
      duration: 60,
      quantity: 1
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'demo20') {
      setAppliedPromo('DEMO20');
      setPromoCode('');
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountedPrice || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getDiscount = () => {
    if (appliedPromo === 'DEMO20') {
      return getSubtotal() * 0.2; // 20% discount
    }
    return 0;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('cartEmpty', 'Your cart is empty')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t('cartEmptyDescription', 'Browse our courses and start learning today!')}
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('browseCourses', 'Browse Courses')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('shoppingCart', 'Shopping Cart')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {cartItems.length} {t('itemsInCart', 'items in your cart')}
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('continueShopping', 'Continue Shopping')}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  {t('courseItems', 'Course Items')}
                </h2>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 pb-6 border-b border-gray-200 dark:border-gray-600 last:border-b-0 last:pb-0">
                      {/* Course Thumbnail */}
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      {/* Course Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {t('by', 'by')} {item.instructor}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            {item.rating}
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {item.totalLessons} lessons
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {item.duration}h
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Price and Remove */}
                      <div className="text-right">
                        <div className="mb-2">
                          {item.discountedPrice ? (
                            <>
                              <span className="text-lg font-bold text-primary-600">
                                ${item.discountedPrice}
                              </span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ${item.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ${item.price}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                          title={t('removeItem', 'Remove item')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t('orderSummary', 'Order Summary')}
              </h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('promoCode', 'Promo Code')}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {t('apply', 'Apply')}
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {appliedPromo} applied (20% off)
                  </p>
                )}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('subtotal', 'Subtotal')}</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${getSubtotal().toFixed(2)}
                  </span>
                </div>
                
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('discount', 'Discount')}</span>
                    <span>-${getDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">{t('total', 'Total')}</span>
                    <span className="text-primary-600">${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Checkout Button */}
              <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center space-x-2">
                <Lock className="w-4 h-4" />
                <span>{t('proceedToCheckout', 'Proceed to Checkout')}</span>
              </button>
              
              <button className="w-full mt-3 bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Pay with PayPal</span>
              </button>
              
              {/* Security Notice */}
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                <Lock className="w-3 h-3 inline mr-1" />
                {t('secureCheckout', 'Secure 256-bit SSL encryption')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
