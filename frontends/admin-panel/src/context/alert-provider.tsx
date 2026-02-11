import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react"
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AlertType = "success" | "warning" | "error" | "debug"

interface AlertData {
  id: string
  type: AlertType
  title: string
  message?: string
  duration: number
  remaining: number
  paused: boolean
  startTime: number
}

interface AlertContextProps {
  alerts: AlertData[]
  showAlert: (type: AlertType, title: string, message?: string, duration?: number) => void
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const timers = useRef<Record<string, NodeJS.Timeout>>({})

  function showAlert(type: AlertType, title: string, message?: string, duration = 4000) {
    const id = crypto.randomUUID()
    const start = Date.now()

    const alert: AlertData = { id, type, title, message, duration, remaining: duration, paused: false, startTime: start }

    setAlerts((prev) => [...prev, alert])
    timers.current[id] = setTimeout(() => removeAlert(id), duration)
  }

  function removeAlert(id: string) {
    clearTimeout(timers.current[id])
    delete timers.current[id]
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  function pause(id: string) {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== id || a.paused) return a
        const elapsed = Date.now() - a.startTime
        const remaining = Math.max(a.remaining - elapsed, 0)
        clearTimeout(timers.current[id])
        return { ...a, remaining, paused: true }
      })
    )
  }

  function resume(id: string) {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== id || !a.paused) return a
        const startTime = Date.now()
        timers.current[id] = setTimeout(() => removeAlert(id), a.remaining)
        return { ...a, paused: false, startTime }
      })
    )
  }

  return (
    <AlertContext.Provider value={{ alerts, showAlert }}>
      {children}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 items-end">
        {alerts.map((a) => (
          <AlertItem key={a.id} alert={a} onPause={pause} onResume={resume} onRemove={removeAlert} />
        ))}
      </div>
    </AlertContext.Provider>
  )
}

function AlertItem({
  alert,
  onPause,
  onResume,
  onRemove,
}: {
  alert: AlertData
  onPause: (id: string) => void
  onResume: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [width, setWidth] = useState(100)

  // inicia animação da barra
  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(0))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (alert.paused) {
      setWidth((alert.remaining / alert.duration) * 100)
    } else {
      const frame = requestAnimationFrame(() => setWidth(0))
      return () => cancelAnimationFrame(frame)
    }
  }, [alert.paused])

  const getIcon = () => {
    switch (alert.type) {
      case "success":
        return <CheckCircle2Icon className="text-green-500" />
      case "warning":
        return <PopcornIcon className="text-yellow-500" />
      case "error":
        return <AlertCircleIcon className="text-red-500" />
      default:
        return <AlertCircleIcon className="text-blue-500" />
    }
  }

  const barColor =
    alert.type === "success"
      ? "bg-green-500/70"
      : alert.type === "warning"
      ? "bg-yellow-500/70"
      : alert.type === "error"
      ? "bg-red-500/70"
      : "bg-blue-500/70"

  return (
    <div
      onMouseEnter={() => onPause(alert.id)}
      onMouseLeave={() => onResume(alert.id)}
      className="relative animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <Alert className="max-w-sm shadow-lg overflow-hidden">
        {getIcon()}
        <div>
          <AlertTitle>{alert.title}</AlertTitle>
          {alert.message && <AlertDescription>{alert.message}</AlertDescription>}
        </div>

        {/* Barra de tempo simples */}
        <div
          className={`absolute bottom-0 left-0 h-[3px] ${barColor} transition-[width] ease-linear`}
          style={{
            width: `${width}%`,
            transitionDuration: alert.paused ? "0ms" : `${alert.remaining}ms`,
          }}
        />
      </Alert>
    </div>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) throw new Error("useAlert deve ser usado dentro de um AlertProvider")
  return context
}
