export enum TaskStatus {
  PENDING = 1,
  SUCCESS = 2,
  CANCELED = 3,
  IN_PROGRESS = 4,
}

export interface createAccountData {
  username: string;
  email: string;
  password: string;
}

export interface loginAccountData {
  email: string;
  password: string;
}

export interface UserData {
  authKey: string;
  username: string;
  email: string;
  tasksCount: number;
  tasksPagesCount: number;
  admin?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface createTaskData {
  title: string;
  description: string;
  status: TaskStatus;
}

export interface updateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  delete?: boolean;
}

export interface TaskData {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
