export type IdType = number;
export type DateType = string | Date;

export interface UserTableType {
  IdUser: IdType;
  mobile: string;
  password: string;
  createdAt: DateType;
  updatedAt: DateType;
}

export interface UserDetailTableType {
  IdUserDetail: IdType;
  IdUser: IdType;
  first: string;
  last?: string;
  createdAt: DateType;
  updatedAt: DateType;
}

export interface MealTypeTableType {
  IdMealType: IdType;
  IdUser: IdType;
  title: string;
  fromTime: null | DateType;
  tillTime: null | DateType;
  createdAt: DateType;
  updatedAt: DateType;
}

export interface MealTypeMasterTableType {
  IdMealTypeMaster: IdType;
  title: string;
  createdAt: DateType;
}
