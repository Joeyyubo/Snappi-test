import React from 'react';
import { Button, Tooltip } from '@patternfly/react-core';

/** Max characters shown before "..." for API key names in lists and headings. */
export const API_KEY_NAME_DISPLAY_MAX_LEN = 20;

/** Same limit for Owner, API, and other table cells. */
export const TABLE_CELL_DISPLAY_MAX_LEN = API_KEY_NAME_DISPLAY_MAX_LEN;

/**
 * @param {string|null|undefined} value
 * @param {number} [maxLen]
 * @returns {{ display: string, full: string, isTruncated: boolean }}
 */
export function getTruncatedTableDisplay(value, maxLen = TABLE_CELL_DISPLAY_MAX_LEN) {
  const s = value == null ? '' : String(value);
  if (s.length <= maxLen) {
    return { display: s, full: s, isTruncated: false };
  }
  return {
    display: `${s.slice(0, maxLen)}...`,
    full: s,
    isTruncated: true
  };
}

/**
 * @param {string|null|undefined} name
 * @returns {{ display: string, full: string, isTruncated: boolean }}
 */
export function getApiKeyNameTableDisplay(name) {
  return getTruncatedTableDisplay(name, API_KEY_NAME_DISPLAY_MAX_LEN);
}

const fullTextWrapStyle = {
  whiteSpace: 'normal',
  wordBreak: 'break-word',
  overflowWrap: 'anywhere'
};

/**
 * Inline API key name; if truncated with "...", full value is shown in a Tooltip on hover/focus.
 * Set `truncate={false}` for detail pages and anywhere the full name must show with no tooltip.
 */
export function ApiKeyNameText({ name, style, className, truncate = true }) {
  if (!truncate) {
    const text = name == null ? '' : String(name);
    return (
      <span style={{ ...fullTextWrapStyle, ...style }} className={className}>
        {text}
      </span>
    );
  }
  const { display, full, isTruncated } = getApiKeyNameTableDisplay(name);
  const span = (
    <span style={style} className={className} tabIndex={isTruncated ? 0 : undefined}>
      {display}
    </span>
  );
  return isTruncated ? <Tooltip content={full}>{span}</Tooltip> : span;
}

/**
 * Plain table cell text: max length + "...", full string in Tooltip when truncated.
 */
export function TruncatedTableText({ text, maxLen, style, className }) {
  const { display, full, isTruncated } = getTruncatedTableDisplay(text, maxLen);
  const span = (
    <span style={style} className={className} tabIndex={isTruncated ? 0 : undefined}>
      {display}
    </span>
  );
  return isTruncated ? <Tooltip content={full}>{span}</Tooltip> : span;
}

/**
 * Link-style table cell (API name, etc.): truncated label with Tooltip when needed.
 */
export function TruncatedTableLink({ text, href = '#', maxLen, onClick, ...buttonProps }) {
  const { display, full, isTruncated } = getTruncatedTableDisplay(text, maxLen);
  const btn = (
    <Button variant="link" isInline component="a" href={href} onClick={onClick} {...buttonProps}>
      {display}
    </Button>
  );
  return isTruncated ? <Tooltip content={full}>{btn}</Tooltip> : btn;
}
