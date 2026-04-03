import React, { useState, useMemo } from 'react';
import {
  PageSection,
  Title,
  Flex,
  FlexItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Icon,
  SearchInput,
  Label,
  Tooltip,
  Divider,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarFilter,
  Popover
} from '@patternfly/react-core';
import { TIER_TOOLTIPS, TIER_LIMIT, CREDENTIAL_TIER_OPTIONS } from '../data/apiCredentialsModel';
import { renderApiKeyField } from './apiKeyFieldDisplay';
import {
  getApiKeyNameTableDisplay,
  TruncatedTableLink
} from './ApiKeyNameText';
import {
  TierSortableColumnHeader,
  TIER_TABLE_COLUMN_STYLE
} from './TierSortableColumnHeader';
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
  expandableRowContentStyleAfterExpandColumn,
  expandedRowTdPaddingInline
} from '../utils/expandableTableRowContentStyles';
import { borderDefaultStyle } from '../styles/pf6Tokens';
import {
  FilterIcon,
  EllipsisVIcon,
  CheckCircleIcon,
  PendingIcon,
  ExclamationCircleIcon,
  AngleRightIcon,
  AngleDownIcon
} from '@patternfly/react-icons';

const STATUS_OPTIONS = ['Active', 'Pending', 'Rejected', 'Revoked', 'Expired'];
const STATUS_RANK = { Active: 3, Pending: 2, Rejected: 1 };

const REJECTION_REASON_FALLBACK =
  'Rejection detail is not shown in this external demo view.';

function apiKeyColumnRank(row, revealedKeyIds) {
  if (row.status === 'Active' && row.apiKeyState === 'masked') return 4;
  if (row.status === 'Active' && (row.apiKeyState === 'viewed' || revealedKeyIds.has(row.id))) return 3;
  if (row.apiKeyState === 'generating') return 2;
  return 1;
}

