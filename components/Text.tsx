// components/ui/text.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  variant?: "default" | "muted" | "lead" | "small" | "large"
  align?: "left" | "center" | "right"
  weight?: "normal" | "medium" | "semibold" | "bold"
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ 
    className,
    as: Component = "p",
    variant = "default",
    align = "left",
    weight = "normal",
    ...props 
  }, ref) => {
    const Comp = Component as React.ElementType

    return (
      <Comp
        ref={ref as React.Ref<HTMLElement>}
        className={cn(
          variant === "muted" && "text-gray-500",
          variant === "lead" && "text-lg text-gray-700",
          variant === "small" && "text-sm text-gray-600",
          variant === "large" && "text-lg font-medium",
          align === "center" && "text-center",
          align === "right" && "text-right",
          weight === "medium" && "font-medium",
          weight === "semibold" && "font-semibold",
          weight === "bold" && "font-bold",
          className
        )}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

export { Text }