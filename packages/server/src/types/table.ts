export type IdType = null | number;
export type DateType = null | string | Date;

export class UserTable {
  IdUser: IdType;
  mobile: string;
  password: string;
  createdAt: DateType = new Date();
  updatedAt: DateType = new Date();
}

export class UserDetailTable {
  IdUserDetail: IdType = null;
  IdUser: IdType;
  first: string;
  last?: null | string = null;
  createdAt: DateType = new Date();
  updatedAt: DateType = new Date();
}

export class MealCategoryTable {
  IdMealCategory: IdType = null;
  IdUser: IdType;
  title: string;
  fromTime: null | DateType = null;
  tillTime: null | DateType = null;
  createdAt: DateType = new Date();
  updatedAt: DateType = new Date();
}

export class MealCategoryMasterTable {
  IdMealCategoryMaster: IdType = null;
  title: string;
  createdAt: DateType = new Date();
}

export class MealTable {
  IdMeal: IdType = null;
  IdUser: IdType;
  IdMealCategory: IdType;
  dateTime: DateType;
  createdAt: DateType = new Date();
  updatedAt: DateType = new Date();
}

export class MealDishTable {
  IdMealDish: IdType = null;
  IdMeal: IdType;
  IdDish: IdType;
  createdAt: DateType = new Date();
}

export class DishTable {
  IdDish: IdType = null;
  IdUser: IdType;
  title: string;
  createdAt: DateType = new Date();
  updatedAt: DateType = new Date();
}

export class DishMasterTable {
  IdDishMaster: IdType = null;
  title: string;
  createdAt: DateType = new Date();
  createdBy: IdType;
}

export class MealDishIngredientTable {
  IdMealDishIngredient: IdType = null;
  IdMealDish: IdType;
  IdIngredientMaster: IdType;
  createdAt: DateType = new Date();
}

export class IngredientMasterTable {
  IdIngredientMaster: IdType = null;
  title: string;
  createdAt: DateType = new Date();
  createdBy: IdType;
}
