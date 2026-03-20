# RHCL dev portal feature

A React application for the RHCL developer portal console experience using PatternFly 6, including Kuadrant-style overview and related flows (OpenShift console plugin prototype).

## Git remote (after renaming on GitHub)

GitHub **repository names cannot contain spaces**. Use a URL-safe slug such as **`rhcl-dev-portal-feature`**, then point your local `origin` at the new URL:

```bash
git remote set-url origin git@github.com:Joeyyubo/rhcl-dev-portal-feature.git
```

(Replace `Joeyyubo` / repo slug if yours differ.)

## Features

- **Authentic Layout**: Reproduces the exact layout from the OpenShift console with navigation sidebar and header
- **PatternFly 6 Components**: Uses the latest PatternFly 6 design system components
- **Responsive Design**: Mobile-first responsive layout following PatternFly guidelines
- **Interactive Elements**: Functional search, sorting, and navigation components
- **Gateway Management**: Overview cards and detailed traffic distribution table

## Components

### Main Sections

1. **Navigation & Layout**
   - Left sidebar with collapsible navigation
   - Top masthead with brand, tools, and user menu
   - OpenShift-style navigation structure

2. **Kuadrant Overview**
   - Getting started resource cards
   - Feature highlights
   - Enhancement recommendations

3. **Gateway Metrics**
   - Total Gateways count
   - Healthy Gateways with success indicator
   - Unhealthy Gateways with warning indicator

4. **Gateway Traffic Distribution**
   - Searchable and sortable data table
   - Status indicators and labels
   - Action dropdowns for each gateway

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## Design Guidelines

This application follows **PatternFly 6** design principles and aims to align with the **OpenShift console** (RH console plugin patterns):

- **No ad-hoc hex / RGB in UI**: Prefer `--pf-t--*` CSS variables for color, spacing, typography, borders, and shadows (see [PatternFly design tokens](https://www.patternfly.org/tokens/all-tokens)).
- **Shared helpers**: `src/styles/pf6Tokens.js` exports a small `pf` object (semantic colors, `space`, `font`) for inline styles and mock charts.
- **Components first**: Use `@patternfly/react-core` / `react-table` / `react-icons` instead of custom controls where possible.
- **Consistent spacing**: `var(--pf-t--global--spacer--*)` instead of raw `px` for margins/padding/gaps.
- **Typography**: `var(--pf-t--global--font--size--body--default|sm|…)` and `var(--pf-t--global--font--weight--body--bold)` instead of hardcoded `px` / `bold`.
- **Semantic color**: Text (`text--color--regular|subtle|link--default`), status (`color--status--success|warning|danger|info--*`), borders (`border--color--default`), backgrounds (`background--color--primary--default|secondary--default|100`).

> **Note:** Some large wizard pages still contain legacy hex values; new UI should use tokens or `pf` from `pf6Tokens.js`.

- **Accessibility**: Prefer PatternFly components to inherit WCAG-oriented behavior from the design system.

## Project Structure

```
src/
├── styles/
│   └── pf6Tokens.js           # PF6 semantic tokens helper (inline styles / charts)
├── components/
│   ├── KuadrantOverview.js    # Main overview page
│   ├── GatewayMetrics.js      # Gateway metrics cards
│   └── GatewayTable.js        # Traffic distribution table
├── App.js                     # Main application with layout
└── index.js                   # Application entry point
```

## Technologies Used

- **React 18**: Modern React with hooks
- **PatternFly 6**: Latest version of Red Hat's design system
- **Webpack**: Module bundler and dev server
- **Babel**: JavaScript compiler for modern syntax

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Apache 2.0 