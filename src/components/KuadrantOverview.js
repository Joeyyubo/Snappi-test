import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  Button,
  Flex,
  FlexItem,
  Icon,
  Tabs,
  Tab,
  TabTitleText,
  SearchInput,
  Label,
  Dropdown,
  DropdownList,
  DropdownItem,
  MenuToggle
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
  ServerIcon,
  SecurityIcon,
  ChartLineIcon,
  CheckCircleIcon,
  EllipsisVIcon
} from '@patternfly/react-icons';
import GatewayTable from './GatewayTable';
import { pf } from '../styles/pf6Tokens';

// Mock chart components since PatternFly charts require additional setup
const DonutChart = ({ data, title, subTitle }) => (
  <div
    style={{
      position: 'relative',
      height: '12.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <svg width="160" height="160" viewBox="0 0 160 160">
      <circle
        cx="80"
        cy="80"
        r="60"
        fill="none"
        stroke={pf.color.borderSubtle}
        strokeWidth="20"
      />
      <circle
        cx="80"
        cy="80"
        r="60"
        fill="none"
        stroke={pf.color.success}
        strokeWidth="20"
        strokeDasharray={`${data.healthy * 3.77} ${(100 - data.healthy) * 3.77}`}
        strokeDashoffset="0"
        transform="rotate(-90 80 80)"
      />
      <text
        x="80"
        y="75"
        textAnchor="middle"
        style={{
          fontSize: pf.font.headingMd,
          fontWeight: pf.font.weightBold,
          fill: pf.color.success
        }}
      >
        {data.healthy}%
      </text>
      <text
        x="80"
        y="95"
        textAnchor="middle"
        style={{ fontSize: pf.font.bodyDefault, fill: pf.color.textSubtle }}
      >
        {title}
      </text>
    </svg>
  </div>
);

const LineChart = ({ data, title }) => (
  <div
    style={{
      height: '12.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}
  >
    <h4
      style={{
        textAlign: 'center',
        marginBottom: pf.space.md,
        color: pf.color.textRegular,
        fontSize: pf.font.bodyDefault,
        fontWeight: pf.font.weightBold
      }}
    >
      {title}
    </h4>
    <svg width="100%" height="120" viewBox="0 0 300 120">
      <defs>
        <linearGradient id="requestGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: pf.color.brand, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: pf.color.brand, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <polyline
        fill="url(#requestGradient)"
        stroke={pf.color.brand}
        strokeWidth="2"
        points="0,80 50,60 100,70 150,50 200,55 250,45 300,40"
      />
      <circle cx="300" cy="40" r="4" fill={pf.color.brand} />
      <text
        x="150"
        y="110"
        textAnchor="middle"
        style={{ fontSize: pf.font.bodySm, fill: pf.color.textSubtle }}
      >
        Last 24 hours
      </text>
    </svg>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: pf.space.sm,
        fontSize: pf.font.bodySm,
        color: pf.color.textSubtle
      }}
    >
      <span>Success: 94.2%</span>
      <span>Errors: 5.8%</span>
    </div>
  </div>
);

// Routes data (aligned with RoutesPage)
const ROUTES_DATA = [
  { name: 'example-route', namespace: 'default', status: 'Accepted', type: 'HTTPRoute', hostnames: ['example.com'], path: '/', service: 'example-service', port: 80, lastUpdated: '2 minutes ago' },
  { name: 'api-route-1', namespace: 'default', status: 'Accepted', type: 'HTTPRoute', hostnames: ['api.example.com'], path: '/api/v1', service: 'api-service', port: 8080, lastUpdated: '5 minutes ago' },
  { name: 'api-route-2', namespace: 'default', status: 'Accepted', type: 'HTTPRoute', hostnames: ['api-v2.example.com'], path: '/api/v2', service: 'api-v2-service', port: 8080, lastUpdated: '10 minutes ago' },
  { name: 'mcp-api-route', namespace: 'api-gateway-dmtest1', status: 'Accepted', type: 'HTTPRoute', hostnames: ['mcp.example.com'], path: '/mcp', service: 'mcp-service', port: 3001, lastUpdated: '15 minutes ago' },
  { name: 'web-route', namespace: 'ai-gateway-prod', status: 'Accepted', type: 'HTTPRoute', hostnames: ['web.example.com'], path: '/', service: 'web-service', port: 80, lastUpdated: '1 hour ago' },
  { name: 'grpc-route', namespace: 'default', status: 'Accepted', type: 'GRPCRoute', hostnames: ['grpc.example.com'], path: '/grpc', service: 'grpc-service', port: 9090, lastUpdated: '2 hours ago' }
];

const KuadrantOverview = ({ onGatewayNameClick, onCreateGateway, onCreateHTTPRoute }) => {
  const [activeGatewayTabKey, setActiveGatewayTabKey] = useState('all-gateways');
  const [activeRoutesTabKey, setActiveRoutesTabKey] = useState('all');
  const [routesSearchValue, setRoutesSearchValue] = useState('');

  const searchFiltered = !routesSearchValue
    ? ROUTES_DATA
    : ROUTES_DATA.filter(
        (r) =>
          r.name.toLowerCase().includes(routesSearchValue.toLowerCase()) ||
          r.namespace.toLowerCase().includes(routesSearchValue.toLowerCase()) ||
          r.type.toLowerCase().includes(routesSearchValue.toLowerCase()) ||
          r.service.toLowerCase().includes(routesSearchValue.toLowerCase())
      );
  const filteredRoutes =
    activeRoutesTabKey === 'httproutes'
      ? searchFiltered.filter((r) => r.type === 'HTTPRoute')
      : activeRoutesTabKey === 'grpcroutes'
        ? searchFiltered.filter((r) => r.type === 'GRPCRoute')
        : searchFiltered;

  const renderNamespace = (namespace) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Label color="green" variant="filled" isCompact>NS</Label>
      <span style={{ marginLeft: pf.space.sm }}>{namespace}</span>
    </div>
  );

  const renderRouteStatus = (status) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Icon style={{ marginRight: pf.space.sm }}>
        <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
      </Icon>
      <span>{status}</span>
    </div>
  );

  return (
    <>
      <PageSection variant="light">
        <Title headingLevel="h1" size="2xl">
          Connectivity Link overview
        </Title>
        
        <div style={{ marginTop: pf.space['3xl'] }}>
          <h2
            style={{
              marginBottom: pf.space.md,
              fontSize: pf.font.bodyDefault,
              fontWeight: pf.font.weightBold,
              color: pf.color.textRegular
            }}
          >
            System overview
          </h2>
          
          <Grid hasGutter>
            <GridItem xl={4} lg={4} md={6} sm={12}>
              <Card isFullHeight>
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                          <Icon>
                            <ServerIcon color="var(--pf-t--global--color--brand--200)" />
                          </Icon>
                        </FlexItem>
                        <FlexItem>
                          <h3 style={{ color: pf.color.brand, fontWeight: pf.font.weightBold }}>
                            Impact
                          </h3>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <p style={{ color: pf.color.textSubtle, fontSize: pf.font.bodyDefault }}>
                        Impact scope
                      </p>
                    </FlexItem>
                    <FlexItem>
                      <div style={{ display: 'flex', alignItems: 'center', gap: pf.space.sm }}>
                        <span style={{ color: pf.color.brand, fontSize: pf.font.headingMd, fontWeight: pf.font.weightBold }}>
                          95%
                        </span>
                        <span style={{ color: pf.color.textSubtle, fontSize: pf.font.bodyDefault }}>
                          Coverage
                        </span>
                      </div>
                    </FlexItem>
                    <FlexItem>
                      <div style={{ color: pf.color.textSubtle, fontSize: pf.font.bodyDefault }}>
                        <div>• 8 active gateways</div>
                        <div>• 16 policies enforced</div>
                        <div>• 3 namespaces</div>
                      </div>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem xl={4} lg={4} md={6} sm={12}>
              <Card isFullHeight>
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                          <Icon>
                            <SecurityIcon color="var(--pf-t--global--color--status--success--100)" />
                          </Icon>
                        </FlexItem>
                        <FlexItem>
                          <h3 style={{ color: pf.color.success, fontWeight: pf.font.weightBold }}>
                            Stability
                          </h3>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <p style={{ color: pf.color.textSubtle, fontSize: pf.font.bodyDefault }}>
                        System status
                      </p>
                    </FlexItem>
                    <FlexItem>
                      <div style={{ display: 'flex', alignItems: 'center', gap: pf.space.sm }}>
                        <span style={{ color: pf.color.success, fontSize: pf.font.headingMd, fontWeight: pf.font.weightBold }}>
                          99.9%
                        </span>
                        <span style={{ color: pf.color.textSubtle, fontSize: pf.font.bodyDefault }}>
                          Uptime
                        </span>
                      </div>
                    </FlexItem>
                    <FlexItem>
                      <div style={{ color: pf.color.textSubtle, fontSize: pf.font.bodyDefault }}>
                        <div>• Average latency 850ms</div>
                        <div>• 0 critical errors</div>
                        <div>• Health checks passing</div>
                      </div>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem xl={4} lg={4} md={6} sm={12}>
              <Card isFullHeight>
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
                        <FlexItem>
                          <Icon>
                            <ChartLineIcon color="var(--pf-t--global--color--status--warning--200)" />
                          </Icon>
                        </FlexItem>
                        <FlexItem>
                          <h3 style={{ color: pf.color.warning, fontWeight: pf.font.weightBold }}>
                            Value
                          </h3>
                        </FlexItem>
                      </Flex>
                    </FlexItem>
                    <FlexItem>
                      <p style={{ color: pf.color.textSubtle, fontSize: pf.font.bodyDefault }}>
                        Business impact
                      </p>
                    </FlexItem>
                    <FlexItem>
                      <div style={{ display: 'flex', alignItems: 'center', gap: pf.space.sm }}>
                        <span style={{ color: pf.color.warning, fontSize: pf.font.headingMd, fontWeight: pf.font.weightBold }}>
                          $2,450
                        </span>
                        <span style={{ color: pf.color.textSubtle, fontSize: pf.font.bodyDefault }}>
                          Monthly savings
                        </span>
                      </div>
                    </FlexItem>
                    <FlexItem>
                      <div style={{ color: pf.color.textSubtle, fontSize: pf.font.bodyDefault }}>
                        <div>• 40% throughput increase</div>
                        <div>• 25% response time improvement</div>
                        <div>• 78% resource utilization</div>
                      </div>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
          
          <Grid hasGutter style={{ marginTop: pf.space.lg }}>
            <GridItem xl={6} lg={6} md={12} sm={12}>
              <Card isFullHeight>
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <h3
                        style={{
                          fontWeight: pf.font.weightBold,
                          marginBottom: pf.space.md,
                          color: pf.color.textRegular
                        }}
                      >
                        System Health
                      </h3>
                    </FlexItem>
                    <FlexItem>
                      <DonutChart 
                        data={{ healthy: 96.5 }}
                        title="Healthy"
                      />
                    </FlexItem>
                    <FlexItem>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          fontSize: pf.font.bodyDefault,
                          color: pf.color.textSubtle
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: pf.font.weightBold, color: pf.color.success }}>8</div>
                          <div>Healthy</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: pf.font.weightBold, color: pf.color.warning }}>1</div>
                          <div>Warning</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: pf.font.weightBold, color: pf.color.danger }}>0</div>
                          <div>Critical</div>
                        </div>
                      </div>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem xl={6} lg={6} md={12} sm={12}>
              <Card isFullHeight>
                <CardBody>
                  <Flex direction={{ default: 'column' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    <FlexItem>
                      <h3
                        style={{
                          fontWeight: pf.font.weightBold,
                          marginBottom: pf.space.md,
                          color: pf.color.textRegular
                        }}
                      >
                        Request Health Trend
                      </h3>
                    </FlexItem>
                    <FlexItem>
                      <LineChart 
                        title="Incoming Requests"
                        data={[]}
                      />
                    </FlexItem>
                    <FlexItem>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          fontSize: pf.font.bodyDefault,
                          color: pf.color.textSubtle
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: pf.font.weightBold, color: pf.color.brand }}>3.2K</div>
                          <div>Req/min</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: pf.font.weightBold, color: pf.color.success }}>94.2%</div>
                          <div>Success</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: pf.font.weightBold, color: pf.color.danger }}>5.8%</div>
                          <div>Errors</div>
                        </div>
                      </div>
                    </FlexItem>
                  </Flex>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </div>
      </PageSection>

      <PageSection
        style={{ paddingTop: 0 }}
        isFilled={false}
      >
        {/* Gateways card */}
        <Card style={{ marginBottom: pf.space.lg }}>
          <CardHeader>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
              <Title headingLevel="h2" size="xl">Gateways</Title>
              <Button variant="primary" onClick={() => onCreateGateway?.()}>
                Create Gateway
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Tabs
              activeKey={activeGatewayTabKey}
              onSelect={(e, tabKey) => setActiveGatewayTabKey(tabKey)}
              style={{ marginBottom: pf.space.lg }}
            >
              <Tab eventKey="all-gateways" title={<TabTitleText>All gateways</TabTitleText>} />
              <Tab eventKey="api-gateways" title={<TabTitleText>API gateways</TabTitleText>} />
              <Tab eventKey="ai-gateways" title={<TabTitleText>AI gateways</TabTitleText>} />
              <Tab eventKey="mcp-gateways" title={<TabTitleText>MCP gateways</TabTitleText>} />
            </Tabs>
            <GatewayTable onGatewayNameClick={onGatewayNameClick || (() => {})} activeTabKey={activeGatewayTabKey} />
          </CardBody>
        </Card>

        {/* Routes card */}
        <Card>
          <CardHeader>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
              <Title headingLevel="h2" size="xl">Routes</Title>
              <Button variant="primary" onClick={() => onCreateHTTPRoute?.()}>
                Create route
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <Tabs
              activeKey={activeRoutesTabKey}
              onSelect={(e, tabKey) => setActiveRoutesTabKey(tabKey)}
              style={{ marginBottom: pf.space.lg }}
            >
              <Tab eventKey="all" title={<TabTitleText>All Routes ({ROUTES_DATA.length})</TabTitleText>} />
              <Tab eventKey="httproutes" title={<TabTitleText>HTTPRoutes ({ROUTES_DATA.filter((r) => r.type === 'HTTPRoute').length})</TabTitleText>} />
              <Tab eventKey="grpcroutes" title={<TabTitleText>GRPCRoutes ({ROUTES_DATA.filter((r) => r.type === 'GRPCRoute').length})</TabTitleText>} />
            </Tabs>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: pf.space.md,
                marginBottom: pf.space.md
              }}
            >
              <SearchInput
                placeholder="Search routes..."
                value={routesSearchValue}
                onChange={(e, value) => setRoutesSearchValue(value)}
                onClear={() => setRoutesSearchValue('')}
                style={{ width: 'min(100%, 18.75rem)' }}
              />
              <span style={{ fontSize: pf.font.bodyDefault, color: pf.color.textSubtle }}>
                {filteredRoutes.length} of {ROUTES_DATA.length} routes
              </span>
            </div>
            <Table aria-label="Routes table">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Namespace</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Hostnames</Th>
                  <Th>Path</Th>
                  <Th>Service</Th>
                  <Th>Last Updated</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRoutes.map((route, rowIndex) => (
                  <Tr key={rowIndex}>
                    <Td>
                      <Button variant="link">{route.name}</Button>
                    </Td>
                    <Td>{renderNamespace(route.namespace)}</Td>
                    <Td>{route.type}</Td>
                    <Td>{renderRouteStatus(route.status)}</Td>
                    <Td>{route.hostnames.join(', ')}</Td>
                    <Td>{route.path}</Td>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{route.service}</span>
                        <span style={{ marginLeft: pf.space.sm, color: pf.color.textSubtle }}>:{route.port}</span>
                      </div>
                    </Td>
                    <Td>{route.lastUpdated}</Td>
                    <Td>
                      <Dropdown
                        onSelect={() => {}}
                        toggle={
                          <MenuToggle aria-label="Actions" variant="plain" onClick={() => {}}>
                            <EllipsisVIcon />
                          </MenuToggle>
                        }
                        isOpen={false}
                      >
                        <DropdownList>
                          <DropdownItem key="edit">Edit</DropdownItem>
                          <DropdownItem key="delete">Delete</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </PageSection>
    </>
  );
};

export default KuadrantOverview; 