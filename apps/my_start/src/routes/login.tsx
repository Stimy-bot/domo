import { createFileRoute } from "@tanstack/react-router";
// import { Input } from '@domo/reusableComponents'
export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center items-center">
  <form className="flex flex-col items-center">
      <p className="text-4xl">Sign In</p>
      <input type="email" placeholder="Enter Email" />
      <input type="text" placeholder="Enter Password" />
    </form>
    </div>
  );
}
