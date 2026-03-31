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
  SearchInput
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
import { getCatalogTableRows } from '../data/apiCatalogModel';

const CATALOG_STATUS_OPTIONS = ['Published', 'Active', 'Draft', 'Retired', 'Deprecated'];

const CATALOG_ROWS = getCatalogTableRows();

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
        row.description.toLowerCase().includes(q);
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
          cmp = a.description.localeCompare(b.description, undefined, { sensitivity: 'base' });
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
              Project
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
              APIs
            </BreadcrumbItem>
            <BreadcrumbItem isActive>APIs</BreadcrumbItem>
          </Breadcrumb>
        )}
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsFlexStart' }}>
          <FlexItem>
            <Title headingLevel="h1" size="2xl">
              APIs
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
                  placeholder="Find by name or description"
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
                    aria-label="APIs toolbar actions"
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
          <Table aria-label="APIs table" ouiaId="api-catalog-table">
            <Thead>
              <Tr>
                <Th sort={{ columnIndex: 0, sortBy: sortState, onSort: handleSort }}>Name</Th>
                <Th sort={{ columnIndex: 1, sortBy: sortState, onSort: handleSort }}>Description</Th>
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
                  <Td dataLabel="Description">
                    <span
                      style={{
                        color: 'var(--pf-t--global--text--color--regular)',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}
                    >
                      {row.description}
                    </span>
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
