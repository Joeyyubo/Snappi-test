import React from 'react';
import {
  Alert,
  AlertVariant,
  AlertActionLink,
  Button
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';

/**
 * Fixed top-right info notice after Edit API key (PatternFly info alert).
 */
const APIKeyUpdatedToast = ({ api, keyName, updates, onClose, onViewDetails }) => (
  <div
    role="region"
    aria-label="API key updated"
    style={{
      position: 'fixed',
      top: 'var(--pf-t--global--spacer--md)',
      right: 'var(--pf-t--global--spacer--md)',
      zIndex: 600,
      width: 'min(calc(100vw - var(--pf-t--global--spacer--xl)), 22rem)',
      maxWidth: '100%',
      pointerEvents: 'auto'
    }}
  >
    <Alert
      variant={AlertVariant.info}
      isLiveRegion
      title="API key updated"
      actionClose={
        <Button variant="plain" onClick={onClose} aria-label="Dismiss notification" icon={<TimesIcon />} />
      }
      actionLinks={
        <AlertActionLink component="button" type="button" onClick={onViewDetails}>
          View details
        </AlertActionLink>
      }
    >
      <div style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}>
        <span style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>API: </span>
        {api}
      </div>
      <div style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}>
        <span style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>API key name: </span>
        {keyName}
      </div>
      <div
        style={{
          wordBreak: 'break-word',
          color: 'var(--pf-t--global--text--color--regular)'
        }}
      >
        <span style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>Updates: </span>
        {updates}
      </div>
    </Alert>
  </div>
);

export default APIKeyUpdatedToast;
