import axios from "axios";
import { TaskData, updateTaskData } from "../types";
import { tryCatch } from "../utils";

export default class Task {
  constructor(public data: TaskData | undefined) {}
  private apiBase = "http://localhost:3000";

  async fetch(accessToken: string) {
    if (!this.data?.id) throw new Error("fetching non created todo...?");
    const [error1, d] = await tryCatch(() =>
      axios.get(`${this.apiBase}/tasks/${this.data?.id}`, {
        headers: {
          Authorization: accessToken,
        },
      })
    );
    if (error1) throw error1;
    this.data.id = d?.data._id;
    this.data.title = d?.data.title;
    this.data.description = d?.data.description;
    this.data.status = d?.data.status;
    this.data.createdAt = d?.data.createdAt;
    this.data.updatedAt = d?.data.updatedAt;
    return this.data;
  }

  async update(data: updateTaskData, accessToken: string) {
    if (!this.data || !this.data?.id)
      throw new TypeError(
        "You can't update a non created Task, create it first."
      );
    if (Object.keys(data).length < 1)
      throw new Error("You must have at least one value to update");

    const [error1, d] = await tryCatch(() =>
      axios.put(
        `${this.apiBase}/tasks/${this.data?.id}`,
        {
          title: data.title,
          description: data.description,
          status: data.status,
          isDeleted: data.delete,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      )
    );
    if (error1) throw error1;
    if (data.title) this.data!.title = d?.data.title;
    if (data.description) this.data!.description = d?.data.description;
    if (data.status) this.data!.status = d?.data.status;
    if (data.delete) this.data = undefined;

    return this;
  }
}
