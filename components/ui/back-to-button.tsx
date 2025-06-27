import { Button } from "./button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const BackToButton = ({ href, label = 'Back' }: { href: string, label?: string }) => {
    return (
        <Link href={href}>
          <Button size="sm" variant="ghost" className="text-muted-foreground text-sm">
            <ArrowLeft className="h-4 w-4" />
            {label}
          </Button>
        </Link>
    )
}