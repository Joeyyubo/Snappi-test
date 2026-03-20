import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Tabs,
  Tab,
  TabTitleText,
  Button,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Card,
  CardBody,
  Icon,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  CodeBlock,
  CodeBlockCode,
  Breadcrumb,
  BreadcrumbItem
} from '@patternfly/react-core';
import {
  ArrowUpIcon,
  ArrowDownIcon
} from '@patternfly/react-icons';

// Simple Bar Chart Component
const chartAxisStyle = { fontSize: 'var(--pf-t--global--font--size--body--sm)', fill: 'var(--pf-t--global--text--color--subtle)' };

const BarChart = ({ data, title }) => (
  <div style={{ height: '18.75rem' }}>
    <h4
      style={{
        marginBottom: 'var(--pf-t--global--spacer--md)',
        fontSize: 'var(--pf-t--global--font--size--heading--h4)',
        fontWeight: 'var(--pf-t--global--font--weight--body--bold)',
        color: 'var(--pf-t--global--text--color--regular)'
      }}
    >
      {title}
    </h4>
    <svg width="100%" height="240" viewBox="0 0 600 240">
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'var(--pf-t--global--color--status--warning--200)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'var(--pf-t--global--color--brand--200)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Y-axis */}
      <line x1="60" y1="20" x2="60" y2="200" stroke="var(--pf-t--global--border--color--default)" strokeWidth="1"/>
      
      {/* X-axis */}
      <line x1="60" y1="200" x2="580" y2="200" stroke="var(--pf-t--global--border--color--default)" strokeWidth="1"/>
      
      {/* Y-axis labels */}
      <text x="40" y="25" textAnchor="end" style={chartAxisStyle}>240</text>
      <text x="40" y="75" textAnchor="end" style={chartAxisStyle}>180</text>
      <text x="40" y="125" textAnchor="end" style={chartAxisStyle}>120</text>
      <text x="40" y="175" textAnchor="end" style={chartAxisStyle}>60</text>
      <text x="40" y="205" textAnchor="end" style={chartAxisStyle}>0</text>
      
      {/* Bars */}
      <rect x="80" y="175" width="60" height="25" fill="url(#barGradient)" rx="var(--pf-t--global--border--radius--small)" />
      <rect x="160" y="120" width="60" height="80" fill="url(#barGradient)" rx="var(--pf-t--global--border--radius--small)" />
      <rect x="240" y="140" width="60" height="60" fill="url(#barGradient)" rx="var(--pf-t--global--border--radius--small)" />
      <rect x="320" y="85" width="60" height="115" fill="url(#barGradient)" rx="var(--pf-t--global--border--radius--small)" />
      <rect x="400" y="25" width="60" height="175" fill="url(#barGradient)" rx="var(--pf-t--global--border--radius--small)" />
      <rect x="480" y="155" width="60" height="45" fill="url(#barGradient)" rx="var(--pf-t--global--border--radius--small)" />
      
      {/* X-axis labels */}
      <text x="110" y="220" textAnchor="middle" style={chartAxisStyle}>1min</text>
      <text x="190" y="220" textAnchor="middle" style={chartAxisStyle}>5min</text>
      <text x="270" y="220" textAnchor="middle" style={chartAxisStyle}>10min</text>
      <text x="350" y="220" textAnchor="middle" style={chartAxisStyle}>15min</text>
      <text x="430" y="220" textAnchor="middle" style={chartAxisStyle}>30min</text>
      <text x="510" y="220" textAnchor="middle" style={chartAxisStyle}>1hour</text>
    </svg>
  </div>
);

