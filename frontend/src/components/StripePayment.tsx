import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { PaymentAPI } from '../services/api';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

interface PaymentFormProps {
  courseId: number;
  amount: number;
  courseName: string;
  onSuccess: (paymentResponse: any) => void;
  onError: (error: string) => void;
}

function PaymentForm({ courseId, amount, courseName, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  const createPaymentIntent = async () => {
    try {
      const response = await PaymentAPI.createPaymentIntent({
        courseId,
        amount,
        currency: 'USD'
      });
      
      setClientSecret(response.clientSecret);
    } catch (error: any) {
      onError(error.response?.data?.error || 'Failed to create payment intent');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (methodError) {
        onError(methodError.message || 'Payment method creation failed');
        setProcessing(false);
        return;
      }

      // If we don't have a client secret yet, create the payment intent
      if (!clientSecret) {
        await createPaymentIntent();
        return; // This will trigger a re-render with the client secret
      }

      // Confirm the payment
      const { error: confirmError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        onError(confirmError.message || 'Payment confirmation failed');
      } else if (confirmedIntent && confirmedIntent.status === 'succeeded') {
        onSuccess(confirmedIntent);
      }
    } catch (error: any) {
      onError(error.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  // Auto-create payment intent when component mounts
  useState(() => {
    if (!clientSecret) {
      createPaymentIntent();
    }
  });

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Complete your purchase
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{courseName}</p>
              <p className="text-sm text-gray-600">Course enrollment</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">${amount}</p>
              <p className="text-sm text-gray-600">USD</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
          Card information
        </label>
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <CardElement id="card-element" options={cardElementOptions} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || !clientSecret}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
          processing || !stripe || !clientSecret
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          `Pay $${amount}`
        )}
      </button>

      <div className="text-xs text-gray-500 text-center">
        <p>Your payment information is secure and encrypted.</p>
        <p>Powered by Stripe</p>
      </div>
    </form>
  );
}

interface StripePaymentProps {
  courseId: number;
  amount: number;
  courseName: string;
  onSuccess: (paymentResponse: any) => void;
  onError: (error: string) => void;
}

export default function StripePayment({ courseId, amount, courseName, onSuccess, onError }: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <PaymentForm
          courseId={courseId}
          amount={amount}
          courseName={courseName}
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </Elements>
  );
}
