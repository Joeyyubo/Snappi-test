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
  Alert,
  AlertVariant,
  AlertActionLink
} from '@patternfly/react-core';
import { TIER_TOOLTIPS, TIER_LIMIT, CREDENTIAL_TIER_OPTIONS } from '../data/apiCredentialsModel';
import { renderApiKeyField } from './apiKeyFieldDisplay';
import {
  getApiKeyNameTableDisplay,
  TruncatedTableLink,
  TruncatedTableText
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
import {
  FilterIcon,
  EllipsisVIcon,
  CheckCircleIcon,
  PendingIcon,
  ExclamationCircleIcon,
  AngleRightIcon,
  AngleDownIcon,
  ExclamationTriangleIcon
} from '@patternfly/react-icons';

const STATUS_OPTIONS = ['Active', 'Pending', 'Rejected', 'Revoked', 'Expired'];
const STATUS_RANK = { Active: 3, Pending: 2, Rejected: 1 };

function apiKeyColumnRank(row, revealedKeyIds) {
  if (row.status === 'Active' && row.apiKeyState === 'masked') return 4;
  if (row.status === 'Active' && (row.apiKeyState === 'viewed' || revealedKeyIds.has(row.id))) return 3;
  if (row.apiKeyState === 'generating') return 2;
  return 1;
}

const APICredentialsPage = ({
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
      row.api.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.owner.toLowerCase().includes(searchValue.toLowerCase());
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
          cmp = (a.owner || '').localeCompare(b.owner || '', undefined, { sensitivity: 'base' });
          break;
        case 3:
          cmp = (a.api || '').localeCompare(b.api || '', undefined, { sensitivity: 'base' });
          break;
        case 4:
          cmp = (STATUS_RANK[a.status] ?? 0) - (STATUS_RANK[b.status] ?? 0);
          break;
        case 5:
          cmp = (TIER_LIMIT[a.tier] ?? 0) - (TIER_LIMIT[b.tier] ?? 0);
          break;
        case 6:
          cmp = apiKeyColumnRank(a, revealedSet) - apiKeyColumnRank(b, revealedSet);
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
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <Icon size="sm" status={iconStatus} style={{ flexShrink: 0 }}>
          <StatusIcon />
        </Icon>
        <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{status}</span>
      </span>
    );
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
        .toolbar-api-credentials .pf-v6-c-toolbar__content:last-of-type {
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
        .toolbar-api-credentials .pf-v6-c-label-group .pf-v6-c-label.pf-m-outline {
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
        .toolbar-api-credentials .pf-v6-c-label-group .pf-v6-c-label.pf-m-outline .pf-v6-c-label__actions .pf-v6-c-button {
          --pf-v6-c-button__icon--Color: var(--pf-t--global--icon--color--regular);
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
          <Divider style={{ marginTop: '16px', marginBottom: '16px' }} />
        </div>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">My API keys</Title>
            <p
              style={{
                marginTop: 'var(--pf-t--global--spacer--sm)',
                color: 'var(--pf-t--global--text--color--subtle)'
              }}
            >
              View and manage your API keys.
            </p>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={() => onOpenRequestApiKey?.()}>
              Request API key
            </Button>
          </FlexItem>
        </Flex>

        <Toolbar
          className="toolbar-api-credentials"
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
                  placeholder="Find by API or API key name"
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
          <Table aria-label="My API keys table">
          <Thead>
            <Tr>
              <Th
                style={{
                  width: 'var(--pf-t--global--spacer--2xl)',
                  paddingLeft: 'var(--pf-t--global--spacer--sm)',
                  paddingRight: 'var(--pf-t--global--spacer--xs)'
                }}
              />
              <Th sort={{ columnIndex: 1, sortBy: sortState, onSort: handleSort }}>API key name</Th>
              <Th sort={{ columnIndex: 2, sortBy: sortState, onSort: handleSort }}>Owner</Th>
              <Th sort={{ columnIndex: 3, sortBy: sortState, onSort: handleSort }}>API</Th>
              <Th sort={{ columnIndex: 4, sortBy: sortState, onSort: handleSort }}>Status</Th>
              <Th dataLabel="Tier" style={TIER_TABLE_COLUMN_STYLE}>
                <TierSortableColumnHeader columnIndex={5} sortBy={sortState} onSort={handleSort} />
              </Th>
              <Th sort={{ columnIndex: 6, sortBy: sortState, onSort: handleSort }}>API key</Th>
              <Th sort={{ columnIndex: 7, sortBy: sortState, onSort: handleSort }}>Requested time</Th>
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
                      {expandedRows[row.id] ? (
                        <AngleDownIcon />
                      ) : (
                        <AngleRightIcon />
                      )}
                    </Button>
                  </Td>
                  <Td style={{ verticalAlign: 'middle' }}>{renderApiKeyNameCell(row)}</Td>
                  <Td style={{ verticalAlign: 'middle' }}>
                    <TruncatedTableText text={row.owner} />
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
                      colSpan={9}
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
                              <AlertActionLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                }}
                              >
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

export default APICredentialsPage;
