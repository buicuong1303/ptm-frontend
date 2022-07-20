import { createSlice } from '@reduxjs/toolkit';

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState: {
    schedulePreviewOrMonitor: null
  },
  reducers: {
    updateSchedulePreviewOrMonitor: (state, action) => {
      state.schedulePreviewOrMonitor = action.payload;
    }
  }
});

const { actions, reducer } = scheduleSlice;

const { updateSchedulePreviewOrMonitor } = actions;

export { updateSchedulePreviewOrMonitor };

export default reducer;
