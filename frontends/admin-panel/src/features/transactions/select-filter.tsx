"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

export type SelectFilterItem = {
    label: string
    value: string
    color?: string
    icon?: React.ReactNode
    count?: number
}

type SelectFilterProps = {
    label: string
    items: SelectFilterItem[]
    placeholder?: string
    selected?: string[]
    onChange?: (selected: string[]) => void
}

export function SelectFilter({
    label,
    items,
    placeholder = label,
    selected: selectedProps,
    onChange,
}: SelectFilterProps) {
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<string[]>(selectedProps || [])
    

    React.useEffect(() => {
        if (selectedProps) setSelected(selectedProps)
    }, [selectedProps])

    const [pending, setPending] = React.useState<string[] | null>(null)

    const toggleItem = (value: string) => {
        setSelected((prev) => {
            const next = prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
            setPending(next)
            return next
        })
    }

    React.useEffect(() => {
        if (pending) {
            onChange?.(pending)
            setPending(null)
        }
    }, [pending, onChange])


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "justify-between gap-2 rounded-md px-3 text-sm font-medium",
                        selected.length > 0 && "border-primary text-primary"
                    )}
                >
                    <span>{label}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[220px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={placeholder} />
                    <CommandList>
                        <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                        <CommandGroup>
                            {items.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    onSelect={() => toggleItem(item.value)}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        {/* 🔹 Se tiver cor, mostra um círculo colorido */}
                                        {item.color ? (
                                            <div
                                                className={cn(
                                                    "h-3 w-3 rounded-full border border-muted",
                                                    item.color
                                                )}
                                            />
                                        ) : (
                                            item.icon
                                        )}
                                        <span>{item.label}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {item.count !== undefined && (
                                            <span className="text-xs text-muted-foreground">
                                                {item.count}
                                            </span>
                                        )}
                                        <Check
                                            className={cn(
                                                "h-4 w-4 transition-opacity",
                                                selected.includes(item.value)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