const MyTokiPage = ({
  onApiKeyNameClick,
  revealedKeyIds,
  onOpenRevealModal,
  credentialsData,
  onOpenEdit,
  onOpenDelete,
  onOpenRequestApiKey,
  onNavigateToApiCatalog
}) => {
  const [projectOpen, setProjectOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [tierFilterOpen, setTierFilterOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState([]);
  const [tierFilters, setTierFilters] = useState([]);
  const [actionsOpenRowId, setActionsOpenRowId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  const [sortState, setSortState] = useState({
    index: 1,
    direction: 'desc',
    defaultDirection: 'desc'
  });

  const handleSort = (_event, index, direction) => {
    setSortState({ index, direction, defaultDirection: 'desc' });
  };

  const revealedSet = revealedKeyIds instanceof Set ? revealedKeyIds : new Set();

  const filteredCredentials = credentialsData.filter((row) => {
    const matchesSearch =
      !searchValue ||
      row.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.status.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.tier.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.api.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(row.status);
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
        case 3:
          cmp = (STATUS_RANK[a.status] ?? 0) - (STATUS_RANK[b.status] ?? 0);
          break;
        case 4:
          cmp = (TIER_LIMIT[a.tier] ?? 0) - (TIER_LIMIT[b.tier] ?? 0);
          break;
        case 5:
          cmp = apiKeyColumnRank(a, revealedSet) - apiKeyColumnRank(b, revealedSet);
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
  }, [filteredCredentials, sortState.index, sortState.direction, revealedKeyIds]);

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
        <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{status}</span>
      </span>
    );
  };

  const renderRejectedStatus = (row) => {
    const reason = (row.rejectionReason && String(row.rejectionReason).trim()) || REJECTION_REASON_FALLBACK;
    return (
      <Popover
        id={`my-toki-rejected-${row.id}`}
        headerContent={
          <span
            style={{
              fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
              color: 'var(--pf-t--global--text--color--regular)'
            }}
          >
            Rejection reason
          </span>
        }
        bodyContent={
          <div
            style={{
              color: 'var(--pf-t--global--text--color--regular)',
              fontSize: 'var(--pf-t--global--font--size--body--default)'
            }}
          >
            {reason}
          </div>
        }
        footerContent={(hide) => (
          <Button
            variant="link"
            isInline
            onClick={() => {
              hide();
              onOpenRequestApiKey?.();
            }}
          >
            Request a new Toki
          </Button>
        )}
        showClose
        closeBtnAriaLabel="Close rejection details"
        position="right"
        distance={8}
        appendTo={() => document.body}
        hideOnOutsideClick
        zIndex={400}
        minWidth="min(18rem, 90vw)"
        maxWidth="min(22rem, 92vw)"
      >
        <Button
          variant="link"
          isInline
          aria-label={`Rejected — view rejection reason for ${row.name || 'Toki'}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: 0
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
            <span>Rejected</span>
          </span>
        </Button>
      </Popover>
    );
  };

  const renderStatusCell = (row) => {
    if (row.status === 'Rejected') {
      return renderRejectedStatus(row);
    }
    return renderStatus(row.status);
  };

  const renderApiKeyNameCell = (row) => {
    const { display, full, isTruncated } = getApiKeyNameTableDisplay(row.name);
    const clickable =
      (row.status === 'Active' || row.status === 'Pending' || row.status === 'Rejected') &&
      typeof onApiKeyNameClick === 'function';

    const inner = clickable ? (
      <Button
        variant="link"
        isInline
        onClick={(e) => {
          e.stopPropagation();
          onApiKeyNameClick(row);
        }}
      >
        {display}
      </Button>
    ) : (
      <span>{display}</span>
    );

    if (isTruncated) {
      return (
        <Tooltip content={full}>
          <span style={{ display: 'inline-flex', maxWidth: '100%' }} tabIndex={0}>
            {inner}
          </span>
        </Tooltip>
      );
    }
    return inner;
  };

  return (
    <>
      <style>{`
        .toolbar-my-toki .pf-v6-c-toolbar__content:last-of-type {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          gap: var(--pf-t--global--spacer--md);
        }
        .tier-dropdown-list {
          max-height: 12rem;
          overflow-y: auto;
        }
        /* Full-row hit target for filter menus: PF menu item is flex-basis 100% with default padding */
        .tier-dropdown-list .pf-v6-c-menu__list-item > .pf-v6-c-menu__item,
        .status-dropdown-list .pf-v6-c-menu__list-item > .pf-v6-c-menu__item {
          width: 100%;
        }
        /* Checkbox items already show selection; hide PF right-side select check on hover/focus */
        .status-dropdown-list .pf-v6-c-menu__item-select-icon,
        .tier-dropdown-list .pf-v6-c-menu__item-select-icon {
          display: none !important;
        }
        /* ToolbarFilter uses outline Labels — fill chip background like design (gray pill) */
        .toolbar-my-toki .pf-v6-c-label-group .pf-v6-c-label.pf-m-outline {
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
        .toolbar-my-toki .pf-v6-c-label-group .pf-v6-c-label.pf-m-outline .pf-v6-c-label__actions .pf-v6-c-button {
          --pf-v6-c-button__icon--Color: var(--pf-t--global--icon--color--regular);
        }
        /* Fixed column widths so expanding a row (colspan detail) does not reflow header/body columns */
        .my-toki-table.pf-v6-c-table {
          table-layout: fixed;
          width: 100%;
        }
        .my-toki-table thead th:nth-child(1) {
          width: 4%;
        }
        .my-toki-table thead th:nth-child(2) {
          width: 21%;
        }
        .my-toki-table thead th:nth-child(3) {
          width: 24%;
        }
        .my-toki-table thead th:nth-child(4) {
          width: 12%;
        }
        .my-toki-table thead th:nth-child(5) {
          width: 10%;
        }
        .my-toki-table thead th:nth-child(6) {
          width: 10%;
        }
        .my-toki-table thead th:nth-child(7) {
          width: 16%;
        }
        .my-toki-table thead th:nth-child(8) {
          width: 5%;
        }
        .my-toki-table tbody > tr > td {
          vertical-align: middle;
        }
        .my-toki-table .pf-v6-c-table__expandable-row-content {
          overflow-wrap: anywhere;
          word-break: break-word;
          max-width: 100%;
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
          <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
        </div>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">My Toki</Title>
            <p
              style={{
                marginTop: 'var(--pf-t--global--spacer--sm)',
                color: 'var(--pf-t--global--text--color--subtle)'
              }}
            >
              View and manage your Toki.
            </p>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={() => onOpenRequestApiKey?.()}>
              Request Toki
            </Button>
          </FlexItem>
        </Flex>

        <Toolbar
          className="toolbar-my-toki"
          clearAllFilters={clearAllFilters}
          clearFiltersButtonText="Clear filters"
          style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
        >
          <ToolbarContent>
            <ToolbarGroup>
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
                      Status
                    </MenuToggle>
                  )}
                >
                  <DropdownList className="status-dropdown-list">
                    {['Active', 'Pending', 'Rejected'].map((s) => (
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
                      Tier
                    </MenuToggle>
                  )}
                >
                  <DropdownList className="tier-dropdown-list">
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
                  placeholder="Find by Roni or Toki name"
                  aria-label="Find by Roni or Toki name"
                  value={searchValue}
                  onChange={(_, value) => setSearchValue(value)}
                  onClear={() => setSearchValue('')}
                  style={{ width: '100%', minWidth: '280px', maxWidth: 'min(100%, 26rem)' }}
                />
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>

        <div style={{ marginTop: 'var(--pf-t--global--spacer--sm)' }}>
          <Table aria-label="My Toki table" className="my-toki-table" isExpandable>
          <Thead>
            <Tr>
              <Th
                style={{
                  paddingLeft: 'var(--pf-t--global--spacer--sm)',
                  paddingRight: 'var(--pf-t--global--spacer--xs)'
                }}
              />
              <Th sort={{ columnIndex: 1, sortBy: sortState, onSort: handleSort }}>Toki name</Th>
              <Th sort={{ columnIndex: 2, sortBy: sortState, onSort: handleSort }}>Roni</Th>
              <Th sort={{ columnIndex: 3, sortBy: sortState, onSort: handleSort }}>Status</Th>
              <Th
                dataLabel="Tier"
                style={{
                  ...TIER_TABLE_COLUMN_STYLE,
                  width: '10%',
                  minWidth: TIER_TABLE_COLUMN_STYLE.minWidth
                }}
              >
                <TierSortableColumnHeader columnIndex={4} sortBy={sortState} onSort={handleSort} />
              </Th>
              <Th sort={{ columnIndex: 5, sortBy: sortState, onSort: handleSort }}>Toki</Th>
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
                      {expandedRows[row.id] ? (
                        <AngleDownIcon />
                      ) : (
                        <AngleRightIcon />
                      )}
                    </Button>
                  </Td>
                  <Td style={{ verticalAlign: 'middle' }}>{renderApiKeyNameCell(row)}</Td>
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
                  <Td style={{ verticalAlign: 'middle' }}>{renderStatusCell(row)}</Td>
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
                    {renderApiKeyField({
                      status: row.status,
                      rowId: row.id,
                      apiKeyState: row.apiKeyState,
                      revealedKeyIds: revealedSet,
                      onOpenReveal: onOpenRevealModal,
                      interactive: true
                    })}
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
                          onClick={() => setActionsOpenRowId(actionsOpenRowId === row.id ? null : row.id)}
                          style={{ display: 'inline-flex', alignItems: 'center' }}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      )}
                    >
                      <DropdownList>
                        {row.status !== 'Rejected' && (
                          <DropdownItem
                            key="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEdit?.(row);
                              setActionsOpenRowId(null);
                            }}
                          >
                            Edit
                          </DropdownItem>
                        )}
                        <DropdownItem
                          key="delete"
                          isDanger
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDelete?.(row);
                            setActionsOpenRowId(null);
                          }}
                        >
                          Delete
                        </DropdownItem>
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
                        borderBottom: borderDefaultStyle,
                        paddingTop: 0,
                        paddingBottom: 'var(--pf-t--global--spacer--md)',
                        verticalAlign: 'top',
                        ...expandedRowTdPaddingInline
                      }}
                    >
                      <ExpandableRowContent style={expandableRowContentStyleAfterExpandColumn}>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Use case</div>
                        <div style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{row.useCase}</div>
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

export default MyTokiPage;
