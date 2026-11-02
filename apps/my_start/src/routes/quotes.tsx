import { createFileRoute } from '@tanstack/react-router'
import { AppQuote } from '@domo/forms'

export const Route = createFileRoute('/quotes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AppQuote />
}
