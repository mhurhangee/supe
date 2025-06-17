import { appConfig } from '@/lib/config'

import { IconBackground } from './icon-background'

export const Logo = ({ iconSize, bgSize }: { iconSize?: string; bgSize?: string }) => {
  return (
    <IconBackground className={bgSize}>
      <appConfig.icon className={iconSize} />
    </IconBackground>
  )
}
