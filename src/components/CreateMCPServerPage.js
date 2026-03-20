import React from 'react';
import {
  PageSection,
  Title,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  CardTitle
} from '@patternfly/react-core';
import {
  PlusIcon,
  UploadIcon,
  SearchIcon
} from '@patternfly/react-icons';

const CreateMCPServerPage = ({ onBack, onCancel, onMCPServerPage }) => {
  const handleMethodSelect = (method) => {
    if (onMCPServerPage) {
      onMCPServerPage(method);
    }
  };

  return (
    <>
      <PageSection variant="light">
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={onBack}>
              MCP Servers
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>Connect MCP Server</BreadcrumbItem>
        </Breadcrumb>
        
        <Title headingLevel="h1" size="2xl" style={{ marginTop: '16px' }}>
          Connect MCP Server
        </Title>
      </PageSection>
      
      <PageSection>
        <Grid hasGutter>
          <GridItem span={4}>
            <Card isHoverable onClick={() => handleMethodSelect('template')} style={{ cursor: 'pointer' }}>
              <CardHeader>
                <CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <PlusIcon
                      style={{
                        marginRight: 'var(--pf-t--global--spacer--sm)',
                        color: 'var(--pf-t--global--text--color--link--default)'
                      }}
                    />
                    Connect via Template
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div>
                  <p>
                    Connect to an MCP server step by step using our guided template wizard.
                    Configure server details, authentication, and security settings.
                  </p>
                </div>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={4}>
            <Card isHoverable onClick={() => handleMethodSelect('config')} style={{ cursor: 'pointer' }}>
              <CardHeader>
                <CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UploadIcon
                      style={{
                        marginRight: 'var(--pf-t--global--spacer--sm)',
                        color: 'var(--pf-t--global--text--color--link--default)'
                      }}
                    />
                    Connect via Config File
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div>
                  <p>
                    Upload a JSON or YAML configuration file containing external MCP server information.
                    Import existing server configurations quickly and easily.
                  </p>
                </div>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={4}>
            <Card isHoverable onClick={() => handleMethodSelect('discovery')} style={{ cursor: 'pointer' }}>
              <CardHeader>
                <CardTitle>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SearchIcon
                      style={{
                        marginRight: 'var(--pf-t--global--spacer--sm)',
                        color: 'var(--pf-t--global--text--color--link--default)'
                      }}
                    />
                    Connect via Discovery
                  </div>
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div>
                  <p>
                    Automatically discover and register MCP servers in your network or cluster.
                    Scan for available servers and select which ones to register.
                  </p>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </PageSection>
    </>
  );
};

export default CreateMCPServerPage;
