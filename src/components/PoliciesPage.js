import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  SearchInput,
  Flex,
  FlexItem,
  Label,
  Icon,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle
} from '@patternfly/react-core';
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableText
} from '@patternfly/react-table';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EllipsisVIcon,
  SortAmountDownIcon,
  UserIcon,
  BanIcon,
  ClockIcon
} from '@patternfly/react-icons';
import PolicyDetailsPage from './PolicyDetailsPage';

const PoliciesPage = () => {
  const [activeTabKey, setActiveTabKey] = useState('all-policies');
  const [searchValue, setSearchValue] = useState('');
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);

  const policyData = [
    {
      name: 'external-auth',
      type: 'AuthPolicy',
      namespace: 'api-gateway-orla',
      status: 'TargetNotFound (Not Accepted)',
      statusType: 'error',
      created: 'May 1, 2025, 5:36 PM',
      badge: 'AP'
    },
    {
      name: 'external-dmtest1-auth',
      type: 'AuthPolicy',
      namespace: 'api-gateway-dmtest1',
      status: 'Overridden (Not Enforced)',
      statusType: 'warning',
      created: 'Feb 27, 2025, 6:21 PM',
      badge: 'AP'
    },
    {
      name: 'external-dmtest1-dnspolicy',
      type: 'DNSPolicy',
      namespace: 'api-gateway-dmtest1',
      status: 'Enforced',
      statusType: 'success',
      created: 'Feb 27, 2025, 6:21 PM',
      badge: 'DNSP'
    },
    {
      name: 'external-jmadigan-1-auth',
      type: 'AuthPolicy',
      namespace: 'api-gateway-jmadigan-1',
      status: 'TargetNotFound (Not Accepted)',
      statusType: 'error',
      created: 'Feb 27, 2025, 12:12 AM',
      badge: 'AP'
    },
    {
      name: 'kserve-override-auth',
      type: 'AuthPolicy',
      namespace: 'default',
      status: 'TargetNotFound (Not Accepted)',
      statusType: 'error',
      created: 'Apr 3, 2025, 12:04 AM',
      badge: 'AP'
    },
    {
      name: 'mcp-auth',
      type: 'AuthPolicy',
      namespace: 'mcp-gateway',
      status: 'Enforced',
      statusType: 'success',
      created: 'Jul 3, 2025, 1:18 AM',
      badge: 'AP'
    },
    {
      name: 'mcp-tool-auth',
      type: 'AuthPolicy',
      namespace: 'mcp-server',
      status: 'Enforced',
      statusType: 'success',
      created: 'Jul 3, 2025, 1:29 AM',
      badge: 'AP'
    },
    {
      name: 'toystore-auth',
      type: 'AuthPolicy',
      namespace: 'toystore-orla',
      status: 'Accepted (Not Enforced)',
      statusType: 'info',
      created: 'May 1, 2025, 5:42 PM',
      badge: 'AP'
    },
    {
      name: 'toystore-auth',
      type: 'AuthPolicy',
      namespace: 'toystore-dmtest1-2',
      status: 'Enforced',
      statusType: 'success',
      created: 'Feb 28, 2025, 12:50 AM',
      badge: 'AP'
    },
    {
      name: 'toystore-auth',
      type: 'AuthPolicy',
      namespace: 'toystore-jmadigan-1',
      status: 'Accepted (Not Enforced)',
      statusType: 'info',
      created: 'Feb 27, 2025, 12:12 AM',
      badge: 'AP'
    }
  ];

  const tokenRateLimitData = [
    {
      name: 'token-rate-limit-openai',
      type: 'TokenRateLimitPolicy',
      namespace: 'ai-gateway-prod',
      status: 'Enforced',
      statusType: 'success',
      created: 'Jul 15, 2025, 2:30 PM',
      badge: 'TRL',
      limit: '1000 tokens/min',
      provider: 'OpenAI'
    },
    {
      name: 'token-rate-limit-azure',
      type: 'TokenRateLimitPolicy',
      namespace: 'ai-gateway-prod',
      status: 'Enforced',
      statusType: 'success',
      created: 'Jul 15, 2025, 2:45 PM',
      badge: 'TRL',
      limit: '800 tokens/min',
      provider: 'Azure'
    },
    {
      name: 'token-rate-limit-gemini',
      type: 'TokenRateLimitPolicy',
      namespace: 'ai-gateway-test',
      status: 'Accepted (Not Enforced)',
      statusType: 'info',
      created: 'Jul 16, 2025, 10:15 AM',
      badge: 'TRL',
      limit: '500 tokens/min',
      provider: 'Gemini'
    },
    {
      name: 'token-rate-limit-watson',
      type: 'TokenRateLimitPolicy',
      namespace: 'ai-gateway-dev',
      status: 'TargetNotFound (Not Accepted)',
      statusType: 'error',
      created: 'Jul 16, 2025, 11:30 AM',
      badge: 'TRL',
      limit: '300 tokens/min',
      provider: 'Watson'
    },
    {
      name: 'token-rate-limit-deepseek',
      type: 'TokenRateLimitPolicy',
      namespace: 'ai-gateway-prod',
      status: 'Enforced',
      statusType: 'success',
      created: 'Jul 16, 2025, 3:45 PM',
      badge: 'TRL',
      limit: '1200 tokens/min',
      provider: 'DeepSeek'
    },
    {
      name: 'token-rate-limit-consumer-1',
      type: 'TokenRateLimitPolicy',
      namespace: 'consumer-namespace',
      status: 'Overridden (Not Enforced)',
      statusType: 'warning',
      created: 'Jul 17, 2025, 9:00 AM',
      badge: 'TRL',
      limit: '200 tokens/min',
      provider: 'Multiple'
    }
  ];

  const planPolicyData = [
    {
      name: 'default-plan',
      type: 'PlanPolicy',
      namespace: 'default',
      status: 'Enforced',
      statusType: 'success',
      created: 'Jan 15, 2025, 9:00 AM',
      badge: 'PP'
    },
    {
      name: 'bronze-tier-plan',
      type: 'PlanPolicy',
      namespace: 'api-gateway-orla',
      status: 'Enforced',
      statusType: 'success',
      created: 'Feb 1, 2025, 10:30 AM',
      badge: 'PP'
    },
    {
      name: 'silver-tier-plan',
      type: 'PlanPolicy',
      namespace: 'api-gateway-dmtest1',
      status: 'Accepted (Not Enforced)',
      statusType: 'info',
      created: 'Feb 10, 2025, 2:15 PM',
      badge: 'PP'
    },
    {
      name: 'gold-tier-plan',
      type: 'PlanPolicy',
      namespace: 'toystore-orla',
      status: 'Enforced',
      statusType: 'success',
      created: 'Feb 20, 2025, 11:00 AM',
      badge: 'PP'
    },
    {
      name: 'consumer-plan-default',
      type: 'PlanPolicy',
      namespace: 'consumer-namespace',
      status: 'TargetNotFound (Not Accepted)',
      statusType: 'error',
      created: 'Mar 5, 2025, 4:45 PM',
      badge: 'PP'
    },
    {
      name: 'analytics-plans',
      type: 'PlanPolicy',
      namespace: 'default',
      status: 'Enforced',
      statusType: 'success',
      created: 'Mar 12, 2025, 8:20 AM',
      badge: 'PP'
    },
    {
      name: 'payments-plans',
      type: 'PlanPolicy',
      namespace: 'api-gateway-orla',
      status: 'Overridden (Not Enforced)',
      statusType: 'warning',
      created: 'Mar 18, 2025, 3:00 PM',
      badge: 'PP'
    }
  ];

  const getFilteredData = () => {
    let dataToFilter = [];
    
    switch (activeTabKey) {
      case 'all-policies':
        dataToFilter = [...policyData, ...tokenRateLimitData, ...planPolicyData];
        break;
      case 'plan':
        dataToFilter = planPolicyData;
        break;
      case 'dns':
        dataToFilter = policyData.filter(policy => policy.type === 'DNSPolicy');
        break;
      case 'tls':
        dataToFilter = policyData.filter(policy => policy.type === 'TLSPolicy');
        break;
      case 'auth':
        dataToFilter = policyData.filter(policy => policy.type === 'AuthPolicy');
        break;
      case 'rate-limit':
        dataToFilter = policyData.filter(policy => policy.type === 'RateLimitPolicy');
        break;
      case 'token-rate-limit':
        dataToFilter = tokenRateLimitData;
        break;
      default:
        dataToFilter = [...policyData, ...tokenRateLimitData, ...planPolicyData];
    }
    
    return dataToFilter.filter(policy =>
      policy.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      policy.namespace.toLowerCase().includes(searchValue.toLowerCase())
    );
  };

  const filteredPolicies = getFilteredData();

  const renderPolicyBadge = (badge) => {
    let color = 'blue';
    switch (badge) {
      case 'DNSP':
        color = 'cyan';
        break;
      case 'TRL':
        color = 'purple';
        break;
      case 'PP':
        color = 'green';
        break;
      case 'AP':
        color = 'blue';
        break;
      default:
        color = 'blue';
    }
    return (
      <Label color={color} variant="filled" isCompact>
        {badge}
      </Label>
    );
  };

  const renderNamespace = (namespace) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Label color="green" variant="filled" isCompact>
          NS
        </Label>
        <span style={{ marginLeft: '8px' }}>{namespace}</span>
      </div>
    );
  };

  const renderStatus = (status, statusType) => {
    let color = 'grey';
    let icon = null;
    
    switch (statusType) {
      case 'success':
        color = 'green';
        icon = <CheckCircleIcon />;
        break;
      case 'error':
        color = 'red';
        icon = <ExclamationTriangleIcon />;
        break;
      case 'warning':
        color = 'orange';
        icon = <BanIcon />;
        break;
      case 'info':
        color = 'blue';
        icon = <UserIcon />;
        break;
      default:
        color = 'grey';
    }

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon && (
          <Icon style={{ marginRight: '8px' }}>
            {icon}
          </Icon>
        )}
        <Label color={color} variant="outline" isCompact>
          {status}
        </Label>
      </div>
    );
  };

  const renderCreated = (created) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon style={{ marginRight: '8px' }}>
          <ClockIcon />
        </Icon>
        <span>{created}</span>
      </div>
    );
  };

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const handlePolicyClick = (policy) => {
    if (policy.name === 'token-rate-limit-openai') {
      setSelectedPolicy(policy);
      setShowPolicyDetails(true);
    }
  };

  const handleBackToPolicies = () => {
    setShowPolicyDetails(false);
    setSelectedPolicy(null);
  };

  if (showPolicyDetails && selectedPolicy) {
    return (
      <PolicyDetailsPage
        policyName={selectedPolicy.name}
        onBack={handleBackToPolicies}
      />
    );
  }

  return (
    <>
      <PageSection variant="light">
        <Title headingLevel="h1" size="2xl">
          Policies
        </Title>
      </PageSection>
      
      <PageSection>
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          style={{ marginBottom: '24px' }}
        >
          <Tab eventKey="all-policies" title={<TabTitleText>All Policies</TabTitleText>} />
          <Tab eventKey="plan" title={<TabTitleText>Plan</TabTitleText>} />
          <Tab eventKey="dns" title={<TabTitleText>DNS</TabTitleText>} />
          <Tab eventKey="tls" title={<TabTitleText>TLS</TabTitleText>} />
          <Tab eventKey="auth" title={<TabTitleText>Auth</TabTitleText>} />
          <Tab eventKey="rate-limit" title={<TabTitleText>RateLimit</TabTitleText>} />
          <Tab eventKey="token-rate-limit" title={<TabTitleText>Token RateLimit</TabTitleText>} />
        </Tabs>
        
        <div style={{ marginBottom: '24px' }}>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
              <Toolbar>
                <ToolbarContent>
                  <ToolbarItem>
                    <Flex alignItems={{ default: 'alignItemsCenter' }}>
                      <FlexItem>
                        <Button variant="control" aria-label="Sort by name">
                          Name
                          <SortAmountDownIcon style={{ marginLeft: '8px' }} />
                        </Button>
                      </FlexItem>
                      <FlexItem>
                        <SearchInput
                          placeholder="Search by name or namespace..."
                          value={searchValue}
                          onChange={(event, value) => setSearchValue(value)}
                          onSearch={(event, value) => setSearchValue(value)}
                          onClear={() => setSearchValue('')}
                        />
                      </FlexItem>
                    </Flex>
                  </ToolbarItem>
                </ToolbarContent>
              </Toolbar>
            </FlexItem>
            <FlexItem>
              <Dropdown
                onSelect={() => setIsCreateDropdownOpen(false)}
                toggle={
                  <MenuToggle
                    onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
                    isExpanded={isCreateDropdownOpen}
                    variant="primary"
                  >
                    Create Policy
                  </MenuToggle>
                }
                isOpen={isCreateDropdownOpen}
                shouldFocusToggleOnSelect
              >
                <DropdownList>
                  <DropdownItem key="auth-policy">Auth Policy</DropdownItem>
                  <DropdownItem key="rate-limit-policy">Rate Limit Policy</DropdownItem>
                  <DropdownItem key="token-rate-limit-policy">Token Rate Limit Policy</DropdownItem>
                  <DropdownItem key="dns-policy">DNS Policy</DropdownItem>
                  <DropdownItem key="tls-policy">TLS Policy</DropdownItem>
                </DropdownList>
              </Dropdown>
            </FlexItem>
          </Flex>
        </div>

        <Table aria-label="Policies table">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Namespace</Th>
              <Th>Status</Th>
              {activeTabKey === 'token-rate-limit' && <Th>Limit</Th>}
              {activeTabKey === 'token-rate-limit' && <Th>Provider</Th>}
              <Th>Created</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {filteredPolicies.map((policy, rowIndex) => (
              <Tr key={rowIndex}>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {renderPolicyBadge(policy.badge)}
                    <Button 
                      variant="link" 
                      isInline 
                      style={{ marginLeft: '8px' }}
                      onClick={() => handlePolicyClick(policy)}
                    >
                      {policy.name}
                    </Button>
                  </div>
                </Td>
                <Td>{policy.type}</Td>
                <Td>{renderNamespace(policy.namespace)}</Td>
                <Td>{renderStatus(policy.status, policy.statusType)}</Td>
                {activeTabKey === 'token-rate-limit' && (
                  <Td>
                    <Label color="blue" variant="outline" isCompact>
                      {policy.limit}
                    </Label>
                  </Td>
                )}
                {activeTabKey === 'token-rate-limit' && (
                  <Td>
                    <Label color="green" variant="filled" isCompact>
                      {policy.provider}
                    </Label>
                  </Td>
                )}
                <Td>{renderCreated(policy.created)}</Td>
                <Td>
                  <Dropdown
                    onSelect={() => {}}
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
                      <DropdownItem key="edit">Edit</DropdownItem>
                      <DropdownItem key="delete">Delete</DropdownItem>
                    </DropdownList>
                  </Dropdown>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageSection>
    </>
  );
};

export default PoliciesPage; 