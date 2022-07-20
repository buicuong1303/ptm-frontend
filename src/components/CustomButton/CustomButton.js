/* eslint-disable prettier/prettier */
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Button } from '@material-ui/core';

const greenBright = '#2ae437';
const green = '#008000';
const greenDark = '#075207';

const blueBright = '#2f3fdc';
const blue = '#3f51b5';
const blueDark = '#1a237e';

const orangeBright = '#ff7f33';
const orange = '#dc6f2e';
const orangeDark = '#ad5724';

const redBright = '#ef3232';
const red = '#d10000';
const redDark = '#ab0000';

const grayBright = '#a9a9a9';
const gray = '#6c6c6c';
const grayDark = '#4b4b4b';

const white = '#ffffff';

const black = '#000000';

const useStyles = makeStyles((theme) => ({
  button: {
    minWidth: '80px',
    minHeight: '35px',
    textTransform: 'inherit',
    cursor: 'pointer',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    padding: `6px ${theme.spacing(2)}px`,
    '&:disabled': {
      opacity: '.5',
      cursor: 'not-allowed',
      // transition: 'background-color 9999999s, color 9999999s',
      pointerEvents: 'unset'
    }
  },

  greenBright: {
    color: `${greenBright} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${greenBright} !important`,
      border: `1px solid ${greenBright}`
    }
  },
  green: {
    color: `${green} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${green} !important`,
      border: `1px solid ${green}`
    }
  },
  greenDark: {
    color: `${greenDark} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${greenDark} !important`,
      border: `1px solid ${greenDark}`
    }
  },
  greenFullBright: {
    color: `${white} !important`,
    backgroundColor: `${greenBright} !important`,
    border: `1px solid ${greenBright}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${green} !important`,
      border: `1px solid ${green}`
    }
  },
  greenFull: {
    color: `${white} !important`,
    backgroundColor: `${green} !important`,
    border: `1px solid ${green}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${greenDark} !important`,
      border: `1px solid ${greenDark}`
    }
  },
  greenFullDark: {
    color: `${white} !important`,
    backgroundColor: `${greenDark} !important`,
    border: `1px solid ${greenDark}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${green} !important`,
      border: `1px solid ${green}`
    }
  },

  blueBright: {
    color: `${blueBright} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${blueBright} !important`,
      border: `1px solid ${blueBright}`
    }
  },
  blue: {
    color: `${blue} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${blue} !important`,
      border: `1px solid ${blue}`
    }
  },
  blueDark: {
    color: `${blueDark} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${blueDark} !important`,
      border: `1px solid ${blueDark}`
    }
  },
  blueFullBright: {
    color: `${white} !important`,
    backgroundColor: `${blueBright} !important`,
    border: `1px solid ${blueBright}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${blue} !important`,
      border: `1px solid ${blue}`
    }
  },
  blueFull: {
    color: `${white} !important`,
    backgroundColor: `${blue} !important`,
    border: `1px solid ${blue}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${blueDark} !important`,
      border: `1px solid ${blueDark}`
    }
  },
  blueFullDark: {
    color: `${white} !important`,
    backgroundColor: `${blueDark} !important`,
    border: `1px solid ${blueDark}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${blue} !important`,
      border: `1px solid ${blue}`
    }
  },

  orangeBright: {
    color: `${orangeBright} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${orangeBright} !important`,
      border: `1px solid ${orangeBright}`
    }
  },
  orange: {
    color: `${orange} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${orange} !important`,
      border: `1px solid ${orange}`
    }
  },
  orangeDark: {
    color: `${orangeDark} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${orangeDark} !important`,
      border: `1px solid ${orangeDark}`
    }
  },
  orangeFullBright: {
    color: `${white} !important`,
    backgroundColor: `${orangeBright} !important`,
    border: `1px solid ${orangeBright}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${orange} !important`,
      border: `1px solid ${orange}`
    }
  },
  orangeFull: {
    color: `${white} !important`,
    backgroundColor: `${orange} !important`,
    border: `1px solid ${orange}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${orangeDark} !important`,
      border: `1px solid ${orangeDark}`
    }
  },
  orangeFullDark: {
    color: `${white} !important`,
    backgroundColor: `${orangeDark} !important`,
    border: `1px solid ${orangeDark}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${orange} !important`,
      border: `1px solid ${orange}`
    }
  },

  redBright: {
    color: `${redBright} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${redBright} !important`,
      border: `1px solid ${redBright}`
    }
  },
  red: {
    color: `${red} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${red} !important`,
      border: `1px solid ${red}`
    }
  },
  redDark: {
    color: `${redDark} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${redDark} !important`,
      border: `1px solid ${redDark}`
    }
  },
  redFullBright: {
    color: `${white} !important`,
    backgroundColor: `${redBright} !important`,
    border: `1px solid ${redBright}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${red} !important`,
      border: `1px solid ${red}`
    }
  },
  redFull: {
    color: `${white} !important`,
    backgroundColor: `${red} !important`,
    border: `1px solid ${red}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${redDark} !important`,
      border: `1px solid ${redDark}`
    }
  },
  redFullDark: {
    color: `${white} !important`,
    backgroundColor: `${redDark} !important`,
    border: `1px solid ${redDark}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${red} !important`,
      border: `1px solid ${red}`
    }
  },

  grayBright: {
    color: `${grayBright} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${grayBright} !important`,
      border: `1px solid ${grayBright}`
    }
  },
  gray: {
    color: `${gray} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${gray} !important`,
      border: `1px solid ${gray}`
    }
  },
  grayDark: {
    color: `${grayDark} !important`,
    backgroundColor: `${white} !important`,
    border: '1px solid currentColor',
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${grayDark} !important`,
      border: `1px solid ${grayDark}`
    }
  },
  grayFullBright: {
    color: `${white} !important`,
    backgroundColor: `${grayBright} !important`,
    border: `1px solid ${grayBright}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${gray} !important`,
      border: `1px solid ${gray}`
    }
  },
  grayFull: {
    color: `${white} !important`,
    backgroundColor: `${gray} !important`,
    border: `1px solid ${gray}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${grayDark} !important`,
      border: `1px solid ${grayDark}`
    }
  },
  grayFullDark: {
    color: `${white} !important`,
    backgroundColor: `${grayDark} !important`,
    border: `1px solid ${grayDark}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${gray} !important`,
      border: `1px solid ${gray}`
    }
  },

  default: {
    color: `${black} !important`,
    backgroundColor: `${white} !important`,
    border: `1px solid ${black}`,
    '&:hover': {
      color: `${white} !important`,
      backgroundColor: `${gray} !important`,
      border: `1px solid ${gray}`
    }
  },

  none: {
    '&:hover': {
    }
  }
}));

const CustomButton = (props) => {
  // eslint-disable-next-line
  const { className, style, theme, children, content, onClick, onChange, disabled, ...rest } = props;
  //* theme in [add, update, delete, cancel, confirm, import, back, next, check, remove, detail, upload]

  const classes = useStyles();

  return (
    <Button
      // variant="contained"
      className={clsx(
        theme === 'green-bright'
          ? classes.greenBright
          : theme === 'green'
            ? classes.green
            : theme === 'green-dark'
              ? classes.greenDark
              : theme === 'green-full-bright'
                ? classes.greenFullBright
                : theme === 'green-full'
                  ? classes.greenFull
                  : theme === 'green-full-dark'
                    ? classes.greenFullDark
                    : theme === 'blue-bright'
                      ? classes.blueBright
                      : theme === 'blue'
                        ? classes.blue
                        : theme === 'blue-dark'
                          ? classes.blueDark
                          : theme === 'blue-full-bright'
                            ? classes.blueFullBright
                            : theme === 'blue-full'
                              ? classes.blueFull
                              : theme === 'blue-full-dark'
                                ? classes.blueFullDark
                                : theme === 'orange-bright'
                                  ? classes.orangeBright
                                  : theme === 'orange'
                                    ? classes.orange
                                    : theme === 'orange-dark'
                                      ? classes.orangeDark
                                      : theme === 'orange-full-bright'
                                        ? classes.orangeFullBright
                                        : theme === 'orange-full'
                                          ? classes.orangeFull
                                          : theme === 'orange-full-dark'
                                            ? classes.orangeFullDark
                                            : theme === 'red-bright'
                                              ? classes.redBright
                                              : theme === 'red'
                                                ? classes.red
                                                : theme === 'red-dark'
                                                  ? classes.redDark
                                                  : theme === 'red-full-bright'
                                                    ? classes.redFullBright
                                                    : theme === 'red-full'
                                                      ? classes.redFull
                                                      : theme === 'red-full-dark'
                                                        ? classes.redFullDark
                                                        : theme === 'gray-bright'
                                                          ? classes.grayBright
                                                          : theme === 'gray'
                                                            ? classes.gray
                                                            : theme === 'gray-dark'
                                                              ? classes.grayDark
                                                              : theme === 'gray-full-bright'
                                                                ? classes.grayFullBright
                                                                : theme === 'gray-full'
                                                                  ? classes.grayFull
                                                                  : theme === 'gray-full-dark'
                                                                    ? classes.grayFullDark
                                                                    : theme === 'none'
                                                                      ? classes.none
                                                                      : classes.default,
        classes.button,
        className
      )}
      disabled={disabled}
      onChange={(event) => onChange(event)}
      onClick={onClick}
      style={style}
      theme={theme === 'import' ? 'file' : 'button'}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {children}
        <div className={classes.span}>{content}</div>
      </div>
    </Button>
  );
};

CustomButton.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  content: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
  theme: PropTypes.string
};

export default CustomButton;
