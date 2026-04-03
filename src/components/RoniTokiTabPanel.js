import React, { useMemo, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownList,
  Icon,
  Label,
  MenuToggle,
  SearchInput,
  Toolbar,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
  Tooltip
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
  expandableRowContentStyleAfterExpandColumn,
  expandedRowTdPaddingInline
} from '../utils/expandableTableRowContentStyles';
import {
  EllipsisVIcon,
  CheckCircleIcon,
  PendingIcon,
  ExclamationCircleIcon,
  AngleRightIcon,
  AngleDownIcon
} from '@patternfly/react-icons';
import { TIER_TOOLTIPS, CREDENTIAL_TIER_OPTIONS, TIER_LIMIT } from '../data/apiCredentialsModel';
import { renderApiKeyField } from './apiKeyFieldDisplay';
import { getApiKeyNameTableDisplay } from './ApiKeyNameText';
import {
  TierSortableColumnHeader,
  TIER_TABLE_COLUMN_STYLE
} from './TierSortableColumnHeader';

const STATUS_RANK = { Active: 3, Pending: 2, Rejected: 1 };

function apiKeyColumnRank(row, revealedSet) {
  if (row.status === 'Active' && row.apiKeyState === 'masked') return 4;
  if (row.status === 'Active' && (row.apiKeyState === 'viewed' || revealedSet.has(row.id))) return 3;
  if (row.apiKeyState === 'generating') return 2;
  return 1;
}

const linkStyle = { color: 'var(--pf-t--global--text--color--link--default)' };

/**
 * Toki tab on Roni product details (toolbar + expandable sortable table).
 */
const RoniTokiTabPanel = ({ rows, onOpenDelete, onOpenEdit, onApiKeyNameClick }) => {
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

  const revealedSet = useMemo(() => new Set(), []);

  const handleSort = (_event, index, direction) => {
    setSortState({ index, direction, defaultDirection: 'desc' });
  };

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      !searchValue || row.name.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(row.status);
    const matchesTier = tierFilters.length === 0 || tierFilters.includes(row.tier);
    return matchesSearch && matchesStatus && matchesTier;
  });

  const sortedRows = useMemo(() => {
    const list = [...filteredRows];
    const { index, direction } = sortState;
    const mult = direction === 'asc' ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (index) {
        case 1:
          cmp = (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
          break;
        case 2:
          cmp = (STATUS_RANK[a.status] ?? 0) - (STATUS_RANK[b.status] ?? 0);
          break;
        case 3:
          cmp = (TIER_LIMIT[a.tier] ?? 0) - (TIER_LIMIT[b.tier] ?? 0);
          break;
        case 4:
          cmp = apiKeyColumnRank(a, revealedSet) - apiKeyColumnRank(b, revealedSet);
          break;
        case 5:
          cmp = (a.requestedTime || '').localeCompare(b.requestedTime || '', undefined, { numeric: true });
          break;
        default:
          return 0;
      }
      return mult * cmp;
    });
    return list;
  }, [filteredRows, sortState.index, sortState.direction, revealedSet]);

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
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <Icon size="sm" status={iconStatus} style={{ flexShrink: 0 }}>
          <StatusIcon />
        </Icon>
        <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{status}</span>
      </span>
    );
  };

  const renderNameCell = (row) => {
    const { display, full, isTruncated } = getApiKeyNameTableDisplay(row.name);
    const label = <span style={linkStyle}>{display}</span>;
    const interactive = onApiKeyNameClick ? (
      <button
        type="button"
        onClick={() => onApiKeyNameClick(row)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          font: 'inherit',
          textAlign: 'left',
          maxWidth: '100%'
        }}
      >
        {label}
      </button>
    ) : (
      label
    );
    if (isTruncated) {
      return (
        <Tooltip content={full}>
          <span style={{ display: 'inline-flex', maxWidth: '100%' }} tabIndex={0}>
            {interactive}
          </span>
        </Tooltip>
      );
    }
    return interactive;
  };

  return (
    <>
      <style>{`
        .toolbar-roni-toki .pf-v6-c-toolbar__content:last-of-type {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          gap: var(--pf-t--global--spacer--md);
        }
        .tier-dropdown-list-catalog {
          max-height: 12rem;
          overflow-y: auto;
        }
        .tier-dropdown-list-catalog .pf-v6-c-menu__list-item > .pf-v6-c-menu__item,
        .status-dropdown-list-catalog .pf-v6-c-menu__list-item > .pf-v6-c-menu__item {
          width: 100%;
        }
        .status-dropdown-list-catalog .pf-v6-c-menu__item-select-icon,
        .tier-dropdown-list-catalog .pf-v6-c-menu__item-select-icon {
          display: none !important;
        }
        .toolbar-roni-toki .pf-v6-c-label-group .pf-v6-c-label.pf-m-outline {
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
        .toolbar-roni-toki .pf-v6-c-label-group .pf-v6-c-label.pf-m-outline .pf-v6-c-label__actions .pf-v6-c-button {
          --pf-v6-c-button__icon--Color: var(--pf-t--global--icon--color--regular);
        }
      `}</style>
      <Toolbar
        className="toolbar-roni-toki"
        clearAllFilters={clearAllFilters}
        clearFiltersButtonText="Clear filters"
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
                <DropdownList className="status-dropdown-list-catalog">
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
                <DropdownList className="tier-dropdown-list-catalog">
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
                placeholder="Find by Toki name"
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
        <Table aria-label="Toki for this Roni product">
          <Thead>
            <Tr>
              <Th
                style={{
                  width: 'var(--pf-t--global--spacer--2xl)',
                  paddingLeft: 'var(--pf-t--global--spacer--sm)',
                  paddingRight: 'var(--pf-t--global--spacer--xs)'
                }}
              />
              <Th sort={{ columnIndex: 1, sortBy: sortState, onSort: handleSort }}>Toki name</Th>
              <Th sort={{ columnIndex: 2, sortBy: sortState, onSort: handleSort }}>Status</Th>
              <Th dataLabel="Tier" style={TIER_TABLE_COLUMN_STYLE}>
                <TierSortableColumnHeader columnIndex={3} sortBy={sortState} onSort={handleSort} />
              </Th>
              <Th sort={{ columnIndex: 4, sortBy: sortState, onSort: handleSort }}>Toki</Th>
              <Th sort={{ columnIndex: 5, sortBy: sortState, onSort: handleSort }}>Requested time</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {sortedRows.map((row) => (
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
                  <Td style={{ verticalAlign: 'middle' }}>{renderNameCell(row)}</Td>
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
                    {renderApiKeyField({
                      status: row.status,
                      rowId: row.id,
                      apiKeyState: row.apiKeyState,
                      revealedKeyIds: revealedSet,
                      onOpenReveal: undefined,
                      interactive: false
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
                        <DropdownItem
                          key="edit"
                          onClick={() => {
                            setActionsOpenRowId(null);
                            onOpenEdit?.(row);
                          }}
                        >
                          Edit
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          isDanger
                          onClick={() => {
                            setActionsOpenRowId(null);
                            onOpenDelete?.(row);
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
                      colSpan={7}
                      style={{
                        borderTop: 'none',
                        paddingTop: 0,
                        paddingBottom: 'var(--pf-t--global--spacer--md)',
                        verticalAlign: 'top',
                        boxShadow: 'none',
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
    </>
  );
};

export default RoniTokiTabPanel;
