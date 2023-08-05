import thTrans from "./extensions/locales/th";
// @ts-ignore
import Favicon from "./extensions/favicon.png";

const translations = {
  th: thTrans,
  en: thTrans,
};

export default {
  config: {
    head: {
      favicon: Favicon,
    },
    locales: ["th"],
    translations: translations,
    tutorials: false,
    notifications: {
      releases: false,
    },
    onboarding: false,
  },
  bootstrap(app) {
    console.log(app);
  },
};
