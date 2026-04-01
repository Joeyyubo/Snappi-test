import React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

const ConnectivityLinkOverviewPage = () => (
  <>
    <PageSection variant="light">
      <Title headingLevel="h1" size="2xl">
        Overview
      </Title>
      <p
        style={{
          marginTop: 'var(--pf-t--global--spacer--sm)',
          color: 'var(--pf-t--global--text--color--subtle)',
          maxWidth: 'min(100%, 40rem)'
        }}
      >
        Connectivity Link — high-level status and entry points (placeholder for upcoming UX).
      </p>
    </PageSection>
    <PageSection>
      <p style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
        Content for this area will go here.
      </p>
    </PageSection>
  </>
);

export default ConnectivityLinkOverviewPage;
