export type PlanId = "akwaba" | "premium";

export type MobileMoneyProvider = "orange" | "mtn" | "moov" | "wave";

export interface EmergencyContact {
  id: string;
  label: string;
  fullName: string;
  phone: string;
}

export interface TrustedNumber {
  id: string;
  label: string;
  fullName: string;
  phone: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  commune: string;
  accessCode?: string;
  createdAt: string;
  plan: PlanId;
  trialEndsAt: string;
  subscriptionActiveUntil: string | null;
  acceptedTermsAt: string | null;
  emergencyContacts: EmergencyContact[];
  trustedNumbers: TrustedNumber[];
}

export type ViolenceAlertStatus = "active" | "stopped" | "resolved";

export interface ViolenceAlert {
  id: string;
  victimPhone: string;
  victimName: string;
  triggeredBy: "cri" | "manuel";
  status: ViolenceAlertStatus;
  createdAt: string;
  updatedAt: string;
  location: { latitude: number; longitude: number } | null;
  stoppedBy: string[];
}

export type KidnapTrackingStatus = "active" | "inactive";

export interface KidnapLocationPing {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  phone: string;
  role: "admin_principal" | "editeur";
  permissions: EditorPermission[];
  status: "actif" | "en_attente" | "suspendu";
}

export type EditorPermission =
  | "gerer_inscriptions"
  | "gerer_forfaits"
  | "gerer_paiements"
  | "gerer_editeurs";

export interface PaymentRecord {
  id: string;
  userPhone: string;
  userName: string;
  amount: number;
  provider: MobileMoneyProvider;
  plan: PlanId;
  status: "reussi" | "en_attente" | "echoue";
  createdAt: string;
}
