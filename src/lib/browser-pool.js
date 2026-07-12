// Simple concurrency limiter for Puppeteer
const MAX_CONCURRENT = 3;
let active = 0;
const queue = [];

/**
 * Acquire a slot to run Puppeteer. Resolves when a slot is available.
 * Returns a release function to call when done.
 */
export function acquireBrowserSlot() {
  return new Promise((resolve) => {
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
        queue.push(tryAcquire);
      }
    };
    tryAcquire();
  });
}
