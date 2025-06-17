import { cn } from "@/lib/utils";

import { appConfig } from "@/lib/config"

export const IconBackground = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={cn(appConfig.iconBackground, "rounded-lg flex items-center justify-center", className)}>
            {children}
        </div>
    )
}