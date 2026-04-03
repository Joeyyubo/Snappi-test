import React from 'react';
import {
  PageSection,
  Title,
  Button,
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Text,
  TextContent,
  List,
  ListItem,
  Split,
  SplitItem
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
    title: '秒级上线节奏',
    body: '从草稿到可观测的生产路径，Toto 把发布流水线收成一条顺滑曲线，团队少开会、多交付。'
  },
  {
    icon: ChartLineIcon,
    title: '指标讲人话',
    body: '把延迟、错误率与业务事件叠在同一张叙事里，值班同学一眼知道该先救哪一段链路。'
  },
  {
    icon: ShieldAltIcon,
    title: '默认安全姿态',
    body: '密钥轮换、最小权限与审计轨迹开箱可用；合规检查从「补材料」变成「点通过」。'
  },
  {
    icon: AutomationIcon,
    title: '自动化玩伴',
    body: '策略模板、回滚剧本与告警降噪规则可复用，新同事复制粘贴也能跑出老炮效果。'
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
          <TextContent>
            <Title headingLevel="h1" size="4xl">
              Toto — 为忙碌团队准备的控制台伴侣
            </Title>
            <Text
              component="p"
              style={{
                marginTop: pf.space.md,
                fontSize: pf.font.bodyDefault,
                color: pf.color.textSubtle,
                maxWidth: 'min(100%, 36rem)'
              }}
            >
              想象一下：周一早晨咖啡还没凉，你已经能在同一块玻璃里看到流量、策略与审批状态。
              Toto 不承诺魔法，只承诺把重复点击变成可复用的习惯。
            </Text>
          </TextContent>
          <div style={{ marginTop: pf.space.xl, display: 'flex', flexWrap: 'wrap', gap: pf.space.sm }}>
            <Button variant="primary">预约演示</Button>
            <Button variant="secondary">下载一页简介</Button>
          </div>
          <List
            component="ul"
            style={{ marginTop: pf.space['2xl'], color: pf.color.textSubtle, fontSize: pf.font.bodySm }}
          >
            <ListItem>14 天试用 · 无需信用卡</ListItem>
            <ListItem>可与现有网关与控制面并存</ListItem>
            <ListItem>支持私有化与分区部署</ListItem>
          </List>
        </SplitItem>
        <SplitItem>
          <HeroIllustration />
        </SplitItem>
      </Split>
    </PageSection>

    <PageSection isWidthLimited>
      <Title headingLevel="h2" size="xl" style={{ marginBottom: pf.space.lg }}>
        为什么团队会留下 Toto
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
                <Text component="p" style={{ marginTop: pf.space.sm, color: pf.color.textSubtle }}>
                  {body}
                </Text>
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
            客户原声（示例摘录）
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
            「以前我们要在三个标签页里拼出一幅图，现在 Toto 把故事讲完了。周五下午终于能准时消失。」
          </blockquote>
          <Text component="p" style={{ marginTop: pf.space.sm, color: pf.color.textSubtle, fontSize: pf.font.bodySm }}>
            — 某金融科技平台 SRE 负责人，代号「北极狐」
          </Text>
        </SplitItem>
        <SplitItem style={{ minWidth: 'min(100%, 14rem)' }}>
          <Card>
            <CardBody>
              <TextContent>
                <Title headingLevel="h4" size="md">
                  今日随机数据
                </Title>
                <Text component="p" style={{ marginTop: pf.space.sm }}>
                  <strong>99.982%</strong> 周可用性（演示）
                </Text>
                <Text component="p" style={{ color: pf.color.textSubtle, fontSize: pf.font.bodySm }}>
                  平均审批耗时 <strong>11 分 07 秒</strong> · 告警误报下降 <strong>37%</strong>（均为虚构示例）
                </Text>
              </TextContent>
            </CardBody>
          </Card>
        </SplitItem>
      </Split>
    </PageSection>
  </>
);

export default TotoPage;
