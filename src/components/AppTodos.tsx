import Task from "@/lib/classes/Task";
import AppTodo from "./AppTodo";
import { useEffect, useState } from "react";
import { userStore } from "@/lib/stores/user";

export default function AppTodos({
  page,
  setKey,
}: {
  page: number;
  setKey: any;
}) {
  const { user } = userStore();
  const [tasks, setTasks] = useState<Array<Task> | undefined>(undefined);
  useEffect(() => {
    user
      ?.listTasks(page)
      .then((T) => {
        setTasks(T || []);
      })
      .catch(console.error);
  }, [JSON.stringify(tasks)]);

  return typeof tasks === "undefined" ? (
    <>
      <div className="m-3">
        <b>LOADING...</b>
      </div>
    </>
  ) : (
    <div className="flex m-3">
      <div className="w-full">
        {tasks.map((task) => {
          return (
            <AppTodo
              key={task.data?.id}
              task={task}
              deleteTodo={(id: any) => {
                const T = [...tasks];
                T.splice(
                  tasks.findIndex((e) => e.data?.id === id),
                  1
                );
                setTasks(T);
                setKey(Date.now());
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
