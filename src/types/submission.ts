import { SupportedLicense } from "../data/licenses";
import { GameCategory, AssetSourceType } from "./game";

export type SubmissionStatus = "PENDING_AUDIT" | "IN_REVIEW" | "APPROVED" | "REJECTED";
export type PayoutStatus = "PENDING" | "PAID" | "PROCESSING";

export interface GameSubmission {
  id: string;
  developerId?: string;
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

  // Milestone 13 Developer Revenue Share
  revenueSharePercentage?: number;
  payoutStatus?: PayoutStatus;
  earningsGenerated?: number;
}
