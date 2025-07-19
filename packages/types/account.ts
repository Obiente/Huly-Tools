export interface Account {
  _id: string;
  email: string;
  first: string;
  last: string;
  confirmed: boolean;
  createdOn: number;
  workspaces: string[];
}
