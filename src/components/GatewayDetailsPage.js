import React, { useState } from 'react';
import CreateMCPServerPage from './CreateMCPServerPage';
import MCPServerTemplatePage from './MCPServerTemplatePage';
import MCPServerConfigPage from './MCPServerConfigPage';
import MCPServerDiscoveryPage from './MCPServerDiscoveryPage';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tabs,
  Tab,
  TabTitleText,
  Flex,
  FlexItem,
  Label,
  Icon,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  TextInput,
  TextArea,
  Select,
  SelectOption,
  Wizard,
  WizardStep,
  WizardHeader,
  WizardFooter,
  Alert,
  Divider,
  SearchInput,
  TabContent,
  Switch,
  Grid,
  GridItem,
  Card,
  CardBody,
  Progress,
  ProgressVariant,
  ProgressSize
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
  CheckCircleIcon,
  ClockIcon,
  EditAltIcon,
  EllipsisVIcon,
  ExclamationTriangleIcon,
  CogIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  AngleRightIcon,
  UploadIcon,
  PlusIcon,
  SearchIcon
} from '@patternfly/react-icons';
import { FaQuestionCircleRegular } from './FaQuestionCircleRegular';

const GatewayDetailsPage = ({ gatewayName = 'example', onBack, onCreateHTTPRoute, onMCPServerPage, onMCPServerAction }) => {
  const [activeTabKey, setActiveTabKey] = useState('details');
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [isRequestsExpanded, setIsRequestsExpanded] = useState(true);
  const [isTokenUsageExpanded, setIsTokenUsageExpanded] = useState(true);
  const [isCreateRouteDropdownOpen, setIsCreateRouteDropdownOpen] = useState(false);
  const [isCreateServerDropdownOpen, setIsCreateServerDropdownOpen] = useState(false);
  const [isCreateMCPServerOpen, setIsCreateMCPServerOpen] = useState(false);
  const [isCreateMCPServerDropdownOpen, setIsCreateMCPServerDropdownOpen] = useState(false);
  
  // Add server modal states
  const [isAddServerModalOpen, setIsAddServerModalOpen] = useState(false);
  const [selectedServerType, setSelectedServerType] = useState('');
  const [serverConfig, setServerConfig] = useState({
    name: '',
    endpoint: '',
    credentials: '',
    description: ''
  });
  
  // Server details modal states
  const [isServerDetailsModalOpen, setIsServerDetailsModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);

  // Attached Resources tab states
  const [activeResourceTab, setActiveResourceTab] = useState('mcpServers');
  const [searchValue, setSearchValue] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const handleCreateMCPServer = (method) => {
    // Use the callback to navigate to different pages
    if (onMCPServerPage) {
      onMCPServerPage(method);
    }
  };

  const handleBackFromCreateMCPServer = () => {
    setIsCreateMCPServerOpen(false);
  };

  // Check if this is MCP demo gateway to show MCP-specific tabs
  const isMCPDemoGateway = gatewayName === 'MCP demo gateway';

  const renderDetailsTab = () => (
    <div>
      {/* Gateway Status Overview */}
      <div style={{ marginBottom: '32px' }}>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h2" size="lg" style={{ marginBottom: '8px' }}>
              Gateway Details
      </Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled">
                  Enforced
                </Label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="blue" variant="filled">
                  Accepted
                </Label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="purple" variant="filled">
                  Programmed
                </Label>
              </div>
            </div>
          </FlexItem>
          <FlexItem>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)' }}>
                  3.2K/min
                </div>
                <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Current RPS
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--color--status--success--100)' }}>
                  95.2%
                </div>
                <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Success Rate
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--color--status--warning--200)' }}>
                  850ms
                </div>
                <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                  Avg Latency
                </div>
              </div>
            </div>
          </FlexItem>
        </Flex>
      </div>

      {/* Basic Information */}
      <div style={{ marginBottom: '32px' }}>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
          Basic Information
        </Title>
      <DescriptionList isHorizontal>
        <DescriptionListGroup>
          <DescriptionListTerm>Name</DescriptionListTerm>
          <DescriptionListDescription>{gatewayName}</DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Namespace</DescriptionListTerm>
          <DescriptionListDescription>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Label color="green" variant="filled" isCompact>
                NS
              </Label>
              <span style={{ marginLeft: '8px' }}>default</span>
            </div>
          </DescriptionListDescription>
        </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTerm>Gateway Class</DescriptionListTerm>
            <DescriptionListDescription>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Label color="blue" variant="filled" isCompact>
                  istio
                </Label>
                <span>Gateway API Implementation</span>
            </div>
          </DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>
            Labels
            <Button variant="link" isInline style={{ marginLeft: '8px' }}>
              Edit <EditAltIcon />
            </Button>
          </DescriptionListTerm>
          <DescriptionListDescription>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <Label color="blue" variant="outline" isCompact>app=gateway</Label>
                <Label color="green" variant="outline" isCompact>env=production</Label>
                <Label color="purple" variant="outline" isCompact>version=v1.0</Label>
              </div>
          </DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Annotations</DescriptionListTerm>
          <DescriptionListDescription>
            <Button variant="link" isInline>
                3 annotations <EditAltIcon />
            </Button>
          </DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Created at</DescriptionListTerm>
          <DescriptionListDescription>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon style={{ marginRight: '8px' }}>
                <ClockIcon />
              </Icon>
              <span>Jun 13, 2025, 9:59 PM</span>
            </div>
          </DescriptionListDescription>
        </DescriptionListGroup>
        
        <DescriptionListGroup>
          <DescriptionListTerm>Owner</DescriptionListTerm>
          <DescriptionListDescription>
            <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>No owner</span>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
      </div>

      {/* Listeners Configuration */}
      <div style={{ marginBottom: '32px' }}>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
          Listeners Configuration
        </Title>
        <Table aria-label="Gateway listeners table" >
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Protocol</Th>
              <Th>Port</Th>
              <Th>Hostname</Th>
              <Th>TLS Mode</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>http-listener</Td>
              <Td>HTTP</Td>
              <Td>80</Td>
              <Td>*.example.com</Td>
              <Td>-</Td>
              <Td>
                <Label color="green" variant="filled" isCompact>
                  <Icon style={{ marginRight: '4px' }}>
                    <CheckCircleIcon />
                  </Icon>
                  Active
                </Label>
              </Td>
            </Tr>
            <Tr>
              <Td>https-listener</Td>
              <Td>HTTPS</Td>
              <Td>443</Td>
              <Td>*.example.com</Td>
              <Td>Terminate</Td>
              <Td>
                <Label color="green" variant="filled" isCompact>
                  <Icon style={{ marginRight: '4px' }}>
                    <CheckCircleIcon />
                  </Icon>
                  Active
                </Label>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </div>
      
      {/* Traffic Monitoring */}
      <div style={{ marginBottom: '32px' }}>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
          Traffic Monitoring
        </Title>
        <Grid hasGutter>
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)', marginBottom: '8px' }}>
                    3.2K/min
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>
                    Requests Per Second
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--color--status--success--100)' }}>
                    <Icon style={{ marginRight: '4px' }}>
                      <ArrowUpIcon />
                    </Icon>
                    +12% from last hour
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--pf-t--global--color--status--success--100)', marginBottom: '8px' }}>
                    95.2%
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>
                    Success Rate
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--color--status--success--100)' }}>
                    <Icon style={{ marginRight: '4px' }}>
                      <ArrowUpIcon />
                    </Icon>
                    +0.3% from last hour
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--pf-t--global--color--status--warning--200)', marginBottom: '8px' }}>
                    850ms
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>
                    Avg Latency
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--color--status--warning--200)' }}>
                    <Icon style={{ marginRight: '4px' }}>
                      <ArrowUpIcon />
                    </Icon>
                    +5% from last hour
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--pf-t--global--color--status--danger--100)', marginBottom: '8px' }}>
                    4.8%
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>
                    Error Rate
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--color--status--danger--100)' }}>
                    <Icon style={{ marginRight: '4px' }}>
                      <ArrowUpIcon />
                    </Icon>
                    +0.2% from last hour
                  </div>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
        
        {/* Latency Percentiles */}
        <div style={{ marginTop: '24px' }}>
          <Title headingLevel="h4" size="sm" style={{ marginBottom: '16px' }}>
            Latency Percentiles (Last 1 Hour)
          </Title>
          <Grid hasGutter>
            <GridItem xl={4} lg={4} md={4} sm={12}>
              <div style={{ 
                backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
                border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
                borderRadius: 'var(--pf-t--global--border--radius--medium)', 
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)' }}>
                  P50
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--pf-t--global--color--status--info--100)' }}>
                  420ms
                </div>
              </div>
            </GridItem>
            <GridItem xl={4} lg={4} md={4} sm={12}>
              <div style={{ 
                backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
                border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
                borderRadius: 'var(--pf-t--global--border--radius--medium)', 
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)' }}>
                  P95
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--pf-t--global--color--status--warning--200)' }}>
                  1.94s
                </div>
              </div>
            </GridItem>
            <GridItem xl={4} lg={4} md={4} sm={12}>
              <div style={{ 
                backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
                border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
                borderRadius: 'var(--pf-t--global--border--radius--medium)', 
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)' }}>
                  P99
                </div>
                <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--pf-t--global--color--status--danger--100)' }}>
                  4.1s
                </div>
              </div>
            </GridItem>
          </Grid>
        </div>
      </div>

      {/* Gateway Conditions */}
      <div style={{ marginBottom: '24px' }}>
        <Title headingLevel="h3" size="md" style={{ marginBottom: '12px' }}>
          Gateway Conditions
        </Title>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Accepted Condition */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--nonstatus--gray--default)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--pf-t--global--color--status--success--100)',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--pf-t--global--text--color--regular)' }}>
                  Accepted
                </div>
                <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '2px' }}>
                  Resource accepted by gateway controller
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              Jun 13, 2025, 9:59 PM
            </div>
          </div>

          {/* Programmed Condition */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--nonstatus--gray--default)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--pf-t--global--color--status--success--100)',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--pf-t--global--text--color--regular)' }}>
                  Programmed
                </div>
                <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '2px' }}>
                  Gateway configuration programmed successfully
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              Jun 13, 2025, 9:59 PM
            </div>
          </div>

          {/* Enforced Condition */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--pf-t--global--color--status--success--100)',
                flexShrink: 0
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--pf-t--global--text--color--regular)' }}>
                  Enforced
                </div>
                <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginTop: '2px' }}>
                  All policies enforced successfully
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              Jun 13, 2025, 9:59 PM
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderYAMLTab = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [yamlContent, setYamlContent] = useState(`apiVersion: gateway.networking.k8s.io/v1beta1
kind: Gateway
metadata:
  name: ${gatewayName}
  namespace: default
  creationTimestamp: "2025-06-13T21:59:00Z"
  labels:
    app: gateway
    env: production
    version: v1.0
spec:
  gatewayClassName: istio
  listeners:
  - name: http-listener
    hostname: "*.example.com"
    port: 80
    protocol: HTTP
  - name: https-listener
    hostname: "*.example.com"
    port: 443
    protocol: HTTPS
    tls:
      mode: Terminate
      certificateRefs:
      - name: example-cert
status:
  conditions:
  - type: Accepted
    status: "True"
    reason: Accepted
    message: Resource accepted by gateway controller
    lastTransitionTime: "2025-06-13T21:59:00Z"
  - type: Programmed
    status: "True"
    reason: Programmed
    message: Gateway configuration programmed successfully
    lastTransitionTime: "2025-06-13T21:59:00Z"
  - type: Enforced
    status: "True"
    reason: Enforced
    message: All policies enforced successfully
    lastTransitionTime: "2025-06-13T21:59:00Z"`);

    const handleSave = () => {
      // Here you would typically save the YAML to the backend
      console.log('Saving YAML:', yamlContent);
      setIsEditing(false);
      // Show success message
    };

    const handleCancel = () => {
      setIsEditing(false);
      // Reset to original content if needed
    };

    return (
      <div>
        {/* YAML Editor Header */}
        <div style={{ marginBottom: '16px' }}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '8px' }}>
                Gateway Configuration
              </Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon>
                    <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                  </Icon>
                  <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    Configuration is valid
                  </span>
                </div>
                <Label color="green" variant="filled" isCompact>
                  Synced
                </Label>
              </div>
            </FlexItem>
            <FlexItem>
              <div style={{ display: 'flex', gap: '12px' }}>
                {isEditing ? (
                  <>
                    <Button variant="primary" size="sm" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                      <Icon style={{ marginRight: '8px' }}>
                        <EditAltIcon />
                      </Icon>
                      Edit YAML
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Icon style={{ marginRight: '8px' }}>
                        <UploadIcon />
                      </Icon>
                      Download
                    </Button>
                  </>
                )}
              </div>
            </FlexItem>
          </Flex>
        </div>

        {/* YAML Content */}
        <div style={{ 
          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', 
          border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)',
          borderRadius: 'var(--pf-t--global--border--radius--medium)', 
          padding: '16px',
          fontFamily: 'monospace',
          position: 'relative'
        }}>
          {isEditing ? (
            <TextArea
              value={yamlContent}
              onChange={(_, value) => setYamlContent(value)}
              rows={25}
              style={{ 
                fontFamily: 'monospace', 
                fontSize: '14px',
                backgroundColor: 'transparent',
                border: 'none',
                resize: 'vertical'
              }}
              aria-label="Gateway YAML configuration"
            />
          ) : (
            <pre style={{ 
              margin: 0, 
              fontSize: '14px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {yamlContent}
      </pre>
          )}
          
          {/* Syntax highlighting overlay for read-only mode */}
          {!isEditing && (
            <div
              style={{
                position: 'absolute',
                top: 'var(--pf-t--global--spacer--md)',
                right: 'var(--pf-t--global--spacer--md)',
                backgroundColor:
                  'color-mix(in srgb, var(--pf-t--global--background--color--primary--default) 92%, transparent)',
                padding: 'var(--pf-t--global--spacer--xs) var(--pf-t--global--spacer--sm)',
                borderRadius: 'var(--pf-t--global--border--radius--small)',
                fontSize: 'var(--pf-t--global--font--size--body--sm)',
                color: 'var(--pf-t--global--text--color--subtle)'
              }}
            >
              YAML
            </div>
          )}
        </div>

        {/* Configuration Validation */}
        <div style={{ marginTop: '16px' }}>
          <Alert variant="info" title="Configuration Status" isInline>
            <div style={{ fontSize: '14px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Validation:</strong> YAML syntax is valid
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Schema:</strong> Gateway API v1beta1 compliant
              </div>
              <div>
                <strong>Last Updated:</strong> Jun 13, 2025, 9:59 PM
              </div>
            </div>
          </Alert>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '16px' }}>
          <Title headingLevel="h4" size="sm" style={{ marginBottom: '12px' }}>
            Quick Actions
          </Title>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm">
              <Icon style={{ marginRight: '8px' }}>
                <CogIcon />
              </Icon>
              Validate Configuration
            </Button>
            <Button variant="secondary" size="sm">
              <Icon style={{ marginRight: '8px' }}>
                <FaQuestionCircleRegular />
              </Icon>
              View Schema Documentation
            </Button>
            <Button variant="secondary" size="sm">
              <Icon style={{ marginRight: '8px' }}>
                <ClockIcon />
              </Icon>
              View History
            </Button>
            <Button variant="secondary" size="sm">
              <Icon style={{ marginRight: '8px' }}>
                <ExclamationTriangleIcon />
              </Icon>
              Compare with Previous
            </Button>
          </div>
        </div>
    </div>
  );
  };

  const renderPoliciesTab = () => {
    // Define comprehensive policies based on gateway name
    const getPoliciesForGateway = (name) => {
      if (name === 'AI gateway example') {
        return [
          {
            name: 'token-rate-limit-openai',
            type: 'TokenRateLimitPolicy',
            namespace: 'ai-gateway-prod',
            status: 'Enforced',
            icon: 'TRL',
            iconColor: 'purple',
            statusIcon: 'CheckCircleIcon',
            statusColor: 'var(--pf-t--global--color--status--success--100)',
            isClickable: true,
            description: 'Rate limiting based on OpenAI token usage',
            config: '1000 tokens/minute per user',
            lastUpdated: 'Jun 13, 2025, 9:59 PM'
          },
          {
            name: 'ai-gateway-tls',
            type: 'TLSPolicy',
            namespace: 'ai-gateway-prod',
            status: 'Enforced',
            icon: 'TLSP',
            iconColor: 'orange',
            statusIcon: 'CheckCircleIcon',
            statusColor: 'var(--pf-t--global--color--status--success--100)',
            isClickable: true,
            description: 'TLS termination with certificate management',
            config: 'TLS 1.2+, Auto certificate renewal',
            lastUpdated: 'Jun 13, 2025, 9:58 PM'
          },
          {
            name: 'ai-gateway-auth',
            type: 'AuthPolicy',
            namespace: 'ai-gateway-prod',
            status: 'Enforced',
            icon: 'AP',
            iconColor: 'blue',
            statusIcon: 'CheckCircleIcon',
            statusColor: 'var(--pf-t--global--color--status--success--100)',
            isClickable: true,
            description: 'JWT-based authentication for API access',
            config: 'JWT validation, Role-based access control',
            lastUpdated: 'Jun 13, 2025, 9:57 PM'
          }
        ];
      }
      
      if (name === 'MCP demo gateway') {
        return [
          {
            name: 'mcp-demo-auth',
            type: 'AuthPolicy',
            namespace: 'api-gateway-dmtest1',
            status: 'Enforced',
            icon: 'AP',
            iconColor: 'blue',
            statusIcon: 'CheckCircleIcon',
            statusColor: 'var(--pf-t--global--color--status--success--100)',
            isClickable: true,
            description: 'OAuth2 authentication for MCP services',
            config: 'OAuth2 with PKCE, Session management',
            lastUpdated: 'Jun 13, 2025, 9:59 PM'
          },
          {
            name: 'mcp-demo-rate-limit',
            type: 'RateLimitPolicy',
            namespace: 'api-gateway-dmtest1',
            status: 'Enforced',
            icon: 'RLP',
            iconColor: 'cyan',
            statusIcon: 'CheckCircleIcon',
            statusColor: 'var(--pf-t--global--color--status--success--100)',
            isClickable: true,
            description: 'Request rate limiting for MCP endpoints',
            config: '100 requests/minute per client',
            lastUpdated: 'Jun 13, 2025, 9:58 PM'
          },
          {
            name: 'mcp-demo-tls',
            type: 'TLSPolicy',
            namespace: 'api-gateway-dmtest1',
            status: 'Enforced',
            icon: 'TLSP',
            iconColor: 'orange',
            statusIcon: 'CheckCircleIcon',
            statusColor: 'var(--pf-t--global--color--status--success--100)',
            isClickable: true,
            description: 'TLS encryption for MCP communication',
            config: 'TLS 1.3, Perfect Forward Secrecy',
            lastUpdated: 'Jun 13, 2025, 9:57 PM'
          },
          {
            name: 'mcp-demo-dns',
            type: 'DNSPolicy',
            namespace: 'api-gateway-dmtest1',
            status: 'Enforced',
            icon: 'DNSP',
            iconColor: 'purple',
            statusIcon: 'CheckCircleIcon',
            statusColor: 'var(--pf-t--global--color--status--success--100)',
            isClickable: true,
            description: 'DNS configuration for MCP service discovery',
            config: 'mcp.example.com, Load balancing',
            lastUpdated: 'Jun 13, 2025, 9:56 PM'
          }
        ];
      }
      
      // Default policies for other gateways
      return [
        {
          name: 'external-dmtest1-auth',
          type: 'AuthPolicy',
          namespace: 'api-gateway-dmtest1',
          status: 'Overridden (Not Enforced)',
          icon: 'AP',
          iconColor: 'blue',
          statusIcon: 'ExclamationTriangleIcon',
          statusColor: 'var(--pf-t--global--color--status--warning--200)',
          isClickable: false,
          description: 'Authentication policy overridden by higher priority policy',
          config: 'Basic Auth, Overridden by namespace policy',
          lastUpdated: 'Jun 13, 2025, 8:30 PM'
        },
        {
          name: 'external-dmtest1-dnspolicy',
          type: 'DNSPolicy',
          namespace: 'api-gateway-dmtest1',
          status: 'Enforced',
          icon: 'DNSP',
          iconColor: 'purple',
          statusIcon: 'CheckCircleIcon',
          statusColor: 'var(--pf-t--global--color--status--success--100)',
          isClickable: false,
          description: 'DNS routing and load balancing configuration',
          config: 'Round-robin DNS, Health checks enabled',
          lastUpdated: 'Jun 13, 2025, 9:55 PM'
        },
        {
          name: 'external-dmtest1-rlp',
          type: 'RateLimitPolicy',
          namespace: 'api-gateway-dmtest1',
          status: 'Overridden (Not Enforced)',
          icon: 'RLP',
          iconColor: 'cyan',
          statusIcon: 'ExclamationTriangleIcon',
          statusColor: 'var(--pf-t--global--color--status--warning--200)',
          isClickable: false,
          description: 'Rate limiting policy overridden by gateway-level policy',
          config: '500 requests/minute, Overridden by gateway policy',
          lastUpdated: 'Jun 13, 2025, 8:25 PM'
        },
        {
          name: 'external-dmtest1-tls',
          type: 'TLSPolicy',
          namespace: 'api-gateway-dmtest1',
          status: 'Enforced',
          icon: 'TLSP',
          iconColor: 'orange',
          statusIcon: 'CheckCircleIcon',
          statusColor: 'var(--pf-t--global--color--status--success--100)',
          isClickable: false,
          description: 'TLS termination and certificate management',
          config: 'TLS 1.2+, Certificate auto-renewal',
          lastUpdated: 'Jun 13, 2025, 9:54 PM'
        }
      ];
    };

    const policies = getPoliciesForGateway(gatewayName);
    const enforcedCount = policies.filter(p => p.status === 'Enforced').length;
    const totalCount = policies.length;

    return (
      <div>
        {/* Security Status Overview */}
        <div style={{ marginBottom: '32px' }}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '8px' }}>
                Security Policies Overview
              </Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon>
                    <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                  </Icon>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>
                    {enforcedCount}/{totalCount} Policies Enforced
                  </span>
                </div>
                <Label color={enforcedCount === totalCount ? 'green' : 'orange'} variant="filled">
                  {enforcedCount === totalCount ? 'Secure' : 'Partially Secure'}
                </Label>
              </div>
            </FlexItem>
            <FlexItem>
              <Button variant="secondary" size="sm">
                <Icon style={{ marginRight: '8px' }}>
                  <PlusIcon />
                </Icon>
                Add Policy
              </Button>
            </FlexItem>
          </Flex>
        </div>

        {/* Policy Categories */}
        <div style={{ marginBottom: '24px' }}>
          <Grid hasGutter>
            <GridItem xl={3} lg={3} md={6} sm={12}>
              <Card>
                <CardBody>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--color--status--info--100)', marginBottom: '8px' }}>
                      {policies.filter(p => p.type === 'AuthPolicy').length}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Authentication Policies
                    </div>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xl={3} lg={3} md={6} sm={12}>
              <Card>
                <CardBody>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--color--status--warning--200)', marginBottom: '8px' }}>
                      {policies.filter(p => p.type === 'TLSPolicy').length}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      TLS Policies
                    </div>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xl={3} lg={3} md={6} sm={12}>
              <Card>
                <CardBody>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--color--status--success--100)', marginBottom: '8px' }}>
                      {policies.filter(p => p.type === 'RateLimitPolicy' || p.type === 'TokenRateLimitPolicy').length}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Rate Limiting Policies
                    </div>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xl={3} lg={3} md={6} sm={12}>
              <Card>
                <CardBody>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--pf-t--global--color--status--info--100)', marginBottom: '8px' }}>
                      {policies.filter(p => p.type === 'DNSPolicy').length}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      DNS Policies
                    </div>
                  </div>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </div>

        {/* Detailed Policies Table */}
        <Table aria-label="Gateway policies table" >
          <Thead>
            <Tr>
              <Th>Policy</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Configuration</Th>
              <Th>Last Updated</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {policies.map((policy, index) => (
              <Tr key={index}>
                <Td>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                    <Label color={policy.iconColor} variant="filled" isCompact style={{ marginRight: '8px' }}>
                      {policy.icon}
                    </Label>
                      <Button variant="link" isInline>
                        {policy.name}
                      </Button>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      {policy.description}
                    </div>
                  </div>
                </Td>
                <Td>
                  <Label color={policy.iconColor} variant="outline" isCompact>
                    {policy.type}
                    </Label>
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon style={{ marginRight: '8px' }}>
                      {policy.statusIcon === 'CheckCircleIcon' ? (
                        <CheckCircleIcon color={policy.statusColor} />
                      ) : (
                        <ExclamationTriangleIcon color={policy.statusColor} />
                      )}
                    </Icon>
                    <Label 
                      color={policy.status === 'Enforced' ? 'green' : 'orange'} 
                      variant="filled" 
                      isCompact
                    >
                      {policy.status}
                    </Label>
                  </div>
                </Td>
                <Td>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                    {policy.config}
                  </div>
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon style={{ marginRight: '8px' }}>
                      <ClockIcon />
                    </Icon>
                    <span style={{ fontSize: '12px' }}>{policy.lastUpdated}</span>
                  </div>
                </Td>
                <Td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="plain" size="sm" aria-label="View details">
                      <Icon><FaQuestionCircleRegular /></Icon>
                    </Button>
                    <Button variant="plain" size="sm" aria-label="Edit policy">
                      <Icon><EditAltIcon /></Icon>
                    </Button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    );
  };

  const renderAnalyticsTab = () => (
    <div>
      {/* Top metrics cards */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
          border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
          borderRadius: 'var(--pf-t--global--border--radius--medium)', 
          padding: '24px' 
        }}>
          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>requests</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--text--color--link--default)' }}></div>
              <span style={{ color: 'var(--pf-t--global--text--color--link--default)', fontSize: '16px', fontWeight: '500' }}>900 Total</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon><CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
              <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: '16px' }}>890 successful</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon><ExclamationTriangleIcon color="var(--pf-t--global--color--status--warning--200)" /></Icon>
              <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: '16px' }}>10 error</span>
            </div>
          </div>
        </div>
        
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
          border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
          borderRadius: 'var(--pf-t--global--border--radius--medium)', 
          padding: '24px' 
        }}>
          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>Tokens consumptions</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--text--color--link--default)' }}></div>
              <span style={{ color: 'var(--pf-t--global--text--color--link--default)', fontSize: '16px', fontWeight: '500' }}>900 Total</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--text--color--subtle)' }}></div>
              <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: '16px' }}>890 completion</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--text--color--link--default)' }}></div>
              <span style={{ color: 'var(--pf-t--global--text--color--link--default)', fontSize: '16px' }}>10 Prompt</span>
            </div>
          </div>
        </div>
        
        <div style={{ 
          flex: 1, 
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
          border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
          borderRadius: 'var(--pf-t--global--border--radius--medium)', 
          padding: '24px' 
        }}>
          <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>Cost</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--pf-t--global--text--color--link--default)' }}></div>
              <span style={{ color: 'var(--pf-t--global--text--color--link--default)', fontSize: '16px', fontWeight: '500' }}>900$ Total</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: '16px' }}>0.02$ Per req</span>
            </div>
          </div>
        </div>
      </div>

      {/* Requests section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Button 
          variant="plain" 
          onClick={() => setIsRequestsExpanded(!isRequestsExpanded)}
          style={{ padding: 0, minWidth: 'auto' }}
        >
          <Icon style={{ 
            transform: isRequestsExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>
            <AngleRightIcon />
          </Icon>
        </Button>
        <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
          Requests
        </Title>
      </div>

      {/* Charts grid - conditionally rendered */}
      {isRequestsExpanded && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Requests details chart */}
          <div style={{ 
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--medium)', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Requests details</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ height: '200px', position: 'relative', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="40" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 25" fill="none" stroke="var(--pf-t--global--border--color--default)" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Time labels */}
                <text x="30" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:00</text>
                <text x="70" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:01</text>
                <text x="110" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:02</text>
                <text x="150" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:03</text>
                <text x="190" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:04</text>
                <text x="230" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:05</text>
                <text x="270" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:06</text>
                <text x="310" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:07</text>
                <text x="350" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:08</text>
                <text x="390" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:09</text>
                
                {/* Y-axis labels */}
                <text x="10" y="180" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">100</text>
                <text x="10" y="155" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">125</text>
                <text x="10" y="130" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">150</text>
                <text x="10" y="105" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">175</text>
                <text x="10" y="80" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">200</text>
                <text x="10" y="55" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">225</text>
                <text x="10" y="30" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">250</text>
                
                {/* Sample data lines */}
                <polyline points="30,120 70,40 110,160 150,100 190,110 230,80 270,60 310,30 350,35 390,50" 
                          fill="none" stroke="var(--pf-t--global--text--color--link--default)" strokeWidth="2"/>
                <polyline points="30,100 70,50 110,140 150,90 190,95 230,70 270,45 310,25 350,30 390,45" 
                          fill="none" stroke="var(--pf-t--global--color--status--warning--200)" strokeWidth="2"/>
                <polyline points="30,140 70,80 110,180 150,120 190,125 230,100 270,85 310,55 350,60 390,75" 
                          fill="none" stroke="var(--pf-t--global--color--status--success--100)" strokeWidth="2"/>
                <polyline points="30,160 70,100 110,190 150,140 190,145 230,120 270,105 310,75 350,80 390,95" 
                          fill="none" stroke="var(--pf-t--global--color--gold--300)" strokeWidth="2"/>
                <polyline points="30,180 70,120 110,200 150,160 190,165 230,140 270,125 310,95 350,100 390,115" 
                          fill="none" stroke="var(--pf-t--global--color--status--info--100)" strokeWidth="2"/>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--warning--200)' }}></div>
                <span>Azure</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--text--color--link--default)' }}></div>
                <span>OpenAI</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--info--100)' }}></div>
                <span>Gemini</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--gold--300)' }}></div>
                <span>Waston</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--success--100)' }}></div>
                <span>DeepSeek</span>
              </div>
            </div>
          </div>

          {/* Requests statistics */}
          <div style={{ 
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--medium)', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>requests statistics</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>2.2K Total</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--warning--200)' }}></div>
                  <span style={{ fontSize: '14px' }}>Azure</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '60px', height: '8px', backgroundColor: 'var(--pf-t--global--text--color--link--default)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>234</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--text--color--link--default)' }}></div>
                  <span style={{ fontSize: '14px' }}>OpenAI</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '80px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--info--200)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>432</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--info--100)' }}></div>
                  <span style={{ fontSize: '14px' }}>Gemini</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '85px', height: '8px', backgroundColor: 'var(--pf-t--global--color--brand--300)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>442</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--gold--300)' }}></div>
                  <span style={{ fontSize: '14px' }}>Waston</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--info--200)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>501</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--success--100)' }}></div>
                  <span style={{ fontSize: '14px' }}>Deepseek</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '120px', height: '8px', backgroundColor: 'var(--pf-t--global--color--brand--300)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>580</span>
                </div>
              </div>
            </div>
          </div>

          {/* Requests latency */}
          <div style={{ 
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--medium)', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Requests latency</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ height: '200px', position: 'relative', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <text x="30" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:00</text>
                <text x="70" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:01</text>
                <text x="110" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:02</text>
                <text x="150" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:03</text>
                <text x="190" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:04</text>
                <text x="230" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:05</text>
                <text x="270" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:06</text>
                <text x="310" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:07</text>
                <text x="350" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:08</text>
                <text x="390" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:09</text>
                
                <text x="10" y="180" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">100</text>
                <text x="10" y="155" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">125</text>
                <text x="10" y="130" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">150</text>
                <text x="10" y="105" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">175</text>
                <text x="10" y="80" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">200</text>
                <text x="10" y="55" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">225</text>
                <text x="10" y="30" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">250</text>
                
                <polyline points="30,130 70,60 110,170 150,110 190,120 230,90 270,70 310,40 350,45 390,60" 
                          fill="none" stroke="var(--pf-t--global--color--status--warning--200)" strokeWidth="2"/>
                <polyline points="30,140 70,70 110,180 150,120 190,130 230,100 270,80 310,50 350,55 390,70" 
                          fill="none" stroke="var(--pf-t--global--text--color--link--default)" strokeWidth="2"/>
                <polyline points="30,150 70,80 110,190 150,130 190,140 230,110 270,90 310,60 350,65 390,80" 
                          fill="none" stroke="var(--pf-t--global--color--status--info--100)" strokeWidth="2"/>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--warning--200)' }}></div>
                <span>p90</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--text--color--link--default)' }}></div>
                <span>p95</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--info--100)' }}></div>
                <span>p99</span>
              </div>
            </div>
          </div>

          {/* Requests status codes */}
          <div style={{ 
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--medium)', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>requests status codes</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="var(--pf-t--global--color--status--success--100)" stroke="var(--pf-t--global--background--color--primary--default)" strokeWidth="2"/>
                <path d="M 80 10 A 70 70 0 0 1 126 45 L 80 80 Z" fill="var(--pf-t--global--color--gold--300)" stroke="var(--pf-t--global--background--color--primary--default)" strokeWidth="2"/>
                <path d="M 126 45 A 70 70 0 0 1 134 95 L 80 80 Z" fill="var(--pf-t--global--color--status--danger--100)" stroke="var(--pf-t--global--background--color--primary--default)" strokeWidth="2"/>
                <text x="80" y="85" textAnchor="middle" fontSize="16" fontWeight="500" fill="var(--pf-t--global--text--color--inverse)">82%</text>
                <text x="110" y="35" textAnchor="middle" fontSize="12" fill="var(--pf-t--global--text--color--inverse)">9%</text>
                <text x="130" y="70" textAnchor="middle" fontSize="12" fill="var(--pf-t--global--text--color--inverse)">9%</text>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--success--100)' }}></div>
                <span>200</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--gold--300)' }}></div>
                <span>4XX</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--danger--100)' }}></div>
                <span>5XX</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Token usage section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '48px', marginBottom: '24px' }}>
        <Button 
          variant="plain" 
          onClick={() => setIsTokenUsageExpanded(!isTokenUsageExpanded)}
          style={{ padding: 0, minWidth: 'auto' }}
        >
          <Icon style={{ 
            transform: isTokenUsageExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}>
            <AngleRightIcon />
          </Icon>
        </Button>
        <Title headingLevel="h2" size="xl" style={{ margin: 0 }}>
          Token usage
        </Title>
      </div>

      {/* Token usage charts grid - conditionally rendered */}
      {isTokenUsageExpanded && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Token usage details */}
          <div style={{ 
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--medium)', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Token usage details</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ height: '200px', position: 'relative', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <text x="30" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:00</text>
                <text x="70" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:01</text>
                <text x="110" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:02</text>
                <text x="150" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:03</text>
                <text x="190" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:04</text>
                <text x="230" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:05</text>
                <text x="270" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:06</text>
                <text x="310" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:07</text>
                <text x="350" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:08</text>
                <text x="390" y="190" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">8:09</text>
                
                <text x="10" y="180" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">100</text>
                <text x="10" y="155" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">125</text>
                <text x="10" y="130" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">150</text>
                <text x="10" y="105" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">175</text>
                <text x="10" y="80" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">200</text>
                <text x="10" y="55" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">225</text>
                <text x="10" y="30" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">250</text>
                <text x="10" y="5" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">275</text>
                <text x="10" y="155" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">300</text>
                <text x="10" y="130" fontSize="12" fill="var(--pf-t--global--text--color--subtle)">325</text>
                
                {/* Token usage lines */}
                <polyline points="30,160 70,30 110,170 150,120 190,125 230,100 270,85 310,55 350,60 390,75" 
                          fill="none" stroke="var(--pf-t--global--color--status--warning--200)" strokeWidth="2"/>
                <polyline points="30,180 70,50 110,190 150,140 190,145 230,120 270,105 310,75 350,80 390,95" 
                          fill="none" stroke="var(--pf-t--global--text--color--link--default)" strokeWidth="2"/>
                <polyline points="30,200 70,70 110,210 150,160 190,165 230,140 270,125 310,95 350,100 390,115" 
                          fill="none" stroke="var(--pf-t--global--color--status--info--100)" strokeWidth="2"/>
                <polyline points="30,220 70,90 110,230 150,180 190,185 230,160 270,145 310,115 350,120 390,135" 
                          fill="none" stroke="var(--pf-t--global--color--gold--300)" strokeWidth="2"/>
                <polyline points="30,240 70,110 110,250 150,200 190,205 230,180 270,165 310,135 350,140 390,155" 
                          fill="none" stroke="var(--pf-t--global--color--status--success--100)" strokeWidth="2"/>
                <polyline points="30,260 70,130 110,270 150,220 190,225 230,200 270,185 310,155 350,160 390,175" 
                          fill="none" stroke="var(--pf-t--global--color--nonstatus--gray--default)" strokeWidth="2"/>
                
                {/* Hover tooltip */}
                <rect x="240" y="120" width="130" height="80" fill="var(--pf-t--global--background--color--dark--100)" rx="4" opacity="0.95"/>
                <text x="250" y="140" fontSize="12" fill="var(--pf-t--global--color--status--warning--200)">⚫ Azure</text>
                <text x="250" y="155" fontSize="11" fill="var(--pf-t--global--text--color--inverse)">Request rate    25.5/s</text>
                <text x="250" y="170" fontSize="11" fill="var(--pf-t--global--text--color--inverse)">Cost per request   0.82</text>
                <text x="250" y="185" fontSize="11" fill="var(--pf-t--global--text--color--inverse)">Total cost        300$</text>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--warning--200)' }}></div>
                <span>Azure</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--text--color--link--default)' }}></div>
                <span>OpenAI</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--info--100)' }}></div>
                <span>Gemini</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--gold--300)' }}></div>
                <span>Waston</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--success--100)' }}></div>
                <span>DeepSeek</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--nonstatus--gray--default)' }}></div>
                <span>Avg token usage</span>
              </div>
            </div>
          </div>

          {/* Token consumption trend */}
          <div style={{ 
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--medium)', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Token consumption trend</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '24px' }}>From last 12 hours</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Completion token</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon><ArrowUpIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>15%</span>
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>21.9K → 24.1K</span>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Prompt token</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon><ArrowDownIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>9%</span>
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>35.9K → 33.7K</span>
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Total token</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icon><ArrowUpIcon color="var(--pf-t--global--color--status--success--100)" /></Icon>
                    <span style={{ fontSize: '20px', fontWeight: '600' }}>1%</span>
                  </div>
                  <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>57.8K → 58.4K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tokens consumption statistics */}
          <div style={{ 
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--medium)', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Tokens consumption statistics</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ height: '200px', position: 'relative', backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', borderRadius: 'var(--pf-t--global--border--radius--small)' }}>
              <svg width="100%" height="100%" viewBox="0 0 400 200">
                {/* Stacked area chart */}
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--pf-t--global--text--color--link--default)" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="var(--pf-t--global--text--color--link--default)" stopOpacity="0.3"/>
                  </linearGradient>
                  <linearGradient id="tealGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--pf-t--global--color--status--info--100)" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="var(--pf-t--global--color--status--info--100)" stopOpacity="0.3"/>
                  </linearGradient>
                  <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--pf-t--global--color--status--warning--200)" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="var(--pf-t--global--color--status--warning--200)" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                
                {/* OpenAI area */}
                <path d="M 50 150 Q 120 120 200 140 Q 280 160 350 150 L 350 180 L 50 180 Z" 
                      fill="url(#blueGradient)" stroke="var(--pf-t--global--text--color--link--default)" strokeWidth="1"/>
                
                {/* Gemini area */}
                <path d="M 50 120 Q 120 90 200 110 Q 280 130 350 120 Q 320 135 280 140 Q 200 130 120 110 Q 80 105 50 120 Z" 
                      fill="url(#tealGradient)" stroke="var(--pf-t--global--color--status--info--100)" strokeWidth="1"/>
                
                {/* Azure area */}
                <path d="M 50 80 Q 120 50 200 70 Q 280 90 350 80 Q 320 95 280 100 Q 200 90 120 70 Q 80 65 50 80 Z" 
                      fill="url(#orangeGradient)" stroke="var(--pf-t--global--color--status--warning--200)" strokeWidth="1"/>
                
                {/* Labels */}
                <text x="60" y="170" fontSize="12" fill="var(--pf-t--global--text--color--link--default)">OpenAI</text>
                <text x="60" y="110" fontSize="12" fill="var(--pf-t--global--color--status--info--100)">Gemini</text>
                <text x="60" y="70" fontSize="12" fill="var(--pf-t--global--color--status--warning--200)">Azure</text>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Completion tokens</span>
                  <Icon><FaQuestionCircleRegular /></Icon>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>24.1K</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Prompt tokens</span>
                  <Icon><FaQuestionCircleRegular /></Icon>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>33.7K</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Total tokens</span>
                  <Icon><FaQuestionCircleRegular /></Icon>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>57.8K</span>
              </div>
            </div>
          </div>

          {/* Consumer token usage */}
          <div style={{ 
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)', 
            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--medium)', 
            padding: '24px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>Consumer token usage</span>
              <Button variant="plain" aria-label="Settings">
                <Icon><CogIcon /></Icon>
              </Button>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '16px' }}>Top 5 consumers</div>
            
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="var(--pf-t--global--text--color--link--default)" stroke="var(--pf-t--global--background--color--primary--default)" strokeWidth="2"/>
                <path d="M 80 10 A 70 70 0 0 1 95 25 L 80 80 Z" fill="var(--pf-t--global--color--status--info--100)" stroke="var(--pf-t--global--background--color--primary--default)" strokeWidth="2"/>
                <path d="M 95 25 A 70 70 0 0 1 110 40 L 80 80 Z" fill="var(--pf-t--global--color--purple--300)" stroke="var(--pf-t--global--background--color--primary--default)" strokeWidth="2"/>
                <path d="M 110 40 A 70 70 0 0 1 125 55 L 80 80 Z" fill="var(--pf-t--global--color--gold--300)" stroke="var(--pf-t--global--background--color--primary--default)" strokeWidth="2"/>
                <path d="M 125 55 A 70 70 0 0 1 140 70 L 80 80 Z" fill="var(--pf-t--global--color--status--success--200)" stroke="var(--pf-t--global--background--color--primary--default)" strokeWidth="2"/>
                
                {/* Percentage labels */}
                <text x="90" y="20" textAnchor="middle" fontSize="12" fill="var(--pf-t--global--text--color--inverse)">9%</text>
                <text x="102" y="32" textAnchor="middle" fontSize="12" fill="var(--pf-t--global--text--color--inverse)">9%</text>
                <text x="118" y="47" textAnchor="middle" fontSize="12" fill="var(--pf-t--global--text--color--inverse)">10%</text>
                <text x="60" y="130" textAnchor="middle" fontSize="12" fill="var(--pf-t--global--text--color--inverse)">72%</text>
              </svg>
              
              {/* Tooltip */}
              <div style={{ 
                position: 'absolute', 
                top: '20px', 
                right: '20px',
                backgroundColor: 'var(--pf-t--global--background--color--dark--100)',
                color: 'var(--pf-t--global--text--color--inverse)',
                padding: '12px',
                borderRadius: 'var(--pf-t--global--border--radius--small)',
                fontSize: '12px',
                opacity: '0.95'
              }}>
                <div style={{ marginBottom: '4px' }}>⚫ AI consumer_1</div>
                <div style={{ marginBottom: '4px' }}>Total tokens      1.2k</div>
                <div style={{ marginBottom: '4px' }}>Prompt tokens     800</div>
                <div>Completion tokens  400</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--text--color--link--default)' }}></div>
                <span>AI consumer_1</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--info--100)' }}></div>
                <span>AI consumer_2</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--purple--300)' }}></div>
                <span>AI consumer_3</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--gold--300)' }}></div>
                <span>AI consumer_4</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--pf-t--global--color--status--success--200)' }}></div>
                <span>AI consumer_5</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLogsTab = () => (
    <div>
      <Table aria-label="Gateway logs table" >
        <Thead>
          <Tr>
            <Th>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Timestamp</span>
                <Button variant="plain" aria-label="Info">
                  <Icon><FaQuestionCircleRegular /></Icon>
                </Button>
              </div>
            </Th>
            <Th>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Status</span>
                <Button variant="plain" aria-label="Info">
                  <Icon><FaQuestionCircleRegular /></Icon>
                </Button>
              </div>
            </Th>
            <Th>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>User</span>
                <Button variant="plain" aria-label="Info">
                  <Icon><FaQuestionCircleRegular /></Icon>
                </Button>
              </div>
            </Th>
            <Th>Model</Th>
            <Th>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>Token usage</span>
                <Button variant="plain" aria-label="Info">
                  <Icon><FaQuestionCircleRegular /></Icon>
                </Button>
              </div>
            </Th>
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>21 January 2019, 9:38:06 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>900</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>21 January 2019, 9:39:22 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>124</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>21 January 2019, 9:40:09 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>68</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>21 January 2019, 9:41:24 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>22</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>21 January 2019, 9:42:00 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>0</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>21 January 2019, 9:38:06 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>900</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>21 January 2019, 9:39:22 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>124</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>21 January 2019, 9:40:09 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>68</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>21 January 2019, 9:41:24 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>22</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
          <Tr>
            <Td>21 January 2019, 9:42:00 PM</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <Label color="green" variant="filled" isCompact>
                  Success
                </Label>
              </div>
            </Td>
            <Td>AI consumer_1</Td>
            <Td>Chatgpt-3 turbo</Td>
            <Td>0</Td>
            <Td>
              <Button variant="plain" aria-label="Actions">
                <Icon><EllipsisVIcon /></Icon>
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );

  const renderRoutesTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title headingLevel="h2" size="lg">
          Routes
        </Title>
        <Dropdown
          onSelect={(event, value) => {
            setIsCreateRouteDropdownOpen(false);
            if (value === 'http' && onCreateHTTPRoute) {
              onCreateHTTPRoute();
            }
          }}
          toggle={
            <MenuToggle
              onClick={() => setIsCreateRouteDropdownOpen(!isCreateRouteDropdownOpen)}
              isExpanded={isCreateRouteDropdownOpen}
              variant="primary"
            >
              Create Route
            </MenuToggle>
          }
          isOpen={isCreateRouteDropdownOpen}
        >
          <DropdownList>
            <DropdownItem key="http" value="http">Create HTTPRoute</DropdownItem>
            <DropdownItem key="grpc" value="grpc">Create gRPC Route</DropdownItem>
          </DropdownList>
        </Dropdown>
      </div>
      <Table aria-label="Gateway routes table" >
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Namespace</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Hostnames</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>
              <Button variant="link" isInline>
                example-route
              </Button>
            </Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Label color="green" variant="filled" isCompact>
                  NS
                </Label>
                <span style={{ marginLeft: '8px' }}>default</span>
              </div>
            </Td>
            <Td>HTTPRoute</Td>
            <Td>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon style={{ marginRight: '8px' }}>
                  <CheckCircleIcon color="var(--pf-t--global--color--status--success--100)" />
                </Icon>
                <span>Accepted</span>
              </div>
            </Td>
            <Td>example.com</Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  );

  const renderConnectionsTab = () => {

    // Mock data for connections - directly connected to gateway
    const connections = {
      'Gateway example': {
        routes: [
          {
            name: 'example-route',
            namespace: 'default',
            status: 'Accepted',
            type: 'HTTPRoute',
            hostnames: ['example.com'],
            lastUpdated: '2 minutes ago',
            description: 'Main HTTP route for the gateway'
          },
          {
            name: 'api-route-1',
            namespace: 'default',
            status: 'Accepted',
            type: 'HTTPRoute',
            hostnames: ['api.example.com'],
            lastUpdated: '5 minutes ago',
            description: 'API route for version 1'
          },
          {
            name: 'api-route-2',
            namespace: 'default',
            status: 'Accepted',
            type: 'HTTPRoute',
            hostnames: ['api-v2.example.com'],
            lastUpdated: '10 minutes ago',
            description: 'API route for version 2'
          }
        ],
        policies: [
          {
            name: 'rate-limit-policy',
            namespace: 'default',
            status: 'Enforced',
            type: 'RateLimitPolicy',
            target: 'Gateway',
            lastUpdated: '5 minutes ago',
            description: 'Rate limiting policy for all traffic'
          },
          {
            name: 'auth-policy',
            namespace: 'default',
            status: 'Enforced',
            type: 'AuthenticationPolicy',
            target: 'Gateway',
            lastUpdated: '1 hour ago',
            description: 'Authentication policy for secure access'
          },
          {
            name: 'cors-policy',
            namespace: 'default',
            status: 'Enforced',
            type: 'CORSPolicy',
            target: 'Gateway',
            lastUpdated: '2 hours ago',
            description: 'CORS policy for cross-origin requests'
          }
        ]
      },
      'MCP demo gateway': {
        routes: [
          {
            name: 'mcp-api-route',
            namespace: 'api-gateway-dmtest1',
            status: 'Accepted',
            type: 'HTTPRoute',
            hostnames: ['mcp.example.com'],
            lastUpdated: '30 minutes ago',
            description: 'API route for MCP server access'
          },
          {
            name: 'mcp-admin-route',
            namespace: 'api-gateway-dmtest1',
            status: 'Accepted',
            type: 'HTTPRoute',
            hostnames: ['admin.mcp.example.com'],
            lastUpdated: '1 hour ago',
            description: 'Admin route for MCP management'
          }
        ],
        policies: [
          {
            name: 'mcp-100-autum',
            namespace: 'api-gateway-istio',
            status: 'Enforced',
            type: 'AuthPolicy',
            target: 'Gateway',
            lastUpdated: '5 minutes ago',
            description: 'Authentication policy for MCP gateway'
          },
          {
            name: 'AuthPolicy',
            namespace: 'api-gateway-istio',
            status: 'Accepted',
            type: 'AuthPolicy',
            target: 'Gateway',
            lastUpdated: '1 hour ago',
            description: 'Authentication policy'
          },
          {
            name: 'example-TLS',
            namespace: 'api-gateway-istio',
            status: 'Accepted',
            type: 'TLSPolicy',
            target: 'Gateway',
            lastUpdated: '2 hours ago',
            description: 'TLS policy for secure connections'
          },
          {
            name: 'example-rl',
            namespace: 'api-gateway-joeytest',
            status: 'Enforced',
            type: 'RateLimitPolicy',
            target: 'Gateway',
            lastUpdated: '3 hours ago',
            description: 'Rate limiting policy'
          },
          {
            name: 'example-DNS',
            namespace: 'api-gateway-dmtest',
            status: 'Enforced',
            type: 'DNSPolicy',
            target: 'Gateway',
            lastUpdated: '4 hours ago',
            description: 'DNS policy configuration'
          }
        ],
        mcpServers: [
          {
            name: 'Desktop Commander',
            namespace: 'api-gateway-dmtest1',
            status: 'Connected',
            type: 'Desktop',
            endpoint: 'ws://localhost:3001',
            lastUpdated: '1 minute ago',
            description: 'Desktop Commander MCP server with 24 tools'
          },
          {
            name: 'GitHub Server',
            namespace: 'api-gateway-dmtest1',
            status: 'Connected',
            type: 'GitHub',
            endpoint: 'https://api.github.com',
            lastUpdated: '5 minutes ago',
            description: 'GitHub API MCP server with 8 tools'
          }
        ]
      }
    };

    const connectionData = connections[gatewayName] || {};

    const getCurrentConnections = () => {
      const connectionMap = {
        routes: connectionData.routes || [],
        policies: connectionData.policies || [],
        mcpServers: connectionData.mcpServers || []
      };
      return connectionMap[activeResourceTab] || [];
    };

    const getFilteredConnections = () => {
      const currentConnections = getCurrentConnections();
      if (!searchValue) return currentConnections;
      
      return currentConnections.filter(connection => 
        connection.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        connection.type.toLowerCase().includes(searchValue.toLowerCase()) ||
        connection.status.toLowerCase().includes(searchValue.toLowerCase()) ||
        (connection.hostnames && connection.hostnames.some(h => h.toLowerCase().includes(searchValue.toLowerCase()))) ||
        (connection.endpoint && connection.endpoint.toLowerCase().includes(searchValue.toLowerCase())) ||
        (connection.target && connection.target.toLowerCase().includes(searchValue.toLowerCase()))
      );
    };

    const renderConnectionTable = (connections, type) => {
      const columns = {
        routes: ['Name', 'Type', 'Status', 'Hostnames', 'Last Updated'],
        policies: ['Name', 'Type', 'Namespace', 'Status'],
        mcpServers: ['Name', 'Type', 'Status', 'Endpoint', 'Last Updated']
      };

      const getColumnData = (connection, column) => {
        switch (column) {
          case 'Name':
            return (
              <Button 
                variant="link" 
                isInline 
                style={{ padding: 0, fontSize: 'inherit' }}
                onClick={() => {
                  if (type === 'mcpServers') {
                    console.log('Name clicked for:', connection.name);
                    setSelectedServer(connection.name);
                    setIsServerDetailsModalOpen(true);
                  }
                }}
              >
                {connection.name}
              </Button>
            );
          case 'Type':
            return connection.type;
          case 'Namespace':
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Label color="green" variant="filled" isCompact>
                  NS
                </Label>
                <span style={{ marginLeft: '8px' }}>{connection.namespace}</span>
              </div>
            );
          case 'Status':
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {connection.status === 'Enforced' ? (
                  <Label color="green" variant="filled" isCompact>
                    <CheckCircleIcon style={{ marginRight: '4px' }} />
                    {connection.status}
                  </Label>
                ) : (
                  <Label color="purple" variant="filled" isCompact>
                    <UploadIcon style={{ marginRight: '4px' }} />
                    {connection.status}
                  </Label>
                )}
              </div>
            );
          case 'Hostnames':
            return connection.hostnames ? connection.hostnames.join(', ') : '-';
          case 'Target':
            return connection.target || '-';
          case 'Endpoint':
            return connection.endpoint || '-';
          case 'Last Updated':
            return connection.lastUpdated;
          default:
            return '-';
        }
      };

      return (
        <div>
          {/* Table */}
          <Table aria-label={`${type} table`} >
            <Thead>
              <Tr>
                {columns[type].map((column, index) => (
                  <Th key={index}>{column}</Th>
                ))}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {connections.map((connection, rowIndex) => (
                <Tr key={rowIndex}>
                  {columns[type].map((column, colIndex) => (
                    <Td key={colIndex}>
                      {getColumnData(connection, column)}
                    </Td>
                  ))}
                  <Td>
                    <Dropdown
                      onSelect={(event, value) => {
                        if (value === 'viewDetails' && type === 'mcpServers') {
                          setSelectedServer(connection.name);
                          setIsServerDetailsModalOpen(true);
                        }
                      }}
                      toggle={
                        <MenuToggle
                          aria-label="Actions"
                          variant="plain"
                          onClick={() => {}}
                        >
                          <EllipsisVIcon />
                        </MenuToggle>
                      }
                      isOpen={false}
                    >
                      <DropdownList>
                        {type === 'mcpServers' && (
                          <DropdownItem key="viewDetails">View Details</DropdownItem>
                        )}
                        <DropdownItem key="edit">Edit</DropdownItem>
                        <DropdownItem key="delete">Delete</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {connections.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              {searchValue ? 'No connections found matching your search.' : 'No connections found.'}
            </div>
          )}
        </div>
      );
    };

    const renderConnectionCards = (connections, type) => {
      const getServerIcon = (serverType) => {
        const iconMap = {
          'Desktop': { icon: 'DC', color: 'var(--pf-t--global--color--status--info--100)' },
          'GitHub': { icon: 'GH', color: 'var(--pf-t--global--color--status--success--100)' },
          'Kubernetes': { icon: 'K8', color: 'var(--pf-t--global--color--brand--200)' },
          'Database': { icon: 'DB', color: 'var(--pf-t--global--color--status--warning--200)' },
          'AI': { icon: 'AI', color: 'var(--pf-t--global--color--status--success--200)' },
          'Custom': { icon: 'CA', color: 'var(--pf-t--global--color--purple--300)' }
        };
        return iconMap[serverType] || { icon: 'SV', color: 'var(--pf-t--global--text--color--subtle)' };
      };

      const renderCard = (connection) => {
        const serverIcon = type === 'mcpServers' ? getServerIcon(connection.type) : null;
        
        return (
          <div key={connection.name} style={{ 
            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
            borderRadius: 'var(--pf-t--global--border--radius--medium)', 
            padding: '20px',
            backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
            boxShadow: 'var(--pf-t--global--box-shadow--sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {type === 'mcpServers' && (
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: serverIcon.color, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <span style={{ color: 'var(--pf-t--global--text--color--inverse)', fontWeight: 'bold', fontSize: '14px' }}>{serverIcon.icon}</span>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{connection.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>{connection.type}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon style={{ color: 'var(--pf-t--global--color--status--success--100)' }}>
                  <CheckCircleIcon />
                </Icon>
                <span style={{ fontSize: '12px', color: 'var(--pf-t--global--color--status--success--100)' }}>{connection.status}</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              {type === 'routes' && connection.hostnames && (
                <>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Hostnames</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {connection.hostnames.map((hostname, index) => (
                      <Label key={index} color="blue" variant="filled" isCompact>{hostname}</Label>
                    ))}
                  </div>
                </>
              )}
              {type === 'policies' && connection.target && (
                <>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Target</div>
                  <Label color="green" variant="filled" isCompact>{connection.target}</Label>
                </>
              )}
              {type === 'mcpServers' && connection.endpoint && (
                <>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Endpoint</div>
                  <div style={{ fontSize: '13px', color: 'var(--pf-t--global--text--color--subtle)', fontFamily: 'monospace' }}>{connection.endpoint}</div>
                </>
              )}
            </div>
            
            <div style={{ borderTop: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', paddingTop: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '8px' }}>Last Updated</div>
              <div style={{ fontSize: '12px' }}>{connection.lastUpdated}</div>
            </div>
            
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              {type === 'mcpServers' && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    console.log('View Details clicked for:', connection.name);
                    setSelectedServer(connection.name);
                    setIsServerDetailsModalOpen(true);
                  }}
                >
                  View Details
                </Button>
              )}
              <Button variant="plain" size="sm">Edit</Button>
            </div>
          </div>
        );
      };

      return (
        <div>
          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {connections.map(renderCard)}
          </div>

          {connections.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              {searchValue ? 'No connections found matching your search.' : 'No connections found.'}
            </div>
          )}
        </div>
      );
    };

    const getConnectionCount = (type) => {
      const connectionMap = {
        routes: connectionData.routes || [],
        policies: connectionData.policies || [],
        mcpServers: connectionData.mcpServers || []
      };
      return connectionMap[type] ? connectionMap[type].length : 0;
    };

    return (
      <div>

        {/* Horizontal Tabs Layout */}
        <Tabs
          activeKey={activeResourceTab}
          onSelect={(event, tabIndex) => {
            setActiveResourceTab(tabIndex);
            setSearchValue('');
          }}
          style={{ marginBottom: '24px' }}
        >
          <Tab eventKey="routes" title={<TabTitleText>Routes ({getConnectionCount('routes')})</TabTitleText>} />
          <Tab eventKey="policies" title={<TabTitleText>Policies ({getConnectionCount('policies')})</TabTitleText>} />
          <Tab eventKey="mcpServers" title={<TabTitleText>MCP Servers ({getConnectionCount('mcpServers')})</TabTitleText>} />
        </Tabs>

        {/* Tab-specific description */}
        {activeResourceTab === 'routes' && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: 'var(--pf-t--global--text--color--subtle)', margin: 0 }}>
              These routes are directly associated with this Gateway through explicit references.
            </p>
          </div>
        )}
        {activeResourceTab === 'policies' && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: 'var(--pf-t--global--text--color--subtle)', margin: 0 }}>
              These policies are directly associated with this Gateway through explicit references.
            </p>
          </div>
        )}
        {activeResourceTab === 'mcpServers' && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: 'var(--pf-t--global--text--color--subtle)', margin: 0 }}>
              These MCP servers are directly connected to this Gateway for enhanced functionality.
            </p>
          </div>
        )}

        {/* Content Area with Card - including toolbar */}
        <div style={{ 
          border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
          borderRadius: 'var(--pf-t--global--border--radius--medium)', 
          backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
          padding: '16px'
        }}>
          {/* Toolbar with Filter, Search, and Pagination */}
          <div style={{ marginBottom: '16px' }}>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Flex alignItems={{ default: 'alignItemsCenter' }} spaceItems={{ default: 'spaceItemsMd' }}>
                  <FlexItem>
                    <Dropdown
                      onSelect={(event, value) => {
                        // Handle filter selection
                      }}
                      toggle={
                        <MenuToggle
                          aria-label="Filter by type"
                          variant="secondary"
                          size="sm"
                        >
                          Filter
                          <AngleRightIcon style={{ marginLeft: '8px' }} />
                        </MenuToggle>
                      }
                      isOpen={false}
                    >
                      <DropdownList>
                        <DropdownItem key="authpolicy">AuthPolicy</DropdownItem>
                        <DropdownItem key="dnspolicy">DNSPolicy</DropdownItem>
                        <DropdownItem key="tlspolicy">TLSPolicy</DropdownItem>
                        <DropdownItem key="ratelimitpolicy">RateLimitPolicy</DropdownItem>
                      </DropdownList>
                    </Dropdown>
                  </FlexItem>
                  <FlexItem>
                    <SearchInput
                      placeholder="Find by name"
                      value={searchValue}
                      onChange={(event, value) => {
                        setSearchValue(value);
                      }}
                      onSearch={(event, value) => setSearchValue(value)}
                      onClear={() => {
                        setSearchValue('');
                      }}
                    />
                  </FlexItem>
                  <FlexItem>
                    {activeResourceTab === 'routes' ? (
                      <Dropdown
                        onSelect={(event, value) => {
                          if (value === 'createHttpRoute') {
                            // Handle Create HTTPRoute
                            console.log('Create HTTPRoute clicked');
                          } else if (value === 'createGcpRoute') {
                            // Handle Create GCPRoute
                            console.log('Create GCPRoute clicked');
                          }
                          setIsCreateRouteDropdownOpen(false);
                        }}
                        toggle={
                          <MenuToggle
                            aria-label="Create route"
                            variant="primary"
                            size="sm"
                            onClick={() => setIsCreateRouteDropdownOpen(!isCreateRouteDropdownOpen)}
                            isExpanded={isCreateRouteDropdownOpen}
                          >
                            Create Route
                            <AngleRightIcon style={{ marginLeft: '8px' }} />
                          </MenuToggle>
                        }
                        isOpen={isCreateRouteDropdownOpen}
                      >
                        <DropdownList>
                          <DropdownItem key="createHttpRoute">Create HTTPRoute</DropdownItem>
                          <DropdownItem key="createGcpRoute">Create GCPRoute</DropdownItem>
                        </DropdownList>
                      </Dropdown>
                    ) : activeResourceTab === 'policies' ? (
                      <Button variant="primary" size="sm">
                        Create Policy
                        <AngleRightIcon style={{ marginLeft: '8px' }} />
                      </Button>
                    ) : activeResourceTab === 'mcpServers' ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => setIsCreateMCPServerDropdownOpen(!isCreateMCPServerDropdownOpen)}
                        >
                          Connect
                          <AngleRightIcon style={{ marginLeft: '8px' }} />
                        </Button>
                        
                        {isCreateMCPServerDropdownOpen && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
                            border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)',
                            borderRadius: 'var(--pf-t--global--border--radius--small)',
                            boxShadow: 'var(--pf-t--global--box-shadow--md)',
                            zIndex: 1000,
                            minWidth: '200px'
                          }}>
                            <div 
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderBottom: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--nonstatus--gray--default)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                              onClick={() => {
                                handleCreateMCPServer('template');
                                setIsCreateMCPServerDropdownOpen(false);
                              }}
                            >
                              <PlusIcon />
                              Connect via Template
                            </div>
                            <div 
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderBottom: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--nonstatus--gray--default)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                              onClick={() => {
                                handleCreateMCPServer('config');
                                setIsCreateMCPServerDropdownOpen(false);
                              }}
                            >
                              <UploadIcon />
                              Connect via Config File
                            </div>
                            <div 
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                              onClick={() => {
                                handleCreateMCPServer('discovery');
                                setIsCreateMCPServerDropdownOpen(false);
                              }}
                            >
                              <SearchIcon />
                              Connect via Discovery
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button variant="primary" size="sm">
                        Create
                        <AngleRightIcon style={{ marginLeft: '8px' }} />
                      </Button>
                    )}
                  </FlexItem>
                </Flex>
              </FlexItem>
            </Flex>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>Table view</span>
              <Switch
                id="view-mode-switch"
                label=""
                labelOff=""
                isChecked={viewMode === 'card'}
                onChange={(checked) => setViewMode(checked ? 'card' : 'table')}
              />
              <span style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>Card view</span>
            </div>
          </div>

          {/* Content */}
          {viewMode === 'table' ? (
            renderConnectionTable(getFilteredConnections(), activeResourceTab)
          ) : (
            renderConnectionCards(getFilteredConnections(), activeResourceTab)
          )}
        </div>

        {/* No Connections */}
        {getConnectionCount('routes') === 0 && 
         getConnectionCount('policies') === 0 && 
         getConnectionCount('mcpServers') === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--pf-t--global--text--color--subtle)' }}>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>No connections found</div>
            <div style={{ fontSize: '14px' }}>This gateway is not currently connected to any resources.</div>
          </div>
        )}
      </div>
    );
  };

  const [activeMCPServerTab, setActiveMCPServerTab] = useState('internal');

  // Mock data for MCP servers
  const internalServers = [
    {
      id: 'desktop-commander',
      name: 'Desktop Commander',
      type: 'Desktop',
      icon: 'DC',
      color: 'var(--pf-t--global--color--status--info--100)',
      status: 'Connected',
      tools: 24,
      toolCategories: [
        { name: 'File Operations', count: 12, color: 'blue' },
        { name: 'Process Management', count: 8, color: 'blue' },
        { name: 'System Info', count: 4, color: 'blue' }
      ],
      mostUsed: [
        { name: 'read_file', uses: 156 },
        { name: 'list_directory', uses: 234 },
        { name: 'write_file', uses: 89 }
      ]
    },
    {
      id: 'kubernetes-api',
      name: 'Kubernetes API',
      type: 'Kubernetes',
      icon: 'K8',
      color: 'var(--pf-t--global--color--brand--200)',
      status: 'Connected',
      tools: 18,
      toolCategories: [
        { name: 'Pod Management', count: 8, color: 'green' },
        { name: 'Service Discovery', count: 6, color: 'green' },
        { name: 'Config Management', count: 4, color: 'green' }
      ],
      mostUsed: [
        { name: 'get_pods', uses: 89 },
        { name: 'create_service', uses: 45 },
        { name: 'update_config', uses: 23 }
      ]
    },
    {
      id: 'database-server',
      name: 'Database Server',
      type: 'Database',
      icon: 'DB',
      color: 'var(--pf-t--global--color--status--warning--200)',
      status: 'Connected',
      tools: 12,
      toolCategories: [
        { name: 'Query Operations', count: 6, color: 'orange' },
        { name: 'Schema Management', count: 4, color: 'orange' },
        { name: 'Backup Tools', count: 2, color: 'orange' }
      ],
      mostUsed: [
        { name: 'execute_query', uses: 67 },
        { name: 'backup_database', uses: 34 },
        { name: 'migrate_schema', uses: 12 }
      ]
    }
  ];

  const publicServers = [
    {
      id: 'github-server',
      name: 'GitHub Server',
      type: 'GitHub',
      icon: 'GH',
      color: 'var(--pf-t--global--color--status--success--100)',
      status: 'Connected',
      tools: 8,
      toolCategories: [
        { name: 'Repository Access', count: 5, color: 'green' },
        { name: 'Issue Management', count: 3, color: 'green' }
      ],
      mostUsed: [
        { name: 'search_code', uses: 45 },
        { name: 'get_repository', uses: 23 },
        { name: 'create_issue', uses: 12 }
      ]
    },
    {
      id: 'openai-api',
      name: 'OpenAI API',
      type: 'AI',
      icon: 'AI',
      color: 'var(--pf-t--global--color--status--success--200)',
      status: 'Connected',
      tools: 15,
      toolCategories: [
        { name: 'Text Generation', count: 8, color: 'purple' },
        { name: 'Image Processing', count: 4, color: 'purple' },
        { name: 'Embeddings', count: 3, color: 'purple' }
      ],
      mostUsed: [
        { name: 'generate_text', uses: 123 },
        { name: 'create_image', uses: 56 },
        { name: 'get_embeddings', uses: 34 }
      ]
    }
  ];

  const customServers = [
    {
      id: 'custom-api-1',
      name: 'Custom API Server',
      type: 'Custom',
      icon: 'CA',
      color: 'var(--pf-t--global--color--purple--300)',
      status: 'Connected',
      tools: 6,
      toolCategories: [
        { name: 'Data Processing', count: 3, color: 'purple' },
        { name: 'External APIs', count: 3, color: 'purple' }
      ],
      mostUsed: [
        { name: 'process_data', uses: 23 },
        { name: 'fetch_external', uses: 18 },
        { name: 'transform_data', uses: 9 }
      ]
    }
  ];

    const renderMCPServersTab = () => {
    const renderServerCard = (server) => (
      <div key={server.id} style={{ 
        border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
        borderRadius: 'var(--pf-t--global--border--radius--medium)', 
        padding: '20px',
        backgroundColor: 'var(--pf-t--global--background--color--primary--default)',
        boxShadow: 'var(--pf-t--global--box-shadow--sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: server.color, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ color: 'var(--pf-t--global--text--color--inverse)', fontWeight: 'bold', fontSize: '14px' }}>{server.icon}</span>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{server.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>{server.type}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon style={{ color: 'var(--pf-t--global--color--status--success--100)' }}>
              <CheckCircleIcon />
            </Icon>
            <span style={{ fontSize: '12px', color: 'var(--pf-t--global--color--status--success--100)' }}>{server.status}</span>
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Available Tools ({server.tools})</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {server.toolCategories.map((category, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>{category.name}</span>
                <Label color={category.color} variant="filled" isCompact>{category.count}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ borderTop: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', paddingTop: '12px' }}>
          <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '8px' }}>Most Used Tools</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {server.mostUsed.map((tool, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>{tool.name}</span>
                <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{tool.uses} uses</span>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => {
              setSelectedServer(server.id);
              setIsServerDetailsModalOpen(true);
            }}
          >
            View Details
          </Button>
          <Button variant="plain" size="sm">Disconnect</Button>
        </div>
      </div>
    );

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title headingLevel="h2" size="lg">
            MCP Configuration
          </Title>
          <Dropdown
            onSelect={(event, value) => {
              setIsCreateServerDropdownOpen(false);
              if (value) {
                setSelectedServerType(value);
                setIsAddServerModalOpen(true);
              }
            }}
            toggle={
              <MenuToggle
                onClick={() => setIsCreateServerDropdownOpen(!isCreateServerDropdownOpen)}
                isExpanded={isCreateServerDropdownOpen}
                variant="primary"
              >
                Register MCP servers
              </MenuToggle>
            }
            isOpen={isCreateServerDropdownOpen}
          >
            <DropdownList>
              <DropdownItem key="desktop" value="desktop">Add Desktop Commander</DropdownItem>
              <DropdownItem key="github" value="github">Add GitHub Server</DropdownItem>
              <DropdownItem key="custom" value="custom">Add Custom Server</DropdownItem>
            </DropdownList>
          </Dropdown>
        </div>

        {/* Internal MCP Configuration Tabs */}
        <Tabs
          activeKey={activeMCPServerTab}
          onSelect={(event, tabIndex) => setActiveMCPServerTab(tabIndex)}
          style={{ marginBottom: '24px' }}
        >
          <Tab eventKey="internal" title={<TabTitleText>Internal</TabTitleText>} />
          <Tab eventKey="public" title={<TabTitleText>Public</TabTitleText>} />
          <Tab eventKey="custom" title={<TabTitleText>Custom</TabTitleText>} />
        </Tabs>
        
        {/* Server Cards based on active tab */}
        {activeMCPServerTab === 'internal' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
            {internalServers.map(renderServerCard)}
          </div>
        )}
        
        {activeMCPServerTab === 'public' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
            {publicServers.map(renderServerCard)}
          </div>
        )}
        
        {activeMCPServerTab === 'custom' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
            {customServers.map(renderServerCard)}
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTabKey) {
      case 'details':
        return renderDetailsTab();
      case 'policies':
        return renderPoliciesTab();
      case 'yaml':
        return renderYAMLTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'logs':
        return renderLogsTab();
      case 'attached-resources':
        return renderConnectionsTab();

      default:
        return renderDetailsTab();
    }
  };

  const AddServerModal = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isServerTypeSelectOpen, setIsServerTypeSelectOpen] = useState(false);
    const [isEndpointSelectOpen, setIsEndpointSelectOpen] = useState(false);

    const handleServerTypeSelect = (event, selection) => {
      setSelectedServerType(selection);
      setIsServerTypeSelectOpen(false);
    };

    const handleEndpointSelect = (event, selection) => {
      setServerConfig({ ...serverConfig, endpoint: selection });
      setIsEndpointSelectOpen(false);
    };

    const getEndpointOptions = () => {
      switch (selectedServerType) {
        case 'desktop':
          return [
            { value: 'ws://localhost:3001', label: 'Local Desktop Commander (ws://localhost:3001)' },
            { value: 'ws://192.168.1.100:3001', label: 'Network Desktop Commander (ws://192.168.1.100:3001)' }
          ];
        case 'github':
          return [
            { value: 'https://api.github.com', label: 'GitHub API (https://api.github.com)' },
            { value: 'https://github.company.com', label: 'Enterprise GitHub (https://github.company.com)' }
          ];
        case 'custom':
          return [
            { value: 'ws://localhost:8080', label: 'Custom WebSocket (ws://localhost:8080)' },
            { value: 'https://api.example.com', label: 'Custom HTTPS (https://api.example.com)' }
          ];
        default:
          return [];
      }
    };

    const renderStep1 = () => (
      <div>
        <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
          Select Server Type
        </Title>
        <p style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '24px' }}>
          Choose the type of MCP server you want to connect to this gateway.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <div 
            style={{ 
              border: selectedServerType === 'desktop' ? '2px solid var(--pf-t--global--text--color--link--default)' : '1px solid var(--pf-t--global--border--color--default)',
              borderRadius: 'var(--pf-t--global--border--radius--medium)',
              padding: '20px',
              cursor: 'pointer',
              backgroundColor:
                selectedServerType === 'desktop'
                  ? 'var(--pf-t--global--palette--blue--50)'
                  : 'var(--pf-t--global--background--color--primary--default)'
            }}
            onClick={() => setSelectedServerType('desktop')}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--pf-t--global--color--status--info--100)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span style={{ color: 'var(--pf-t--global--text--color--inverse)', fontWeight: 'bold', fontSize: '14px' }}>DC</span>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>Desktop Commander</div>
                <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Local file system access</div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              Provides tools for file operations, process management, and system information.
            </div>
          </div>

          <div 
            style={{ 
              border: selectedServerType === 'github' ? '2px solid var(--pf-t--global--text--color--link--default)' : '1px solid var(--pf-t--global--border--color--default)',
              borderRadius: 'var(--pf-t--global--border--radius--medium)',
              padding: '20px',
              cursor: 'pointer',
              backgroundColor:
                selectedServerType === 'github'
                  ? 'var(--pf-t--global--palette--blue--50)'
                  : 'var(--pf-t--global--background--color--primary--default)'
            }}
            onClick={() => setSelectedServerType('github')}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--pf-t--global--color--status--success--100)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span style={{ color: 'var(--pf-t--global--text--color--inverse)', fontWeight: 'bold', fontSize: '14px' }}>GH</span>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>GitHub Server</div>
                <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Repository and issue management</div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              Provides tools for repository access, code search, and issue management.
            </div>
          </div>

          <div 
            style={{ 
              border: selectedServerType === 'custom' ? '2px solid var(--pf-t--global--text--color--link--default)' : '1px solid var(--pf-t--global--border--color--default)',
              borderRadius: 'var(--pf-t--global--border--radius--medium)',
              padding: '20px',
              cursor: 'pointer',
              backgroundColor:
                selectedServerType === 'custom'
                  ? 'var(--pf-t--global--palette--blue--50)'
                  : 'var(--pf-t--global--background--color--primary--default)'
            }}
            onClick={() => setSelectedServerType('custom')}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--pf-t--global--color--nonstatus--gray--default)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span style={{ color: 'var(--pf-t--global--text--color--inverse)', fontWeight: 'bold', fontSize: '14px' }}>C</span>
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>Custom Server</div>
                <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Custom MCP implementation</div>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--pf-t--global--text--color--subtle)' }}>
              Connect to a custom MCP server with your own tools and capabilities.
            </div>
          </div>
        </div>
      </div>
    );

    const renderStep2 = () => (
      <div>
        <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
          Configure Connection
        </Title>
        <p style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '24px' }}>
          Configure the connection details for your {selectedServerType === 'desktop' ? 'Desktop Commander' : 
          selectedServerType === 'github' ? 'GitHub' : 'Custom'} server.
        </p>
        
        <Form>
          <FormGroup label="Server Name" isRequired fieldId="server-name">
            <TextInput
              id="server-name"
              value={serverConfig.name}
              onChange={(value) => setServerConfig({ ...serverConfig, name: value })}
              placeholder={`Enter ${selectedServerType === 'desktop' ? 'Desktop Commander' : 
              selectedServerType === 'github' ? 'GitHub' : 'Custom'} server name`}
            />
          </FormGroup>
          
          <FormGroup label="Endpoint" isRequired fieldId="server-endpoint">
            <Select
              id="server-endpoint"
              isOpen={isEndpointSelectOpen}
              selected={serverConfig.endpoint}
              onSelect={handleEndpointSelect}
              onOpenChange={(isOpen) => setIsEndpointSelectOpen(isOpen)}
              toggle={
                <MenuToggle 
                  onClick={() => setIsEndpointSelectOpen(!isEndpointSelectOpen)}
                  isExpanded={isEndpointSelectOpen}
                >
                  {serverConfig.endpoint || 'Select endpoint'}
                </MenuToggle>
              }
            >
              {getEndpointOptions().map((option) => (
                <SelectOption key={option.value} value={option.value}>
                  {option.label}
                </SelectOption>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup label="Credentials" fieldId="server-credentials">
            <TextInput
              id="server-credentials"
              value={serverConfig.credentials}
              onChange={(value) => setServerConfig({ ...serverConfig, credentials: value })}
              placeholder="Toki, token, or credentials (optional)"
            />
          </FormGroup>
          
          <FormGroup label="Description" fieldId="server-description">
            <TextArea
              id="server-description"
              value={serverConfig.description}
              onChange={(value) => setServerConfig({ ...serverConfig, description: value })}
              placeholder="Optional description for this server"
              rows={3}
            />
          </FormGroup>
        </Form>
      </div>
    );

    const renderStep3 = () => (
      <div>
        <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
          Review Configuration
        </Title>
        <p style={{ color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '24px' }}>
          Review your server configuration before connecting.
        </p>
        
        <div style={{ 
          border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
          borderRadius: 'var(--pf-t--global--border--radius--medium)', 
          padding: '20px',
          backgroundColor: 'var(--pf-t--global--background--color--secondary--default)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor:
                selectedServerType === 'desktop'
                  ? 'var(--pf-t--global--color--status--info--100)'
                  : selectedServerType === 'github'
                    ? 'var(--pf-t--global--color--status--success--100)'
                    : 'var(--pf-t--global--color--nonstatus--gray--default)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{ color: 'var(--pf-t--global--text--color--inverse)', fontWeight: 'bold', fontSize: '14px' }}>
                {selectedServerType === 'desktop' ? 'DC' : 
                selectedServerType === 'github' ? 'GH' : 'C'}
              </span>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>{serverConfig.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                {selectedServerType === 'desktop' ? 'Desktop Commander' : 
                selectedServerType === 'github' ? 'GitHub Server' : 'Custom Server'}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Endpoint</div>
              <div style={{ fontSize: '14px' }}>{serverConfig.endpoint}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Credentials</div>
              <div style={{ fontSize: '14px' }}>
                {serverConfig.credentials ? 'Configured' : 'Not configured'}
              </div>
            </div>
          </div>
          
          {serverConfig.description && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '4px' }}>Description</div>
              <div style={{ fontSize: '14px' }}>{serverConfig.description}</div>
            </div>
          )}
        </div>
        
        <Alert 
          variant="info" 
          title="Connection will be established"
          style={{ marginTop: '16px' }}
        >
          The server will be connected to this gateway and its tools will be available for use.
        </Alert>
      </div>
    );

    const handleNext = () => {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        // Handle server creation
        setIsAddServerModalOpen(false);
        setCurrentStep(1);
        setSelectedServerType('');
        setServerConfig({ name: '', endpoint: '', credentials: '', description: '' });
      }
    };

    const handleBack = () => {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    };

    const canProceed = () => {
      switch (currentStep) {
        case 1:
          return selectedServerType !== '';
        case 2:
          return serverConfig.name && serverConfig.endpoint;
        case 3:
          return true;
        default:
          return false;
      }
    };

    return (
      <Modal
        isOpen={isAddServerModalOpen}
        onClose={() => setIsAddServerModalOpen(false)}
        variant="small"
        title="Add MCP Server"
      >
        <ModalHeader>
          <WizardHeader
            title="Add MCP Server"
            description="Connect a new MCP server to this gateway"
            onClose={() => setIsAddServerModalOpen(false)}
          />
        </ModalHeader>
        <ModalBody>
          <Wizard
            currentStep={currentStep}
            onNext={handleNext}
            onBack={handleBack}
            onClose={() => setIsAddServerModalOpen(false)}
          >
            <WizardStep
              id={1}
              name="Server Type"
              description="Choose server type"
            >
              {renderStep1()}
            </WizardStep>
            <WizardStep
              id={2}
              name="Configuration"
              description="Configure connection"
            >
              {renderStep2()}
            </WizardStep>
            <WizardStep
              id={3}
              name="Review"
              description="Review and connect"
            >
              {renderStep3()}
            </WizardStep>
          </Wizard>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="primary" 
            onClick={handleNext}
            isDisabled={!canProceed()}
          >
            {currentStep === 3 ? 'Connect Server' : 'Next'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleBack}
            isDisabled={currentStep === 1}
          >
            Back
          </Button>
          <Button 
            variant="link" 
            onClick={() => setIsAddServerModalOpen(false)}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const ServerDetailsModal = () => {
    const getServerDetails = (serverName) => {
      const allServers = [...internalServers, ...publicServers, ...customServers];
      const server = allServers.find(s => s.name === serverName);
      
      if (!server) return null;
      
      // 根据server类型返回不同的详细信息
      switch (serverName) {
        case 'Desktop Commander':
          return {
            name: server.name,
            type: server.type,
            status: server.status,
            endpoint: 'ws://localhost:3001',
            version: '1.2.3',
            lastConnected: '2 minutes ago',
            uptime: '3 days, 12 hours',
            tools: [
              {
                category: 'File Operations',
                tools: [
                  { name: 'read_file', description: 'Read file contents', usage: 156, status: 'Active' },
                  { name: 'write_file', description: 'Write content to file', usage: 89, status: 'Active' },
                  { name: 'list_directory', description: 'List directory contents', usage: 234, status: 'Active' },
                  { name: 'create_directory', description: 'Create new directory', usage: 23, status: 'Active' },
                  { name: 'move_file', description: 'Move or rename files', usage: 45, status: 'Active' },
                  { name: 'delete_file', description: 'Delete files or directories', usage: 12, status: 'Active' },
                  { name: 'search_files', description: 'Search files by pattern', usage: 67, status: 'Active' },
                  { name: 'get_file_info', description: 'Get file metadata', usage: 34, status: 'Active' },
                  { name: 'edit_block', description: 'Edit file content blocks', usage: 78, status: 'Active' },
                  { name: 'read_multiple_files', description: 'Read multiple files', usage: 29, status: 'Active' },
                  { name: 'search_code', description: 'Search code patterns', usage: 56, status: 'Active' },
                  { name: 'file_search', description: 'Find files by name', usage: 41, status: 'Active' }
                ]
              },
              {
                category: 'Process Management',
                tools: [
                  { name: 'start_process', description: 'Start new terminal process', usage: 123, status: 'Active' },
                  { name: 'read_process_output', description: 'Read process output', usage: 456, status: 'Active' },
                  { name: 'interact_with_process', description: 'Send input to process', usage: 234, status: 'Active' },
                  { name: 'force_terminate', description: 'Terminate running process', usage: 15, status: 'Active' },
                  { name: 'list_sessions', description: 'List active sessions', usage: 89, status: 'Active' },
                  { name: 'list_processes', description: 'List running processes', usage: 67, status: 'Active' },
                  { name: 'kill_process', description: 'Kill process by PID', usage: 8, status: 'Active' },
                  { name: 'get_usage_stats', description: 'Get usage statistics', usage: 23, status: 'Active' }
                ]
              },
              {
                category: 'System Information',
                tools: [
                  { name: 'get_config', description: 'Get server configuration', usage: 12, status: 'Active' },
                  { name: 'set_config_value', description: 'Set configuration value', usage: 5, status: 'Active' },
                  { name: 'give_feedback', description: 'Provide feedback', usage: 2, status: 'Active' }
                ]
              }
            ],
            performance: {
              totalRequests: 1247,
              successRate: 99.2,
              averageResponseTime: 45,
              errors: 10
            }
          };
          
        case 'GitHub Server':
          return {
            name: server.name,
            type: server.type,
            status: server.status,
            endpoint: 'https://api.github.com',
            version: '2.1.0',
            lastConnected: '5 minutes ago',
            uptime: '1 day, 8 hours',
            tools: [
              {
                category: 'Repository Access',
                tools: [
                  { name: 'search_code', description: 'Search code in repositories', usage: 45, status: 'Active' },
                  { name: 'get_repository', description: 'Get repository information', usage: 23, status: 'Active' },
                  { name: 'list_repositories', description: 'List user repositories', usage: 18, status: 'Active' },
                  { name: 'get_file_content', description: 'Get file content from repo', usage: 34, status: 'Active' },
                  { name: 'get_commit_history', description: 'Get commit history', usage: 12, status: 'Active' }
                ]
              },
              {
                category: 'Issue Management',
                tools: [
                  { name: 'create_issue', description: 'Create new issue', usage: 12, status: 'Active' },
                  { name: 'get_issues', description: 'Get repository issues', usage: 28, status: 'Active' },
                  { name: 'update_issue', description: 'Update issue status', usage: 8, status: 'Active' }
                ]
              }
            ],
            performance: {
              totalRequests: 456,
              successRate: 98.5,
              averageResponseTime: 120,
              errors: 7
            }
          };
          
        default:
          return {
            name: server.name,
            type: server.type,
            status: server.status,
            endpoint: 'https://api.example.com',
            version: '1.0.0',
            lastConnected: '10 minutes ago',
            uptime: '2 days, 5 hours',
            tools: [
              {
                category: 'General Tools',
                tools: [
                  { name: 'get_info', description: 'Get server information', usage: 25, status: 'Active' },
                  { name: 'test_connection', description: 'Test server connection', usage: 15, status: 'Active' }
                ]
              }
            ],
            performance: {
              totalRequests: 200,
              successRate: 95.0,
              averageResponseTime: 80,
              errors: 10
            }
          };
      }
    };

    const serverDetails = getServerDetails(selectedServer);
    if (!serverDetails) return null;

    return (
      <Modal
        isOpen={isServerDetailsModalOpen}
        onClose={() => setIsServerDetailsModalOpen(false)}
        variant="small"
        title="Server Details"
      >
        <ModalHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor:
                selectedServer === 'GitHub Server'
                  ? 'var(--pf-t--global--color--status--success--100)'
                  : 'var(--pf-t--global--color--status--info--100)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <span style={{ color: 'var(--pf-t--global--text--color--inverse)', fontWeight: 'bold', fontSize: '18px' }}>
                {selectedServer === 'GitHub Server' ? 'GH' : 'DC'}
              </span>
            </div>
            <div>
              <Title headingLevel="h2" size="xl">{serverDetails.name}</Title>
              <div style={{ fontSize: '14px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                {serverDetails.type} • {serverDetails.status}
              </div>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* Connection Info */}
            <div>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
                Connection Information
              </Title>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Endpoint</DescriptionListTerm>
                  <DescriptionListDescription>
                    <code style={{ backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', padding: '4px 8px', borderRadius: 'var(--pf-t--global--border--radius--small)' }}>
                      {serverDetails.endpoint}
                    </code>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Version</DescriptionListTerm>
                  <DescriptionListDescription>{serverDetails.version}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Last Connected</DescriptionListTerm>
                  <DescriptionListDescription>{serverDetails.lastConnected}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Uptime</DescriptionListTerm>
                  <DescriptionListDescription>{serverDetails.uptime}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </div>

            {/* Performance Stats */}
            <div>
              <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
                Performance Statistics
              </Title>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ 
                  border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
                  borderRadius: 'var(--pf-t--global--border--radius--medium)', 
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--pf-t--global--text--color--link--default)' }}>
                    {serverDetails.performance.totalRequests}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Total Requests</div>
                </div>
                <div style={{ 
                  border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
                  borderRadius: 'var(--pf-t--global--border--radius--medium)', 
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div
                    style={{
                      fontSize: 'var(--pf-t--global--font--size--heading--h3)',
                      fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                      color: 'var(--pf-t--global--color--status--success--100)'
                    }}
                  >
                    {serverDetails.performance.successRate}%
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Success Rate</div>
                </div>
                <div style={{ 
                  border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
                  borderRadius: 'var(--pf-t--global--border--radius--medium)', 
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div
                    style={{
                      fontSize: 'var(--pf-t--global--font--size--heading--h3)',
                      fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                      color: 'var(--pf-t--global--color--gold--300)'
                    }}
                  >
                    {serverDetails.performance.averageResponseTime}ms
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Avg Response</div>
                </div>
                <div style={{ 
                  border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
                  borderRadius: 'var(--pf-t--global--border--radius--medium)', 
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div
                    style={{
                      fontSize: 'var(--pf-t--global--font--size--heading--h3)',
                      fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
                      color: 'var(--pf-t--global--color--status--danger--100)'
                    }}
                  >
                    {serverDetails.performance.errors}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>Errors</div>
                </div>
              </div>
            </div>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          {/* Tools by Category */}
          <Title headingLevel="h3" size="md" style={{ marginBottom: '16px' }}>
            Available Tools ({serverDetails.tools.reduce((acc, cat) => acc + cat.tools.length, 0)})
          </Title>
          
          {serverDetails.tools.map((category, catIndex) => (
            <div key={catIndex} style={{ marginBottom: '24px' }}>
              <div style={{ 
                backgroundColor: 'var(--pf-t--global--background--color--secondary--default)', 
                padding: '12px 16px', 
                borderRadius: '6px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px', fontWeight: '500' }}>{category.category}</span>
                  <Label color="blue" variant="filled" isCompact>{category.tools.length} tools</Label>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                {category.tools.map((tool, toolIndex) => (
                  <div key={toolIndex} style={{ 
                    border: 'var(--pf-t--global--border--width--regular) solid var(--pf-t--global--border--color--default)', 
                    borderRadius: '6px', 
                    padding: '12px',
                    backgroundColor: 'var(--pf-t--global--background--color--primary--default)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <code style={{ fontSize: '14px', fontWeight: '500' }}>{tool.name}</code>
                      <Label color="green" variant="filled" isCompact>{tool.status}</Label>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: '8px' }}>
                      {tool.description}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--pf-t--global--text--color--subtle)' }}>
                      Used {tool.usage} times
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button variant="primary" onClick={() => setIsServerDetailsModalOpen(false)}>
            Close
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => {
              if (onMCPServerAction) {
                onMCPServerAction('test-connection', selectedServer);
              }
              setIsServerDetailsModalOpen(false);
            }}
          >
            Test Connection
          </Button>
          <Button 
            variant="secondary"
            onClick={() => {
              if (onMCPServerAction) {
                onMCPServerAction('view-logs', selectedServer);
              }
              setIsServerDetailsModalOpen(false);
            }}
          >
            View Logs
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  return (
    <>
      <PageSection variant="light">
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={onBack}>
              Gateways
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>Gateway details</BreadcrumbItem>
        </Breadcrumb>
        
        <div style={{ marginTop: '16px' }}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--pf-t--global--text--color--link--default)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ color: 'var(--pf-t--global--text--color--inverse)', fontWeight: 'bold', fontSize: '14px' }}>G</span>
                </div>
                <Title headingLevel="h1" size="2xl">
                  {gatewayName}
                </Title>
              </div>
            </FlexItem>
            <FlexItem>
              <Dropdown
                onSelect={() => setIsActionsDropdownOpen(false)}
                toggle={
                  <MenuToggle
                    onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                    isExpanded={isActionsDropdownOpen}
                  >
                    Actions <EllipsisVIcon />
                  </MenuToggle>
                }
                isOpen={isActionsDropdownOpen}
              >
                <DropdownList>
                  <DropdownItem key="edit">Edit Gateway</DropdownItem>
                  <DropdownItem key="delete">Delete Gateway</DropdownItem>
                  <DropdownItem key="restart">Restart Gateway</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
          </Flex>
        </div>
        
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          style={{ marginTop: '24px' }}
        >
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey="policies" title={<TabTitleText>Policies</TabTitleText>} />
          <Tab eventKey="yaml" title={<TabTitleText>YAML</TabTitleText>} />
          <Tab eventKey="analytics" title={<TabTitleText>Analytics</TabTitleText>} />
          <Tab eventKey="logs" title={<TabTitleText>Logs</TabTitleText>} />
          <Tab eventKey="attached-resources" title={<TabTitleText>Attached</TabTitleText>} />

        </Tabs>
      </PageSection>
      
      <PageSection>
        {isCreateMCPServerOpen ? (
          mcpServerPageType === 'template' ? (
            <MCPServerTemplatePage
              onBack={handleBackFromCreateMCPServer}
              onCancel={handleBackFromCreateMCPServer}
            />
          ) : mcpServerPageType === 'config' ? (
            <MCPServerConfigPage
              onBack={handleBackFromCreateMCPServer}
              onCancel={handleBackFromCreateMCPServer}
            />
          ) : mcpServerPageType === 'discovery' ? (
            <MCPServerDiscoveryPage
              onBack={handleBackFromCreateMCPServer}
              onCancel={handleBackFromCreateMCPServer}
            />
          ) : (
            <CreateMCPServerPage
              onBack={handleBackFromCreateMCPServer}
              onCancel={handleBackFromCreateMCPServer}
              onMCPServerPage={handleCreateMCPServer}
            />
          )
        ) : (
          renderTabContent()
        )}
      </PageSection>
      
      {/* Modals */}
      <AddServerModal />
      <ServerDetailsModal />
    </>
  );
};

export default GatewayDetailsPage; 