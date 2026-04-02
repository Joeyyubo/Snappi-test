import React from 'react';
import { PageSection, Title } from '@patternfly/react-core';

const ServiceMeshPage = () => (
  <>
    <PageSection variant="light">
      <Title headingLevel="h1" size="2xl">
        Service mesh
      </Title>
      <p
        style={{
          marginTop: 'var(--pf-t--global--spacer--sm)',
          color: 'var(--pf-t--global--text--color--subtle)',
          maxWidth: 'min(100%, 40rem)'
        }}
      >
        Service mesh overview and management (placeholder for upcoming UX).
      </p>
    </PageSection>
    <PageSection>
      <p style={{ color: 'var(--pf-t--global--text--color--regular)' }}>
        Mesh topology, namespaces, and control plane details will go here.
      </p>
    </PageSection>
  </>
);

export default ServiceMeshPage;
