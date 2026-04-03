import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  TextInput
} from '@patternfly/react-core';

/**
 * Delete Toki confirmation — typing the exact Toki name enables Delete.
 */
const DeleteTokiModal = ({ credential, isOpen, onClose, onConfirm }) => {
  const [confirmInput, setConfirmInput] = useState('');

  useEffect(() => {
    if (isOpen && credential) {
      setConfirmInput('');
    }
  }, [isOpen, credential?.id]);

  if (!credential) {
    return null;
  }

  const { id, name: expectedName } = credential;
  const trimmed = confirmInput.trim();
  const canDelete = trimmed.length > 0 && trimmed === expectedName;

  let validated = 'default';
  if (trimmed.length > 0) {
    validated = canDelete ? 'success' : 'warning';
  }

  const handleDelete = () => {
    if (!canDelete) return;
    onConfirm(id);
  };

  return (
    <Modal title="Delete Toki" isOpen={isOpen} onClose={onClose} variant="small" aria-labelledby="delete-api-key-title">
      <ModalHeader title="Delete Toki" titleIconVariant="danger" labelId="delete-api-key-title" />
      <ModalBody>
        <p style={{ marginBottom: 'var(--pf-t--global--spacer--lg)', color: 'var(--pf-t--global--text--color--regular)' }}>
          The Toki will be deleted and removed. The deletion will immediately disable access for all applications
          currently using it.
        </p>
        <Form id="delete-api-key-form" onSubmit={(e) => e.preventDefault()}>
          <FormGroup
            role="group"
            fieldId="delete-api-key-confirm"
            label={
              <span style={{ fontWeight: 700 }}>
                Confirm by typing{' '}
                <span style={{ wordBreak: 'break-word' }}>&ldquo;{expectedName}&rdquo;</span>
                {' '}
                below
              </span>
            }
          >
            <TextInput
              id="delete-api-key-confirm"
              value={confirmInput}
              onChange={(_e, v) => setConfirmInput(v)}
              validated={validated}
              aria-label="Type Toki name to confirm deletion"
              autoComplete="off"
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button key="delete" variant="secondary" isDanger isDisabled={!canDelete} onClick={handleDelete}>
          Delete
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteTokiModal;
