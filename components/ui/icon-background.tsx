import { appConfig } from '@/lib/config'
import { cn } from '@/lib/utils'

export const IconBackground = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        appConfig.iconBackground,
        'flex items-center justify-center rounded-lg',
        className
      )}
    >
      {children}
    </div>
  )
}
