import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  TextArea,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Flex,
  Icon
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { TIER_TOOLTIPS, USE_CASE_EXPANDED_TEXT } from '../data/apiCredentialsModel';

const dtStyle = {
  fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
  color: 'var(--pf-t--global--text--color--subtle)'
};

function RequestSummaryBody({ row }) {
  const useCaseText = row.useCase || USE_CASE_EXPANDED_TEXT;
  const tierNote = TIER_TOOLTIPS[row.tier] || `${row.tier} tier`;
  return (
    <DescriptionList isHorizontal isCompact>
      <DescriptionListGroup>
        <DescriptionListTerm style={dtStyle}>Requester</DescriptionListTerm>
        <DescriptionListDescription>{row.owner}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm style={dtStyle}>Toki name</DescriptionListTerm>
        <DescriptionListDescription>{row.name}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm style={dtStyle}>Roni</DescriptionListTerm>
        <DescriptionListDescription>{row.api}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm style={dtStyle}>Tier</DescriptionListTerm>
        <DescriptionListDescription>
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
            <Label variant="outline" isCompact>
              {row.tier}
            </Label>
            <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{tierNote}</span>
          </Flex>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm style={dtStyle}>Use case</DescriptionListTerm>
        <DescriptionListDescription>
          <span
            style={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              color: 'var(--pf-t--global--text--color--regular)'
            }}
          >
            {useCaseText}
          </span>
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
}

/**
 * Approve a pending API key request — same modal width as Request API key (`variant="small"`).
 */
export function ApproveApiKeyModal({ isOpen, onClose, row, onApprove }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant="small"
      aria-labelledby="approve-api-key-title"
    >
      <ModalHeader title="Approve Toki" labelId="approve-api-key-title" />
      <ModalBody>{row ? <RequestSummaryBody row={row} /> : null}</ModalBody>
      <ModalFooter>
        <Button
          key="approve"
          variant="primary"
          onClick={() => {
            if (row) onApprove?.(row);
            onClose();
          }}
        >
          Approve
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/**
 * Reject a pending API key request — same modal width as Request API key (`variant="small"`).
 */
export function RejectApiKeyModal({ isOpen, onClose, row, onReject }) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (isOpen) setReason('');
  }, [isOpen]);

  const trimmed = reason.trim();
  const canReject = trimmed.length > 0;

  const title = (
    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
      <Icon size="md" status="danger" style={{ flexShrink: 0 }}>
        <ExclamationCircleIcon />
      </Icon>
      <span id="reject-api-key-title">Reject Toki</span>
    </Flex>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="small" aria-labelledby="reject-api-key-title">
      <ModalHeader title={title} labelId="reject-api-key-title" />
      <ModalBody>
        {row ? (
          <>
            <RequestSummaryBody row={row} />
            <Form
              id="reject-api-key-form"
              style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}
              onSubmit={(e) => {
                e.preventDefault();
                if (!canReject || !row) return;
                onReject?.(row, trimmed);
                onClose();
              }}
            >
              <FormGroup label="Rejection reason" isRequired fieldId="reject-api-key-reason">
                <TextArea
                  id="reject-api-key-reason"
                  value={reason}
                  onChange={(_e, v) => setReason(v)}
                  placeholder="Enter a reason for rejection"
                  aria-required
                  resizeOrientation="vertical"
                  rows={4}
                />
              </FormGroup>
            </Form>
          </>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button
          key="reject"
          variant="danger"
          type="submit"
          form="reject-api-key-form"
          isDisabled={!canReject}
        >
          Reject
        </Button>
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
