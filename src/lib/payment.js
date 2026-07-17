import { supabase } from './supabase';

/**
 * Check if user can download for free or needs to pay
 */
export async function checkDownloadAccess() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return { canDownload: false, isPaid: false, downloadCount: 0, noAuth: true };

  const res = await fetch('/api/check-download', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return { canDownload: true, isPaid: false, downloadCount: 0 };
  return await res.json();
}

/**
 * Initiate Cashfree payment flow
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
      if (!orderData.paymentSessionId) { reject(new Error('Failed to create order')); return; }

      // Load Cashfree SDK
      if (!window.Cashfree) {
        const script = document.createElement('script');
        script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
        script.onload = () => openCashfreeCheckout(orderData, session.access_token, resolve, reject);
        document.head.appendChild(script);
      } else {
        openCashfreeCheckout(orderData, session.access_token, resolve, reject);
      }
    } catch (err) {
      reject(err);
    }
  });
}

function openCashfreeCheckout(orderData, accessToken, resolve, reject) {
  const cashfree = window.Cashfree({ mode: 'production' });

  cashfree.checkout({
    paymentSessionId: orderData.paymentSessionId,
    redirectTarget: '_modal',
  }).then(async (result) => {
    if (result.error) {
      reject(new Error(result.error.message || 'Payment failed'));
      return;
    }
    if (result.redirect) {
      // Payment is being processed
      return;
    }
    if (result.paymentDetails) {
      // Verify on server
      try {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ orderId: orderData.orderId }),
        });
        const verifyResult = await verifyRes.json();
        if (verifyResult.success) {
          resolve({ paid: true });
        } else {
          reject(new Error('Payment verification failed'));
        }
      } catch (err) {
        reject(err);
      }
    }
  }).catch((err) => {
    if (err.message?.includes('cancelled') || err.message?.includes('closed')) {
      reject(new Error('Payment cancelled'));
    } else {
      reject(err);
    }
  });
}
