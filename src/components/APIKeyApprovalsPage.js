import React, { useState, useMemo } from 'react';
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
  Alert,
  AlertVariant,
  AlertActionLink,
  Flex
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  ExpandableRowContent
} from '@patternfly/react-table';
import {
  expandableRowContentStyleAfterExpandAndCheckbox,
  expandedRowTdPaddingInline
} from '../utils/expandableTableRowContentStyles';
import {
  FilterIcon,
  EllipsisVIcon,
  CheckCircleIcon,
  PendingIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  AngleRightIcon,
  AngleDownIcon,
  CaretDownIcon
} from '@patternfly/react-icons';
import {
  buildCredentialsData,
  TIER_LIMIT,
  TIER_TOOLTIPS,
  CREDENTIAL_TIER_OPTIONS,
  USE_CASE_EXPANDED_TEXT
} from '../data/apiCredentialsModel';
import {
  TierSortableColumnHeader,
  TIER_TABLE_COLUMN_STYLE
} from './TierSortableColumnHeader';
import { TruncatedTableLink, TruncatedTableText } from './ApiKeyNameText';

const STATUS_OPTIONS = ['Approved', 'Pending', 'Rejected'];
const STATUS_RANK = { Active: 4, Pending: 3, Rejected: 2 };

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

const APIKeyApprovalsPage = ({ onNavigateToApiCatalog }) => {
  const [credentialsData, setCredentialsData] = useState(() => buildCredentialsData());

  const [projectOpen, setProjectOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [tierFilterOpen, setTierFilterOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState([]);
  const [tierFilters, setTierFilters] = useState([]);
  const [actionsOpenRowId, setActionsOpenRowId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [sortState, setSortState] = useState({
    index: 2,
    direction: 'asc',
    defaultDirection: 'asc'
  });

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

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCredentials = credentialsData.filter((row) => {
    const q = searchValue.trim().toLowerCase();
    const statusForSearch =
      row.status === 'Active' ? `${approvalStatusLabel(row.status)} active`.toLowerCase() : row.status.toLowerCase();
    const matchesSearch =
      !q ||
      row.name.toLowerCase().includes(q) ||
      row.api.toLowerCase().includes(q) ||
      row.owner.toLowerCase().includes(q) ||
      statusForSearch.includes(q);
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
        case 2:
          cmp = (a.api || '').localeCompare(b.api || '', undefined, { sensitivity: 'base' });
          break;
        case 3:
          cmp = (STATUS_RANK[a.status] ?? 0) - (STATUS_RANK[b.status] ?? 0);
          break;
        case 4:
          cmp = (TIER_LIMIT[a.tier] ?? 0) - (TIER_LIMIT[b.tier] ?? 0);
          break;
        case 5:
          cmp = (a.owner || '').localeCompare(b.owner || '', undefined, { sensitivity: 'base' });
          break;
        case 6:
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

  const handleBulkApprove = () => {
    if (selectedPendingCount === 0) return;
    setCredentialsData((prev) =>
      prev.map((r) => (selectedIds.has(r.id) && r.status === 'Pending' ? { ...r, status: 'Active' } : r))
    );
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    if (selectedPendingCount === 0) return;
    setCredentialsData((prev) =>
      prev.map((r) => (selectedIds.has(r.id) && r.status === 'Pending' ? { ...r, status: 'Rejected' } : r))
    );
    setSelectedIds(new Set());
  };

  const renderStatus = (status) => {
    const isActive = status === 'Active';
    const isPending = status === 'Pending';
    const isRejected = status === 'Rejected';
    const iconStatus = isActive ? 'success' : isPending ? 'info' : isRejected ? 'warning' : 'danger';
    const StatusIcon = isActive
      ? CheckCircleIcon
      : isPending
        ? PendingIcon
        : isRejected
          ? ExclamationTriangleIcon
          : ExclamationCircleIcon;
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
        /* Bulk select: outer frame matches Status/Tier filter MenuToggle (rounded rect, not pill) */
        .approvals-bulk-select-frame {
          display: inline-flex;
          align-items: center;
          box-sizing: border-box;
          border: var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default);
          border-radius: var(--pf-t--global--border--radius--small);
          background-color: var(--pf-t--global--background--color--primary--default);
          overflow: hidden;
          padding-block: var(--pf-t--global--spacer--xs);
        }
        .approvals-bulk-select-frame .approvals-bulk-select-checkbox-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-inline-start: var(--pf-t--global--spacer--sm);
          padding-inline-end: var(--pf-t--global--spacer--xs);
          padding-block: 0;
        }
        .approvals-bulk-select-frame .approvals-bulk-select-caret-toggle.pf-v6-c-menu-toggle {
          --pf-v6-c-menu-toggle--BorderRadius: 0;
          --pf-v6-c-menu-toggle--before--BorderWidth: 0;
          --pf-v6-c-menu-toggle--BackgroundColor: transparent;
          align-self: center;
          border-inline-start: var(--pf-t--global--border--width--regular) solid
            var(--pf-t--global--border--color--default);
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
          border-inline-start: var(--pf-t--global--border--width--regular) solid
            var(--pf-t--global--border--color--default);
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
              Project: All Projects
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
          API key approval
        </Title>
        <p
          style={{
            marginTop: 'var(--pf-t--global--spacer--sm)',
            color: 'var(--pf-t--global--text--color--subtle)'
          }}
        >
          Manage keys issued to requesters for accessing APIs.
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
                        Select all pending on page
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
                  placeholder="Find by API or requester"
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
                      onClick={handleBulkApprove}
                    >
                      {`Approve ${selectedPendingCount} selected`}
                    </Button>
                    <Button
                      variant="danger"
                      style={bulkActionButtonStyle}
                      onClick={handleBulkReject}
                    >
                      {`Reject ${selectedPendingCount} selected`}
                    </Button>
                  </Flex>
                </ToolbarItem>
              ) : null}
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
          <Table aria-label="API key approval table">
          <Thead>
            <Tr>
              <Th
                style={{
                  width: 'var(--pf-t--global--spacer--2xl)',
                  paddingLeft: 'var(--pf-t--global--spacer--sm)',
                  paddingRight: 'var(--pf-t--global--spacer--xs)'
                }}
              />
              <Th screenReaderText="Row selection" />
              <Th sort={{ columnIndex: 2, sortBy: sortState, onSort: handleSort }}>API</Th>
              <Th sort={{ columnIndex: 3, sortBy: sortState, onSort: handleSort }}>Status</Th>
              <Th dataLabel="Tier" style={TIER_TABLE_COLUMN_STYLE}>
                <TierSortableColumnHeader columnIndex={4} sortBy={sortState} onSort={handleSort} />
              </Th>
              <Th sort={{ columnIndex: 5, sortBy: sortState, onSort: handleSort }}>Requester</Th>
              <Th sort={{ columnIndex: 6, sortBy: sortState, onSort: handleSort }}>Requested time</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {sortedCredentials.map((row) => (
              <React.Fragment key={row.id}>
                <Tr style={expandedRows[row.id] ? { borderBottom: 'none' } : undefined}>
                  <Td
                    style={{
                      width: 'var(--pf-t--global--spacer--2xl)',
                      paddingLeft: 'var(--pf-t--global--spacer--sm)',
                      paddingRight: 'var(--pf-t--global--spacer--xs)',
                      verticalAlign: 'middle'
                    }}
                  >
                    <Button
                      variant="plain"
                      aria-label={expandedRows[row.id] ? 'Collapse' : 'Expand'}
                      onClick={() => toggleExpand(row.id)}
                      style={{ display: 'inline-flex', alignItems: 'center' }}
                    >
                      {expandedRows[row.id] ? <AngleDownIcon /> : <AngleRightIcon />}
                    </Button>
                  </Td>
                  <Td
                    style={{
                      verticalAlign: 'middle',
                      width: 'var(--pf-t--global--spacer--2xl)'
                    }}
                  >
                    <Checkbox
                      id={`approvals-row-${row.id}`}
                      isChecked={row.status === 'Pending' && selectedIds.has(row.id)}
                      isDisabled={row.status !== 'Pending'}
                      onChange={(_e, checked) => toggleRowSelected(row.id, checked, row.status)}
                      aria-label={
                        row.status === 'Pending'
                          ? `Select ${row.name}`
                          : `Cannot select ${row.name} (${approvalStatusLabel(row.status)} keys are not selectable)`
                      }
                    />
                  </Td>
                  <Td style={{ verticalAlign: 'middle' }}>
                    <TruncatedTableLink
                      text={row.api}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigateToApiCatalog?.(row.api);
                      }}
                    />
                  </Td>
                  <Td style={{ verticalAlign: 'middle' }}>{renderStatus(row.status)}</Td>
                  <Td style={{ verticalAlign: 'middle', ...TIER_TABLE_COLUMN_STYLE }}>
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
                  <Td style={{ verticalAlign: 'middle' }}>
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
                        <DropdownItem key="view">View details</DropdownItem>
                        <DropdownItem key="approve">Approve</DropdownItem>
                        <DropdownItem key="reject">Reject</DropdownItem>
                        <DropdownItem key="edit">Edit</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </Td>
                </Tr>
                {expandedRows[row.id] && (
                  <Tr isExpanded style={{ borderTop: 'none' }}>
                    <Td
                      colSpan={8}
                      style={{
                        borderTop: 'none',
                        paddingTop: 0,
                        paddingBottom: 'var(--pf-t--global--spacer--md)',
                        verticalAlign: 'top',
                        boxShadow: 'none',
                        ...expandedRowTdPaddingInline
                      }}
                    >
                      <ExpandableRowContent style={expandableRowContentStyleAfterExpandAndCheckbox}>
                        <div
                          style={{
                            fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                            marginBottom: 'var(--pf-t--global--spacer--sm)'
                          }}
                        >
                          API key name
                        </div>
                        <div
                          style={{
                            marginBottom: 'var(--pf-t--global--spacer--md)',
                            color: 'var(--pf-t--global--text--color--regular)'
                          }}
                        >
                          {row.name}
                        </div>
                        <div
                          style={{
                            fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                            marginBottom: 'var(--pf-t--global--spacer--sm)'
                          }}
                        >
                          Use case
                        </div>
                        <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>
                          {row.useCase || USE_CASE_EXPANDED_TEXT}
                        </div>
                        {row.status === 'Rejected' && (
                          <Alert
                            variant={AlertVariant.warning}
                            isInline
                            title={
                              <>
                                <strong>Rejection reason: </strong>
                                {row.rejectionReason ||
                                  'No additional details were provided for this rejection.'}
                              </>
                            }
                            component="div"
                            actionLinks={
                              <AlertActionLink href="#" onClick={(e) => e.preventDefault()}>
                                Request a new API key
                              </AlertActionLink>
                            }
                            style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                          />
                        )}
                      </ExpandableRowContent>
                    </Td>
                  </Tr>
                )}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>
        </div>
      </PageSection>
    </>
  );
};

export default APIKeyApprovalsPage;
