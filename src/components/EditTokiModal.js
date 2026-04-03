import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Alert,
  AlertVariant,
  Select,
  SelectOption,
  MenuToggle,
  Label,
  Flex,
  Icon
} from '@patternfly/react-core';
import { CheckIcon } from '@patternfly/react-icons';
import { EDIT_MODAL_TIER_OPTIONS } from '../data/apiCredentialsModel';

const ALLOWED_EDIT_TIERS = new Set(EDIT_MODAL_TIER_OPTIONS.map((o) => o.value));

/**
 * Edit Toki — opened from Toki details or My Toki row actions.
 */
const EditTokiModal = ({ credential, isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [tier, setTier] = useState('');
  const [useCase, setUseCase] = useState('');
  const [tierSelectOpen, setTierSelectOpen] = useState(false);

  useEffect(() => {
    if (credential && isOpen) {
      setName(credential.name || '');
      setUseCase(credential.useCase || '');
      setTier(ALLOWED_EDIT_TIERS.has(credential.tier) ? credential.tier : '');
      setTierSelectOpen(false);
    }
  }, [credential, isOpen]);

  if (!credential) {
    return null;
  }

  const { id, api } = credential;

  const selectedTierMeta = EDIT_MODAL_TIER_OPTIONS.find((o) => o.value === tier);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName || !tier) {
      return;
    }
    onSave(id, { name: trimmedName, tier, useCase: useCase.trim() });
    onClose();
  };

  const handleTierSelect = (_event, selection) => {
    setTier(selection);
    setTierSelectOpen(false);
  };

  const tierToggleDisplay = selectedTierMeta ? (
    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
      <Label variant="outline" isCompact>
        {tier}
      </Label>
      <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{selectedTierMeta.description}</span>
    </Flex>
  ) : (
    'Select tier'
  );

  return (
    <Modal title="Edit Toki" isOpen={isOpen} onClose={onClose} variant="small" aria-labelledby="edit-api-key-title">
      <ModalHeader title="Edit Toki" labelId="edit-api-key-title" />
      <ModalBody>
        <p style={{ marginBottom: 'var(--pf-t--global--spacer--md)', color: 'var(--pf-t--global--text--color--subtle)' }}>
          Update the Toki details such as change tiers or add more details.
        </p>
        <Alert
          variant={AlertVariant.info}
          isInline
          title="The Toki will become pending approval after edition."
          style={{ marginBottom: 'var(--pf-t--global--spacer--lg)' }}
        />
        <Form
          id="edit-api-key-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <FormGroup role="group" label="Roni" fieldId="edit-api-name-readonly">
            <TextInput
              id="edit-api-name-readonly"
              value={api}
              isReadOnly
              readOnlyVariant="default"
              aria-label="Roni (read only)"
            />
          </FormGroup>
          <FormGroup role="group" label="Tier" isRequired fieldId="edit-api-key-tier">
            <div style={{ width: '100%' }}>
              <Select
                id="edit-api-key-tier"
                isOpen={tierSelectOpen}
                selected={tier || undefined}
                onSelect={handleTierSelect}
                onOpenChange={setTierSelectOpen}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setTierSelectOpen((prev) => !prev)}
                    isExpanded={tierSelectOpen}
                    variant="default"
                    id="edit-api-key-tier-toggle"
                    aria-label="Tier"
                    isFullWidth
                    isPlaceholder={!tier}
                  >
                    <div
                      style={{
                        textAlign: 'start',
                        width: '100%',
                        minWidth: 0,
                        overflow: 'hidden'
                      }}
                    >
                      {tierToggleDisplay}
                    </div>
                  </MenuToggle>
                )}
              >
              {EDIT_MODAL_TIER_OPTIONS.map((opt) => (
                <SelectOption key={opt.value} value={opt.value}>
                  <Flex
                    justifyContent={{ default: 'justifyContentSpaceBetween' }}
                    alignItems={{ default: 'alignItemsCenter' }}
                    gap={{ default: 'gapMd' }}
                    style={{ width: '100%' }}
                  >
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
                      <Label variant="outline" isCompact>
                        {opt.value}
                      </Label>
                      <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{opt.description}</span>
                    </Flex>
                    {tier === opt.value ? (
                      <Icon size="sm" status="info">
                        <CheckIcon />
                      </Icon>
                    ) : (
                      <span style={{ width: '1.25rem', flexShrink: 0 }} aria-hidden />
                    )}
                  </Flex>
                </SelectOption>
              ))}
              </Select>
            </div>
          </FormGroup>
          <FormGroup role="group" label="Toki name" isRequired fieldId="edit-api-key-name">
            <TextInput
              id="edit-api-key-name"
              value={name}
              onChange={(_e, v) => setName(v)}
              aria-label="Toki name"
              placeholder="Name of this Toki"
            />
          </FormGroup>
          <FormGroup role="group" label="Use case" fieldId="edit-api-key-use-case">
            <TextArea
              id="edit-api-key-use-case"
              value={useCase}
              onChange={(_e, v) => setUseCase(v)}
              aria-label="Use case"
              placeholder="use case example"
              rows={3}
              resizeOrientation="both"
              style={{ width: '100%' }}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button key="save" variant="primary" type="submit" form="edit-api-key-form">
          Save
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditTokiModal;
