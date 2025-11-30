import { useEffect, useRef } from "react";

function noop() {};

/**
 * A hook that manages event listeners for receiving data from client scripts
 * @param {string} action - The specific `action` that should be listened for.
 * @param {(data: any) => void} handler - The callback function that will handle data relayed by this hook
 *
 * @example
 * useNuiEvent('setVisible', (data) => {
 *   // whatever logic you want
 * })
 */
export const useNuiEvent = (action, handler) => {
  const savedHandler = useRef(noop);

  // Make sure we handle for a reactive handler
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event) => {
      const { action: eventAction, data } = event.data || {};

      if (savedHandler.current && eventAction === action) {
        savedHandler.current(data);
      }
    };

    window.addEventListener("message", eventListener);
    return () => window.removeEventListener("message", eventListener);
  }, [action]);
};