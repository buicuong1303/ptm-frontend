/* eslint-disable no-unused-vars */
import BarChartIcon from '@material-ui/icons/BarChart';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import ChatIcon from '@material-ui/icons/ChatOutlined';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ScheduleIcon from '@material-ui/icons/ScheduleOutlined';
import PhoneIcon from '@material-ui/icons/PhoneOutlined';
import AuthIcon from '@material-ui/icons/LockOutlined';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import PaymentIcon from '@material-ui/icons/Payment';
import ForumIcon from '@material-ui/icons/Forum';
import GroupIcon from '@material-ui/icons/Group';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import ContactsIcon from '@material-ui/icons/Contacts';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import PublicIcon from '@material-ui/icons/Public';
import EventNoteIcon from '@material-ui/icons/EventNote';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import LabelIcon from '@material-ui/icons/Label';
import HistoryIcon from '@material-ui/icons/History';
import SpeakerNotesOffIcon from '@material-ui/icons/SpeakerNotesOff';
import EventIcon from '@material-ui/icons/Event';

const createNavConfig = (
  totalMessageUnread,
  companies,
  navigate,
  authorPermission
) => {
  return pagesNavRender(
    totalMessageUnread,
    companies,
    navigate,
    authorPermission
  );
};

const ReportMessageNavRender = (authorPermission) => {
  const listChild = [];
  if (authorPermission.readDashboard) {
    listChild.push({
      title: 'Dashboard',
      href: '/dashboard',
      icon: DashboardIcon
    });
  }
  if (authorPermission.readReportMessages) {
    listChild.push({
      title: 'Conversation History',
      href: '/report/message/conversation-history',
      icon: EventIcon
    });
  }
  return listChild;
};

const CampaignNavRender = (authorPermission) => {
  const listPage = [];
  if (authorPermission.readCampaigns) {
    if (authorPermission.readCampaignManage) {
      listPage.push({
        title: 'Campaigns',
        href: '/campaigns',
        icon: EventNoteIcon
      });
    }
    if (authorPermission.readSchedule) {
      listPage.push({
        title: 'Scheduling',
        href: '/scheduling',
        icon: ScheduleIcon
      });
    }
    if (authorPermission.readSuggestions) {
      listPage.push({
        title: 'Opt in/out Suggestion',
        children: [
          {
            title: 'History',
            href: '/opt-history'
          },
          {
            title: 'Suggestions',
            href: '/opt-suggestions'
          }
        ],
        icon: LabelImportantIcon
      });
    }
  }
  return listPage;
};

const ComplianceNavRender = (authorPermission) => {
  const listPage = [];
  if (authorPermission.readCompliance) {
    if (authorPermission.readLogActivity) {
      listPage.push({
        title: 'History',
        href: '/compliance-history',
        icon: HistoryIcon
      });
    }
    if (authorPermission.readSensitives) {
      listPage.push({
        title: 'Non-compliant Rules',
        children: [
          {
            title: 'Sensitive Message',
            href: '/sensitive-message'
          },
          {
            title: 'Sensitive Setting',
            href: '/sensitive-setting'
          }
        ],
        icon: SpeakerNotesOffIcon
      });
    }
  }
  return listPage;
};

const pagesNavRender = (
  totalMessageUnread,
  companies,
  navigate,
  authorPermission
) => {
  const listPage = [];
  if (authorPermission.readChat) {
    listPage.push({
      title: 'Message',
      pages: messageNavRender(
        totalMessageUnread,
        companies,
        navigate,
        authorPermission
      )
    });
  }
  if (authorPermission.readCustomer) {
    listPage.push({
      title: 'Clients',
      pages: [
        {
          title: 'Clients',
          href: '/clients',
          icon: GroupIcon
        }
      ]
    });
  }
  if (authorPermission.readManages) {
    listPage.push({
      title: 'Companies and Users',
      pages: companyAndUserNavRender(authorPermission)
    });
  }
  if (
    authorPermission.readCampaigns &&
    (authorPermission.readSuggestions ||
      authorPermission.readCampaignManage ||
      authorPermission.readSchedule)
  ) {
    listPage.push({
      title: 'Campaigns',
      pages: CampaignNavRender(authorPermission)
    });
  }
  if (authorPermission.readCompliance) {
    listPage.push({
      title: 'Compliance',
      pages: ComplianceNavRender(authorPermission)
    });
  }
  if (authorPermission.readReportMessages || authorPermission.readDashboard) {
    listPage.push({
      title: 'Reporting',
      pages: ReportMessageNavRender(authorPermission)
    });
  }

  return listPage;
};

const companyAndUserNavRender = (authorPermission) => {
  const listPage = [];
  if (authorPermission.readManages) {
    if (authorPermission.readCompany) {
      listPage.push({
        title: 'Companies',
        href: '/companies',
        icon: LocationCityIcon
      });
    }
    if (authorPermission.readUsers) {
      listPage.push({
        title: 'Users',
        href: '/users',
        icon: ContactsIcon
      });
    }
    if (authorPermission.readPermission || authorPermission.readRole) {
      listPage.push({
        title: 'Permissions',
        href: '/permissions',
        icon: PublicIcon
      });
      listPage.push({
        title: 'Roles',
        href: '/roles',
        icon: VpnLockIcon
      });
    }
    if (authorPermission.readLabels) {
      listPage.push({
        title: 'Labels',
        href: '/labels',
        icon: LabelIcon
      });
    }
  }
  return listPage;
};

const messageNavRender = (
  totalMessageUnread,
  companies,
  navigate,
  authorPermission
) => {
  const communicationList = [];
  if (authorPermission.readChat) {
    communicationList.push({
      title: `Inbox(${totalMessageUnread})`,
      children: [...companyNavRender(companies, navigate, authorPermission)],
      icon: MailOutlineIcon,
      href: '/messages'
    });
  }
  if (authorPermission.readComposeText) {
    communicationList.push({
      title: 'Compose',
      href: '/compose',
      icon: ChatIcon
    });
  }
  if (authorPermission.readSignature) {
    communicationList.push({
      title: 'Signatures',
      href: '/signatures',
      icon: PaymentIcon
    });
  }
  if (authorPermission.readGroupMessages) {
    communicationList.push({
      title: 'Group Messages',
      href: '/group-messages',
      icon: ForumIcon
    });
  }
  return communicationList;
};

const companyNavRender = (companies, navigate, authorPermission) => {
  if (authorPermission.readChat && authorPermission.readLabels) {
    return companies.map((company) => {
      return {
        title: company.name,
        href: `/messages/${company.code}`,
        manualRoute: true,
        onclick: navigate,
        umn: company.umn
      };
    });
  }
  return [];
};

export default createNavConfig;
