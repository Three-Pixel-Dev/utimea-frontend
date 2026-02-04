import { type ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/UIT-Logo.webp"
      alt="Utimea Admin Logo"
      className={cn('h-6 w-auto', className)}
      {...props}
    />
  )
}
