import { createFileRoute } from '@tanstack/react-router'
import { Register } from '@domo/forms'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return  < Register/>
}
