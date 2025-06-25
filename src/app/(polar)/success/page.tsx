"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
const CheckoutSuccessPage: React.FC = () => {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get('checkoutId');

  if (!checkoutId) {
    return (
      <div>
        <h1>Checkout Failed</h1>
        <p>No checkout ID was provided. Please try again.</p>
        <Link className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' href="/polar-products">Back to Home</Link>
      </div>
    );
  }

  // In a real application, you would fetch checkout details using the checkoutId
  // from your backend or a state management system like Redux or Context.
  // For this example, we'll just display a success message with the ID.

  return (
    <div>
      <h1>Checkout Successful🎉</h1>
      <p>Your checkout with ID: {checkoutId} was successful.</p>
      {/* In a real app, you might display order details here. */}
      <p>Thank you for your order!</p>
      <br></br>
      <Link className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' href="/polar-products">Back to Home</Link>
    </div>
  );
};

export default CheckoutSuccessPage;
