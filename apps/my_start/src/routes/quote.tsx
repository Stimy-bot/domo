import { Quote } from '../pages/Quote'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/quote')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Quote />
}
