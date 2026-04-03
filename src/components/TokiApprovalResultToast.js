import React from 'react';
import { Alert, AlertVariant, Button } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import TokiToastFrame from './TokiToastFrame';

const detailLineStyle = { marginBottom: 'var(--pf-t--global--spacer--xs)' };
const labelStyle = { fontWeight: 'var(--pf-t--global--font--weight--body--bold)' };

/**
 * Transient success / info after approve or reject on Toki approval (single or bulk).
 *
 * @param {{ kind: 'approve' | 'reject'; count: number; api?: string; requester?: string; onClose: () => void }} props
 */
const TokiApprovalResultToast = ({ kind, count, api, requester, onClose }) => {
  const isApprove = kind === 'approve';
  const variant = isApprove ? AlertVariant.success : AlertVariant.info;
  const title =
    count === 1
      ? isApprove
        ? 'Toki request approved'
        : 'Toki request rejected'
      : isApprove
        ? `Approved ${count} Toki requests`
        : `Rejected ${count} Toki requests`;

  return (
    <TokiToastFrame aria-label={title} onClose={onClose}>
      <Alert
        variant={variant}
        isLiveRegion
        title={title}
        actionClose={
          <Button variant="plain" onClick={onClose} aria-label="Dismiss notification" icon={<TimesIcon />} />
        }
      >
        {api ? (
          <div style={requester ? detailLineStyle : undefined}>
            <span style={labelStyle}>Roni: </span>
            {api}
          </div>
        ) : null}
        {requester ? (
          <div>
            <span style={labelStyle}>Requester: </span>
            {requester}
          </div>
        ) : null}
      </Alert>
    </TokiToastFrame>
  );
};

export default TokiApprovalResultToast;
