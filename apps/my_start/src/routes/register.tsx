import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <form className="pt-5 flex flex-col items-center border size-1/3 rounded-md">
      <p className="text-4xl mb-3">Register</p>
      <input type="text" placeholder="Enter First Name" className="mb-3" />
      <input type="text" placeholder="Enter Last Name" className="mb-3" />
      <input type="email" placeholder="Enter Email" className="mb-3" />
      <input type="text" placeholder="Enter Phone Number" className="mb-3" />
      <input type="text" placeholder="Enter Password" className="mb-3" />
      <input type="text" placeholder="Confirm Password" className="mb-3" />
      <button type="submit">Submit</button>
    </form>
  );
}
