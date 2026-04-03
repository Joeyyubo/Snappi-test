import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * PatternFly-aligned toast duration (common default for transient alerts ~8s).
 * @see https://www.patternfly.org/components/alert/design-guidelines
 */
export const TOKI_TOAST_TIMEOUT_MS = 8000;

/**
 * Above masthead on the z-axis (PF masthead is typically low hundreds).
 * Below masthead on the y-axis: top = masthead height + spacer.
 */
export const TOKI_TOAST_Z_INDEX = 6000;

/**
 * Viewport-fixed position below the masthead; portal to body avoids Page stacking contexts
 * that kept the toast painted under the masthead.
 */
export const tokiToastFrameStyle = {
  position: 'fixed',
  /* Nudge: 16px up on Y, 24px left on X (from prior masthead + md inset) */
  top: 'calc(var(--pf-v6-c-masthead--MinHeight, 5rem) + var(--pf-t--global--spacer--md) - 16px)',
  right: 'calc(var(--pf-t--global--spacer--md) + 24px)',
  zIndex: TOKI_TOAST_Z_INDEX,
  width: 'min(calc(100vw - var(--pf-t--global--spacer--xl)), 22rem)',
  maxWidth: '100%',
  pointerEvents: 'auto'
};

function useTokiToastAutoDismiss(onClose, timeoutMs = TOKI_TOAST_TIMEOUT_MS) {
  useEffect(() => {
    if (typeof onClose !== 'function') return undefined;
    const id = window.setTimeout(onClose, timeoutMs);
    return () => window.clearTimeout(id);
  }, [onClose, timeoutMs]);
}

/**
 * Wrapper for Toki toasts: placement below masthead + auto-dismiss after interval.
 */
const TokiToastFrame = ({ 'aria-label': ariaLabel, onClose, timeoutMs, children }) => {
  useTokiToastAutoDismiss(onClose, timeoutMs ?? TOKI_TOAST_TIMEOUT_MS);

  const node = (
    <div role="region" aria-label={ariaLabel} style={tokiToastFrameStyle}>
      {children}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(node, document.body) : node;
};

export default TokiToastFrame;
