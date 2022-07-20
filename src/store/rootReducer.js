import sessionReducer from 'store/slices/session.slice';
import permissionReducer from 'scenes/Permission/Permission.reducer';
import profileReducer from 'scenes/Profile/Profile.reducer';
import roleReducer from 'scenes/Role/Role.reducer';
import usersReducer from 'scenes/User/User.reducer';
import messageReducer from 'scenes/Message/Message.reducer';
import authenReducer from 'scenes/Authentication/Authen.reducer';
import customerReducer from 'scenes/Customer/Customer.reducer';
import signatureReducer from 'scenes/Signature/Signature.reducer';
import companyReducer from 'scenes/Company/Company.slice';
import userOnlineReducer from 'store/slices/userOnline.slice';
import composeTextReducer from 'scenes/ComposeText/ComposeText.reducer';
import groupReducer from 'scenes/Group/Group.reducer';
import notificationReducer from 'store/slices/notification.slice';
import scheduleMessageReducer from 'scenes/ScheduleMessage/ScheduleMessage.reducer';
import dashBoardReducer from 'scenes/DashBoard/DashBoard.reducer';
import searchReducer from 'store/slices/search.slice';
import optSuggestionReducer from 'scenes/OptSuggestion/OptSuggestion.reducer';
import sensitiveReducer from 'scenes/Sensitive/Sensitive.reducer';
import sensitiveOverviewReducer from 'scenes/SensitiveOverview/SensitiveOverview.reducer';
import campaignReducer from 'scenes/Campaign/Campaign.reducer';
import suggestionHistoryReducer from 'scenes/SuggestionHistory/SuggestionHistory.reducer';
import groupMessageReducer from 'scenes/GroupMessage/GroupMessage.reducer';
import logActivityReducer from 'scenes/LogActivity/LogActivity.reducer';

const rootReducer = {
  dashBoard: dashBoardReducer,
  session: sessionReducer,
  permission: permissionReducer,
  profile: profileReducer,
  customer: customerReducer,
  role: roleReducer,
  users: usersReducer,
  message: messageReducer,
  authen: authenReducer,
  signature: signatureReducer,
  company: companyReducer,
  userOnline: userOnlineReducer,
  composeText: composeTextReducer,
  group: groupReducer,
  notification: notificationReducer,
  schedule: scheduleMessageReducer,
  search: searchReducer,
  optSuggestion: optSuggestionReducer,
  sensitive: sensitiveReducer,
  sensitiveOverview: sensitiveOverviewReducer,
  campaign: campaignReducer,
  suggestionHistory: suggestionHistoryReducer,
  groupMessage: groupMessageReducer,
  logActivity: logActivityReducer
};

export default rootReducer;
