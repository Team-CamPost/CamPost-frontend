import { useCallback, useState } from "react";

const PREFERRED_DEPARTMENT_KEY = "campost.preferred-department";

export const getPreferredDepartmentId = () =>
  localStorage.getItem(PREFERRED_DEPARTMENT_KEY);

export const setPreferredDepartmentId = (departmentId: string) => {
  localStorage.setItem(PREFERRED_DEPARTMENT_KEY, departmentId);
};

export const clearPreferredDepartmentId = () => {
  localStorage.removeItem(PREFERRED_DEPARTMENT_KEY);
};

export const usePreferredDepartment = () => {
  const [preferredDepartmentId, setPreferredDepartmentIdState] = useState(
    getPreferredDepartmentId,
  );

  const handleSetPreferredDepartmentId = useCallback((departmentId: string) => {
    setPreferredDepartmentId(departmentId);
    setPreferredDepartmentIdState(departmentId);
  }, []);

  const handleClearPreferredDepartmentId = useCallback(() => {
    clearPreferredDepartmentId();
    setPreferredDepartmentIdState(null);
  }, []);

  return {
    preferredDepartmentId,
    setPreferredDepartmentId: handleSetPreferredDepartmentId,
    clearPreferredDepartmentId: handleClearPreferredDepartmentId,
  };
};
