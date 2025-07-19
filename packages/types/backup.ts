export interface Backup {
  _id: string;
  workspaceId: string;
  name: string;
  createdOn: number;
  size: number;
  status: 'pending' | 'completed' | 'failed';
}
