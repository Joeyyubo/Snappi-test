import React, { useState, useMemo, useCallback } from 'react';
import {
  PageSection,
  Title,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Icon,
  SearchInput,
  Divider,
  Checkbox,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarFilter,
  Label,
  Tooltip,
  Popover,
  Flex
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, TableGridBreakpoint } from '@patternfly/react-table';
import {
  FilterIcon,
  EllipsisVIcon,
  CheckCircleIcon,
  PendingIcon,
  ExclamationCircleIcon,
  CaretDownIcon
} from '@patternfly/react-icons';
import {
  buildCredentialsData,
  TIER_LIMIT,
  TIER_TOOLTIPS,
  CREDENTIAL_TIER_OPTIONS,
  USE_CASE_EXPANDED_TEXT
} from '../data/apiCredentialsModel';
import { TierSortableColumnHeader } from './TierSortableColumnHeader';
import { TruncatedTableLink, TruncatedTableText, UseCaseTwoLineCell } from './ApiKeyNameText';
import { ApproveApiKeyModal, RejectApiKeyModal } from './TokiApprovalActionModals';
import { BulkApproveApiKeysModal, BulkRejectApiKeysModal } from './BulkTokiApprovalModals';
import TokiApprovalResultToast from './TokiApprovalResultToast';

/** Wider than shared Tier min — approvals table uses fixed layout; header needs Tier + sort + help */
const APPROVALS_TIER_COLUMN_MIN_WIDTH = '10.75rem';

const APPROVALS_TIER_TH_TD_STYLE = {
  minWidth: APPROVALS_TIER_COLUMN_MIN_WIDTH,
  whiteSpace: 'nowrap',
  verticalAlign: 'middle'
};

/** Tighten checkbox ↔ API: PF table cells use large default padding; col width alone does not remove it. */
const APPROVALS_SELECT_COL_STYLE = {
  verticalAlign: 'middle',
  width: '1.25rem',
  padding: 0,
  paddingInlineStart: 'var(--pf-t--global--spacer--xs)',
  paddingInlineEnd: 0
};

const APPROVALS_API_COL_STYLE = {
  verticalAlign: 'middle',
  paddingInlineStart: 'var(--pf-t--global--spacer--xs)'
};

const APPROVALS_USE_CASE_COL_STYLE = {
  verticalAlign: 'middle',
  color: 'var(--pf-t--global--text--color--subtle)',
  overflow: 'hidden',
  maxWidth: 0,
  paddingInlineEnd: 'var(--pf-t--global--spacer--md)'
};

const APPROVALS_STATUS_COL_STYLE = {
  verticalAlign: 'middle',
  paddingInlineStart: 'var(--pf-t--global--spacer--md)'
};

/** Row actions (kebab): align to table trailing edge like My Toki (fixed layout can widen this cell). */
const APPROVALS_ACTIONS_COL_STYLE = {
  verticalAlign: 'middle',
  textAlign: 'end',
  whiteSpace: 'nowrap'
};

const STATUS_OPTIONS = ['Approved', 'Pending', 'Rejected'];
/** Status column sort: Pending → Approved (Active) → Rejected */
const STATUS_RANK = { Pending: 1, Active: 2, Rejected: 3 };

/** Data layer still uses `Active`; approvals UI shows “Approved”. */
function approvalStatusLabel(status) {
  return status === 'Active' ? 'Approved' : status;
}

function rowMatchesApprovalStatusFilters(rowStatus, filters) {
  if (filters.length === 0) return true;
  return filters.some((f) => {
    if (f === 'Approved') return rowStatus === 'Active';
    return rowStatus === f;
  });
}

const bulkActionButtonStyle = {
  borderRadius: 'var(--pf-t--global--border--radius--large)'
};

