/*eslint complexity: ["error", 20]*/
// Imports
import { useState, useContext, useEffect } from 'react';
import { useQuery, useMutation, ApolloError } from '@apollo/client';

// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Components
import Billing from './Billing.component';
import CartContents from '../Cart/CartContents.component';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner.component';

// GraphQL
import { GET_CART } from '../../../lib/gql/woo_gql_queries';
import { CHECKOUT_MUTATION } from '../../../lib/gql/woo_gql_mutations';
import { CartContext } from '../../../stores/CartProvider';

// Utils
import {
  getFormattedCart,
  createCheckoutData,
  ICheckoutDataProps,
} from '../../../lib/functions/functions';

export interface IBilling {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  postcode: string;
  email: string;
  phone: string;
}

export interface IShipping {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  postcode: string;
  email: string;
  phone: string;
}

export interface ICheckoutData {
  clientMutationId: string;
  billing: IBilling;
  shipping: IShipping;
  shipToDifferentAddress: boolean;
  paymentMethod: string;
  isPaid: boolean;
  transactionId: string;
}

const CheckoutForm = () => {
  const { cart, setCart } = useContext(CartContext);
  const [orderData, setOrderData] = useState<ICheckoutData | null>(null);
  const [requestError, setRequestError] = useState<ApolloError | null>(null);
  const [orderCompleted, setorderCompleted] = useState<boolean>(false);

  // Get cart data query
  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      // Update cart in the localStorage.
      const updatedCart = getFormattedCart(data);

      if (!updatedCart && !data.cart.contents.nodes.length) {
        localStorage.removeItem('woo-session');
        localStorage.removeItem('wooocommerce-cart');
        setCart(null);
        return;
      }

      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));

      // Update cart data in React Context.
      setCart(updatedCart);
    },
  });

  // Checkout GraphQL mutation
  const [checkout, { loading: checkoutLoading }] = useMutation(
    CHECKOUT_MUTATION,
    {
      variables: {
        input: orderData,
      },
      onCompleted: () => {
        localStorage.removeItem('woo-session');
        localStorage.removeItem('wooocommerce-cart');
        setorderCompleted(true);
        setCart(null);
        refetch();
      },
      onError: (error) => {
        setRequestError(error);
        refetch();
      },
    },
  );

  useEffect(() => {
    if (null !== orderData) {
      // Perform checkout mutation when the value for orderData changes.
      checkout();
      setTimeout(() => {
        refetch();
      }, 2000);
    }
  }, [checkout, orderData, refetch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleFormSubmit = (submitData: ICheckoutDataProps) => {
    const checkOutData = createCheckoutData(submitData);

    setOrderData(checkOutData);
    setRequestError(null);
  };

  useEffect(()=> {
    console.log(requestError)
  }, [requestError])

  return (
    <>
      {cart && !orderCompleted ? (
        <div className="container mx-auto">
          {/*	Order*/}
          <CartContents />
          {/*Payment Details*/}
          <Billing handleFormSubmit={handleFormSubmit} />
          {/*Error display*/}
          {requestError && (
            <div className="h-32 text-xl text-center text-red-600">
              An error has occured.
            </div>
          )}
          {/* Checkout Loading*/}
          {checkoutLoading && (
            <div className="text-xl text-center">
              Processing order, please wait...
              <LoadingSpinner />
            </div>
          )}
        </div>
      ) : (
        <>
          {!cart && !orderCompleted && (
            <h1 className="text-2xl m-12 mt-24 font-bold text-center">
              No products added to your shopping cart.
            </h1>
          )}
          {orderCompleted && (
            <div className="container h-24 m-12 mx-auto mt-24 text-xl text-center">
              Thank you for your order.
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CheckoutForm;
