import palette from './palette';
import typography from './typography';
import overrides from './overrides';
import { createTheme } from '@material-ui/core';

const theme = createTheme({
  palette,
  typography,
  overrides
});

export default theme;
