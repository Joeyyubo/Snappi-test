import React, { useState } from 'react';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Flex,
  FlexItem,
  Tabs,
  Tab,
  TabTitleText,
  Grid,
  GridItem,
  Card,
  CardTitle,
  CardBody,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Label,
  Icon,
  Tooltip,
  CodeBlock,
  CodeBlockCode,
  Alert,
  AlertVariant
} from '@patternfly/react-core';
import {
  CheckCircleIcon,
  PendingIcon,
  ExclamationCircleIcon,
  CopyIcon,
  TimesIcon
} from '@patternfly/react-icons';
import { getTierTooltipText } from '../data/apiCredentialsModel';
import { renderApiKeyField } from './apiKeyFieldDisplay';
import { ApiKeyNameText } from './ApiKeyNameText';

const CURL_EXAMPLE = `curl -X GET "https://api.example.com/v1/resource" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`;

const NODE_EXAMPLE = `const res = await fetch('https://api.example.com/v1/resource', {
  headers: {
    Authorization: 'Bearer YOUR_API_KEY',
    Accept: 'application/json'
  }
});
const data = await res.json();`;

const PYTHON_EXAMPLE = `import requests

r = requests.get(
    'https://api.example.com/v1/resource',
    headers={'Authorization': 'Bearer YOUR_API_KEY', 'Accept': 'application/json'}
)
print(r.json())`;

const GO_EXAMPLE = `req, _ := http.NewRequest("GET", "https://api.example.com/v1/resource", nil)
req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
req.Header.Set("Accept", "application/json")
client := &http.Client{}
resp, _ := client.Do(req)`;

