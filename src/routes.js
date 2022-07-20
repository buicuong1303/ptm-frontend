/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

//Layout
import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import { ComponentLoader } from 'components';
import { CompanyProvider } from 'contexts/CompanyProvider';

const routes = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/profile" />
  },
  {
    path: '/auth',
    component: AuthLayout,
    routes: [
      {
        path: '/auth/sign-in',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/Authentication/scenes/SignIn'))
        )
      },
      {
        path: '/auth/sign-up',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/Authentication/scenes/SignUp'))
        )
      },
      {
        path: '/auth/sign-in/forgot-password',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() =>
            import('scenes/Authentication/scenes/ForgotPassword')
          )
        )
      },
      {
        path: '/auth/sign-in/forgot-password/sent',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() =>
            import(
              'scenes/Authentication/scenes/ForgotPassword/scenes/SendEmailResetPassword'
            )
          )
        )
      },
      {
        path: '/auth/sign-in/reset-password',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() =>
            import(
              'scenes/Authentication/scenes/ForgotPassword/scenes/ResetPassword'
            )
          )
        )
      },
      {
        path: '/auth/verify/sent',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() =>
            import('scenes/Authentication/scenes/SignUp/scenes/SendVerifyEmail')
          )
        )
      },
      {
        path: '/auth/verify',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() =>
            import('scenes/Authentication/scenes/SignUp/scenes/VerifyAccount')
          )
        )
      },
      {
        // eslint-disable-next-line react/no-multi-comp
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('scenes/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('components/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('scenes/Error500'))
      },
      {
        // eslint-disable-next-line react/no-multi-comp
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '*/',
    // eslint-disable-next-line react/no-multi-comp
    component: (props) => (
      <CompanyProvider>
        <DashboardLayout {...props} />
      </CompanyProvider>
    ),
    routes: [
      {
        path: '/profile',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Profile')))
      },
      {
        path: '/change-password',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/ChangePassword'))
        )
      },
      {
        path: '/messages/:company',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Message')))
      },
      {
        path: '/companies',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Company')))
      },
      {
        path: '/groups',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Group')))
      },
      {
        path: '/compose',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/ComposeText'))
        )
      },
      {
        path: '/scheduling',
        component: lazy(() =>
          ComponentLoader(() => import('scenes/ScheduleMessage'))
        ),
        routes: [
          {
            path: '/scheduling',
            exact: true,
            component: lazy(() =>
              ComponentLoader(() =>
                import('scenes/ScheduleMessage/scenes/ScheduleManegement')
              )
            )
          },
          {
            path: '/scheduling/create',
            component: lazy(() =>
              ComponentLoader(() =>
                import('scenes/ScheduleMessage/scenes/CreateSchedule')
              )
            )
          },
          {
            path: '/scheduling/update/:id',
            component: lazy(() =>
              ComponentLoader(() =>
                import('scenes/ScheduleMessage/scenes/UpdateSchedule')
              )
            )
          },
          {
            path: '/scheduling/preview/:id',
            component: lazy(() =>
              ComponentLoader(() =>
                import('scenes/ScheduleMessage/scenes/SchedulePreview')
              )
            )
          },
          {
            path: '/scheduling/monitor/:id',
            component: lazy(() =>
              ComponentLoader(() =>
                import('scenes/ScheduleMessage/scenes/ScheduleMonitor')
              )
            )
          }
        ]
      },
      {
        path: '/permissions',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/Permission'))
        )
      },
      {
        path: '/clients',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Customer')))
      },
      {
        path: '/opt-suggestions',
        exact: true,
        component: lazy(() => import('scenes/OptSuggestion'))
      },
      {
        path: '/users',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/User')))
      },
      {
        path: '/roles',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Role')))
      },
      {
        path: '/dashboard',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/DashBoard')))
      },
      {
        path: '/signatures',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Signature')))
      },
      {
        path: '/notifications',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/NotificationSummary'))
        )
      },
      {
        path: '/setting',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Setting')))
      },
      {
        path: '/labels',
        component: lazy(() => ComponentLoader(() => import('scenes/Label'))),
        routes: [
          {
            path: '/labels',
            exact: true,
            component: lazy(() =>
              ComponentLoader(() =>
                import('scenes/Label/scenes/LabelManagement')
              )
            )
          },
          {
            path: '/labels/create',
            component: lazy(() =>
              ComponentLoader(() => import('scenes/Label/scenes/CreateLabel'))
            )
          },
          {
            path: '/labels/update/:id',
            component: lazy(() =>
              ComponentLoader(() => import('scenes/Label/scenes/UpdateLabel'))
            )
          }
        ]
      },
      {
        path: '/report/message/conversation-history',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/ConversationHistory'))
        )
      },
      {
        path: '/sensitive-setting',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Sensitive')))
      },
      {
        path: '/sensitive-message',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/SensitiveOverview'))
        )
      },
      {
        path: '/campaigns',
        exact: true,
        component: lazy(() => ComponentLoader(() => import('scenes/Campaign')))
      },
      {
        path: '/opt-history',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/SuggestionHistory'))
        )
      },
      {
        path: '/group-messages',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/GroupMessage'))
        )
      },
      {
        path: '/compliance-history',
        exact: true,
        component: lazy(() =>
          ComponentLoader(() => import('scenes/LogActivity'))
        )
      }
    ]
  }
];

export default routes;
