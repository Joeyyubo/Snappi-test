import React, { useEffect, useMemo, useState } from 'react';
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
  Select,
  SelectOption,
  MenuToggle,
  Label,
  Flex,
  Icon,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Dropdown,
  DropdownList,
  DropdownItem,
  SearchInput,
  Content,
  ContentVariants,
  Popover,
  Tooltip
} from '@patternfly/react-core';
import { CheckIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import {
  EDIT_MODAL_TIER_OPTIONS,
  REQUESTABLE_API_NAMES,
  API_KEY_NAME_PATTERN,
  API_KEY_NAME_FORMAT_ERROR,
  API_KEY_NAME_DUPLICATE_ERROR
} from '../data/apiCredentialsModel';
import { QuestionCircleHelpTrigger } from './QuestionCircleHelpTrigger';

/**
 * Request a new Toki — same modal width as Edit Toki (`variant="small"`).
 * Tier stays disabled until a Roni is selected.
 */
const RequestTokiModal = ({ isOpen, onClose, onSubmit, existingKeyNames = [] }) => {
  const [api, setApi] = useState('');
  const [tier, setTier] = useState('');
  const [name, setName] = useState('');
  const [useCase, setUseCase] = useState('');
  const [apiSelectOpen, setApiSelectOpen] = useState(false);
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [tierSelectOpen, setTierSelectOpen] = useState(false);

  const tierEnabled = Boolean(api);

  useEffect(() => {
    if (isOpen) {
      setApi('');
      setTier('');
      setName('');
      setUseCase('');
      setApiSelectOpen(false);
      setApiSearchQuery('');
      setTierSelectOpen(false);
    }
  }, [isOpen]);

  const filteredApiNames = useMemo(() => {
    const q = apiSearchQuery.trim().toLowerCase();
    if (!q) return REQUESTABLE_API_NAMES;
    return REQUESTABLE_API_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [apiSearchQuery]);

  const existingNamesLower = useMemo(
    () =>
      new Set(
        existingKeyNames
          .map((n) => String(n ?? '').trim().toLowerCase())
          .filter((n) => n.length > 0)
      ),
    [existingKeyNames]
  );

  const trimmedKeyName = name.trim();
  /** @type {'format' | 'duplicate' | null} */
  const nameValidationError = useMemo(() => {
    if (!trimmedKeyName) return null;
    if (!API_KEY_NAME_PATTERN.test(trimmedKeyName)) return 'format';
    if (existingNamesLower.has(trimmedKeyName.toLowerCase())) return 'duplicate';
    return null;
  }, [trimmedKeyName, existingNamesLower]);

  const handleApiSelect = (_event, selection) => {
    setApi(selection);
    setTier('');
    setApiSelectOpen(false);
    setApiSearchQuery('');
    setTierSelectOpen(false);
  };

  const handleApiDropdownOpenChange = (open) => {
    setApiSelectOpen(open);
    if (!open) {
      setApiSearchQuery('');
    }
  };

  const handleTierSelect = (_event, selection) => {
    setTier(selection);
    setTierSelectOpen(false);
  };

  const handleRequest = () => {
    if (!api || !tier) return;
    const trimmedName = name.trim();
    if (trimmedName) {
      if (!API_KEY_NAME_PATTERN.test(trimmedName)) return;
      if (existingNamesLower.has(trimmedName.toLowerCase())) return;
    }
    const trimmedUseCase = useCase.trim();
    onSubmit({
      api,
      tier,
      name: trimmedName || undefined,
      useCase: trimmedUseCase
    });
    onClose();
  };

  const selectedTierMeta = EDIT_MODAL_TIER_OPTIONS.find((o) => o.value === tier);

  const tierToggleDisplay = selectedTierMeta ? (
    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
      <Label variant="outline" isCompact>
        {tier}
      </Label>
      <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{selectedTierMeta.description}</span>
    </Flex>
  ) : (
    'Select...'
  );

  const apiToggleDisplay = api || 'Select...';

  const canRequest = Boolean(api && tier && !nameValidationError);

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="small" aria-labelledby="request-api-key-title">
      <ModalHeader title="Request Toki" labelId="request-api-key-title" />
      <ModalBody>
        <Content
          component={ContentVariants.p}
          style={{ marginBottom: 'var(--pf-t--global--spacer--lg)', color: 'var(--pf-t--global--text--color--subtle)' }}
        >
          Provide details to request a new Toki for accessing Roni.
        </Content>
        <Form
          id="request-api-key-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleRequest();
          }}
        >
          <FormGroup role="group" label="Roni" isRequired fieldId="request-api-key-api">
            <div style={{ width: '100%' }}>
              <Dropdown
                isOpen={apiSelectOpen}
                onOpenChange={handleApiDropdownOpenChange}
                onSelect={(_e, value) => {
                  if (value) {
                    handleApiSelect(_e, value);
                  }
                }}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    onClick={() => setApiSelectOpen((prev) => !prev)}
                    isExpanded={apiSelectOpen}
                    variant="default"
                    id="request-api-key-api-toggle"
                    aria-label="Roni"
                    isFullWidth
                    isPlaceholder={!api}
                  >
                    {api ? (
                      <Tooltip content={api}>
                        <span
                          tabIndex={0}
                          style={{
                            textAlign: 'start',
                            width: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block'
                          }}
                        >
                          {apiToggleDisplay}
                        </span>
                      </Tooltip>
                    ) : (
                      <span
                        style={{
                          textAlign: 'start',
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block'
                        }}
                      >
                        {apiToggleDisplay}
                      </span>
                    )}
                  </MenuToggle>
                )}
                isScrollable
                maxMenuHeight="16rem"
                shouldFocusFirstItemOnOpen={false}
              >
              <div
                style={{
                  padding: 'var(--pf-t--global--spacer--sm)',
                  borderBottom: '1px solid var(--pf-t--global--border--color--default)'
                }}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <SearchInput
                  id="request-api-key-api-search"
                  placeholder="Find by Roni"
                  value={apiSearchQuery}
                  onChange={(_e, v) => setApiSearchQuery(v)}
                  onClear={() => setApiSearchQuery('')}
                  aria-label="Find by Roni"
                  style={{ width: '100%' }}
                />
              </div>
              {filteredApiNames.length > 0 ? (
                <DropdownList>
                  {filteredApiNames.map((n) => (
                    <DropdownItem key={n} value={n}>
                      {n}
                    </DropdownItem>
                  ))}
                </DropdownList>
              ) : (
                <div
                  style={{
                    padding: 'var(--pf-t--global--spacer--md)',
                    maxWidth: '100%',
                    textAlign: 'center'
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <p
                    style={{
                      margin: 0,
                      color: 'var(--pf-t--global--text--color--subtle)',
                      fontSize: 'var(--pf-t--global--font--size--body--default)'
                    }}
                  >
                    No results match your search.
                  </p>
                </div>
              )}
              </Dropdown>
            </div>
            {!api ? (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>Select a Roni. Submit a separate request for each additional Roni.</HelperTextItem>
                </HelperText>
              </FormHelperText>
            ) : null}
          </FormGroup>

          <FormGroup
            role="group"
            label="Tier"
            isRequired
            fieldId="request-api-key-tier"
            labelHelp={
              <Popover
                aria-label="Tier"
                headerContent="Tier"
                showClose
                closeBtnAriaLabel="Close"
                position="right"
                bodyContent={
                  <p style={{ margin: 0 }}>
                    A Tier is a set of rate limits defined within the PlanPolicy.
                  </p>
                }
              >
                <QuestionCircleHelpTrigger aria-label="More information about tier" />
              </Popover>
            }
          >
            <div style={{ width: '100%' }}>
              <Select
                id="request-api-key-tier"
                isOpen={tierEnabled && tierSelectOpen}
                selected={tierEnabled ? tier || undefined : undefined}
                onSelect={handleTierSelect}
                onOpenChange={(open) => tierEnabled && setTierSelectOpen(open)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    isDisabled={!tierEnabled}
                    onClick={() => tierEnabled && setTierSelectOpen((prev) => !prev)}
                    isExpanded={tierEnabled && tierSelectOpen}
                    variant="default"
                    id="request-api-key-tier-toggle"
                    aria-label="Tier"
                    isFullWidth
                    isPlaceholder={!tierEnabled || !tier}
                  >
                    {tierEnabled ? (
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
                    ) : (
                      <span style={{ display: 'block', textAlign: 'start', width: '100%' }}>
                        Select a Roni first...
                      </span>
                    )}
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
            {tierEnabled && !tier ? (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>
                    Select a tier to define the usage limits for this Toki.
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            ) : null}
          </FormGroup>

          <FormGroup
            role="group"
            label="Toki name"
            fieldId="request-api-key-name"
            validated={nameValidationError ? 'error' : 'default'}
          >
            <TextInput
              id="request-api-key-name"
              value={name}
              onChange={(_e, v) => setName(v)}
              aria-label="Toki name"
              aria-invalid={nameValidationError ? true : undefined}
              validated={nameValidationError ? 'error' : 'default'}
              style={{ width: '100%' }}
            />
            {nameValidationError ? (
              <FormHelperText>
                <HelperText>
                  {nameValidationError === 'format' ? (
                    <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
                      {API_KEY_NAME_FORMAT_ERROR}
                    </HelperTextItem>
                  ) : (
                    <HelperTextItem variant="error" icon={<ExclamationCircleIcon />}>
                      {API_KEY_NAME_DUPLICATE_ERROR}
                    </HelperTextItem>
                  )}
                </HelperText>
              </FormHelperText>
            ) : !trimmedKeyName ? (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>
                    A unique name to identify this Toki. If left blank, a name is automatically generated.
                  </HelperTextItem>
                </HelperText>
              </FormHelperText>
            ) : null}
          </FormGroup>

          <FormGroup role="group" label="Use case" fieldId="request-api-key-use-case">
            <TextArea
              id="request-api-key-use-case"
              value={useCase}
              onChange={(_e, v) => setUseCase(v)}
              aria-label="Use case"
              rows={3}
              resizeOrientation="both"
              style={{ width: '100%' }}
            />
            {!useCase.trim() ? (
              <FormHelperText>
                <HelperText>
                  <HelperTextItem>A brief description of how you intend to use this Toki.</HelperTextItem>
                </HelperText>
              </FormHelperText>
            ) : null}
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button key="request" variant="primary" type="submit" form="request-api-key-form" isDisabled={!canRequest}>
          Request
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RequestTokiModal;
