export type SupportedLicense = "MIT" | "BSD-2" | "BSD-3" | "Apache-2.0" | "ISC";

export type RejectedLicense = "GPL" | "AGPL" | "LGPL" | "Unknown" | "No License";

export interface LicenseRules {
  id: SupportedLicense;
  name: string;
  commercialUse: boolean;
  attributionRequired: boolean;
  isPermissive: boolean;
}

export const SUPPORTED_LICENSES: Record<SupportedLicense, LicenseRules> = {
  MIT: {
    id: "MIT",
    name: "MIT License",
    commercialUse: true,
    attributionRequired: true,
    isPermissive: true,
  },
  "BSD-2": {
    id: "BSD-2",
    name: "BSD 2-Clause License",
    commercialUse: true,
    attributionRequired: true,
    isPermissive: true,
  },
  "BSD-3": {
    id: "BSD-3",
    name: "BSD 3-Clause License",
    commercialUse: true,
    attributionRequired: true,
    isPermissive: true,
  },
  "Apache-2.0": {
    id: "Apache-2.0",
    name: "Apache License 2.0",
    commercialUse: true,
    attributionRequired: true,
    isPermissive: true,
  },
  ISC: {
    id: "ISC",
    name: "ISC License",
    commercialUse: true,
    attributionRequired: true,
    isPermissive: true,
  },
};

export const REJECTED_LICENSES: string[] = ["GPL", "AGPL", "LGPL", "UNKNOWN", "NO LICENSE", "NONE"];

export function isSupportedLicense(licenseStr: string): licenseStr is SupportedLicense {
  if (!licenseStr) return false;
  const upper = licenseStr.trim().toUpperCase();
  
  if (REJECTED_LICENSES.includes(upper)) return false;

  const keyMap: Record<string, SupportedLicense> = {
    MIT: "MIT",
    "BSD-2": "BSD-2",
    "BSD-2-CLAUSE": "BSD-2",
    "BSD-3": "BSD-3",
    "BSD-3-CLAUSE": "BSD-3",
    "APACHE-2.0": "Apache-2.0",
    "APACHE-2": "Apache-2.0",
    APACHE: "Apache-2.0",
    ISC: "ISC",
  };

  return keyMap[upper] !== undefined;
}

export function normalizeLicenseKey(licenseStr: string): SupportedLicense | null {
  if (!licenseStr) return null;
  const upper = licenseStr.trim().toUpperCase();
  const keyMap: Record<string, SupportedLicense> = {
    MIT: "MIT",
    "BSD-2": "BSD-2",
    "BSD-2-CLAUSE": "BSD-2",
    "BSD-3": "BSD-3",
    "BSD-3-CLAUSE": "BSD-3",
    "APACHE-2.0": "Apache-2.0",
    "APACHE-2": "Apache-2.0",
    APACHE: "Apache-2.0",
    ISC: "ISC",
  };
  return keyMap[upper] || null;
}
