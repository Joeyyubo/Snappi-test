import React, { useMemo, useState } from 'react';
import {
  PageSection,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarGroup,
  Flex,
  FlexItem,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Icon,
  Divider,
  SearchInput,
  Label
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  SortByDirection
} from '@patternfly/react-table';
import { FilterIcon, EllipsisVIcon } from '@patternfly/react-icons';
import { TruncatedTableText } from './ApiKeyNameText';
import { getCatalogTableRows } from '../data/apiCatalogModel';

const CATALOG_STATUS_OPTIONS = ['Published', 'Active', 'Draft', 'Retired', 'Deprecated'];

const CATALOG_ROWS = getCatalogTableRows();

function renderProductStatus(status) {
  switch (status) {
    case 'Published':
    case 'Active':
      return (
        <Label color="green" variant="filled" isCompact>
          {status}
        </Label>
      );
    case 'Draft':
      return (
        <Label color="blue" variant="filled" isCompact>
          {status}
        </Label>
      );
    case 'Retired':
      return (
        <Label color="grey" variant="outline" isCompact>
          {status}
        </Label>
      );
    case 'Deprecated':
      return (
        <Label color="orange" variant="outline" isCompact>
          {status}
        </Label>
      );
    default:
      return (
        <Label variant="outline" isCompact>
          {status}
        </Label>
      );
  }
}

function tagLabelColor(tag) {
  if (tag === 'Business') return 'blue';
  if (tag === 'People') return 'purple';
  if (tag === 'Airport') return 'cyan';
  return 'grey';
}

