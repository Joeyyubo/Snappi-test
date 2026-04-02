import React, { useMemo } from 'react';
import {
  PageSection,
  Title,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Grid,
  GridItem,
  Flex,
  Label,
  Content
} from '@patternfly/react-core';
import { ChartLineIcon, DatabaseIcon, ExclamationTriangleIcon } from '@patternfly/react-icons';
import { pf, borderDefaultStyle } from '../styles/pf6Tokens';

/** Mock time series: requests per minute (last 12 intervals). */
const REQUEST_RATE_POINTS = [42, 55, 48, 72, 68, 81, 76, 90, 85, 94, 88, 102];

/** Mock latency percentiles (ms). */
const LATENCY_BARS = [
  { label: 'p50', value: 12, max: 100 },
  { label: 'p95', value: 48, max: 100 },
  { label: 'p99', value: 78, max: 100 }
];

/** Mock traffic outcome split (sum 100). */
const ERROR_BUDGET = { success: 97.4, client4xx: 1.8, server5xx: 0.8 };

/** Mock hourly error rate sparkline (0–100 scale for chart height). */
const ERROR_SPARK = [8, 6, 12, 9, 15, 11, 7, 5, 4, 6, 8, 5];

function buildAreaPath(values, width, height, padY) {
  const n = values.length;
  if (n < 2) return { line: '', area: '' };
  const maxV = Math.max(...values, 1);
  const minV = 0;
  const innerH = height - padY * 2;
  const step = width / (n - 1);
  const toY = (v) => padY + innerH - ((v - minV) / (maxV - minV)) * innerH;
  let line = '';
  let area = `0,${height} `;
  values.forEach((v, i) => {
    const x = i * step;
    const y = toY(v);
    line += `${i === 0 ? 'M' : 'L'}${x},${y} `;
    area += `${x},${y} `;
  });
  area += `${width},${height} Z`;
  return { line: line.trim(), area };
}

function buildSparkPaths(values, width, height) {
  const n = values.length;
  if (n < 2) return { line: '', area: '' };
  const maxV = Math.max(...values, 1);
  const pad = 4;
  const innerH = height - pad * 2;
  const step = width / (n - 1);
  let line = '';
  let area = `M 0,${height} `;
  values.forEach((v, i) => {
    const x = i * step;
    const y = pad + innerH - (v / maxV) * innerH;
    line += `${i === 0 ? 'M' : 'L'}${x},${y} `;
    area += `L ${x},${y} `;
  });
  area += `L ${width},${height} Z`;
  return { line: line.trim(), area: area.trim() };
}

