import { SupportedLicense } from "../data/licenses";
import { GameCategory, AssetSourceType } from "./game";

export type SubmissionStatus = "PENDING_AUDIT" | "IN_REVIEW" | "APPROVED" | "REJECTED";

export interface GameSubmission {
  id: string;
  developerName: string;
  email: string;
  title: string;
  repositoryUrl: string;
  license: SupportedLicense;
  category: GameCategory;
  description: string;
  assetSource: AssetSourceType;
  complianceChecklist: {
    permissiveLicenseVerified: boolean;
    zeroTrademarkInfringement: boolean;
    originalSourceAvailable: boolean;
    commercialUseAllowed: boolean;
  };
  status: SubmissionStatus;
  submittedAt: string;
  rejectionReason?: string;
}
