enum CrudRole {
  ADMIN = "admin",
  USER = "user",
}

export type CrudDataItem = {
  name: string;
  role: CrudRole;
  active: boolean;
};
export const crudData: CrudDataItem[] = [
  { name: "Jane Doe", role: CrudRole.ADMIN, active: true },
  { name: "Mary Joe", role: CrudRole.USER, active: false }
];
