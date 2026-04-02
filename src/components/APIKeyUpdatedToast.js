import React from 'react';
import {
  Alert,
  AlertVariant,
  AlertActionLink,
  Button
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import ApiKeyToastFrame from './ApiKeyToastFrame';

/**
 * Info notice after Edit API key (PatternFly info alert).
 * Renders below masthead; auto-dismisses after PatternFly-style interval.
 */
const APIKeyUpdatedToast = ({ api, keyName, updates, onClose, onViewDetails }) => (
  <ApiKeyToastFrame aria-label="Toki updated" onClose={onClose}>
    <Alert
      variant={AlertVariant.info}
      isLiveRegion
      title="Toki updated"
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
        <span style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>Roni: </span>
        {api}
      </div>
      <div style={{ marginBottom: 'var(--pf-t--global--spacer--xs)' }}>
        <span style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>Toki name: </span>
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
  </ApiKeyToastFrame>
);

export default APIKeyUpdatedToast;
