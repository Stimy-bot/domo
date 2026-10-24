import { Input } from '@domo/reusableComponents';
import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center items-center">
      <form className="flex flex-col items-center">
        <p className="text-4xl">Sign In</p>
        <Input type="email" placeholder="Enter Email" />
        <Input type="text" placeholder="Enter Password" />
      </form>
    </div>
  );
}
