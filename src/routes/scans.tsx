import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/scans')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/scans"!</div>
}
