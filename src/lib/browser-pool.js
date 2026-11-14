// Simple concurrency limiter for Puppeteer
const MAX_CONCURRENT = 3;
const MAX_QUEUE_SIZE = 20;
let active = 0;
const queue = [];

/**
 * Acquire a slot to run Puppeteer. Resolves when a slot is available.
 * Returns a release function to call when done.
 */
export function acquireBrowserSlot() {
  return new Promise((resolve, reject) => {
    const tryAcquire = () => {
      if (active < MAX_CONCURRENT) {
        active++;
        resolve(() => {
          active--;
          if (queue.length > 0) {
            const next = queue.shift();
            next();
          }
        });
      } else {
        if (queue.length >= MAX_QUEUE_SIZE) {
          const error = new Error('PDF rendering queue is full');
          error.code = 'PDF_QUEUE_FULL';
          reject(error);
          return;
        }
        queue.push(tryAcquire);
      }
    };
    tryAcquire();
  });
}
