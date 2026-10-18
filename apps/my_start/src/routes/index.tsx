import { UiButton } from '@domo/ui-buttons'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (

       <UiButton>Click me</UiButton>

  )
}