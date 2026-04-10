const fs = require('fs');
const path = require('path');

const localesPath = path.join(__dirname, 'locales');
if (!fs.existsSync(localesPath)) fs.mkdirSync(localesPath);

const locales = {
  en: {
    common: {
      "welcome": "Welcome to Sentry",
      "settings": "Settings",
      "loading": "Loading...",
      "save": "Save",
      "cancel": "Cancel",
      "language": "App Language",
      "home": "Home",
      "helpCenter": "Help Center",
      "personalInfo": "Personal Information",
      "myAddress": "My Address",
      "myTickets": "My Tickets",
      "account": "Account"
    },
    auth: {
      "login": "Login",
      "logout": "Sign Out",
      "signup": "Sign Up",
      "email": "Email",
      "password": "Password",
      "roleSelection": "Select your role"
    },
    emergency: {
      "sosBtn": "SOS",
      "sosActive": "ACTIVE",
      "familyContacts": "Family Contacts",
      "addContact": "Add Contact",
      "dispatching": "Dispatching Help...",
      "shareLocation": "Share Live Location",
      "safetyTips": "Safety Tips",
      "callNow": "Call Now",
      "alertActive": "Alert is active",
      "serverDisconnected": "Server disconnected",
      "liveTracking": "Live tracking active",
      "noContacts": "No Emergency Contacts",
      "addInstructions": "Tap + Add to create your emergency contacts"
    }
  },
  hi: {
    common: {
      "welcome": "सेंटी में आपका स्वागत है",
      "settings": "सेटिंग्स",
      "loading": "लोड हो रहा है...",
      "save": "सहेजें",
      "cancel": "रद्द करें",
      "language": "ऐप की भाषा",
      "home": "होम",
      "helpCenter": "सहायता केंद्र",
      "personalInfo": "व्यक्तिगत जानकारी",
      "myAddress": "मेरा पता",
      "myTickets": "मेरे टिकट",
      "account": "खाता"
    },
    auth: {
      "login": "लॉग इन करें",
      "logout": "साइन आउट",
      "signup": "साइन अप करें",
      "email": "ईमेल",
      "password": "पासवर्ड",
      "roleSelection": "अपनी भूमिका चुनें"
    },
    emergency: {
      "sosBtn": "एसओएस",
      "sosActive": "सक्रिय है",
      "familyContacts": "पारिवारिक संपर्क",
      "addContact": "संपर्क जोड़ें",
      "dispatching": "मदद भेजी जा रही है...",
      "shareLocation": "लाइव लोकेशन साझा करें",
      "safetyTips": "सुरक्षा सुझाव",
      "callNow": "अभी कॉल करें",
      "alertActive": "अलर्ट सक्रिय है",
      "serverDisconnected": "सर्वर डिस्कनेक्ट हो गया",
      "liveTracking": "लाइव ट्रैकिंग सक्रिय है",
      "noContacts": "कोई आपातकालीन संपर्क नहीं",
      "addInstructions": "आपातकालीन संपर्क जोड़ने के लिए + जोड़ें पर टैप करें"
    }
  },
  as: {
    common: {
      "welcome": "চেন্ট্ৰিলৈ স্বাগতম",
      "settings": "ছেটিংছ",
      "loading": "লোড হৈ আছে...",
      "save": "ছেভ কৰক",
      "cancel": "বাতিল কৰক",
      "language": "এপৰ ভাষা",
      "home": "হোম",
      "helpCenter": "সহায় কেন্দ্ৰ",
      "personalInfo": "ব্যক্তিগত তথ্য",
      "myAddress": "মোৰ ঠিকনা",
      "myTickets": "মোৰ টিকটসমূহ",
      "account": "একাউণ্ট"
    },
    auth: {
      "login": "লগ ইন",
      "logout": "ছাইন আউট",
      "signup": "ছাইন আপ",
      "email": "ইমেইল",
      "password": "পাছৱৰ্ড",
      "roleSelection": "আপোনাৰ ভূমিকা বাছনি কৰক"
    },
    emergency: {
      "sosBtn": "এছ.ও.এছ",
      "sosActive": "সক্ৰিয়",
      "familyContacts": "পৰিয়ালৰ যোগাযোগ",
      "addContact": "যোগাযোগ যোগ কৰক",
      "dispatching": "সহায় প্ৰেৰণ কৰা হৈছে...",
      "shareLocation": "লাইভ অৱস্থান শ্বেয়াৰ কৰক",
      "safetyTips": "সুৰক্ষাৰ পৰামৰ্শ",
      "callNow": "এতিয়া কল কৰক",
      "alertActive": "এলাৰ্ট সক্ৰিয় হৈ আছে",
      "serverDisconnected": "চাৰ্ভাৰ সংযোগ বিচ্ছিন্ন",
      "liveTracking": "লাইভ ট্ৰেকিং সক্ৰিয়",
      "noContacts": "কোনো জৰুৰীকালীন যোগাযোগ নাই",
      "addInstructions": "জৰুৰীকালীন যোগাযোগ সংযোগ কৰিবলৈ + যোগ কৰক টিপক"
    }
  }
};

for (const [lang, namespaces] of Object.entries(locales)) {
  const langPath = path.join(localesPath, lang);
  if (!fs.existsSync(langPath)) fs.mkdirSync(langPath);
  for (const [ns, data] of Object.entries(namespaces)) {
    fs.writeFileSync(path.join(langPath, `${ns}.json`), JSON.stringify(data, null, 2));
  }
}

const indexFileContent = `
import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enEmergency from './en/emergency.json';

import hiCommon from './hi/common.json';
import hiAuth from './hi/auth.json';
import hiEmergency from './hi/emergency.json';

import asCommon from './as/common.json';
import asAuth from './as/auth.json';
import asEmergency from './as/emergency.json';

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    emergency: enEmergency
  },
  hi: {
    common: hiCommon,
    auth: hiAuth,
    emergency: hiEmergency
  },
  as: {
    common: asCommon,
    auth: asAuth,
    emergency: asEmergency
  }
};
`;
fs.writeFileSync(path.join(localesPath, 'index.ts'), indexFileContent.trim());
console.log('I18n files created.');
