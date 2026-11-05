import { createFileRoute } from '@tanstack/react-router'
import { Quote } from '@domo/forms'

export const Route = createFileRoute('/quote')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Quote />
}
