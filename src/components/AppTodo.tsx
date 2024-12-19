import Task from "@/lib/classes/Task";
import { TaskStatus } from "@/lib/types";
import { MouseEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { userStore } from "@/lib/stores/user";

export default function AppTodo({
  task,
  deleteTodo,
}: {
  task: Task;
  deleteTodo: (id: any) => void;
}) {
  const { user, setUser } = userStore();
  const [
    [title, setTitle],
    [description, setDescription],
    [status, setStatus],
    [needRefresh, setNeedRefresh],
  ] = [
    useState(task.data?.title || ""),
    useState(task.data?.description || ""),
    useState(task.data?.status),
    useState(false),
  ];
  useEffect(() => {}, [needRefresh]);
  const TodoColor =
    status === TaskStatus.CANCELED
      ? "bg-red-600"
      : status === TaskStatus.IN_PROGRESS
      ? "bg-blue-600"
      : status === TaskStatus.SUCCESS
      ? "bg-green-600"
      : "bg-gray-600";
  const setTaskStatus = (e: MouseEvent) => {
    e.preventDefault();
    if (status === TaskStatus.PENDING) {
      setStatus(TaskStatus.IN_PROGRESS);
    } else if (status === TaskStatus.IN_PROGRESS) {
      setStatus(TaskStatus.CANCELED);
    } else if (status === TaskStatus.CANCELED) {
      setStatus(TaskStatus.SUCCESS);
    } else if (status === TaskStatus.SUCCESS) {
      setStatus(TaskStatus.PENDING);
    }
  };
  const getTaskStatus = () => {
    switch (status) {
      case TaskStatus.SUCCESS:
        return "Success";
      case TaskStatus.CANCELED:
        return "Canceled";
      case TaskStatus.IN_PROGRESS:
        return "In Progress";
      case TaskStatus.PENDING:
        return "Pending";
    }
  };
  const needChanges = () => {
    return (
      title === task.data?.title &&
      description === task.data?.description &&
      status === task.data?.status
    );
  };
  const save = async (del: boolean) => {
    if (!(task instanceof Task)) {
      task = new Task((task as Task)?.data);
    }
    if (del) {
      await task.update({ delete: true }, user?.data?.authKey!);
      deleteTodo(task.data?.id);
      return task;
    }
    if (needChanges()) return task;
    const t = await task.update(
      {
        title,
        description,
        status,
        delete: false,
      },
      user?.data?.authKey!
    );
    setUser(user?.data?.authKey);
    return t;
  };
  return (
    <div className="bg-zinc-900 p-2 rounded-md my-1.5 w-full">
      <div className="flex text-gray-500 justify-end cursor-pointer">
        <sub
          onClick={async (e) => {
            e.preventDefault();
            await save(true);
          }}
          title="Delete?"
        >
          X
        </sub>
      </div>
      <div>
        <div className="flex">
          <div
            title={`status: ${getTaskStatus()}`}
            className="w-12 bg-zinc-800 mr-2 rounded-md flex justify-center items-center"
          >
            <div
              onClick={setTaskStatus}
              className={`cursor-pointer size-10 ${TodoColor} flex rounded-full`}
            ></div>
          </div>
          <div>
            <input
              type="text"
              className="flex text-base bg-zinc-900 w-full"
              value={title}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length > 0) setTitle(e.target.value);
              }}
            />
            <div className="flex justify-between">
              <div>
                <input
                  type="text"
                  className="bg-zinc-900 text-sm text-gray-400 ml-0.5 mt-0.5"
                  value={description}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 0) setDescription(value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!needChanges() && (
        <div className="mt-5">
          <Button
            className="bg-zinc-800 w-full"
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              e.currentTarget.textContent = "saving...";
              try {
                task = await save(false);
                setNeedRefresh(!needRefresh);
              } catch (error) {
                console.error(error);
                return ((e.target as Element).textContent = "failed to save!");
              }
            }}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
}
