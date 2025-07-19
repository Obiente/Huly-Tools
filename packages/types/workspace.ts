export interface Workspace {
  _id: string;
  workspace: string;
  workspaceUrl: string;
  version?: any;
  branding?: string;
  workspaceName?: string;
  accounts?: any[];
  disabled: boolean;
  region?: string;
  mode?: string;
  progress?: number;
  createdOn: number;
  lastVisit?: number;
  createdBy?: string;
  lastProcessingTime?: number;
  attempts?: number;
  uuid?: string;
  message?: string;
}
