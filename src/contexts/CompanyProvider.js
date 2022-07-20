/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo
} from 'react';
import { useRouter } from 'hooks';
import { useDispatch, useSelector } from 'react-redux';
import { getConversationsOfUser } from 'scenes/Message/Message.asyncAction';
import { getCompaniesOfUser } from 'scenes/User/User.asyncActions';
import {
  initConversations,
  resetLoadingConversations
} from 'scenes/Message/Message.slice';
import { cloneDeep } from 'lodash';
import limit from 'constants/limit';
import { SocketChatContext } from 'services/socket/SocketChat';
import { getUserInfo } from 'store/asyncActions/session.asyncAction';
import { getCampaigns } from 'scenes/Campaign/Campaign.asyncAction';

const CompanyContext = createContext();
const { Provider } = CompanyContext;

const CompanyProvider = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { setCompaniesProvider } = useContext(SocketChatContext);

  const conversations = useSelector((state) => state.message.conversations);
  const manager = useSelector((state) => state.message.conversations.manager);
  const user = useSelector((state) => state.session.user);
  const [company, setCompany] = useState({});
  const [companies, setCompanies] = useState([]);

  const handleResetLoadingConversation = () => {
    dispatch(resetLoadingConversations());
  };

  //* Load company list and conversation of companies
  useEffect(() => {
    if (user.id) {
      const getListCompany = async () => {
        const result = await dispatch(getCompaniesOfUser({ userId: user.id }));
        // await new Promise(r => setTimeout(r, 3000));
        const companies = result.payload
          ? preHandleCompanies(result.payload)
          : [];
        if (companies) {
          setCompanies(companies);
          setCompaniesProvider(companies);
          dispatch(initConversations(companies));
          dispatch(getCampaigns());
          if (companies[0]) setCompany(companies[0]);

          companies.forEach((item) => {
            return dispatch(
              getConversationsOfUser({
                page: 1,
                limitConversations: limit.initLimitConversations,
                limitMessageInConversations:
                  limit.initLimitMessageInConversations,
                company: item,
                filters: {
                  type: 'all',
                  search: ''
                }
              })
            );
          });
        }
      };

      getListCompany();
    }
  }, [user.id]);
  useEffect(() => {
    const path = router.location.pathname;
    const companyCode = path.split('/').reverse()[0];
    const scenePath = path.split('/').reverse()[1];
    if (scenePath === 'messages') {
      const currentCompanies = cloneDeep(companies);
      const selectCompany = currentCompanies.filter(
        (company) => company.code === companyCode
      )[0];
      if (selectCompany) setCompany(selectCompany);
    }
  }, [companies]);

  useEffect(() => {
    const companiesWithUmn = companies.map((item) => {
      return {
        ...item,
        umn: manager[item.code]?.pagination
          ? manager[item.code].pagination.umn
          : 0
      };
    });

    setCompanies(companiesWithUmn);
    setCompaniesProvider(companiesWithUmn);
  }, [conversations]);

  const preHandleCompanies = (companies) => {
    const companiesEnhanced = companies
      ? companies.map((company) => {
        const labels = company['labels'].map((label) => {
          return {
            label: label.title,
            color: label.bgColor,
            value: label.id
          };
        });
        return {
          ...company,
          labels: labels,
          users: company.users
        };
      })
      : [];

    return companiesEnhanced;
  };
  return (
    <Provider
      value={{
        company,
        companies,
        setCompany,
        setCompanies,
        handleResetLoadingConversation
      }}
    >
      {children}
      {/* {companies.length > 0 && children} */}
    </Provider>
  );
};

export { CompanyContext, CompanyProvider };
