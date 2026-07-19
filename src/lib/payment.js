import { supabase } from './supabase';

// Preload Cashfree SDK on first import
if (typeof window !== 'undefined' && !document.querySelector('script[src*="cashfree"]')) {
  const script = document.createElement('script');
  script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
  script.async = true;
  document.head.appendChild(script);
}

// Cache for payment status
let cachedAccess = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Check if user can download for free or needs to pay
 */
export async function checkDownloadAccess() {
  // Return cached result if fresh
  if (cachedAccess && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedAccess;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return { canDownload: false, isPaid: false, downloadCount: 0, noAuth: true };

  const res = await fetch('/api/check-download', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!res.ok) return { canDownload: true, isPaid: false, downloadCount: 0 };
  
  const result = await res.json();
  cachedAccess = result;
  cacheTimestamp = Date.now();
  return result;
}

/** Invalidate cache after a successful download or payment */
export function invalidateDownloadCache() {
  cachedAccess = null;
  cacheTimestamp = 0;
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

      if (orderData.alreadyPaid) { invalidateDownloadCache(); resolve({ alreadyPaid: true }); return; }
      if (!orderData.paymentSessionId) { reject(new Error('Failed to create order')); return; }

      // Wait for SDK if still loading
      const waitForSdk = () => new Promise((res) => {
        if (window.Cashfree) { res(); return; }
        const interval = setInterval(() => { if (window.Cashfree) { clearInterval(interval); res(); } }, 100);
        setTimeout(() => { clearInterval(interval); res(); }, 5000);
      });
      await waitForSdk();

      if (!window.Cashfree) { reject(new Error('Payment SDK failed to load')); return; }
      openCashfreeCheckout(orderData, session.access_token, resolve, reject);
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
          invalidateDownloadCache();
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
