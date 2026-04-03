import React from 'react';
import {
  Alert,
  AlertVariant,
  AlertActionLink,
  Button
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import TokiToastFrame from './TokiToastFrame';

/**
 * Success notice after Request Toki (PatternFly success alert).
 */
const RequestTokiSuccessToast = ({ api, keyName, onClose, onViewDetails }) => (
  <TokiToastFrame aria-label="Toki request success" onClose={onClose}>
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
  </TokiToastFrame>
);

export default RequestTokiSuccessToast;
