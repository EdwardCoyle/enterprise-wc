const RAF = window.requestAnimationFrame;
const CAF = window.cancelAnimationFrame;

export type FrameRequestLoopHandler = {
  value?: number;
};

/**
 * Behaves similarly to `setInterval`, using `requestAnimationFrame()` where possible for better performance
 * @param {FrameRequestCallback} fn The callback function
 * @param {number} delay The delay in milliseconds
 * @returns {number} loop handle
 */
export function requestAnimationInterval(fn: FrameRequestCallback, delay: number): FrameRequestLoopHandler {
  if (!RAF) return { value: setTimeout(fn, delay) };

  let start = new Date().getTime();
  const handle: FrameRequestLoopHandler = {};

  const loop = (): void => {
    const current = new Date().getTime();
    const delta = current - start;

    if (delta >= delay) {
      fn(current);
      start = new Date().getTime();
    }

    handle.value = RAF(loop);
  };

  handle.value = RAF(loop);
  return handle;
}

/**
 * Behaves similarly to `clearInterval`, using `cancelAnimationFrame()` where possible for better performance
 * @param {FrameRequestLoopHandler} handle The callback function
 */
export function clearAnimationInterval(handle: FrameRequestLoopHandler) {
  if (handle?.value) {
    if (!CAF) clearInterval(handle.value);
    else CAF(handle.value);
  }
}

/**
 * Behaves similarly to `setTimeout`, using `requestAnimationFrame()` where possible for better performance
 * @param {FrameRequestCallback} fn The callback function
 * @param {number} delay The delay in milliseconds
 * @returns {number} loop handle
 */
export function requestAnimationTimeout(fn: FrameRequestCallback, delay: number): FrameRequestLoopHandler {
  if (!RAF) return { value: setTimeout(fn, delay) };

  const start = new Date().getTime();
  const handle: FrameRequestLoopHandler = {};

  const loop = (): void => {
    const current = new Date().getTime();
    const delta = current - start;

    if (delta >= delay) fn(current);
    else handle.value = RAF(loop);
  };

  handle.value = RAF(loop);
  return handle;
}

/**
 * Behaves similarly to `clearTimeout`, using `cancelAnimationFrame()` where possible for better performance
 * @param {FrameRequestLoopHandler} handle The callback function
 */
export function clearAnimationTimeout(handle: FrameRequestLoopHandler) {
  if (handle?.value) {
    if (!CAF) clearTimeout(handle.value);
    else CAF(handle.value);
  }
}
