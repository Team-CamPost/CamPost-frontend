import { useMemo } from "react";

const PREFERRED_DEPARTMENT_KEY = "campost.preferred-department";

export function getPreferredDepartmentId() {
  return localStorage.getItem(PREFERRED_DEPARTMENT_KEY);
}

export function setPreferredDepartmentId(departmentId: string) {
  localStorage.setItem(PREFERRED_DEPARTMENT_KEY, departmentId);
}

export function clearPreferredDepartmentId() {
  localStorage.removeItem(PREFERRED_DEPARTMENT_KEY);
}

export function usePreferredDepartment() {
  return useMemo(
    () => ({
      preferredDepartmentId: getPreferredDepartmentId(),
      setPreferredDepartmentId,
      clearPreferredDepartmentId,
    }),
    [],
  );
}
