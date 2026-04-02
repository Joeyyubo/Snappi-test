import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  Form,
  FormGroup,
  TextArea,
  Label,
  Flex,
  Icon,
  Content,
  ContentVariants,
  Tooltip
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, TableGridBreakpoint } from '@patternfly/react-table';
import { ExclamationCircleIcon, TimesIcon } from '@patternfly/react-icons';
import { pf } from '../styles/pf6Tokens';

/** ~1 header row + 4½ compact body rows — fifth row peeks so scrolling is discoverable */
const BULK_SUMMARY_SCROLL_MAX_HEIGHT = 'calc(3rem + 4.5 * 2.75rem)';

/** Narrower than full modal width; left-aligned with intro copy; +24px width vs base 28rem */
const BULK_SUMMARY_TABLE_OUTER_STYLE = {
  maxWidth: 'min(100%, calc(28rem + 24px))',
  width: '100%'
};

const BULK_SUMMARY_STICKY_TH_STYLE = {
  position: 'sticky',
  top: 0,
  zIndex: 2,
  backgroundColor: pf.color.bgPrimary,
  boxShadow: `0 1px 0 ${pf.color.borderDefault}`
};

/** Shown on row remove control */
const BULK_REMOVE_FROM_BATCH_TOOLTIP = 'Remove from this batch.';

function SelectedRowsTable({ rows, onRemoveRow, onNavigateToApiCatalog }) {
  const scrollable = rows.length > 4;
  const thStyle = scrollable ? BULK_SUMMARY_STICKY_TH_STYLE : undefined;

  const table = (
    <Table
      aria-label="Selected Toki requests"
      variant="compact"
      gridBreakPoint={TableGridBreakpoint.none}
      style={{ tableLayout: 'fixed', width: '100%' }}
    >
      <colgroup>
        <col style={{ width: '20%' }} />
        <col style={{ width: '20%' }} />
        <col style={{ width: '36%' }} />
        <col style={{ width: '14%' }} />
        <col style={{ width: '2.75rem' }} />
      </colgroup>
      <Thead>
        <Tr>
          <Th style={thStyle}>Requester</Th>
          <Th style={thStyle}>Toki name</Th>
          <Th style={thStyle}>Roni</Th>
          <Th style={thStyle}>Tier</Th>
          <Th screenReaderText="Remove from list" style={{ ...thStyle, width: '2.75rem' }} />
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.id}>
            <Td style={{ verticalAlign: 'middle' }}>{row.owner}</Td>
            <Td style={{ verticalAlign: 'middle' }}>{row.name}</Td>
            <Td style={{ verticalAlign: 'middle' }}>
              <Button
                variant="link"
                isInline
                onClick={() => onNavigateToApiCatalog?.(row.api)}
              >
                {row.api}
              </Button>
            </Td>
            <Td style={{ verticalAlign: 'middle' }}>
              <Label variant="outline" isCompact>
                {row.tier}
              </Label>
            </Td>
            <Td
              style={{
                verticalAlign: 'middle',
                textAlign: 'end',
                width: '2.75rem',
                paddingInlineEnd: pf.space.sm
              }}
            >
              <Tooltip content={BULK_REMOVE_FROM_BATCH_TOOLTIP}>
                <Button
                  variant="plain"
                  aria-label={`Remove ${row.api} from this batch`}
                  onClick={() => onRemoveRow(row.id)}
                >
                  <TimesIcon />
                </Button>
              </Tooltip>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  if (!scrollable) {
    return <div style={BULK_SUMMARY_TABLE_OUTER_STYLE}>{table}</div>;
  }

  return (
    <div style={BULK_SUMMARY_TABLE_OUTER_STYLE}>
      <div
        role="region"
        aria-label="Selected Toki requests"
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          maxHeight: BULK_SUMMARY_SCROLL_MAX_HEIGHT,
          paddingInlineEnd: pf.space.md,
          scrollbarGutter: 'stable'
        }}
      >
        {table}
      </div>
    </div>
  );
}

/**
 * Bulk approve pending requests — opens from toolbar after multi-select.
 */
