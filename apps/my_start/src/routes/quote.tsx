import { createFileRoute } from '@tanstack/react-router';
import { Quote } from '../pages/Quote';

export const Route = createFileRoute('/quote')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Quote />;
}