const renderStatus = (status) => {
  const isActive = status === 'Active';
  const isPending = status === 'Pending';
  const iconStatus = isActive ? 'success' : isPending ? 'info' : 'danger';
  const StatusIcon = isActive ? CheckCircleIcon : isPending ? PendingIcon : ExclamationCircleIcon;
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

const TokiDetailPage = ({
  credential,
  onBack,
  revealedKeyIds,
  onOpenRevealModal,
  onOpenEdit,
  onOpenDelete,
  /** 'my-api-keys' | 'api-catalog' — catalog flow: Roni catalog → Roni product → Toki name */
  breadcrumbSource = 'my-api-keys',
  catalogApiName,
  onNavigateToApiCatalog,
  onNavigateToParentApi,
  /** Rejected: open Request Toki modal on current page */
  onRequestNewApiKey,
  requestSubmitSuccessAlert = false,
  onDismissRequestSubmitSuccessAlert
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [usageLang, setUsageLang] = useState('curl');
  const [copyTip, setCopyTip] = useState('Copy to clipboard');

  if (!credential) {
    return null;
  }

  const { name, owner, api, status, tier, requestedTime, rejectionReason, apiKeyState, useCase } = credential;
  const tierTooltipText = getTierTooltipText(tier);
  const revealedSet = revealedKeyIds instanceof Set ? revealedKeyIds : new Set();
  const codeByLang = {
    curl: CURL_EXAMPLE,
    node: NODE_EXAMPLE,
    python: PYTHON_EXAMPLE,
    go: GO_EXAMPLE
  };
  const activeCode = codeByLang[usageLang] || CURL_EXAMPLE;
  const showUsageExamples = status === 'Active';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopyTip('Copied!');
      setTimeout(() => setCopyTip('Copy to clipboard'), 2000);
    } catch {
      setCopyTip('Copy failed');
    }
  };

  return (
    <>
      <style>{`
        /* PF breadcrumb items default to nowrap, which truncates long active labels */
        .toki-detail-breadcrumb .pf-v6-c-breadcrumb__item:last-child {
          white-space: normal;
          max-width: 100%;
        }
      `}</style>
      <PageSection variant="light">
        {requestSubmitSuccessAlert && (
          <Alert
            variant={AlertVariant.success}
            isInline
            isLiveRegion
            title="Toki requested successfully"
            timeout={8000}
            onTimeout={() => onDismissRequestSubmitSuccessAlert?.()}
            actionClose={
              <Button
                variant="plain"
                onClick={() => onDismissRequestSubmitSuccessAlert?.()}
                aria-label="Dismiss notification"
                icon={<TimesIcon />}
              />
            }
            style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
          />
        )}
        <Breadcrumb className="toki-detail-breadcrumb" style={{ flexWrap: 'wrap' }}>
          {breadcrumbSource === 'api-catalog' ? (
            <>
              <BreadcrumbItem>
                <Button variant="link" onClick={onNavigateToApiCatalog} isInline>
                  Roni catalog
                </Button>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Button variant="link" onClick={onNavigateToParentApi} isInline>
                  {catalogApiName || api}
                </Button>
              </BreadcrumbItem>
              <BreadcrumbItem
                isActive
                style={{
                  maxWidth: 'none',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere'
                }}
              >
                <ApiKeyNameText name={name} truncate={false} />
              </BreadcrumbItem>
            </>
          ) : (
            <>
              <BreadcrumbItem>
                <Button variant="link" onClick={onBack} isInline>
                  My Toki
                </Button>
              </BreadcrumbItem>
              <BreadcrumbItem
                isActive
                style={{
                  maxWidth: 'none',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere'
                }}
              >
                <ApiKeyNameText name={name} truncate={false} />
              </BreadcrumbItem>
            </>
          )}
        </Breadcrumb>

        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsFlexStart' }}
          style={{ marginTop: '16px' }}
        >
          <FlexItem grow={{ default: 'grow' }} style={{ minWidth: 0 }}>
            <Flex
              alignItems={{ default: 'alignItemsCenter' }}
              gap={{ default: 'gapMd' }}
              flexWrap={{ default: 'wrap' }}
            >
              <Title
                headingLevel="h1"
                size="2xl"
                style={{
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  marginBlock: 0
                }}
              >
                <ApiKeyNameText name={name} truncate={false} />
              </Title>
              <FlexItem style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                {renderStatus(status)}
              </FlexItem>
            </Flex>
          </FlexItem>
          <FlexItem>
            <Flex gap={{ default: 'gapSm' }}>
              {status !== 'Rejected' && (
                <Button variant="secondary" onClick={() => onOpenEdit?.(credential)}>
                  Edit
                </Button>
              )}
              <Button variant="secondary" isDanger onClick={() => onOpenDelete?.(credential)}>
                Delete
              </Button>
            </Flex>
          </FlexItem>
        </Flex>

        <Tabs activeKey={activeTab} onSelect={(_, k) => setActiveTab(k)} style={{ marginTop: '24px' }}>
          <Tab eventKey="details" title={<TabTitleText>Details</TabTitleText>} />
        </Tabs>
      </PageSection>

      {activeTab === 'details' && (
        <PageSection>
          <Grid hasGutter>
            <GridItem span={12} lg={showUsageExamples ? 6 : 12}>
              <DescriptionList>
                <DescriptionListGroup>
                  <DescriptionListTerm>Toki name</DescriptionListTerm>
                  <DescriptionListDescription
                    style={{
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere'
                    }}
                  >
                    <ApiKeyNameText name={name} truncate={false} />
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Use case</DescriptionListTerm>
                  <DescriptionListDescription>
                    <div
                      style={{
                        maxWidth: 'min(100%, 36rem)',
                        color: 'var(--pf-t--global--text--color--subtle)'
                      }}
                    >
                      {useCase}
                    </div>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Owner</DescriptionListTerm>
                  <DescriptionListDescription>{owner}</DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>API</DescriptionListTerm>
                  <DescriptionListDescription
                    style={{
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere'
                    }}
                  >
                    <Button
                      variant="link"
                      isInline
                      component="a"
                      href="#"
                      style={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        textAlign: 'left',
                        height: 'auto'
                      }}
                    >
                      {api}
                    </Button>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Status</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Flex direction={{ default: 'column' }} gap={{ default: 'gapMd' }} alignItems={{ default: 'alignItemsFlexStart' }}>
                      {renderStatus(status)}
                      {status === 'Rejected' && (
                        <>
                          <div
                            style={{
                              maxWidth: 'min(100%, 36rem)',
                              color: 'var(--pf-t--global--text--color--regular)',
                              fontSize: 'var(--pf-t--global--font--size--body--default)',
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              overflowWrap: 'anywhere'
                            }}
                          >
                            <span style={{ fontWeight: 'var(--pf-t--global--font--weight--body--bold)' }}>
                              Rejection reason:
                            </span>{' '}
                            {rejectionReason || 'No additional details were provided for this rejection.'}
                          </div>
                          <Button variant="link" isInline onClick={() => onRequestNewApiKey?.()}>
                            Request a new Toki
                          </Button>
                        </>
                      )}
                    </Flex>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Tier</DescriptionListTerm>
                  <DescriptionListDescription>
                    <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }} flexWrap={{ default: 'wrap' }}>
                      <Label variant="outline" isCompact>
                        {tier}
                      </Label>
                      <span style={{ color: 'var(--pf-t--global--text--color--subtle)' }}>{tierTooltipText}</span>
                    </Flex>
                  </DescriptionListDescription>
                </DescriptionListGroup>
                {status === 'Active' && (
                  <DescriptionListGroup>
                    <DescriptionListTerm>Toki</DescriptionListTerm>
                    <DescriptionListDescription>
                      {renderApiKeyField({
                        status,
                        rowId: credential.id,
                        apiKeyState,
                        revealedKeyIds: revealedSet,
                        onOpenReveal: onOpenRevealModal,
                        interactive: true
                      })}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                )}
                <DescriptionListGroup>
                  <DescriptionListTerm>Requested time</DescriptionListTerm>
                  <DescriptionListDescription>{requestedTime}</DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </GridItem>

            {showUsageExamples && (
              <GridItem span={12} lg={6} style={{ alignSelf: 'start' }}>
                <Card>
                  <CardTitle>
                    <div>
                      <div>Usage examples</div>
                      <div
                        style={{
                          fontSize: 'var(--pf-t--global--font--size--body--sm)',
                          fontWeight: 400,
                          color: 'var(--pf-t--global--text--color--subtle)',
                          marginTop: '4px'
                        }}
                      >
                        Use these code examples to test the API with your tier key.
                      </div>
                    </div>
                  </CardTitle>
                  <CardBody>
                    <Tabs
                      activeKey={usageLang}
                      onSelect={(_, k) => setUsageLang(k)}
                      variant="secondary"
                      style={{ marginBottom: 'var(--pf-t--global--spacer--md)' }}
                    >
                      <Tab eventKey="curl" title={<TabTitleText>cURL</TabTitleText>} />
                      <Tab eventKey="node" title={<TabTitleText>Node.js</TabTitleText>} />
                      <Tab eventKey="python" title={<TabTitleText>Python</TabTitleText>} />
                      <Tab eventKey="go" title={<TabTitleText>Go</TabTitleText>} />
                    </Tabs>
                    <CodeBlock
                      actions={
                        <Tooltip content={copyTip}>
                          <Button variant="plain" aria-label="Copy code" icon={<CopyIcon />} onClick={handleCopy} />
                        </Tooltip>
                      }
                    >
                      <CodeBlockCode>{activeCode}</CodeBlockCode>
                    </CodeBlock>
                  </CardBody>
                </Card>
              </GridItem>
            )}
          </Grid>
        </PageSection>
      )}
    </>
  );
};

export default TokiDetailPage;
