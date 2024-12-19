import { Button } from "./ui/button";

export default function AppUnauthorized() {
  return (
    <>
      <div>
        <div>
          <a href="/login">
            <Button
              type="submit"
              className="ml-1 hover:bg-gray-300 hover:text-black"
            >
              Login
            </Button>
          </a>{" "}
          <b>
            <sub> OR </sub>
          </b>
          <a href="/register">
            <Button
              type="submit"
              className="ml-1 hover:bg-gray-300 hover:text-black"
            >
              SignUp
            </Button>
          </a>
        </div>
        <sub>to use the website freely.</sub>
      </div>
    </>
  );
}
