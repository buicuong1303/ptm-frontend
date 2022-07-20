/* eslint-disable prettier/prettier */
import { getFileExtension } from './getFileExtension';

export function getTypeFile(fileName) {
  let fileExtension = getFileExtension(fileName);

  let typeFile = '';

  if (['jpg', 'jpeg', 'png', 'gif'].indexOf(fileExtension) !== -1) typeFile = 'image';
  if (['zip'].indexOf(fileExtension) !== -1) typeFile = 'zip';
  if (['rar'].indexOf(fileExtension) !== -1) typeFile = 'rar';
  if (['doc', 'docx', 'xml', 'txt'].indexOf(fileExtension) !== -1) typeFile = 'doc';
  if (['pdf', 'pptx'].indexOf(fileExtension) !== -1) typeFile = 'pdf';
  if (['xlsx', 'csv', 'xls'].indexOf(fileExtension) !== -1) typeFile = 'excel';

  return typeFile; // ['image', 'zip', 'rar', 'doc', 'pdf', 'excel']
};
