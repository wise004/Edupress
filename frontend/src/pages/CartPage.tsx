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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 sm:pt-20">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-8 space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('shoppingCart', 'Shopping Cart')}
            </h1>
            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              {cartItems.length} {t('itemsInCart', 'items in your cart')}
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            {t('continueShopping', 'Continue Shopping')}
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-2 sm:p-6">
                <h2 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-6">
                  {t('courseItems', 'Course Items')}
                </h2>
                
                <div className="space-y-2 sm:space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 pb-2 sm:pb-6 border-b border-gray-200 dark:border-gray-600 last:border-b-0 last:pb-0">
                      {/* Course Thumbnail */}
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full sm:w-24 h-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                      />
                      
                      {/* Course Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-lg font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {t('byInstructor', 'by')} {item.instructor}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-1 sm:gap-4 text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-3">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            {item.rating}
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {item.totalLessons} lessons
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.duration}h
                          </div>
                        </div>

                        {/* Mobile: Price and Controls */}
                        <div className="sm:hidden flex items-center justify-between pt-1">
                          <div className="text-left">
                            {item.discountedPrice && (
                              <span className="text-xs text-gray-500 line-through mr-1">
                                ${item.price}
                              </span>
                            )}
                            <span className="text-sm font-bold text-blue-600">
                              ${item.discountedPrice || item.price}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-l"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 py-1 text-xs text-center min-w-[1.5rem]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Desktop: Quantity Controls */}
                        <div className="hidden sm:flex items-center space-x-3">
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
                      
                      {/* Desktop: Price and Remove */}
                      <div className="hidden sm:block text-right">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-6 sticky top-8">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-6">
                {t('orderSummary', 'Order Summary')}
              </h2>
              
              {/* Promo Code */}
              <div className="mb-3 sm:mb-6">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('promoCode', 'Promo Code')}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-2 sm:px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {t('apply', 'Apply')}
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-xs sm:text-sm text-green-600 mt-2">
                    ✓ {appliedPromo} applied (20% off)
                  </p>
                )}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-6">
                <div className="flex justify-between">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('subtotal', 'Subtotal')}</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    ${getSubtotal().toFixed(2)}
                  </span>
                </div>
                
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-xs sm:text-sm">{t('discount', 'Discount')}</span>
                    <span className="text-xs sm:text-sm">-${getDiscount().toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2 sm:pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span className="text-gray-900 dark:text-white">{t('total', 'Total')}</span>
                    <span className="text-primary-600">${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Checkout Button */}
              <button className="w-full bg-primary-600 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center space-x-2 text-sm sm:text-base">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{t('proceedToCheckout', 'Proceed to Checkout')}</span>
              </button>
              
              <button className="w-full mt-2 sm:mt-3 bg-yellow-500 text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center space-x-2 text-sm sm:text-base">
                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
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