const RequestRateCard = ({ gradId }) => {
  const w = 320;
  const h = 120;
  const padY = 8;
  const { line, area } = useMemo(
    () => buildAreaPath(REQUEST_RATE_POINTS, w, h, padY),
    []
  );

  return (
    <Card isFullHeight>
      <CardHeader>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsCenter' }}
          flexWrap={{ default: 'nowrap' }}
        >
          <CardTitle>
            <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
              <ChartLineIcon style={{ color: pf.color.brand }} />
              Request rate
            </Flex>
          </CardTitle>
          <Label color="blue" isCompact>
            Demo data
          </Label>
        </Flex>
      </CardHeader>
      <CardBody>
        <Content>
          <small style={{ color: pf.color.textSubtle }}>Requests per minute · last hour (simulated)</small>
        </Content>
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ marginTop: pf.space.md }}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: pf.color.brand, stopOpacity: 0.35 }} />
              <stop offset="100%" style={{ stopColor: pf.color.brand, stopOpacity: 0.02 }} />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gradId})`} stroke="none" />
          <path
            d={line}
            fill="none"
            stroke={pf.color.brand}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          style={{ marginTop: pf.space.sm, fontSize: pf.font.bodySm, color: pf.color.textSubtle }}
        >
          <span>Min {Math.min(...REQUEST_RATE_POINTS)} rpm</span>
          <span>Max {Math.max(...REQUEST_RATE_POINTS)} rpm</span>
        </Flex>
      </CardBody>
    </Card>
  );
};

const LatencyBarsCard = () => (
  <Card isFullHeight>
    <CardHeader>
      <CardTitle>
        <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
          <DatabaseIcon style={{ color: pf.color.info }} />
          Latency
        </Flex>
      </CardTitle>
    </CardHeader>
    <CardBody>
      <Content>
        <small style={{ color: pf.color.textSubtle }}>Gateway round-trip · milliseconds (simulated)</small>
      </Content>
      <div style={{ marginTop: pf.space.lg }}>
        {LATENCY_BARS.map((row) => (
          <div key={row.label} style={{ marginBottom: pf.space.md }}>
            <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }} style={{ marginBottom: pf.space.xs }}>
              <span style={{ fontSize: pf.font.bodySm, fontWeight: pf.font.weightBold }}>{row.label}</span>
              <span style={{ fontSize: pf.font.bodySm, color: pf.color.textSubtle }}>{row.value} ms</span>
            </Flex>
            <div
              style={{
                height: pf.space.md,
                borderRadius: 'var(--pf-t--global--border--radius--small)',
                background: pf.color.bg100,
                overflow: 'hidden',
                border: borderDefaultStyle
              }}
            >
              <div
                style={{
                  width: `${(row.value / row.max) * 100}%`,
                  height: '100%',
                  background: pf.color.info,
                  transition: 'width 0.2s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </CardBody>
  </Card>
);

const TrafficOutcomeCard = () => {
  const r = 52;
  const c = 70;
  const stroke = 18;
  const circumference = 2 * Math.PI * r;
  const seg = (pct) => (pct / 100) * circumference;

  const dashSuccess = seg(ERROR_BUDGET.success);
  const dash4xx = seg(ERROR_BUDGET.client4xx);
  const dash5xx = seg(ERROR_BUDGET.server5xx);

  return (
    <Card isFullHeight>
      <CardHeader>
        <CardTitle>
          <Flex alignItems={{ default: 'alignItemsCenter' }} gap={{ default: 'gapSm' }}>
            <ExclamationTriangleIcon style={{ color: pf.color.warning }} />
            Traffic outcome
          </Flex>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Flex justifyContent={{ default: 'justifyContentCenter' }} style={{ marginTop: pf.space.sm }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={pf.color.borderSubtle}
              strokeWidth={stroke}
            />
            <circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={pf.color.success}
              strokeWidth={stroke}
              strokeDasharray={`${dashSuccess} ${circumference}`}
              strokeDashoffset="0"
              transform={`rotate(-90 ${c} ${c})`}
            />
            <circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={pf.color.warning}
              strokeWidth={stroke}
              strokeDasharray={`${dash4xx} ${circumference}`}
              strokeDashoffset={-dashSuccess}
              transform={`rotate(-90 ${c} ${c})`}
            />
            <circle
              cx={c}
              cy={c}
              r={r}
              fill="none"
              stroke={pf.color.danger}
              strokeWidth={stroke}
              strokeDasharray={`${dash5xx} ${circumference}`}
              strokeDashoffset={-(dashSuccess + dash4xx)}
              transform={`rotate(-90 ${c} ${c})`}
            />
            <text
              x={c}
              y={c - 4}
              textAnchor="middle"
              style={{
                fontSize: pf.font.headingMd,
                fontWeight: pf.font.weightBold,
                fill: pf.color.textRegular
              }}
            >
              {ERROR_BUDGET.success}%
            </text>
            <text
              x={c}
              y={c + 14}
              textAnchor="middle"
              style={{ fontSize: pf.font.bodySm, fill: pf.color.textSubtle }}
            >
              2xx success
            </text>
          </svg>
        </Flex>
        <Flex
          direction={{ default: 'column' }}
          gap={{ default: 'gapSm' }}
          style={{ marginTop: pf.space.lg, fontSize: pf.font.bodySm }}
        >
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <span style={{ color: pf.color.textSubtle }}>
              <span style={{ color: pf.color.success, fontWeight: pf.font.weightBold }}>●</span> 2xx / 3xx
            </span>
            <span>{ERROR_BUDGET.success}%</span>
          </Flex>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <span style={{ color: pf.color.textSubtle }}>
              <span style={{ color: pf.color.warning, fontWeight: pf.font.weightBold }}>●</span> 4xx
            </span>
            <span>{ERROR_BUDGET.client4xx}%</span>
          </Flex>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <span style={{ color: pf.color.textSubtle }}>
              <span style={{ color: pf.color.danger, fontWeight: pf.font.weightBold }}>●</span> 5xx
            </span>
            <span>{ERROR_BUDGET.server5xx}%</span>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

const ErrorRateSparkCard = ({ sparkId }) => {
  const w = 280;
  const h = 64;
  const { line, area } = useMemo(() => buildSparkPaths(ERROR_SPARK, w, h), []);

  return (
    <Card isFullHeight>
      <CardHeader>
        <CardTitle>Error rate trend</CardTitle>
      </CardHeader>
      <CardBody>
        <Content>
          <small style={{ color: pf.color.textSubtle }}>Relative error signal · last 12 hours (simulated)</small>
        </Content>
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ marginTop: pf.space.md }}>
          <defs>
            <linearGradient id={sparkId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: pf.color.danger, stopOpacity: 0.25 }} />
              <stop offset="100%" style={{ stopColor: pf.color.danger, stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${sparkId})`} stroke="none" />
          <path d={line} fill="none" stroke={pf.color.danger} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </CardBody>
    </Card>
  );
};

const ObservabilityPage = () => {
  const areaGradId = 'observability-request-area';
  const sparkGradId = 'observability-error-spark';

  return (
    <>
      <PageSection variant="light">
        <Title headingLevel="h1" size="2xl">
          Observability
        </Title>
        <p
          style={{
            marginTop: pf.space.sm,
            color: pf.color.textSubtle,
            maxWidth: 'min(100%, 40rem)'
          }}
        >
          Simulated metrics and charts for API traffic health. Layout follows PatternFly cards and design tokens
          (<code style={{ fontSize: pf.font.bodySm }}>pf6Tokens</code>), consistent with the developer portal
          prototype.
        </p>
      </PageSection>
      <PageSection>
        <Grid hasGutter>
          <GridItem span={12} md={8}>
            <RequestRateCard gradId={areaGradId} />
          </GridItem>
          <GridItem span={12} md={4}>
            <TrafficOutcomeCard />
          </GridItem>
          <GridItem span={12} md={6}>
            <LatencyBarsCard />
          </GridItem>
          <GridItem span={12} md={6}>
            <ErrorRateSparkCard sparkId={sparkGradId} />
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export default ObservabilityPage;
