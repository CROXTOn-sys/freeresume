import { supabase } from './supabase';

/**
 * Check if user can download for free or needs to pay
 * Returns { canDownload, isPaid, downloadCount }
 */
export async function checkDownloadAccess() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return { canDownload: false, isPaid: false, downloadCount: 0, noAuth: true };

  const res = await fetch('/api/check-download', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return { canDownload: true, isPaid: false, downloadCount: 0 }; // Fallback: allow
  return await res.json();
}

/**
 * Initiate Razorpay payment flow
 * Returns a promise that resolves when payment is complete
 */
export function initiatePayment() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { reject(new Error('Not authenticated')); return; }

      // Create order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const orderData = await orderRes.json();

      if (orderData.alreadyPaid) { resolve({ alreadyPaid: true }); return; }
      if (!orderData.orderId) { reject(new Error('Failed to create order')); return; }

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => openCheckout(orderData, session.access_token, resolve, reject);
        document.head.appendChild(script);
      } else {
        openCheckout(orderData, session.access_token, resolve, reject);
      }
    } catch (err) {
      reject(err);
    }
  });
}

function openCheckout(orderData, accessToken, resolve, reject) {
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'ResumeLab',
    description: 'Unlimited Resume Downloads',
    order_id: orderData.orderId,
    handler: async function (response) {
      // Verify payment on server
      try {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });
        const result = await verifyRes.json();
        if (result.success) {
          resolve({ paid: true });
        } else {
          reject(new Error('Payment verification failed'));
        }
      } catch (err) {
        reject(err);
      }
    },
    modal: {
      ondismiss: function () {
        reject(new Error('Payment cancelled'));
      },
    },
    theme: {
      color: '#6C63FF',
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
