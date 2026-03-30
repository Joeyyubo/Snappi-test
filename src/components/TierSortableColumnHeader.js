import React from 'react';
import { css } from '@patternfly/react-styles';
import tableStyles from '@patternfly/react-styles/css/components/Table/table';
import { Popover } from '@patternfly/react-core';
import { SortColumn, SortByDirection } from '@patternfly/react-table';
import { QuestionCircleHelpTrigger } from './QuestionCircleHelpTrigger';

const TIER_POPOVER_BODY = <p style={{ margin: 0 }}>API product limit tiers.</p>;

/** Min width for Tier header (label + sort + help). Keep modest so the column does not look oversized. */
export const TIER_TABLE_COLUMN_MIN_WIDTH = '7.5rem';

/** Table header/body styles so Tier stays content-sized; `width: 1%` avoids extra space being assigned here. */
export const TIER_TABLE_COLUMN_STYLE = {
  width: '1%',
  minWidth: TIER_TABLE_COLUMN_MIN_WIDTH,
  whiteSpace: 'nowrap'
};

/**
 * Sortable "Tier" header with FA question-circle popover (My API keys / API key approval).
 */
export function TierSortableColumnHeader({ columnIndex, sortBy, onSort }) {
  const isSortedBy = sortBy && columnIndex === sortBy.index;

  const sortClicked = (event) => {
    let reversedDirection;
    if (!isSortedBy) {
      reversedDirection = sortBy?.defaultDirection ? sortBy.defaultDirection : SortByDirection.asc;
    } else {
      reversedDirection =
        sortBy.direction === SortByDirection.asc ? SortByDirection.desc : SortByDirection.asc;
    }
    onSort?.(event, columnIndex, reversedDirection);
  };

  /* PatternFly Table: `.pf-v6-c-table__column-help` is inline-grid; `.pf-v6-c-table__column-help-action`
     uses `--pf-v6-c-table__column-help--MarginInlineStart` (token `--pf-t--global--spacer--sm`).
     Do not use flex+gap here — it adds extra gap on top of that margin (see HeaderCellInfoWrapper). */
  return (
    <div
      className={css(tableStyles.tableColumnHelp)}
      style={{
        /* Still PF6 spacing scale; slightly tighter than table default sm for sort+help cluster */
        ['--pf-v6-c-table__column-help--MarginInlineStart']: 'var(--pf-t--global--spacer--xs)'
      }}
    >
      <SortColumn
        isSortedBy={isSortedBy}
        sortDirection={isSortedBy ? sortBy.direction : ''}
        onSort={sortClicked}
        aria-label="Sort by Tier"
      >
        Tier
      </SortColumn>
      <span className={css(tableStyles.tableColumnHelpAction)}>
        <Popover
          headerContent="Tier"
          showClose
          closeBtnAriaLabel="Close"
          position="top"
          aria-label="API product limit tiers"
          bodyContent={TIER_POPOVER_BODY}
        >
          <QuestionCircleHelpTrigger aria-label="More information about Tier" />
        </Popover>
      </span>
    </div>
  );
}
