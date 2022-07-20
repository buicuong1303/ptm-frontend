import { colors } from '@material-ui/core';

const white = '#FFFFFF';
const black = '#000000';

export default {
  black,
  white,
  primary: {
    contrastText: white,
    dark: colors.indigo[900],
    darkLight: colors.indigo[700],
    main: colors.indigo[800],
    light: colors.indigo[100]
  },
  secondary: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue['A400'],
    light: colors.blue['A400']
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green['700'],
    light: colors.green['100']
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: colors.blueGrey[900],
    secondary: colors.blueGrey[600],
    link: colors.blue[600]
  },
  label: {
    primary: colors.grey[600]
  },
  header: {
    primary: colors.grey[200]
  },
  link: colors.blue[800],
  icon: '#FFFFFF',
  background: {
    default: '#f7f9fc', //'#F4F6F8',
    paper: white
  },
  divider: colors.grey[200],
  cancel: {
    contrastText: white,
    dark: '#4b4b4b',
    main: '#6c6c6c',
    light: '#898989'
  }
};
