/* eslint-disable no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { conversationHistory } from 'services/apis';
import { formatStanderPhone } from 'utils/formatStanderPhone';
import { readAsArrayBuffer } from 'utils/readFilePromise';
import * as xlsx from 'xlsx';

const getConversationHistory = createAsyncThunk(
  'getConversationHistory/conversationHistory',
  async (data, props) => {
    try {
      const fileBuffer = await readAsArrayBuffer(data.file[0]);

      const workbook = xlsx.read(fileBuffer.data, { type: 'buffer' });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = xlsx.utils.sheet_to_json(ws, { raw: false });
      const header = xlsx.utils.sheet_to_json(ws, { raw: false, header: 1 })[0];
      if (header.length !== 1 || header[0] !== 'phone') {
        throw new Error('File is invalid');
      }
      const phones = jsonData.map((item) => formatStanderPhone(item.phone));
      const newData = {
        companyId: data.companyId,
        startDate: data.rangeDate[0],
        endDate: data.rangeDate[1],
        phones: phones
      };
      const response = await conversationHistory.getConversationHistory(
        newData
      );

      return response.data;
    } catch (error) {
      const payload = { error: error.message };
      return props.rejectWithValue(payload);
    }
  }
);

export { getConversationHistory };