export function BulkApproveApiKeysModal({ onClose, initialRows, onConfirm, onNavigateToApiCatalog }) {
  const [includedIds, setIncludedIds] = useState(() => new Set(initialRows.map((r) => r.id)));
  const [confirmed, setConfirmed] = useState(false);

  const rows = useMemo(
    () => initialRows.filter((r) => includedIds.has(r.id)),
    [initialRows, includedIds]
  );
  const n = rows.length;

  /** Removing the last row abandons bulk approve — close without submitting (same as cancel). */
  useEffect(() => {
    if (includedIds.size === 0) {
      onClose();
    }
  }, [includedIds.size, onClose]);

  const removeRow = (id) => {
    setIncludedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const canSubmit = confirmed && n > 0;

  return (
    <Modal isOpen onClose={onClose} variant="small" aria-labelledby="bulk-approve-api-keys-title">
      <ModalHeader title={`Approve ${n} Toki`} labelId="bulk-approve-api-keys-title" />
      <ModalBody>
        <Content
          component={ContentVariants.p}
          style={{
            marginBottom: 'var(--pf-t--global--spacer--sm)',
            color: 'var(--pf-t--global--text--color--regular)'
          }}
        >
          You are about to approve the following Toki:
        </Content>
        <SelectedRowsTable
          rows={rows}
          onRemoveRow={removeRow}
          onNavigateToApiCatalog={onNavigateToApiCatalog}
        />
        <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
          <Checkbox
            id="bulk-approve-confirm"
            isChecked={confirmed}
            onChange={(_e, checked) => setConfirmed(checked)}
            label={`Yes, I confirm that I want to approve these ${n} Toki.`}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="primary"
          isDisabled={!canSubmit}
          onClick={() => {
            onConfirm(rows.map((r) => r.id));
            onClose();
          }}
        >
          Approve
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/**
 * Bulk reject pending requests — opens from toolbar after multi-select.
 */
export function BulkRejectApiKeysModal({ onClose, initialRows, onConfirm, onNavigateToApiCatalog }) {
  const [includedIds, setIncludedIds] = useState(() => new Set(initialRows.map((r) => r.id)));
  const [confirmed, setConfirmed] = useState(false);
  const [reason, setReason] = useState('');

  const rows = useMemo(
    () => initialRows.filter((r) => includedIds.has(r.id)),
    [initialRows, includedIds]
  );
  const n = rows.length;

  /** Removing the last row abandons bulk reject — close without submitting (same as cancel). */
  useEffect(() => {
    if (includedIds.size === 0) {
      onClose();
    }
  }, [includedIds.size, onClose]);

  const removeRow = (id) => {
    setIncludedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const trimmedReason = reason.trim();
  const canSubmit = confirmed && n > 0 && trimmedReason.length > 0;

  const title = (
    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
      <Icon size="md" status="danger" style={{ flexShrink: 0 }}>
        <ExclamationCircleIcon />
      </Icon>
      <span id="bulk-reject-api-keys-title">Reject {n} Toki</span>
    </Flex>
  );

  return (
    <Modal isOpen onClose={onClose} variant="small" aria-labelledby="bulk-reject-api-keys-title">
      <ModalHeader title={title} labelId="bulk-reject-api-keys-title" />
      <ModalBody>
        <Content
          component={ContentVariants.p}
          style={{
            marginBottom: 'var(--pf-t--global--spacer--sm)',
            color: 'var(--pf-t--global--text--color--regular)'
          }}
        >
          You are about to reject the following Toki:
        </Content>
        <SelectedRowsTable
          rows={rows}
          onRemoveRow={removeRow}
          onNavigateToApiCatalog={onNavigateToApiCatalog}
        />
        <Form
          id="bulk-reject-form"
          style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSubmit) return;
            onConfirm(rows.map((r) => r.id), trimmedReason);
            onClose();
          }}
        >
          <FormGroup label="Rejection reason" isRequired fieldId="bulk-reject-reason">
            <TextArea
              id="bulk-reject-reason"
              value={reason}
              onChange={(_e, v) => setReason(v)}
              placeholder="Enter a reason for all rejections"
              aria-required
              resizeOrientation="vertical"
              rows={4}
            />
          </FormGroup>
        </Form>
        <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
          <Checkbox
            id="bulk-reject-confirm"
            isChecked={confirmed}
            onChange={(_e, checked) => setConfirmed(checked)}
            label={`Yes, I confirm that I want to reject these ${n} Toki.`}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="danger" type="submit" form="bulk-reject-form" isDisabled={!canSubmit}>
          Reject
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
