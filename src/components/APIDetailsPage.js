import React, { useState, useMemo } from 'react';
import {
  PageSection,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Breadcrumb,
  BreadcrumbItem,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  CodeBlock,
  CodeBlockCode,
  Flex,
  FlexItem,
  Button,
  Grid,
  GridItem,
  Label,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Divider,
  Card,
  CardBody,
  CardTitle,
  Alert,
  AlertVariant
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@patternfly/react-table';
import { getCatalogProductByName } from '../data/apiCatalogModel';
import { buildCatalogDetailsApiKeysDemo } from '../data/apiCredentialsModel';
import CatalogApiKeysTabPanel from './CatalogApiKeysTabPanel';

function renderCatalogStatusLabel(status) {
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

const getSwaggerDefinition = (apiName, slug) => {
  const pathSlug = slug || apiName.toLowerCase().replace(/\s+/g, '_').replace(/&/g, 'and');
  const basePath = `/${pathSlug}/v1`;
  return `openapi: 3.0.3
info:
  title: ${apiName} API
  description: Mock OpenAPI definition for ${apiName}.
  version: 1.0.0
  contact:
    name: API Support
    email: api@example.com

servers:
  - url: https://api.example.com${basePath}
    description: Production

paths:
  /resources:
    get:
      summary: List resources
      operationId: listItems
      tags:
        - ${apiName}
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ListResponse'
    post:
      summary: Create resource
      operationId: createItem
      tags:
        - ${apiName}
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateRequest'
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ItemResponse'
        '400':
          description: Bad request

  /resources/{id}:
    get:
      summary: Get by ID
      operationId: getItem
      tags:
        - ${apiName}
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ItemResponse'
        '404':
          description: Not found

components:
  schemas:
    ListResponse:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: '#/components/schemas/Item'
        total:
          type: integer
          example: 42
    Item:
      type: object
      properties:
        id:
          type: string
          example: "item-001"
        name:
          type: string
        createdAt:
          type: string
          format: date-time
    ItemResponse:
      allOf:
        - $ref: '#/components/schemas/Item'
    CreateRequest:
      type: object
      required:
        - name
      properties:
        name:
          type: string
        metadata:
          type: object
`;
};

const dtStyle = {
  fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
  color: 'var(--pf-t--global--text--color--subtle)'
};

const APIDetailsPage = ({
  apiName,
  onBack,
  breadcrumbParent = 'API catalog',
  onRequestApiKey
}) => {
  const [activeTabKey, setActiveTabKey] = useState('overview');
  const [projectOpen, setProjectOpen] = useState(false);

  const product = getCatalogProductByName(apiName);

  const catalogApiKeysRows = useMemo(
    () => (product ? buildCatalogDetailsApiKeysDemo(apiName) : []),
    [product, apiName]
  );

  const handleTabClick = (_event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const linkStyle = { color: 'var(--pf-t--global--text--color--link--default)' };

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
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsFlexStart' }}
          flexWrap={{ default: 'wrap' }}
          gap={{ default: 'gapMd' }}
        >
          <FlexItem grow={{ default: 'grow' }}>
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
                {breadcrumbParent}
              </BreadcrumbItem>
              <BreadcrumbItem isActive>{apiName}</BreadcrumbItem>
            </Breadcrumb>
            <Flex
              alignItems={{ default: 'alignItemsCenter' }}
              gap={{ default: 'gapMd' }}
              flexWrap={{ default: 'wrap' }}
            >
              <Title headingLevel="h1" size="2xl">
                {apiName}
              </Title>
              {product ? renderCatalogStatusLabel(product.catalogStatus) : null}
            </Flex>
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={() => onRequestApiKey?.()}>
              Request API key
            </Button>
          </FlexItem>
        </Flex>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          style={{ marginTop: 'var(--pf-t--global--spacer--lg)' }}
        >
          <Tab eventKey="overview" title={<TabTitleText>Overview</TabTitleText>} />
          <Tab eventKey="definition" title={<TabTitleText>Definition</TabTitleText>} />
          <Tab eventKey="api-keys" title={<TabTitleText>API keys</TabTitleText>} />
        </Tabs>
      </PageSection>

      <PageSection
        style={{
          backgroundColor: 'var(--pf-t--global--background--color--100)'
        }}
      >
        {activeTabKey === 'overview' && (
          <>
            {!product && (
              <Alert
                variant={AlertVariant.warning}
                isInline
                title="Catalog entry not found"
                style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
              >
                No metadata is defined for &quot;{apiName}&quot; in the API catalog model.
              </Alert>
            )}
            {product && (
              <Grid hasGutter>
                <GridItem span={12}>
                  <Card isCompact>
                    <CardBody>
                      <CardTitle>
                        <Title headingLevel="h2" size="lg">
                          About
                        </Title>
                      </CardTitle>
                      <Grid hasGutter style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}>
                        <GridItem md={6}>
                          <DescriptionList isCompact>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>API product name</DescriptionListTerm>
                              <DescriptionListDescription>
                                {product.productDisplayName}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>Description</DescriptionListTerm>
                              <DescriptionListDescription>{product.description}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>Version</DescriptionListTerm>
                              <DescriptionListDescription>{product.version}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>Lifecycle status</DescriptionListTerm>
                              <DescriptionListDescription>
                                {renderCatalogStatusLabel(product.catalogStatus)}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>Owner</DescriptionListTerm>
                              <DescriptionListDescription>{product.owner}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>URL</DescriptionListTerm>
                              <DescriptionListDescription>
                                <a href={product.baseUrl} style={linkStyle} target="_blank" rel="noopener noreferrer">
                                  {product.baseUrl}
                                </a>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </GridItem>
                        <GridItem md={6}>
                          <DescriptionList isCompact>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>API spec</DescriptionListTerm>
                              <DescriptionListDescription>
                                <a href={product.specUrl} style={linkStyle} target="_blank" rel="noopener noreferrer">
                                  {product.specUrl}
                                </a>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>API document</DescriptionListTerm>
                              <DescriptionListDescription>
                                <a href={product.docUrl} style={linkStyle} target="_blank" rel="noopener noreferrer">
                                  {product.docUrl}
                                </a>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>Tag</DescriptionListTerm>
                              <DescriptionListDescription>
                                <Label color={tagLabelColor(product.tag)} variant="outline" isCompact>
                                  {product.tag}
                                </Label>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>Lifecycle</DescriptionListTerm>
                              <DescriptionListDescription>{product.lifecycle}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>Approval</DescriptionListTerm>
                              <DescriptionListDescription>{product.approval}</DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm style={dtStyle}>Created</DescriptionListTerm>
                              <DescriptionListDescription>{product.created}</DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </GridItem>
                      </Grid>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem span={12}>
                  <Card isCompact>
                    <CardBody>
                      <CardTitle>
                        <Title headingLevel="h2" size="lg">
                          Plan
                        </Title>
                      </CardTitle>
                      <Table
                        aria-label="API product tiers"
                        style={{ marginTop: 'var(--pf-t--global--spacer--md)' }}
                      >
                        <Thead>
                          <Tr>
                            <Th>Tiers</Th>
                            <Th>Rate limit</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {product.planTiers.map((row) => (
                            <Tr key={`${row.tier}-${row.rateLimit}`}>
                              <Td>
                                <Label variant="outline" isCompact>
                                  {row.tier}
                                </Label>
                              </Td>
                              <Td>{row.rateLimit}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            )}
          </>
        )}

        {activeTabKey === 'definition' && (
          <div>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}>
              OpenAPI 3.0 Definition
            </Title>
            <CodeBlock>
              <CodeBlockCode>{getSwaggerDefinition(apiName, product?.slug)}</CodeBlockCode>
            </CodeBlock>
          </div>
        )}

        {activeTabKey === 'api-keys' && (
          <>
            {!product && (
              <Alert
                variant={AlertVariant.warning}
                isInline
                title="Catalog entry not found"
                style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
              >
                No API keys can be listed for &quot;{apiName}&quot; until it exists in the API catalog model.
              </Alert>
            )}
            {product && <CatalogApiKeysTabPanel rows={catalogApiKeysRows} />}
          </>
        )}
      </PageSection>
    </>
  );
};

export default APIDetailsPage;
