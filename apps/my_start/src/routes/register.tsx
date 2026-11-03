import { createFileRoute } from '@tanstack/react-router'
import { AppRegister } from '@domo/forms'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return  < AppRegister/>
}
