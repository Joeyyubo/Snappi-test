import React, { useState, useMemo } from 'react';
import {
  PageSection,
  Title,
  Flex,
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
  AlertActionLink
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
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
  TIER_TABLE_COLUMN_MIN_WIDTH,
} from './TierSortableColumnHeader';
import { TruncatedTableLink, TruncatedTableText } from './ApiKeyNameText';

const STATUS_OPTIONS = ['Active', 'Pending', 'Rejected', 'Revoked', 'Expired'];
const STATUS_RANK = { Active: 4, Pending: 3, Rejected: 2, Revoked: 1, Expired: 0 };

const APIKeyApprovalsPage = ({ onNavigateToApiCatalog }) => {
  const credentialsData = useMemo(() => buildCredentialsData(), []);

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
    const matchesSearch =
      !searchValue ||
      row.name.toLowerCase().includes(searchValue.toLowerCase()) ||
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

  const visibleIds = sortedCredentials.map((r) => r.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedIds.has(id)) && !allVisibleSelected;

  const toggleSelectAllVisible = (checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        visibleIds.forEach((id) => next.add(id));
      } else {
        visibleIds.forEach((id) => next.delete(id));
      }
      return next;
    });
  };

  const toggleRowSelected = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

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
        <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{status}</span>
      </span>
    );
  };

  return (
    <>
      <style>{`
        .toolbar-api-approvals .pf-v6-c-toolbar__content:last-of-type {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          gap: var(--pf-t--global--spacer--md);
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
            <ToolbarGroup>
              <ToolbarItem>
                <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapNone' }}>
                  <Checkbox
                    id="approvals-select-all"
                    isChecked={allVisibleSelected}
                    isIndeterminate={someVisibleSelected}
                    onChange={(_e, checked) => toggleSelectAllVisible(checked)}
                    aria-label="Select all rows on this page"
                  />
                  <Dropdown
                    isOpen={bulkOpen}
                    onOpenChange={setBulkOpen}
                    onSelect={() => setBulkOpen(false)}
                    toggle={(toggleRef) => (
                      <MenuToggle
                        ref={toggleRef}
                        variant="plain"
                        onClick={() => setBulkOpen((prev) => !prev)}
                        isExpanded={bulkOpen}
                        aria-label="Bulk selection options"
                      >
                        <CaretDownIcon />
                      </MenuToggle>
                    )}
                  >
                    <DropdownList>
                      <DropdownItem key="all" onClick={() => toggleSelectAllVisible(true)}>
                        Select all on page
                      </DropdownItem>
                      <DropdownItem key="none" onClick={clearSelection}>
                        Select none
                      </DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Flex>
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
              <Th
                dataLabel="Tier"
                style={{ minWidth: TIER_TABLE_COLUMN_MIN_WIDTH, whiteSpace: 'nowrap' }}
              >
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
                      isChecked={selectedIds.has(row.id)}
                      onChange={(_e, checked) => toggleRowSelected(row.id, checked)}
                      aria-label={`Select ${row.name}`}
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
                  <Td style={{ verticalAlign: 'middle', minWidth: TIER_TABLE_COLUMN_MIN_WIDTH }}>
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
                        boxShadow: 'none'
                      }}
                    >
                      <div
                        style={{
                          paddingLeft: 'var(--pf-t--global--spacer--3xl)',
                          paddingTop: 'var(--pf-t--global--spacer--md)',
                          paddingBottom: 0,
                          backgroundColor: 'var(--pf-t--global--background--color--100)'
                        }}
                      >
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
                      </div>
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
