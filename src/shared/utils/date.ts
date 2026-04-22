export const formatDate = (
  value: string | null | undefined,
  fallback = "-",
) => {
  if (!value) return fallback;
  return value.replaceAll("-", ".");
};

export const getDDay = (deadline: string | null | undefined) => {
  if (!deadline) return null;

  const today = new Date();
  const baseDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const targetDate = new Date(`${deadline}T00:00:00`);

  if (Number.isNaN(targetDate.getTime())) {
    return null;
  }

  const diffMs = targetDate.getTime() - baseDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export const getDateSortValue = (value: string | null | undefined) => {
  if (!value) return 0;
  const parsed = Date.parse(value.replaceAll(".", "-"));
  return Number.isNaN(parsed) ? 0 : parsed;
};
