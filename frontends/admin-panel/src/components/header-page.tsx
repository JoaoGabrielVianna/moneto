type HeaderPageProps = {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export function HeaderPage({ title, subtitle, children }: HeaderPageProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        )}
      </div>

      <div className="flex gap-2">{children}</div>
    </div>
  )
}
