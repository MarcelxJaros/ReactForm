export type FormView = "new" | "edit" | "display" | "admin";

export interface IFormSettings {
  view: FormView;
  itemId: number;
}