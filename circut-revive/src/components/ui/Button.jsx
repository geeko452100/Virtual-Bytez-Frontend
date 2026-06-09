import { cn } from '../../lib/cn'

const variants = {
  default: 'btn',
  primary: 'btn btn-primary',
  ghost: 'btn btn-ghost',
}

const sizes = {
  default: '',
  sm: 'btn-sm',
  lg: 'btn-lg',
}

export default function Button({
  variant = 'default',
  size = 'default',
  className,
  as: Component = 'button',
  ...props
}) {
  return (
    <Component
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    />
  )
}