const TokiApprovalPage = ({ onNavigateToApiCatalog }) => {
  const [credentialsData, setCredentialsData] = useState(() => buildCredentialsData());

  const [projectOpen, setProjectOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [tierFilterOpen, setTierFilterOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState([]);
  const [tierFilters, setTierFilters] = useState([]);
  const [actionsOpenRowId, setActionsOpenRowId] = useState(null);
  const [approveRow, setApproveRow] = useState(null);
  const [rejectRow, setRejectRow] = useState(null);
  const [bulkApproveRows, setBulkApproveRows] = useState(null);
  const [bulkRejectRows, setBulkRejectRows] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [sortState, setSortState] = useState({
    index: 2,
    direction: 'asc',
    defaultDirection: 'asc'
  });
  const [approvalToast, setApprovalToast] = useState(null);

  const dismissApprovalToast = useCallback(() => setApprovalToast(null), []);

  const handleSort = (_event, index, direction) => {
    setSortState({ index, direction, defaultDirection: 'asc' });
  };

  const clearAllFilters = () => {
    setStatusFilters([]);
    setTierFilters([]);
  };

  const toggleStatusFilter = (value) => {
    setStatusFilters((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const toggleTierFilter = (value) => {
    setTierFilters((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value]
    );
  };

  const filteredCredentials = credentialsData.filter((row) => {
    const q = searchValue.trim().toLowerCase();
    const statusForSearch =
      row.status === 'Active' ? `${approvalStatusLabel(row.status)} active`.toLowerCase() : row.status.toLowerCase();
    const useCaseText = (row.useCase || USE_CASE_EXPANDED_TEXT || '').toLowerCase();
    const reasonText = (row.rejectionReason || '').toLowerCase();
    const matchesSearch =
      !q ||
      (row.name && row.name.toLowerCase().includes(q)) ||
      row.api.toLowerCase().includes(q) ||
      row.owner.toLowerCase().includes(q) ||
      useCaseText.includes(q) ||
      statusForSearch.includes(q) ||
      reasonText.includes(q);
    const matchesStatus = rowMatchesApprovalStatusFilters(row.status, statusFilters);
    const matchesTier = tierFilters.length === 0 || tierFilters.includes(row.tier);
    return matchesSearch && matchesStatus && matchesTier;
  });

  const sortedCredentials = useMemo(() => {
    const list = [...filteredCredentials];
    const { index, direction } = sortState;
    const mult = direction === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (index) {
        case 1:
          cmp = (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
          break;
        case 2:
          cmp = (a.api || '').localeCompare(b.api || '', undefined, { sensitivity: 'base' });
          break;
        case 3: {
          const ua = (a.useCase || USE_CASE_EXPANDED_TEXT) || '';
          const ub = (b.useCase || USE_CASE_EXPANDED_TEXT) || '';
          cmp = ua.localeCompare(ub, undefined, { sensitivity: 'base' });
          break;
        }
        case 4:
          cmp = (STATUS_RANK[a.status] ?? 0) - (STATUS_RANK[b.status] ?? 0);
          break;
        case 5:
          cmp = (TIER_LIMIT[a.tier] ?? 0) - (TIER_LIMIT[b.tier] ?? 0);
          break;
        case 6:
          cmp = (a.owner || '').localeCompare(b.owner || '', undefined, { sensitivity: 'base' });
          break;
        case 7:
          cmp = (a.requestedTime || '').localeCompare(b.requestedTime || '', undefined, { numeric: true });
          break;
        default:
          return 0;
      }
      return mult * cmp;
    });
    return list;
  }, [filteredCredentials, sortState.index, sortState.direction]);

  /** Only Pending rows can be selected (Approved / Rejected checkboxes are disabled). */
  const pendingVisibleIds = useMemo(
    () => sortedCredentials.filter((r) => r.status === 'Pending').map((r) => r.id),
    [sortedCredentials]
  );
  const allVisibleSelected =
    pendingVisibleIds.length > 0 && pendingVisibleIds.every((id) => selectedIds.has(id));
  const someVisibleSelected =
    pendingVisibleIds.some((id) => selectedIds.has(id)) && !allVisibleSelected;

  const toggleSelectAllVisible = (checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        pendingVisibleIds.forEach((id) => next.add(id));
      } else {
        pendingVisibleIds.forEach((id) => next.delete(id));
      }
      return next;
    });
  };

  const toggleRowSelected = (id, checked, rowStatus) => {
    if (rowStatus !== 'Pending') return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const selectedPendingCount = useMemo(() => {
    const pendingIds = new Set(credentialsData.filter((r) => r.status === 'Pending').map((r) => r.id));
    let n = 0;
    selectedIds.forEach((id) => {
      if (pendingIds.has(id)) n += 1;
    });
    return n;
  }, [selectedIds, credentialsData]);

  const openBulkApproveModal = () => {
    if (selectedPendingCount === 0) return;
    const rows = credentialsData.filter((r) => selectedIds.has(r.id) && r.status === 'Pending');
    if (rows.length === 0) return;
    setBulkApproveRows(rows);
  };

  const openBulkRejectModal = () => {
    if (selectedPendingCount === 0) return;
    const rows = credentialsData.filter((r) => selectedIds.has(r.id) && r.status === 'Pending');
    if (rows.length === 0) return;
    setBulkRejectRows(rows);
  };

  const handleBulkApproveByIds = (ids) => {
    const idSet = new Set(ids);
    setCredentialsData((prev) =>
      prev.map((r) =>
        idSet.has(r.id) && r.status === 'Pending'
          ? { ...r, status: 'Active', rejectionReason: undefined }
          : r
      )
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      idSet.forEach((id) => next.delete(id));
      return next;
    });
    if (ids.length > 0) {
      setApprovalToast({ kind: 'approve', count: ids.length });
    }
  };

  const handleBulkRejectByIds = (ids, reason) => {
    const idSet = new Set(ids);
    setCredentialsData((prev) =>
      prev.map((r) =>
        idSet.has(r.id) && r.status === 'Pending' ? { ...r, status: 'Rejected', rejectionReason: reason } : r
      )
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      idSet.forEach((id) => next.delete(id));
      return next;
    });
    if (ids.length > 0) {
      setApprovalToast({ kind: 'reject', count: ids.length });
    }
  };

  const handleApproveFromModal = (row) => {
    setCredentialsData((prev) =>
      prev.map((r) =>
        r.id === row.id ? { ...r, status: 'Active', rejectionReason: undefined } : r
      )
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(row.id);
      return next;
    });
    setApprovalToast({ kind: 'approve', count: 1, api: row.api, requester: row.owner });
  };

  const handleRejectFromModal = (row, reason) => {
    setCredentialsData((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: 'Rejected', rejectionReason: reason } : r))
    );
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(row.id);
      return next;
    });
    setApprovalToast({ kind: 'reject', count: 1, api: row.api, requester: row.owner });
  };

  const renderStatus = (status) => {
    const isActive = status === 'Active';
    const isPending = status === 'Pending';
    const iconStatus = isActive ? 'success' : isPending ? 'info' : 'danger';
    const StatusIcon = isActive ? CheckCircleIcon : isPending ? PendingIcon : ExclamationCircleIcon;
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--pf-t--global--spacer--sm)'
        }}
      >
        <Icon size="sm" status={iconStatus} style={{ flexShrink: 0 }}>
          <StatusIcon />
        </Icon>
        <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
          {approvalStatusLabel(status)}
        </span>
      </span>
    );
  };

  const renderStatusCell = (row) => {
    if (row.status !== 'Rejected') {
      return renderStatus(row.status);
    }
    const reason =
      row.rejectionReason || 'No additional details were provided for this rejection.';
    return (
      <Popover
        aria-label={`Rejection reason for ${row.api}`}
        headerContent="Rejection reason"
        showClose
        closeBtnAriaLabel="Close"
        position="right"
        bodyContent={
          <p
            style={{
              margin: 0,
              color: 'var(--pf-t--global--text--color--regular)',
              whiteSpace: 'normal',
              wordBreak: 'break-word'
            }}
          >
            {reason}
          </p>
        }
      >
        <Button
          variant="plain"
          aria-label={`Rejected — open rejection reason for request: ${row.api}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 'auto',
            padding: 0,
            textAlign: 'start'
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--pf-t--global--spacer--sm)'
            }}
          >
            <Icon size="sm" status="danger" style={{ flexShrink: 0 }}>
              <ExclamationCircleIcon />
            </Icon>
            <span style={{ color: 'var(--pf-t--global--text--color--link--default)' }}>
              {approvalStatusLabel(row.status)}
            </span>
          </span>
        </Button>
      </Popover>
    );
  };

  return (
    <>
      <style>{`
        .toolbar-api-approvals .pf-v6-c-toolbar__content:last-of-type {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--pf-t--global--spacer--md);
        }
        /* Vertical center: filters, search, bulk frame, and action buttons on one baseline */
        .toolbar-api-approvals .pf-v6-c-toolbar__group {
          align-items: center;
        }
        .toolbar-api-approvals .pf-v6-c-toolbar__item {
          align-self: center;
          display: flex;
          align-items: center;
        }
        .toolbar-api-approvals .pf-v6-c-toolbar__group .pf-v6-c-text-input-group {
          align-items: center;
        }
        .tier-dropdown-list-approvals {
          max-height: 12rem;
          overflow-y: auto;
        }
        .tier-dropdown-list-approvals .pf-v6-c-menu__list-item > .pf-v6-c-menu__item,
        .status-dropdown-list-approvals .pf-v6-c-menu__list-item > .pf-v6-c-menu__item {
          width: 100%;
        }
        .status-dropdown-list-approvals .pf-v6-c-menu__item-select-icon,
        .tier-dropdown-list-approvals .pf-v6-c-menu__item-select-icon {
          display: none !important;
        }
        .toolbar-api-approvals .pf-v6-c-label-group .pf-v6-c-label.pf-m-outline {
          --pf-v6-c-label--m-outline--BackgroundColor: var(--pf-t--global--color--nonstatus--gray--default);
          --pf-v6-c-label--BorderWidth: 0;
          --pf-v6-c-label--BorderColor: transparent;
          --pf-v6-c-label--Color: var(--pf-t--global--text--color--regular);
          --pf-v6-c-label__icon--Color: var(--pf-t--global--icon--color--regular);
          --pf-v6-c-label--m-outline--Color: var(--pf-t--global--text--color--regular);
          --pf-v6-c-label--m-outline__icon--Color: var(--pf-t--global--icon--color--regular);
          --pf-v6-c-label--m-outline--m-clickable--hover--BackgroundColor: var(
            --pf-t--global--color--nonstatus--gray--hover
          );
        }
        .toolbar-api-approvals .pf-v6-c-label-group .pf-v6-c-label.pf-m-outline .pf-v6-c-label__actions .pf-v6-c-button {
          --pf-v6-c-button__icon--Color: var(--pf-t--global--icon--color--regular);
        }
        /* Bulk select: same visual height as Status/Tier MenuToggle; no inner vertical rules */
        .approvals-bulk-select-frame {
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;
          border: var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default);
          border-radius: var(--pf-t--global--border--radius--small);
          background-color: var(--pf-t--global--background--color--primary--default);
          overflow: hidden;
          padding-block: 0;
          min-height: var(--pf-v6-c-menu-toggle--MinHeight, 2.25rem);
        }
        .approvals-bulk-select-frame .approvals-bulk-select-checkbox-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-inline-start: var(--pf-t--global--spacer--sm);
          padding-inline-end: var(--pf-t--global--spacer--xs);
          padding-block: 0;
        }
        .approvals-bulk-select-frame .pf-v6-c-check {
          display: flex;
          align-items: center;
          margin-block: 0;
        }
        .approvals-bulk-select-frame .approvals-bulk-select-caret-toggle.pf-v6-c-menu-toggle {
          --pf-v6-c-menu-toggle--BorderRadius: 0;
          --pf-v6-c-menu-toggle--before--BorderWidth: 0;
          --pf-v6-c-menu-toggle--BackgroundColor: transparent;
          align-self: stretch;
          border-inline-start: none;
          min-height: 0;
        }
        .approvals-bulk-select-frame .approvals-bulk-select-caret-toggle.pf-v6-c-menu-toggle:hover:not(:disabled) {
          --pf-v6-c-menu-toggle--hover--BackgroundColor: var(--pf-t--global--color--nonstatus--gray--hover);
        }
        .approvals-bulk-select-frame .approvals-bulk-selected-badge-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-inline: var(--pf-t--global--spacer--sm);
          padding-block: 0;
          border-inline-start: none;
        }
        .approvals-toolbar-bulk-actions-wrap {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--pf-t--global--spacer--md);
          margin-inline-start: auto;
        }
        .approvals-toolbar-bulk-divider {
          flex-shrink: 0;
          align-self: center;
          width: 1px;
          height: var(--pf-t--global--spacer--xl);
          background-color: var(--pf-t--global--border--color--default);
        }
        /* Pull checkbox column and API column together (override PF cell padding). */
        .approvals-key-table th:first-child,
        .approvals-key-table td:first-child {
          padding-inline-end: 0 !important;
        }
        .approvals-key-table th:nth-child(2),
        .approvals-key-table td:nth-child(2) {
          padding-inline-start: var(--pf-t--global--spacer--xs) !important;
        }
      `}</style>
      <PageSection variant="light">
        <Dropdown
          isOpen={projectOpen}
          onOpenChange={(open) => setProjectOpen(open)}
          onSelect={() => setProjectOpen(false)}
          toggle={(toggleRef) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setProjectOpen((prev) => !prev)}
              isExpanded={projectOpen}
              variant="default"
            >
              Project
            </MenuToggle>
          )}
        >
          <DropdownList>
            <DropdownItem key="all">All Projects</DropdownItem>
            <DropdownItem key="proj1">Project 1</DropdownItem>
            <DropdownItem key="proj2">Project 2</DropdownItem>
          </DropdownList>
        </Dropdown>
        <div style={{ width: '100%' }}>
          <Divider
            style={{
              marginTop: 'var(--pf-t--global--spacer--md)',
              marginBottom: 'var(--pf-t--global--spacer--md)'
            }}
          />
        </div>
        <Title headingLevel="h1" size="2xl">
          Toki approval
        </Title>
        <p
          style={{
            marginTop: 'var(--pf-t--global--spacer--sm)',
            color: 'var(--pf-t--global--text--color--subtle)'
          }}
        >
          Review and approve Toki requests
        </p>

        <Toolbar
          className="toolbar-api-approvals"
          clearAllFilters={clearAllFilters}
          clearFiltersButtonText="Clear filters"
          style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
        >
          <ToolbarContent>
            <ToolbarGroup alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapMd' }}>
              <ToolbarItem>
                <div className="approvals-bulk-select-frame">
                  <div className="approvals-bulk-select-checkbox-wrap">
                    <Checkbox
                      id="approvals-select-all"
                      isChecked={allVisibleSelected}
                      isIndeterminate={someVisibleSelected}
                      isDisabled={pendingVisibleIds.length === 0}
                      onChange={(_e, checked) => toggleSelectAllVisible(checked)}
                      aria-label="Select all pending rows on this page"
                    />
                  </div>
                  {selectedPendingCount > 0 ? (
                    <div className="approvals-bulk-selected-badge-wrap">
                      <Label color="blue" variant="filled" isCompact>
                        {selectedPendingCount} selected
                      </Label>
                    </div>
                  ) : null}
                  <Dropdown
                    isOpen={bulkOpen}
                    onOpenChange={setBulkOpen}
                    onSelect={() => setBulkOpen(false)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        className="approvals-bulk-select-caret-toggle"
                        variant="plain"
                        onClick={() => setBulkOpen((prev) => !prev)}
                        isExpanded={bulkOpen}
                        isDisabled={pendingVisibleIds.length === 0}
                        aria-label="Bulk selection options"
                      >
                        <CaretDownIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="all" onClick={() => toggleSelectAllVisible(true)}>
                        Select all pending
                      </DropdownItem>
                      <DropdownItem key="none" onClick={clearSelection}>
                        Select none
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </div>
              </ToolbarItem>
              <ToolbarFilter
                categoryName="Status"
                labels={statusFilters}
                deleteLabel={(_cat, label) => setStatusFilters((prev) => prev.filter((s) => s !== label))}
                deleteLabelGroup={() => setStatusFilters([])}
              >
                <Dropdown
                  isOpen={statusFilterOpen}
                  onOpenChange={(open) => setStatusFilterOpen(open)}
                  onSelect={() => {}}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setStatusFilterOpen((prev) => !prev)}
                      isExpanded={statusFilterOpen}
                      variant="default"
                    >
                      <Icon style={{ marginRight: 'var(--pf-t--global--spacer--sm)' }}>
                        <FilterIcon />
                      </Icon>
                      Status
                    </MenuToggle>
                  )}
                >
                  <DropdownList className="status-dropdown-list-approvals">
                    {STATUS_OPTIONS.map((s) => (
                      <DropdownItem
                        key={s}
                        value={s}
                        hasCheckbox
                        isSelected={statusFilters.includes(s)}
                        onClick={() => toggleStatusFilter(s)}
                      >
                        {s}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </ToolbarFilter>
              <ToolbarFilter
                categoryName="Tier"
                labels={tierFilters}
                deleteLabel={(_cat, label) => setTierFilters((prev) => prev.filter((t) => t !== label))}
                deleteLabelGroup={() => setTierFilters([])}
                labelGroupCollapsedText={tierFilters.length > 3 ? `${tierFilters.length - 3} more` : undefined}
              >
                <Dropdown
                  isOpen={tierFilterOpen}
                  onOpenChange={(open) => setTierFilterOpen(open)}
                  onSelect={() => {}}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={() => setTierFilterOpen((prev) => !prev)}
                      isExpanded={tierFilterOpen}
                      variant="default"
                    >
                      <Icon style={{ marginRight: 'var(--pf-t--global--spacer--sm)' }}>
                        <FilterIcon />
                      </Icon>
                      Tier
                    </MenuToggle>
                  )}
                >
                  <DropdownList className="tier-dropdown-list-approvals">
                    {CREDENTIAL_TIER_OPTIONS.map((t) => (
                      <DropdownItem
                        key={t}
                        value={t}
                        hasCheckbox
                        isSelected={tierFilters.includes(t)}
                        description={`Rate limits: ${TIER_TOOLTIPS[t] || '-'}`}
                        onClick={() => toggleTierFilter(t)}
                      >
                        {t}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </ToolbarFilter>
              <ToolbarItem>
                <SearchInput
                  placeholder="Find by Roni, Toki name, requester, or use case"
                  aria-label="Find by Roni, Toki name, requester, or use case"
                  value={searchValue}
                  onChange={(_, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                  style={{ width: '100%', minWidth: '280px', maxWidth: 'min(100%, 26rem)' }}
                />
              </ToolbarItem>
              {selectedPendingCount > 0 ? (
                <ToolbarItem className="approvals-toolbar-bulk-actions-wrap">
                  <div className="approvals-toolbar-bulk-divider" aria-hidden />
                  <Flex gap={{ default: 'gapSm' }} flexWrap={{ default: 'nowrap' }}>
                    <Button
                      variant="primary"
                      style={bulkActionButtonStyle}
                      onClick={openBulkApproveModal}
                    >
                      {`Approve ${selectedPendingCount} selected`}
                    </Button>
                    <Button
                      variant="danger"
                      style={bulkActionButtonStyle}
                      onClick={openBulkRejectModal}
                    >
                      {`Reject ${selectedPendingCount} selected`}
                    </Button>
                  </Flex>
                </ToolbarItem>
              ) : null}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <div
          style={{
            marginTop: 'var(--pf-t--global--spacer--sm)',
            overflowX: 'auto',
            maxWidth: '100%'
          }}
        >
          <Table
            className="approvals-key-table"
            aria-label="Toki approval table"
            gridBreakPoint={TableGridBreakpoint.none}
            style={{
              tableLayout: 'fixed',
              width: '100%',
              minWidth: '62rem'
            }}
          >
            <colgroup>
              <col style={{ width: '1.25rem' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '10%' }} />
              <col style={{ width: '17%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '3rem' }} />
            </colgroup>
          <Thead>
            <Tr>
              <Th screenReaderText="Row selection" style={APPROVALS_SELECT_COL_STYLE} />
              <Th sort={{ columnIndex: 1, sortBy: sortState, onSort: handleSort }} style={APPROVALS_API_COL_STYLE}>
                Toki name
              </Th>
              <Th sort={{ columnIndex: 2, sortBy: sortState, onSort: handleSort }} style={APPROVALS_API_COL_STYLE}>
                Roni
              </Th>
              <Th
                sort={{ columnIndex: 3, sortBy: sortState, onSort: handleSort }}
                style={{ paddingInlineEnd: 'var(--pf-t--global--spacer--md)' }}
              >
                Use case
              </Th>
              <Th
                sort={{ columnIndex: 4, sortBy: sortState, onSort: handleSort }}
                style={{ paddingInlineStart: 'var(--pf-t--global--spacer--md)' }}
              >
                Status
              </Th>
              <Th dataLabel="Tier" style={APPROVALS_TIER_TH_TD_STYLE}>
                <TierSortableColumnHeader columnIndex={5} sortBy={sortState} onSort={handleSort} />
              </Th>
              <Th
                sort={{ columnIndex: 6, sortBy: sortState, onSort: handleSort }}
                style={{ whiteSpace: 'nowrap' }}
              >
                Requester
              </Th>
              <Th
                sort={{ columnIndex: 7, sortBy: sortState, onSort: handleSort }}
                style={{ whiteSpace: 'nowrap' }}
              >
                Requested time
              </Th>
              <Th screenReaderText="Row actions" style={APPROVALS_ACTIONS_COL_STYLE} />
            </Tr>
          </Thead>
          <Tbody>
            {sortedCredentials.map((row) => (
              <React.Fragment key={row.id}>
                <Tr>
                  <Td style={APPROVALS_SELECT_COL_STYLE}>
                    <Checkbox
                      id={`approvals-row-${row.id}`}
                      isChecked={row.status === 'Pending' && selectedIds.has(row.id)}
                      isDisabled={row.status !== 'Pending'}
                      onChange={(_e, checked) => toggleRowSelected(row.id, checked, row.status)}
                      aria-label={
                        row.status === 'Pending'
                          ? `Select request for ${row.api} (${row.owner})`
                          : `Cannot select request for ${row.api} (${approvalStatusLabel(row.status)} keys are not selectable)`
                      }
                    />
                  </Td>
                  <Td style={APPROVALS_API_COL_STYLE}>
                    <TruncatedTableText text={row.name} />
                  </Td>
                  <Td style={APPROVALS_API_COL_STYLE}>
                    <TruncatedTableLink
                      text={row.api}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToApiCatalog?.(row.api);
                      }}
                    />
                  </Td>
                  <Td style={APPROVALS_USE_CASE_COL_STYLE}>
                    <UseCaseTwoLineCell text={row.useCase || USE_CASE_EXPANDED_TEXT} />
                  </Td>
                  <Td style={APPROVALS_STATUS_COL_STYLE}>{renderStatusCell(row)}</Td>
                  <Td style={APPROVALS_TIER_TH_TD_STYLE}>
                    <Tooltip content={TIER_TOOLTIPS[row.tier] || `${row.tier} tier`}>
                      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                        <Label variant="outline" isCompact>
                          {row.tier}
                        </Label>
                      </span>
                    </Tooltip>
                  </Td>
                  <Td style={{ verticalAlign: 'middle' }}>
                    <TruncatedTableText text={row.owner} />
                  </Td>
                  <Td style={{ verticalAlign: 'middle' }}>{row.requestedTime}</Td>
                  <Td style={APPROVALS_ACTIONS_COL_STYLE}>
                    {row.status === 'Pending' ? (
                      <Dropdown
                        isOpen={actionsOpenRowId === row.id}
                        onOpenChange={(open) => setActionsOpenRowId(open ? row.id : null)}
                        onSelect={() => setActionsOpenRowId(null)}
                        toggle={(toggleRef) => (
                          <MenuToggle
                            ref={toggleRef}
                            aria-label="Actions"
                            variant="plain"
                            onClick={() =>
                              setActionsOpenRowId(actionsOpenRowId === row.id ? null : row.id)
                            }
                            style={{ display: 'inline-flex', alignItems: 'center' }}
                          >
                            <EllipsisVIcon />
                          </MenuToggle>
                        )}
                      >
                        <DropdownList>
                          <DropdownItem
                            key="approve"
                            onClick={() => {
                              setApproveRow(row);
                              setActionsOpenRowId(null);
                            }}
                          >
                            Approve
                          </DropdownItem>
                          <DropdownItem
                            key="reject"
                            onClick={() => {
                              setRejectRow(row);
                              setActionsOpenRowId(null);
                            }}
                          >
                            Reject
                          </DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    ) : null}
                  </Td>
                </Tr>
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
        </div>
      </PageSection>
      <ApproveApiKeyModal
        isOpen={Boolean(approveRow)}
        onClose={() => setApproveRow(null)}
        row={approveRow}
        onApprove={handleApproveFromModal}
      />
      <RejectApiKeyModal
        isOpen={Boolean(rejectRow)}
        onClose={() => setRejectRow(null)}
        row={rejectRow}
        onReject={handleRejectFromModal}
      />
      {bulkApproveRows ? (
        <BulkApproveApiKeysModal
          onClose={() => setBulkApproveRows(null)}
          initialRows={bulkApproveRows}
          onConfirm={handleBulkApproveByIds}
          onNavigateToApiCatalog={onNavigateToApiCatalog}
        />
      ) : null}
      {bulkRejectRows ? (
        <BulkRejectApiKeysModal
          onClose={() => setBulkRejectRows(null)}
          initialRows={bulkRejectRows}
          onConfirm={handleBulkRejectByIds}
          onNavigateToApiCatalog={onNavigateToApiCatalog}
        />
      ) : null}
      {approvalToast ? (
        <TokiApprovalResultToast
          kind={approvalToast.kind}
          count={approvalToast.count}
          api={approvalToast.api}
          requester={approvalToast.requester}
          onClose={dismissApprovalToast}
        />
      ) : null}
    </>
  );
};

export default TokiApprovalPage;
