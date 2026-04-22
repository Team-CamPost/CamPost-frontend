export type Department = {
  id: string;
  name: string;
  backendDeptCode: string;
};

export const DEPARTMENTS: Department[] = [
  { id: "sw", name: "소프트웨어학과", backendDeptCode: "SW" },
  { id: "cse", name: "컴퓨터공학과", backendDeptCode: "ACE" },
  { id: "sds", name: "통계데이터사이언스학과", backendDeptCode: "STAT" },
  { id: "cybersec", name: "사이버보안학과", backendDeptCode: "INDSEC" },
  { id: "ai", name: "인공지능학과", backendDeptCode: "AI" },
];

export const getDepartmentById = (departmentId: string) =>
  DEPARTMENTS.find((department) => department.id === departmentId);

export const getBackendDeptCodeByDepartmentId = (departmentId: string) => {
  const department = getDepartmentById(departmentId);
  return department?.backendDeptCode || "SW";
};
