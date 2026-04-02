import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TextInput,
  InputGroup,
  Tooltip,
  Checkbox
} from '@patternfly/react-core';
import { CopyIcon } from '@patternfly/react-icons';

const REVEALED_API_KEY = 'KAsDZ-U1pWW-KAsDZ-UhpBx-182jsP';

/**
 * Shared reveal flow for list + detail pages; parent tracks revealedKeyIds.
 */
const RevealApiKeyModal = ({ rowId, onClose, onRevealed }) => {
  const [revealStep, setRevealStep] = useState(1);
  const [revealAcknowledged, setRevealAcknowledged] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState('Copy to clipboard');

  useEffect(() => {
    if (rowId) {
      setRevealStep(1);
      setRevealAcknowledged(false);
      setCopyTooltip('Copy to clipboard');
    }
  }, [rowId]);

  const closeRevealModal = () => {
    if (revealStep === 2 && rowId) {
      onRevealed(rowId);
    }
    onClose();
    setRevealStep(1);
    setRevealAcknowledged(false);
  };

  const handleRevealConfirm = () => {
    setRevealStep(2);
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(REVEALED_API_KEY);
      setCopyTooltip('Copied!');
      setTimeout(() => setCopyTooltip('Copy to clipboard'), 2000);
    } catch {
      setCopyTooltip('Copy failed');
    }
  };

  const canCloseRevealModal = revealStep === 1 || revealAcknowledged;

  return (
    <Modal
      title="Reveal Toki"
      isOpen={!!rowId}
      onClose={() => canCloseRevealModal && closeRevealModal()}
      variant="small"
    >
      <ModalHeader title="Reveal Toki" titleIconVariant="warning" />
      <ModalBody>
        {revealStep === 1 && (
          <p>
            The Toki can only be viewed <strong>once</strong>. After you reveal it, you will not be able to retrieve it
            again.
          </p>
        )}
        {revealStep === 2 && (
          <>
            <p style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
              Make sure to copy and store it securely before closing this view.
            </p>
            <div style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
              <label
                htmlFor="reveal-api-key-input"
                style={{ display: 'block', fontWeight: 700, marginBottom: 'var(--pf-t--global--spacer--xs)' }}
              >
                Toki
              </label>
              <InputGroup>
                <Tooltip content={REVEALED_API_KEY}>
                  <span tabIndex={0} style={{ flex: '1 1 auto', minWidth: 0, display: 'block' }}>
                    <TextInput
                      id="reveal-api-key-input"
                      type="text"
                      value={REVEALED_API_KEY}
                      isReadOnly
                      aria-label="Toki"
                      style={{ width: '100%', textOverflow: 'ellipsis' }}
                    />
                  </span>
                </Tooltip>
                <Tooltip content={copyTooltip}>
                  <Button variant="plain" aria-label="Copy to clipboard" onClick={handleCopyKey} icon={<CopyIcon />} />
                </Tooltip>
              </InputGroup>
            </div>
            <Checkbox
              id="reveal-acknowledge"
              isChecked={revealAcknowledged}
              onChange={(_, checked) => setRevealAcknowledged(checked)}
              label="I've copied the Toki and I'm aware that it's only shown once."
            />
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {revealStep === 1 && (
          <>
            <Button variant="primary" onClick={handleRevealConfirm}>
              Reveal
            </Button>
            <Button variant="link" onClick={closeRevealModal}>
              Cancel
            </Button>
          </>
        )}
        {revealStep === 2 && (
          <Button variant="primary" onClick={closeRevealModal} isDisabled={!revealAcknowledged}>
            Close
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default RevealApiKeyModal;
