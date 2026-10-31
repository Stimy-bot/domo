import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">
      <main className="island-shell rise-in flex flex-col items-center justify-center max-w-400 min-h-[60vh] px-4 text-center rounded-lg">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <form className="pt-5 w-75 flex flex-col items-center">
          <h1 className="text-4xl font-semibold pt-5 mb-2">REGISTER</h1>
          <input type="text" placeholder="Enter First Name" className="demo-input m-2"/>
          <input type="text" placeholder="Enter Last Name" className="demo-input m-2"/>
          <input type="email" placeholder="Enter Email" className="demo-input m-2"/>
          <input type="text" placeholder="Enter Phone Number" className="demo-input m-2"/>
          <input type="text" placeholder="Enter Password" className="demo-input m-2"/>
          <input type="text" placeholder="Confirm Password" className="demo-input m-2"/>
          <button type="submit" className="demo-button m-2">Submit</button>
        </form>
      </main>
    </div>
  );
}