const PortalPage = ({ onApiNameClick, onBack }) => {
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [toolbarActionsOpen, setToolbarActionsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  const [sortState, setSortState] = useState({
    index: 0,
    direction: SortByDirection.asc,
    defaultDirection: SortByDirection.asc
  });

  const handleSort = (_event, index, direction) => {
    setSortState({ index, direction, defaultDirection: SortByDirection.asc });
  };

  const toggleStatusFilter = (value) => {
    setStatusFilters((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const filteredRows = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    return CATALOG_ROWS.filter((row) => {
      const matchesSearch =
        !q ||
        row.name.toLowerCase().includes(q) ||
        row.owner.toLowerCase().includes(q) ||
        row.tag.toLowerCase().includes(q) ||
        row.lifecycle.toLowerCase().includes(q);
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(row.status);
      return matchesSearch && matchesStatus;
    });
  }, [searchValue, statusFilters]);

  const sortedRows = useMemo(() => {
    const list = [...filteredRows];
    const { index, direction } = sortState;
    const mult = direction === SortByDirection.asc ? 1 : -1;
    list.sort((a, b) => {
      let cmp = 0;
      switch (index) {
        case 0:
          cmp = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
          break;
        case 1:
          cmp = a.version.localeCompare(b.version, undefined, { sensitivity: 'base', numeric: true });
          break;
        case 2:
          cmp = a.owner.localeCompare(b.owner, undefined, { sensitivity: 'base' });
          break;
        case 3:
          cmp = a.lifecycle.localeCompare(b.lifecycle, undefined, { sensitivity: 'base' });
          break;
        case 4:
          cmp = a.status.localeCompare(b.status, undefined, { sensitivity: 'base' });
          break;
        case 5:
          cmp = a.description.localeCompare(b.description, undefined, { sensitivity: 'base' });
          break;
        case 6:
          cmp = a.tag.localeCompare(b.tag, undefined, { sensitivity: 'base' });
          break;
        case 7:
          cmp = a.created.localeCompare(b.created, undefined, { numeric: true });
          break;
        default:
          return 0;
      }
      return mult * cmp;
    });
    return list;
  }, [filteredRows, sortState]);

  const statusFilterLabel =
    statusFilters.length === 0
      ? 'Status'
      : statusFilters.length === 1
        ? `Status: ${statusFilters[0]}`
        : `Status (${statusFilters.length})`;

  return (
    <>
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
            <DropdownItem key="proj1">Project alpha</DropdownItem>
            <DropdownItem key="proj2">Project beta</DropdownItem>
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
        {onBack && (
          <Breadcrumb style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
            <BreadcrumbItem
              onClick={onBack}
              isLink
              style={{
                color: 'var(--pf-t--global--text--color--link--default)',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              API catalog
            </BreadcrumbItem>
            <BreadcrumbItem isActive>API catalog</BreadcrumbItem>
          </Breadcrumb>
        )}
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              API catalog
            </Title>
            <p
              style={{
                marginTop: 'var(--pf-t--global--spacer--sm)',
                color: 'var(--pf-t--global--text--color--subtle)',
                maxWidth: 'min(100%, 40rem)'
              }}
            >
              Discover and request available API product in organization.
            </p>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" isDisabled>
              Request API product
            </Button>
          </FlexItem>
        </Flex>
      </PageSection>

      <PageSection>
        <Toolbar ouiaId="api-catalog-toolbar">
          <ToolbarContent>
            <ToolbarGroup variant="filter-group" gap={{ default: 'gapMd' }}>
              <ToolbarItem>
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
                      {statusFilterLabel}
                    </MenuToggle>
                  )}
                >
                  <DropdownList>
                    {CATALOG_STATUS_OPTIONS.map((s) => (
                      <DropdownItem
                        key={s}
                        hasCheckbox
                        isSelected={statusFilters.includes(s)}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleStatusFilter(s);
                        }}
                      >
                        {s}
                      </DropdownItem>
                    ))}
                  </DropdownList>
                </Dropdown>
              </ToolbarItem>
              <ToolbarItem>
                <SearchInput
                  placeholder="Find by name"
                  value={searchValue}
                  onChange={(_e, v) => setSearchValue(v)}
                  onClear={() => setSearchValue('')}
                  style={{ width: 'min(100%, 18rem)' }}
                />
              </ToolbarItem>
            </ToolbarGroup>
            <ToolbarItem>
              <Dropdown
                isOpen={toolbarActionsOpen}
                onOpenChange={(open) => setToolbarActionsOpen(open)}
                onSelect={() => setToolbarActionsOpen(false)}
                toggle={(toggleRef) => (
                  <MenuToggle
                    ref={toggleRef}
                    aria-label="API catalog toolbar actions"
                    variant="plain"
                    onClick={() => setToolbarActionsOpen((o) => !o)}
                    style={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    <EllipsisVIcon />
                  </MenuToggle>
                )}
              >
                <DropdownList>
                  <DropdownItem key="export">Export list</DropdownItem>
                  <DropdownItem key="refresh">Refresh</DropdownItem>
                </DropdownList>
              </Dropdown>
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>

        <div style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
          <Table aria-label="API catalog table" ouiaId="api-catalog-table">
            <Thead>
              <Tr>
                <Th sort={{ columnIndex: 0, sortBy: sortState, onSort: handleSort }}>Name</Th>
                <Th sort={{ columnIndex: 1, sortBy: sortState, onSort: handleSort }}>Version</Th>
                <Th sort={{ columnIndex: 2, sortBy: sortState, onSort: handleSort }}>Owner</Th>
                <Th sort={{ columnIndex: 3, sortBy: sortState, onSort: handleSort }}>Lifecycle</Th>
                <Th sort={{ columnIndex: 4, sortBy: sortState, onSort: handleSort }}>Status</Th>
                <Th sort={{ columnIndex: 5, sortBy: sortState, onSort: handleSort }}>Description</Th>
                <Th sort={{ columnIndex: 6, sortBy: sortState, onSort: handleSort }}>Tag</Th>
                <Th sort={{ columnIndex: 7, sortBy: sortState, onSort: handleSort }}>Created</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sortedRows.map((row) => (
                <Tr key={row.id}>
                  <Td dataLabel="Name">
                    <Button variant="link" isInline onClick={() => onApiNameClick?.(row.name)}>
                      {row.name}
                    </Button>
                  </Td>
                  <Td dataLabel="Version">{row.version}</Td>
                  <Td dataLabel="Owner">
                    <TruncatedTableText text={row.owner} />
                  </Td>
                  <Td dataLabel="Lifecycle">{row.lifecycle}</Td>
                  <Td dataLabel="Status">{renderProductStatus(row.status)}</Td>
                  <Td dataLabel="Description">
                    <span style={{ color: 'var(--pf-t--global--text--color--regular)' }}>{row.description}</span>
                  </Td>
                  <Td dataLabel="Tag">
                    <Label color={tagLabelColor(row.tag)} variant="outline" isCompact>
                      {row.tag}
                    </Label>
                  </Td>
                  <Td dataLabel="Created">
                    <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{row.created}</span>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </PageSection>
    </>
  );
};

export default PortalPage;
