import enCommon from './en/common.json';
import enAuth from './en/auth.json';
import enEmergency from './en/emergency.json';

import hiCommon from './hi/common.json';
import hiAuth from './hi/auth.json';
import hiEmergency from './hi/emergency.json';

import esCommon from './es/common.json';
import esAuth from './es/auth.json';
import esEmergency from './es/emergency.json';

import frCommon from './fr/common.json';
import frAuth from './fr/auth.json';
import frEmergency from './fr/emergency.json';

import zhCommon from './zh/common.json';
import zhAuth from './zh/auth.json';
import zhEmergency from './zh/emergency.json';

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    emergency: enEmergency,
  },
  hi: {
    common: hiCommon,
    auth: hiAuth,
    emergency: hiEmergency,
  },
  es: {
    common: esCommon,
    auth: esAuth,
    emergency: esEmergency,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    emergency: frEmergency,
  },
  zh: {
    common: zhCommon,
    auth: zhAuth,
    emergency: zhEmergency,
  },
} as const;

// Type augmentation for react-i18next
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: (typeof resources)['en'];
  }
}