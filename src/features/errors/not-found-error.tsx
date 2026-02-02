import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

export function NotFoundError() {
  const navigate = useNavigate()
  const { history } = useRouter()
  const { auth } = useAuthStore()
  
  const handleGoHome = () => {
    if (auth.accessToken) {
      // Navigate to root, which will redirect to dashboard
      window.location.href = '/'
    } else {
      window.location.href = '/sign-in'
    }
  }
  
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>Oops! Page Not Found!</span>
        <p className='text-center text-muted-foreground'>
          It seems like the page you're looking for <br />
          does not exist or might have been removed.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            Go Back
          </Button>
          <Button onClick={handleGoHome}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
