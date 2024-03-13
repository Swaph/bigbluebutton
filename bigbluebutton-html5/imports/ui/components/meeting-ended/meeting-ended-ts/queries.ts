import { gql } from '@apollo/client';

export interface MeetingEndDataResponse {
  user_current: Array<{
    role: string;
    meeting: {
      learningDashboard: {
        learningDashboardAccessToken: string;
      }
      isBreakout: boolean;
      logoutUrl: string;
      clientSettings: {
        askForFeedbackOnLogout: boolean;
        allowDefaultLogoutUrl: boolean;
        learningDashboardBase: string;
      };
    };
  }>;
}

export const getMeetingEndData = gql`
query getMeetingEndData {
  user_current {
    role
    meeting {
      learningDashboard {
        learningDashboardAccessToken
      }
      isBreakout
      logoutUrl
      clientSettings {
        askForFeedbackOnLogout: clientSettingsJson(path: "$.public.app.askForFeedbackOnLogout")
        allowDefaultLogoutUrl: clientSettingsJson(path: "$.public.app.allowDefaultLogoutUrl")
        learningDashboardBase: clientSettingsJson(path: "$.public.app.learningDashboardBase")
      }
    }
  }
}
`;

export default {
  getMeetingEndData,
};
