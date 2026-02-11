import sidebarDataJson from "./sidebar.json";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
    ChevronsUpDown,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SidebarData } from "@/types/sidebar";
import * as Icons from "lucide-react";


import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "@/context/alert-provider";
import { useState } from "react";
import { ConfirmDialog } from "../confirm-dialog";

const sidebarData = sidebarDataJson as SidebarData;

export function AppSidebar() {
    const { showAlert } = useAlert()
    const [openConfirm, setOpenConfirm] = useState(false);
    const navigate = useNavigate()
    const actions = {
        handleUpgrade: () => showAlert("warning","Upgrade to Moneto Pro"),
        handleLogout: () => setOpenConfirm(true),
        handleTest: () => showAlert("success", "Login realizado com sucesso!", `Bem-vindo`)

    };

    const handleLogout = () => {
        showAlert("success", "Sessão encerrada", "Você saiu da sua conta com sucesso!");
        localStorage.clear();
        navigate("/login")
    };

    // 🔹 Ícone padrão e dinâmico (usado em header + footer)
    const HeaderIcon =
        sidebarData.header?.logo && typeof sidebarData.header.logo === "string"
            ? (Icons[sidebarData.header.logo as keyof typeof Icons] as React.ComponentType<any>)
            : Icons.GalleryVerticalEnd;

    return (
        <Sidebar collapsible="icon">
            {/* === HEADER === */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#" className="flex items-center gap-3">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <HeaderIcon className="size-4" />
                                </div>

                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">{sidebarData.header!.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {sidebarData.header!.subtitle}
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* === BODY === */}
            <SidebarContent>
                {sidebarData.body.map((group, i) => (
                    <SidebarGroup key={i}>
                        {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item, idx) => {
                                    const Icon =
                                        item.icon && typeof item.icon === "string"
                                            ? (Icons[item.icon as keyof typeof Icons] as React.ComponentType<any>)
                                            : undefined;

                                    // Verifica se tem subitens
                                    const hasChildren = item.children && item.children.length > 0;

                                    return (
                                        <Collapsible
                                            key={idx}
                                            asChild
                                            defaultOpen={false}
                                            className="group/collapsible"
                                        >
                                            <SidebarMenuItem>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton asChild tooltip={item.label}>
                                                        <Link
                                                            to={item.to || "#"}
                                                            onClick={
                                                                item.onClick
                                                                    ? actions[item.onClick as keyof typeof actions]
                                                                    : undefined
                                                            }
                                                        >
                                                            {Icon && <Icon className="h-4 w-4" />}
                                                            <span>{item.label}</span>
                                                            {hasChildren && (
                                                                <Icons.ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                                            )}
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>

                                                {hasChildren && (
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {item.children?.map((child, cidx) => (
                                                                <SidebarMenuSubItem key={cidx}>
                                                                    <SidebarMenuSubButton asChild>
                                                                        <Link to={child.to || "#"}>
                                                                            <span>{child.label}</span>
                                                                        </Link>
                                                                    </SidebarMenuSubButton>
                                                                </SidebarMenuSubItem>
                                                            ))}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                )}
                                            </SidebarMenuItem>
                                        </Collapsible>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* === FOOTER (Dropdown igual ao Header) === */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                        <HeaderIcon className="size-4" />
                                    </div>

                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{sidebarData.footer!.user.name}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {sidebarData.footer!.user.email}
                                        </span>
                                    </div>

                                    <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                            <HeaderIcon className="size-4" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{sidebarData.footer!.user.name}</span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {sidebarData.footer!.user.email}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                {sidebarData.footer!.groups.map((group, i) => (
                                    <div key={i}>
                                        {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
                                        <DropdownMenuGroup>
                                            {group.items.map((item, idx) => {
                                                const Icon =
                                                    item.icon && typeof item.icon === "string"
                                                        ? (Icons[item.icon as keyof typeof Icons] as React.ComponentType<any>)
                                                        : undefined;

                                                return (
                                                    <DropdownMenuItem
                                                        key={idx}
                                                        onClick={
                                                            item.onClick
                                                                ? actions[item.onClick as keyof typeof actions]
                                                                : undefined
                                                        }
                                                        className="cursor-pointer"
                                                    >
                                                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                                                        {item.label}
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                        </DropdownMenuGroup>
                                        {i < sidebarData.footer!.groups.length - 1 && <DropdownMenuSeparator />}
                                    </div>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            {/* 🧩 Diálogo de confirmação */}
            <ConfirmDialog
                open={openConfirm}
                onOpenChange={setOpenConfirm}
                title={
                    <span className="text-destructive flex items-center gap-2">
                        <Icons.AlertTriangle className="h-5 w-5 stroke-destructive" />
                        Encerrar Sessão
                    </span>
                }
                desc={
                    <p className="text-sm text-muted-foreground">
                        Tem certeza de que deseja sair da sua conta? <br />
                        Você precisará fazer login novamente para acessar o Moneto.
                    </p>
                }
                confirmText="Sair"
                destructive
                handleConfirm={handleLogout}
            />
        </Sidebar>
    );
}
