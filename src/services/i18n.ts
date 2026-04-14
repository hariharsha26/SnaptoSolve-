import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "home": "Home",
      "map": "Map",
      "snap": "Snap",
      "issues": "Issues",
      "rewards": "Rewards",
      "submit": "Submit Complaint",
      "routing": "Routing to department...",
      "location_locked": "Location locked",
    }
  },
  hi: {
    translation: {
      "welcome": "स्वागत है",
      "home": "होम",
      "map": "मानचित्र",
      "snap": "स्नैप",
      "issues": "मुद्दे",
      "rewards": "पुरस्कार",
      "submit": "शिकायत दर्ज करें",
      "routing": "विभाग को भेज रहा है...",
      "location_locked": "स्थान लॉक है",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
