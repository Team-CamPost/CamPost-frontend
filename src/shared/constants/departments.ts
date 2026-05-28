export type Department = {
  id: string;
  name: string;
  backendDeptCode: string;
};

export const DEFAULT_DEPARTMENT_ID = "sw";
export const DEFAULT_BACKEND_DEPT_CODE = "SW";

export const DEPARTMENTS: Department[] = [
  {
    id: DEFAULT_DEPARTMENT_ID,
    name: "소프트웨어학과",
    backendDeptCode: DEFAULT_BACKEND_DEPT_CODE,
  },
  { id: "cse", name: "컴퓨터공학과", backendDeptCode: "ACE" },
  { id: "mobile", name: "모바일시스템공학과", backendDeptCode: "MOBILE" },
  { id: "sds", name: "통계사이언스학과", backendDeptCode: "STAT" },
  { id: "cybersec", name: "사이버보안학과", backendDeptCode: "INDSEC" },
  { id: "swcu", name: "SW중심대학사업단", backendDeptCode: "SWCU" },
];

export const getDepartmentById = (departmentId: string) =>
  DEPARTMENTS.find((department) => department.id === departmentId);

export const getBackendDeptCodeByDepartmentId = (departmentId: string) => {
  const department = getDepartmentById(departmentId);
  return department?.backendDeptCode || DEFAULT_BACKEND_DEPT_CODE;
};
