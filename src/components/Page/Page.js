import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { useRouter } from 'hooks';
import { CompanyContext } from 'contexts/CompanyProvider';

// eslint-disable-next-line no-undef
const NODE_ENV = process.env.NODE_ENV;
// eslint-disable-next-line no-undef
const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

const Page = (props) => {
  const { title, children, ...rest } = props;
  const companyContext = useContext(CompanyContext);
  // const { companies } = useContext(CompanyContext);
  const [totalMessageUnread, setTotalMessageUnread] = useState(0);
  const [companies, setCompanies] = useState([]);

  const router = useRouter();

  useEffect(() => {
    let isFull = true;
    let total = 0;
    companies.forEach((company) => {
      if (company.umn !== undefined) {
        total = total + company.umn;
      } else {
        isFull = false;
      }
    });
    if (isFull) {
      setTotalMessageUnread(total);
    }
  }, [companies]);

  useEffect(() => {
    if (companyContext) {
      setCompanies(companyContext.companies);
    }
  }, [companyContext]);

  useEffect(() => {
    if (NODE_ENV !== 'production') {
      return;
    }

    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: router.location.pathname,
        page_name: title
      });
    }
  }, [title, router]);

  return (
    <div {...rest}>
      <Helmet>
        <title>
          {totalMessageUnread === 0
            ? title
            : `(${totalMessageUnread}) ${title}`}
        </title>
      </Helmet>
      {children}
    </div>
  );
};

Page.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string
};

export default Page;
