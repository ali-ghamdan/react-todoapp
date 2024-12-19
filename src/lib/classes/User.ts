import axios from "axios";
import {
  createAccountData,
  createTaskData,
  loginAccountData,
  UserData,
} from "../types";
import Task from "./Task";
import { tryCatch } from "../utils";

export default class User {
  constructor(public data: UserData | undefined = {} as UserData) {}
  private apiBase = "http://localhost:3000";
  async create(data: createAccountData) {
    const [error1, _] = await tryCatch(() =>
      axios.post(`${this.apiBase}/auth/register`, {
        username: data.username,
        email: data.email,
        password: data.password,
      })
    );
    if (error1?.status == 409)
      throw new Error("Try another Email, an already existed Account.");
    await this.login({ email: data.email, password: data.password });
    return this;
  }

  async login(data: loginAccountData) {
    const [error1, d] = await tryCatch(() =>
      axios.post(`${this.apiBase}/auth/login`, {
        email: data.email,
        password: data.password,
      })
    );
    if (error1) throw error1;
    const accessToken = d?.data.access_token;
    this.data!.authKey = accessToken;
    await this.fetch(accessToken);
    const tasks = await this.listAllTasks();
    this.data!.tasksCount = tasks.length;
    this.data!.tasksPagesCount = Math.ceil(tasks.length / 10);
    return this;
  }

  async listAllTasks() {
    let n = 1;
    const l: Array<Task> = [];
    let tasks = await this.listTasks(n);
    l.push(...tasks);
    while (tasks.length >= 10) {
      if (tasks.length < 10) break;
      tasks = await this.listTasks(++n);
      l.push(...tasks);
    }
    this.data!.tasksPagesCount = Math.ceil(l.length / 10);
    return l;
  }

  async fetch(token: string) {
    if (!token) throw new Error("TOKEN WASN'T FOUND...");
    this.data = { authKey: token } as UserData;
    const [err, usr] = await tryCatch(() => this.profile());
    if (err) {
      this.data = undefined;
      throw err;
    }
    this.data.username = usr.username;
    this.data.createdAt = usr.createdAt;
    this.data.updatedAt = usr.updatedAt;
    this.data.admin = usr.admin; // TODO: make it in the server side;

    return this;
  }
  async profile() {
    const [error1, d] = await tryCatch(() =>
      axios.get(`${this.apiBase}/auth/profile`, {
        headers: {
          Authorization: this.data?.authKey,
        },
      })
    );
    if (error1) throw error1;
    return d?.data;
  }

  async listTasks(page: number = 1) {
    const [error1, d] = await tryCatch(() =>
      axios.get(`${this.apiBase}/tasks?page=${page}`, {
        headers: {
          Authorization: this.data?.authKey,
        },
      })
    );
    if (error1) throw error1;

    return (
      d?.data?.map?.(
        (t: any) =>
          new Task({
            id: t._id,
            title: t.title,
            description: t.description,
            status: t.status,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          })
      ) || []
    );
  }

  async getTasksPagesCount() {
    const [error1, d] = await tryCatch(() =>
      axios.get(`${this.apiBase}/tasks/count`, {
        headers: {
          Authorization: this.data?.authKey,
        },
      })
    );
    if (error1) throw error1;

    return d?.data;
  }

  async delete() {
    if (!this.data?.authKey) throw new Error("user wasn't found to delete it.");
    //TODO: await tryCatch(())
    this.data = undefined;
    return this;
  }

  async createTask(data: createTaskData) {
    if (!this.data?.authKey) throw new Error("please login first.");
    const [error1, d] = await tryCatch(() =>
      axios.post(
        `${this.apiBase}/tasks`,
        {
          title: data.title,
          description: data.description,
          status: data.status,
        },
        {
          headers: {
            Authorization: this.data?.authKey,
          },
        }
      )
    );
    if (error1) throw error1;
    const task = new Task({
      id: d?.data._id,
      title: d?.data.title,
      description: d?.data.description,
      status: d?.data.status,
      createdAt: new Date(d?.data.createdAt),
      updatedAt: new Date(d?.data.updatedAt),
    });
    return task;
  }
}
