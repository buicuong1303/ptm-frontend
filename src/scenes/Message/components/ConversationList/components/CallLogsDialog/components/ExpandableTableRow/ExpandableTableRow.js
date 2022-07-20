import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableCell, TableRow } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const ExpandableTableRow = ({ children, expandComponent, ...rest }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <TableRow {...rest}>
        {children}

        {expandComponent.length > 0 && (
          <TableCell padding="checkbox" key="detail">
            <IconButton onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? (
                <KeyboardArrowUpIcon color="primary" />
              ) : (
                <KeyboardArrowDownIcon color="primary" />
              )}
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      {isExpanded && <>{expandComponent}</>}
    </>
  );
};

ExpandableTableRow.propTypes = {
  children: PropTypes.node,
  expandComponent: PropTypes.node
};

export default ExpandableTableRow;
