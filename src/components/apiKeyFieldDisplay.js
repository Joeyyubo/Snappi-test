import React from 'react';
import { Icon, Spinner, Tooltip } from '@patternfly/react-core';
import { EyeIcon, EyeSlashIcon } from '@patternfly/react-icons';

/**
 * Renders the Toki column / detail field to match My Toki table behavior.
 */
export function renderApiKeyField({
  status,
  rowId,
  apiKeyState,
  revealedKeyIds,
  onOpenReveal,
  interactive = true
}) {
  if (status !== 'Active') {
    return <span>-</span>;
  }
  const isRevealed = revealedKeyIds.has(rowId);
  if (apiKeyState === 'viewed' || isRevealed) {
    const disabledColor = 'var(--pf-t--global--color--disabled--200)';
    return (
      <Tooltip content="The Toki has already been viewed and can not be retrieved again.">
        <span
          style={{
            color: disabledColor,
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          <Icon style={{ marginRight: '6px', color: disabledColor }}>
            <EyeSlashIcon />
          </Icon>
          Already viewed
        </span>
      </Tooltip>
    );
  }
  if (apiKeyState === 'masked') {
    const inner = (
      <span
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={
          interactive
            ? (e) => {
                e.stopPropagation();
                onOpenReveal?.(rowId);
              }
            : undefined
        }
        onKeyDown={
          interactive
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onOpenReveal?.(rowId);
                }
              }
            : undefined
        }
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: interactive ? 'pointer' : 'default',
          outline: 'none'
        }}
      >
        <Icon style={{ marginRight: '6px', color: 'var(--pf-t--global--text--color--link--default)' }}>
          <EyeIcon />
        </Icon>
        ••••••••••••••••
      </span>
    );
    return (
      <Tooltip content="Reveal Toki (one-time only)">
        {inner}
      </Tooltip>
    );
  }
  if (apiKeyState === 'generating') {
    return (
      <span>
        <Spinner size="sm" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
        Awaiting secret..
      </span>
    );
  }
  return <span>-</span>;
}
