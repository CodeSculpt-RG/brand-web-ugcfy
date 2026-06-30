export type BrandAccessStatus =
  | "incomplete"
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "on_hold";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getBrandAccessStatus(profile: any): BrandAccessStatus {
  if (!profile) return "incomplete";

  const approvalStatus = (profile.approval_status || "").toLowerCase();
  const kycStatus = (profile.kyc_status || "").toLowerCase();
  const onboardingStatus = (profile.onboarding_status || "").toLowerCase();
  const status = (profile.status || "").toLowerCase();

  const isApproved =
    approvalStatus === "approved" ||
    approvalStatus === "verified" ||
    approvalStatus === "active" ||
    approvalStatus === "completed" ||
    kycStatus === "approved" ||
    kycStatus === "verified" ||
    kycStatus === "completed" ||
    status === "approved" ||
    status === "active";

  if (isApproved) return "approved";

  const isPending =
    approvalStatus === "pending" ||
    approvalStatus === "pending_verification" ||
    approvalStatus === "under_review" ||
    kycStatus === "pending" ||
    kycStatus === "pending_verification" ||
    kycStatus === "submitted" ||
    kycStatus === "under_review" ||
    onboardingStatus === "submitted" ||
    onboardingStatus === "under_review" ||
    status === "pending";

  if (isPending) return "pending";

  const isRejected =
    approvalStatus === "rejected" ||
    approvalStatus === "declined" ||
    kycStatus === "rejected" ||
    kycStatus === "declined" ||
    status === "rejected";

  if (isRejected) return "rejected";

  const isOnHold =
    approvalStatus === "on_hold" ||
    approvalStatus === "needs_changes" ||
    approvalStatus === "changes_requested" ||
    kycStatus === "on_hold" ||
    kycStatus === "needs_changes" ||
    kycStatus === "changes_requested" ||
    status === "on_hold";

  if (isOnHold) return "on_hold";

  if (
    approvalStatus === "draft" ||
    approvalStatus === "profile_incomplete" ||
    approvalStatus === "incomplete" ||
    kycStatus === "draft" ||
    kycStatus === "not_started" ||
    kycStatus === "not_submitted" ||
    onboardingStatus === "draft" ||
    onboardingStatus === "in_progress"
  ) {
    return "draft";
  }

  return "incomplete";
}
