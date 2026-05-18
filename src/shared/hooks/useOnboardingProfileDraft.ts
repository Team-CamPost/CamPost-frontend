const ONBOARDING_PROFILE_DRAFT_KEY = "campost.onboarding-profile-draft";
const ONBOARDING_PROFILE_COMPLETED_PREFIX =
  "campost.onboarding-profile-completed";

export type OnboardingProfileDraft = {
  departmentId: string;
  departmentCode: string;
  grade: number;
  nickname: string;
};

export const saveOnboardingProfileDraft = (profile: OnboardingProfileDraft) => {
  localStorage.setItem(ONBOARDING_PROFILE_DRAFT_KEY, JSON.stringify(profile));
};

export const getOnboardingProfileDraft = () => {
  const storedProfile = localStorage.getItem(ONBOARDING_PROFILE_DRAFT_KEY);

  if (!storedProfile) {
    return null;
  }

  try {
    return JSON.parse(storedProfile) as OnboardingProfileDraft;
  } catch {
    localStorage.removeItem(ONBOARDING_PROFILE_DRAFT_KEY);
    return null;
  }
};

export const clearOnboardingProfileDraft = () => {
  localStorage.removeItem(ONBOARDING_PROFILE_DRAFT_KEY);
};

const getCompletedKey = (username: string) =>
  `${ONBOARDING_PROFILE_COMPLETED_PREFIX}.${username}`;

export const isOnboardingProfileCompleted = (username: string) => {
  if (!username.trim()) {
    return false;
  }

  return localStorage.getItem(getCompletedKey(username.trim())) === "true";
};

export const markOnboardingProfileCompleted = (username: string) => {
  if (!username.trim()) {
    return;
  }

  localStorage.setItem(getCompletedKey(username.trim()), "true");
};
