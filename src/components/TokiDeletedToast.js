import React from 'react';
import { Alert, AlertVariant, Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import TokiToastFrame from './TokiToastFrame';

/**
 * Success notice after Delete Toki (PatternFly success alert).
 * Renders below masthead; auto-dismisses after PatternFly-style interval.
 */
const TokiDeletedToast = ({ api, keyName, onClose }) => (
  <TokiToastFrame aria-label="Toki deleted" onClose={onClose}>
    <Alert
      variant={AlertVariant.success}
      isLiveRegion
      title="Toki deleted"
      actionClose={
        <Button variant="plain" onClick={onClose} aria-label="Dismiss notification" icon={<TimesIcon />} />
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

export default TokiDeletedToast;
