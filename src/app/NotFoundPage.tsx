import { useNavigate } from 'react-router-dom'
import { Button } from '../design-system'
import { RESOURCES_PATH } from '../features/resources/routes'
import { StatePanel } from '../shared/ui/StatePanel'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <>
      <title>Page not found · Modular Form Creator</title>
      <StatePanel
        title="Page not found"
        description="There is nothing at this address. Check the link or go back to the resource list."
        action={<Button onClick={() => navigate(RESOURCES_PATH)}>Go to resources</Button>}
      />
    </>
  )
}