const PolicyDetailsPage = ({ policyName, onBack }) => {
  const [activeTabKey, setActiveTabKey] = useState('details');

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const yamlContent = `apiVersion: kuadrant.io/v1beta1
kind: TokenRateLimitPolicy
metadata:
  name: token-rate-limit-openai
  namespace: ai-gateway-prod
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: openai-route
  limits:
    tokens_per_minute:
      rates:
      - limit: 1000
        duration: 60s
      counters:
      - token_count
  providers:
  - name: openai
    endpoint: https://api.openai.com
    tokenCounter: gpt_tokens`;

  const renderDetailsTab = () => (
    <Grid hasGutter>
      <GridItem span={6}>
        <Card>
          <CardBody>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
              Policy Information
            </Title>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Name</DescriptionListTerm>
                <DescriptionListDescription>token-rate-limit-openai</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Type</DescriptionListTerm>
                <DescriptionListDescription>TokenRateLimitPolicy</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Namespace</DescriptionListTerm>
                <DescriptionListDescription>ai-gateway-prod</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Status</DescriptionListTerm>
                <DescriptionListDescription>Enforced</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Created</DescriptionListTerm>
                <DescriptionListDescription>Jul 15, 2025, 2:30 PM</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={6}>
        <Card>
          <CardBody>
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '16px' }}>
              Configuration
            </Title>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>Token Limit</DescriptionListTerm>
                <DescriptionListDescription>1000 tokens/min</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Provider</DescriptionListTerm>
                <DescriptionListDescription>OpenAI</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Target Route</DescriptionListTerm>
                <DescriptionListDescription>openai-route</DescriptionListDescription>
              </DescriptionListGroup>
              <DescriptionListGroup>
                <DescriptionListTerm>Duration Window</DescriptionListTerm>
                <DescriptionListDescription>60 seconds</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );

  const renderYAMLTab = () => (
    <Card>
      <CardBody>
        <CodeBlock>
          <CodeBlockCode>{yamlContent}</CodeBlockCode>
        </CodeBlock>
      </CardBody>
    </Card>
  );

  const renderAnalyticsTab = () => (
    <div>
      <div style={{ marginBottom: 'var(--pf-t--global--spacer--2xl)' }}>
        <p style={{ color: 'var(--pf-t--global--text--color--subtle)', fontSize: 'var(--pf-t--global--font--size--body--default)', marginBottom: 'var(--pf-t--global--spacer--lg)' }}>
          Monitor token-based rate limiting and consumption
        </p>
        
        <Grid hasGutter style={{ marginBottom: 'var(--pf-t--global--spacer--3xl)' }}>
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--lg)' }}>
                <div style={{ fontSize: 'var(--pf-t--global--font--size--heading--h2)', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  12,340
                </div>
                <div style={{ fontSize: 'var(--pf-t--global--font--size--body--default)', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  Token Requests/min
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--pf-t--global--spacer--xs)' }}>
                  <Icon>
                    <ArrowUpIcon color="var(--pf-t--global--color--status--success--100)" />
                  </Icon>
                  <span style={{ color: 'var(--pf-t--global--color--status--success--100)', fontSize: 'var(--pf-t--global--font--size--body--default)' }}>
                    +15%
                  </span>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--lg)' }}>
                <div style={{ fontSize: 'var(--pf-t--global--font--size--heading--h2)', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  890/min
                </div>
                <div style={{ fontSize: 'var(--pf-t--global--font--size--body--default)', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  Token Consumption Rate
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--pf-t--global--spacer--xs)' }}>
                  <Icon>
                    <ArrowUpIcon color="var(--pf-t--global--color--status--success--100)" />
                  </Icon>
                  <span style={{ color: 'var(--pf-t--global--color--status--success--100)', fontSize: 'var(--pf-t--global--font--size--body--default)' }}>
                    +8%
                  </span>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--lg)' }}>
                <div style={{ fontSize: 'var(--pf-t--global--font--size--heading--h2)', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  67
                </div>
                <div style={{ fontSize: 'var(--pf-t--global--font--size--body--default)', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  Rate Limited Tokens
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--pf-t--global--spacer--xs)' }}>
                  <Icon>
                    <ArrowUpIcon color="var(--pf-t--global--color--status--warning--200)" />
                  </Icon>
                  <span style={{ color: 'var(--pf-t--global--color--status--warning--200)', fontSize: 'var(--pf-t--global--font--size--body--default)' }}>
                    +23%
                  </span>
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <Card>
              <CardBody style={{ textAlign: 'center', padding: 'var(--pf-t--global--spacer--lg)' }}>
                <div style={{ fontSize: 'var(--pf-t--global--font--size--heading--h2)', fontWeight: 'bold', color: 'var(--pf-t--global--text--color--regular)', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  45ms
                </div>
                <div style={{ fontSize: 'var(--pf-t--global--font--size--body--default)', color: 'var(--pf-t--global--text--color--subtle)', marginBottom: 'var(--pf-t--global--spacer--sm)' }}>
                  Avg Token Latency
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--pf-t--global--spacer--xs)' }}>
                  <Icon>
                    <ArrowDownIcon color="var(--pf-t--global--color--status--success--100)" />
                  </Icon>
                  <span style={{ color: 'var(--pf-t--global--color--status--success--100)', fontSize: 'var(--pf-t--global--font--size--body--default)' }}>
                    -2ms
                  </span>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </div>
      
      <Card>
        <CardBody>
          <BarChart 
            title="Token Rate Limit Hits by Time Window" 
            data={[]}
          />
        </CardBody>
      </Card>
    </div>
  );

  return (
    <>
      <PageSection variant="light">
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={onBack} isInline>
              Policies
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>
            {policyName}
          </BreadcrumbItem>
        </Breadcrumb>
        
        <Title headingLevel="h1" size="2xl" style={{ marginTop: '16px' }}>
          {policyName}
        </Title>
        
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          style={{ marginTop: '24px' }}
        >
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} />
          <Tab eventKey="yaml" title={<TabTitleText>YAML</TabTitleText>} />
          <Tab eventKey="analytics" title={<TabTitleText>Analytics</TabTitleText>} />
        </Tabs>
      </PageSection>
      
      <PageSection>
        {activeTabKey === 'details' && renderDetailsTab()}
        {activeTabKey === 'yaml' && renderYAMLTab()}
        {activeTabKey === 'analytics' && renderAnalyticsTab()}
      </PageSection>
    </>
  );
};

export default PolicyDetailsPage; 