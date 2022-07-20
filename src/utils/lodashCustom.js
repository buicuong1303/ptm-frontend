import { isEmpty, isEqual, xorWith } from 'lodash';

export const isArrayEqual = (x, y) => isEmpty(xorWith(x, y, isEqual));
