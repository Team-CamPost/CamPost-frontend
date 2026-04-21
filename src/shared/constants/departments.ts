export type Department = {
  id: string;
  name: string;
};

export const DEPARTMENTS: Department[] = [
  { id: "sw", name: "소프트웨어학과" },
  { id: "cse", name: "컴퓨터공학과" },
  { id: "sds", name: "통계데이터사이언스학과" },
  { id: "cybersec", name: "사이버보안학과" },
  { id: "ai", name: "인공지능학과" },
];

export function getDepartmentById(departmentId: string) {
  return DEPARTMENTS.find((department) => department.id === departmentId);
}
