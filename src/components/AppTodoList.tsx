import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TaskStatus } from "@/lib/types";
import { inputsStyle } from "@/lib/constants";
import AppUnauthorized from "./AppUnauthorized";
import { userStore } from "@/lib/stores/user";
import AppTodos from "./AppTodos";
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";

// TODO: change isUser into userId, or use context for userID.
export default function AppTodoList() {
  const { user } = userStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [page, set_page] = useState(1);
  const [key, setKey] = useState(Date.now());
  const [pages, setPages] = useState(0);
  const setPage = (p: number) => {
    set_page(p);
    setKey(Date.now());
  };
  const getPages = () => {
    const PP: Array<number> = [];
    for (let i = 0; i < pages; i++) {
      if (PP.length >= 5) break;
      PP.push(i);
    }
    console.log({ pages });
    if (PP.length === 0) return [0];
    return PP;
  };

  useEffect(() => {
    user
      ?.getTasksPagesCount()
      .then((c) => setPages(Math.ceil(c / 10)))
      .catch(console.error);
  }, [key]);

  if (!user?.data?.authKey) return <AppUnauthorized />;
  return (
    <>
      <div
        className="bg-zinc-950 max-w-prose p-4 rounded-lg"
        style={{ width: "80vw" }}
      >
        <div className="bg-zinc-900 rounded-sm p-2 m-2 pr-6">
          <div className="mt-1">
            <Label className="flex ml-4">
              <sub>Create new Todo</sub>
            </Label>
            <Input
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className={inputsStyle}
              placeholder="Title"
            />
            <Input
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className={inputsStyle}
              placeholder="Description"
            />
          </div>
          <div className="flex justify-end mt-5">
            <Button
              className={`bg-zinc-800 ${
                title === "" || description === "" ? "cursor-not-allowed" : ""
              }`}
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                const B = e.target as HTMLButtonElement;
                B.innerHTML = "Creating...";
                B.disabled = true;
                await user.createTask({
                  title,
                  description,
                  status: TaskStatus.PENDING,
                });
                B.innerHTML = "Create";
                B.disabled = false;
                setKey(Date.now());
              }}
              disabled={title === "" || description === ""}
            >
              Create
            </Button>
          </div>
        </div>

        {pages > 0 ? (
          <>
            <hr className="border-zinc-600" />
            <div className="flex ml-0.5 mt-1">
              <Label className="text-2xl">
                <sup>TODOs</sup>
              </Label>
            </div>
            <div>
              <AppTodos page={page} key={key} setKey={setKey} />
            </div>
            <hr className="border-zinc-600" />
            <div className="flex justify-center m-3">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      className="cursor-pointer bg-zinc-950 text-zinc-200 hover:bg-zinc-900 border-none"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page - 1);
                      }}
                      disabled={page === 1}
                    >
                      <span className="mr-0">{"<"}</span> Previous
                    </Button>
                  </PaginationItem>
                  {getPages().map((i) => {
                    return (
                      <>
                        <PaginationItem>
                          <Button
                            className={`cursor-pointer bg-zinc-950 text-zinc-200 ${
                              page === i + 1 ? "border-zinc-700" : "border-none"
                            }`}
                            variant={"outline"}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </Button>
                        </PaginationItem>
                      </>
                    );
                  })}
                  <PaginationItem>
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(page + 1);
                      }}
                      className="cursor-pointer bg-zinc-950 text-zinc-200 hover:bg-zinc-900 border-none"
                      disabled={page === user.data.tasksPagesCount}
                    >
                      Next <span className="mr-0">{">"}</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
