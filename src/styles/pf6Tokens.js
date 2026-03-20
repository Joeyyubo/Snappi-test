/**
 * PatternFly 6 semantic tokens for inline styles (console-aligned).
 * Prefer over hex/RGB and ad-hoc px values.
 */

export const pf = {
  color: {
    textRegular: 'var(--pf-t--global--text--color--regular)',
    textSubtle: 'var(--pf-t--global--text--color--subtle)',
    textLink: 'var(--pf-t--global--text--color--link--default)',
    borderDefault: 'var(--pf-t--global--border--color--default)',
    borderSubtle: 'var(--pf-t--global--border--color--nonstatus--gray--default)',
    bgPrimary: 'var(--pf-t--global--background--color--primary--default)',
    bgSecondary: 'var(--pf-t--global--background--color--secondary--default)',
    bg100: 'var(--pf-t--global--background--color--100)',
    success: 'var(--pf-t--global--color--status--success--100)',
    warning: 'var(--pf-t--global--color--status--warning--200)',
    danger: 'var(--pf-t--global--color--status--danger--100)',
    info: 'var(--pf-t--global--color--status--info--100)',
    brand: 'var(--pf-t--global--color--brand--200)',
    /** Distinct series for charts / legends (semantic palette) */
    series1: 'var(--pf-t--global--color--brand--200)',
    series2: 'var(--pf-t--global--color--status--warning--200)',
    series3: 'var(--pf-t--global--color--status--info--100)',
    series4: 'var(--pf-t--global--color--status--success--100)',
    series5: 'var(--pf-t--global--color--status--danger--100)'
  },
  font: {
    bodySm: 'var(--pf-t--global--font--size--body--sm)',
    bodyDefault: 'var(--pf-t--global--font--size--body--default)',
    weightBold: 'var(--pf-t--global--font--weight--body--bold)',
    /** Emphasis / chart center figures */
    headingMd: 'var(--pf-t--global--font--size--heading--h3)'
  },
  space: {
    xs: 'var(--pf-t--global--spacer--xs)',
    sm: 'var(--pf-t--global--spacer--sm)',
    md: 'var(--pf-t--global--spacer--md)',
    lg: 'var(--pf-t--global--spacer--lg)',
    xl: 'var(--pf-t--global--spacer--xl)',
    '2xl': 'var(--pf-t--global--spacer--2xl)',
    '3xl': 'var(--pf-t--global--spacer--3xl)'
  },
  icon: {
    sizeBody: 'var(--pf-t--global--icon--size--font--body--default)'
  }
};

/** Border using PF width + color tokens */
export const borderDefaultStyle = `var(--pf-t--global--border--width--regular) solid ${pf.color.borderDefault}`;
