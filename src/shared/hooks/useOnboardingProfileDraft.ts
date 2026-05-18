const ONBOARDING_PROFILE_DRAFT_KEY = "campost.onboarding-profile-draft";

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
