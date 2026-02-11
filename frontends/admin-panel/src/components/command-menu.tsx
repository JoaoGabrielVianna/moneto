import React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ChevronRight, Laptop, Moon, Sun } from "lucide-react"
import { useSearch } from "@/context/search-provider"
import { useTheme } from "@/context/theme-provider"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import sidebarData from "@/components/sidebar/sidebar.json"
import type { SidebarData, SidebarItem } from "@/types/sidebar"

const data = sidebarData as SidebarData

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  // 🔹 Função recursiva para renderizar itens e subitens
  const renderItems = (items: SidebarItem[], parentLabel?: string) => {
    return items.map((item, i) => {
      // Caso o item tenha children → renderiza subitens também
      if (item.children && item.children.length > 0) {
        return (
          <React.Fragment key={`${item.label}-${i}`}>
            {item.children.map((child, j) => (
              <CommandItem
                key={`${item.label}-${child.label}-${j}`}
                value={`${item.label}-${child.label}`}
                onSelect={() => runCommand(() => navigate(child.to || "#"))}
              >
                <div className="flex size-4 items-center justify-center">
                  <ArrowRight className="text-muted-foreground/80 size-2" />
                </div>
                {item.label} <ChevronRight /> {child.label}
              </CommandItem>
            ))}
          </React.Fragment>
        )
      }

      // Item normal (sem children)
      return (
        <CommandItem
          key={`${item.label}-${i}`}
          value={item.label}
          onSelect={() => runCommand(() => navigate(item.to || "#"))}
        >
          <div className="flex size-4 items-center justify-center">
            <ArrowRight className="text-muted-foreground/80 size-2" />
          </div>
          {parentLabel ? (
            <>
              {parentLabel} <ChevronRight /> {item.label}
            </>
          ) : (
            item.label
          )}
        </CommandItem>
      )
    })
  }

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pe-1">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* 🔹 Renderização dinâmica com base no sidebarData.body */}
          {data.body.map((group, i) => (
            <CommandGroup key={group.label || i} heading={group.label}>
              {renderItems(group.items)}
            </CommandGroup>
          ))}

          <CommandSeparator />

          {/* 🔹 Seções adicionais: tema */}
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="scale-90" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
