import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

function getErrorMessage(code: string) {
  const errorMap: Record<string, string> = {
    access_denied: "You do not have permission to access this resource.",
    configuration: "There is a problem with the server configuration.",
    verification: "The verification link may have expired or has already been used.",
    default: "An unexpected error occurred. Please try again later."
  }

  return errorMap[code] || errorMap.default
}

export default async function ErrorPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ error?: string }> 
}) {
  const params = await searchParams
  const errorCode = params?.error || 'default'
  const message = getErrorMessage(errorCode)

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-gray-50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="border-red-100 shadow-lg">
          <CardHeader className="flex flex- col items-center gap-2 pb-2 text-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Something went wrong
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 leading-relaxed">
              {message}
            </p>
            {params?.error && (
              <p className="mt-4 text-xs font-mono text-gray-400 bg-gray-100 p-1 rounded inline-block">
                Code: {params.error}
              </p>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}