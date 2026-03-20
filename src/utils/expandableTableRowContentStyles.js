/**
 * PatternFly `ExpandableRowContent` uses `--pf-v6-c-table__expandable-row-content--*` tokens.
 * Align “Use case” with the **API key name** column: expanded `Td` uses the same inline-start as the
 * expand column (`sm`, overriding :first-child/:last-child page-chrome padding on colspan cells).
 * This offset skips expand cell content width + its padding-end, then matches the next cell’s padding-start.
 */

const BG = 'var(--pf-t--global--background--color--100)';
const INLINE_END = 'var(--pf-t--global--spacer--md)';
const CELL_PAD = 'var(--pf-v6-c-table--cell--PaddingInlineStart)';

/**
 * Inside expanded td (after `paddingInlineStart: sm`): skip expand column track (2xl + xs) + name column pad.
 */
const AFTER_EXPAND_TO_NAME_COL = `calc(var(--pf-t--global--spacer--2xl) + var(--pf-t--global--spacer--xs) + ${CELL_PAD})`;

/** My API keys, API catalog API keys tab: expand | API key name | … */
export const expandableRowContentStyleAfterExpandColumn = {
  ['--pf-v6-c-table__expandable-row-content--BackgroundColor']: BG,
  ['--pf-v6-c-table__expandable-row-content--PaddingInlineStart']: AFTER_EXPAND_TO_NAME_COL,
  ['--pf-v6-c-table__expandable-row-content--PaddingInlineEnd']: INLINE_END
};

/** Expanded row `Td` horizontal padding: match expand column start, avoid colspan first/last chrome insets. */
export const expandedRowTdPaddingInline = {
  paddingInlineStart: 'var(--pf-t--global--spacer--sm)',
  paddingInlineEnd: 'var(--pf-v6-c-table--cell--PaddingInlineEnd)'
};

/** API key approvals: expand | checkbox | API | … (align with API column link) */
export const expandableRowContentStyleAfterExpandAndCheckbox = {
  ['--pf-v6-c-table__expandable-row-content--BackgroundColor']: BG,
  ['--pf-v6-c-table__expandable-row-content--PaddingInlineStart']: `calc(var(--pf-t--global--spacer--2xl) + var(--pf-t--global--spacer--xs) + ${CELL_PAD} + var(--pf-t--global--spacer--2xl) + ${CELL_PAD})`,
  ['--pf-v6-c-table__expandable-row-content--PaddingInlineEnd']: INLINE_END
};
