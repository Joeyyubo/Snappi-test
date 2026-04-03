import React from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Content,
  ContentVariants,
  Split,
  SplitItem,
  Stack
} from '@patternfly/react-core';
import {
  RocketIcon,
  ChartLineIcon,
  ShieldAltIcon,
  AutomationIcon
} from '@patternfly/react-icons';
import { pf, borderDefaultStyle } from '../styles/pf6Tokens';

const HeroIllustration = () => (
  <svg
    width="320"
    height="240"
    viewBox="0 0 320 240"
    aria-hidden
    style={{ maxWidth: '100%', height: 'auto' }}
  >
    <defs>
      <linearGradient id="toto-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="var(--pf-t--global--color--brand--200)" stopOpacity="0.35" />
        <stop offset="100%" stopColor="var(--pf-t--global--color--status--info--100)" stopOpacity="0.45" />
      </linearGradient>
    </defs>
    <rect x="24" y="40" width="272" height="160" rx="16" fill="url(#toto-grad)" />
    <circle cx="88" cy="108" r="36" fill="var(--pf-t--global--color--brand--200)" opacity="0.25" />
    <rect
      x="152"
      y="76"
      width="120"
      height="20"
      rx="4"
      fill="var(--pf-t--global--border--color--default)"
      opacity="0.35"
    />
    <rect
      x="152"
      y="108"
      width="96"
      height="14"
      rx="3"
      fill="var(--pf-t--global--text--color--subtle)"
      opacity="0.25"
    />
    <rect
      x="152"
      y="132"
      width="72"
      height="14"
      rx="3"
      fill="var(--pf-t--global--text--color--subtle)"
      opacity="0.18"
    />
    <path
      d="M56 184 L120 152 L168 168 L264 120"
      fill="none"
      stroke="var(--pf-t--global--color--status--success--100)"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.6"
    />
  </svg>
);

const featureCards = [
  {
    icon: RocketIcon,
    title: 'Ship in minutes, not meetings',
    body: 'Toto turns the path from draft to observable production into a single smooth curve—fewer status meetings, more shipped work.'
  },
  {
    icon: ChartLineIcon,
    title: 'Metrics that read like a story',
    body: 'Latency, errors, and business signals live in one narrative so on-call knows which part of the chain to fix first.'
  },
  {
    icon: ShieldAltIcon,
    title: 'Secure by default',
    body: 'Key rotation, least privilege, and audit trails are ready out of the box—compliance shifts from chasing paperwork to clicking approve.'
  },
  {
    icon: AutomationIcon,
    title: 'Automation you can reuse',
    body: 'Policy templates, rollback playbooks, and alert-noise rules are copy-paste friendly—even new teammates can run like veterans.'
  }
];

const TotoPage = () => (
  <>
    <PageSection
      isWidthLimited
      style={{
        background: `linear-gradient(
          135deg,
          var(--pf-t--global--background--color--secondary--default) 0%,
          var(--pf-t--global--background--color--100) 55%,
          var(--pf-t--global--background--color--primary--default) 100%
        )`,
        borderBottom: borderDefaultStyle
      }}
    >
      <Split hasGutter>
        <SplitItem isFilled>
          <Stack hasGutter>
            <Title headingLevel="h1" size="4xl">
              Toto — a console companion for busy teams
            </Title>
            <Content
              component={ContentVariants.p}
              style={{
                fontSize: pf.font.bodyDefault,
                color: pf.color.textSubtle,
                maxWidth: 'min(100%, 36rem)'
              }}
            >
              Picture this: before your Monday coffee cools, you already see traffic, policy, and approvals in one pane of glass.
              Toto does not promise magic—only fewer repeated clicks and habits you can reuse.
            </Content>
          </Stack>
        </SplitItem>
        <SplitItem>
          <HeroIllustration />
        </SplitItem>
      </Split>
    </PageSection>

    <PageSection isWidthLimited>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: pf.space.lg }}>
        Why teams stick with Toto
      </Title>
      <Grid hasGutter>
        {featureCards.map(({ icon: Icon, title, body }) => (
          <GridItem key={title} span={12} md={6} lg={3}>
            <Card isFullHeight>
              <CardBody>
                <Icon
                  style={{
                    color: 'var(--pf-t--global--color--brand--200)',
                    width: pf.icon.sizeBody,
                    height: pf.icon.sizeBody,
                    marginBottom: pf.space.sm
                  }}
                />
                <CardTitle>{title}</CardTitle>
                <Content
                  component={ContentVariants.p}
                  style={{ marginTop: pf.space.sm, color: pf.color.textSubtle }}
                >
                  {body}
                </Content>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </PageSection>

    <PageSection
      variant="secondary"
      isWidthLimited
      style={{ borderTop: `var(--pf-t--global--border--width--regular) solid ${pf.color.borderSubtle}` }}
    >
      <Split hasGutter>
        <SplitItem isFilled>
          <Title headingLevel="h2" size="lg">
            Customer voice (sample)
          </Title>
          <blockquote
            style={{
              margin: `${pf.space.md} 0 0`,
              paddingLeft: pf.space.md,
              borderLeft: `4px solid var(--pf-t--global--color--brand--200)`,
              color: pf.color.textRegular,
              fontStyle: 'italic'
            }}
          >
            &ldquo;We used to stitch three browser tabs into one mental model. Toto tells the story for us. Friday afternoons are
            human again.&rdquo;
          </blockquote>
          <Content
            component={ContentVariants.p}
            style={{ marginTop: pf.space.sm, color: pf.color.textSubtle, fontSize: pf.font.bodySm }}
          >
            — Head of SRE, fictional fintech platform (&ldquo;Arctic Fox&rdquo;)
          </Content>
        </SplitItem>
        <SplitItem style={{ minWidth: 'min(100%, 14rem)' }}>
          <Card>
            <CardBody>
              <Stack hasGutter>
                <Title headingLevel="h4" size="md">
                  Snapshot numbers
                </Title>
                <Content component={ContentVariants.p} style={{ marginTop: pf.space.sm }}>
                  <strong>99.982%</strong> weekly availability (demo)
                </Content>
                <Content
                  component={ContentVariants.p}
                  style={{ color: pf.color.textSubtle, fontSize: pf.font.bodySm }}
                >
                  Mean approval time <strong>11m 07s</strong> · noisy alerts down <strong>37%</strong> (illustrative only)
                </Content>
              </Stack>
            </CardBody>
          </Card>
        </SplitItem>
      </Split>
    </PageSection>
  </>
);

export default TotoPage;
