import React from 'react';
import {
  Alert,
  AlertVariant,
  AlertActionLink,
  Button
} from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import TokiToastFrame from './TokiToastFrame';

/** Info notice after Edit Toki (PatternFly info alert). */
const TokiUpdatedToast = ({ api, keyName, updates, onClose, onViewDetails }) => (
  <TokiToastFrame aria-label="Toki updated" onClose={onClose}>
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
  </TokiToastFrame>
);

export default TokiUpdatedToast;
