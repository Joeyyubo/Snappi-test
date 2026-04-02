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
 * Success notice after Request API key (PatternFly success alert).
 * Renders below masthead; auto-dismisses after PatternFly-style interval.
 */
const RequestApiKeySuccessToast = ({ api, keyName, onClose, onViewDetails }) => (
  <ApiKeyToastFrame aria-label="Toki request success" onClose={onClose}>
    <Alert
      variant={AlertVariant.success}
      isLiveRegion
      title="Toki requested successfully"
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
      <div>
        <span style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>Toki name: </span>
        {keyName}
      </div>
    </Alert>
  </ApiKeyToastFrame>
);

export default RequestApiKeySuccessToast;
