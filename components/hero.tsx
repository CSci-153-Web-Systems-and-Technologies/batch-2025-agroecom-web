// components/ui/hero.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const heroVariants = cva(
  "flex flex-col justify-center py-16 px-4 sm:px-6 lg:px-8 w-full relative",
  {
    variants: {
      variant: {
        default: "bg-white",
        primary: "bg-gradient-to-r from-green-50 to-emerald-50",
        secondary: "bg-gradient-to-r from-gray-50 to-green-50",
        dark: "bg-gray-900 text-white",
      },
      align: {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right",
      },
      size: {
        default: "min-h-[400px]",
        sm: "min-h-[300px]",
        lg: "min-h-[500px]",
        full: "min-h-[calc(100vh-4rem)]",
      },
    },
    defaultVariants: {
      variant: "default",
      align: "center",
      size: "default",
    },
  }
)

export interface HeroProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof heroVariants> {
  title?: string
  subtitle?: string
  description?: string
  backgroundImage?: string
  overlay?: boolean
  darkenImage?: boolean 
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  ({ 
    className, 
    variant, 
    align, 
    size, 
    title, 
    subtitle, 
    description, 
    backgroundImage,
    darkenImage = true, 
    children,
    ...props 
  }, ref) => {

    return (
      <section
        ref={ref}
        className={cn(heroVariants({ variant, align, size, className }))}
        {...props}
      >
        {backgroundImage && (
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: darkenImage ? 'brightness(50%)' : 'none',
            }}
          />
        )}
        
        <div className={cn(
          "container mx-auto relative z-10 max-w-4xl",
          align === "center" && "text-center mx-auto",
          align === "right" && "text-right ml-auto",
        )}>
          {subtitle && (
            <p className="text-lg font-medium text-(--btn-primary) mb-2">
              {subtitle}
            </p>
          )}
          
          {title && (
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              {title}
            </h1>
          )}
          
          {description && (
            <p className="mt-4 text-lg text-white max-w-2xl">
              {description}
            </p>
          )}
          
          {children && (
            <div className="mt-8">
              {children}
            </div>
          )}
        </div>
      </section>
    )
  }
)
Hero.displayName = "Hero"

export { Hero, heroVariants }