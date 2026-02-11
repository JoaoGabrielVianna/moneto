/**
 * Representa um item de menu genérico (pode ter children, rota ou ação)
 */
export interface SidebarItem {
  label: string;
  icon?: keyof typeof import("lucide-react"); // 👈 força autocomplete + string segura
  to?: string;
  onClick?: string;
  children?: SidebarItem[];
}


/**
 * Grupo de menus dentro do corpo principal da sidebar
 */
export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

/**
 * Cabeçalho da sidebar (logo, título e subtítulo)
 */
export interface SidebarHeader {
  title: string;
  subtitle?: string;
  logo?: string;
}

/**
 * Grupo do menu do usuário no rodapé (ex: Conta, Plano, Sair)
 */
export interface SidebarFooterGroup {
  label?: string;
  items: SidebarItem[];
}

/**
 * Dados do usuário exibido no rodapé
 */
export interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
}

/**
 * Estrutura principal do JSON da Sidebar
 */
export interface SidebarData {
  header?: SidebarHeader;
  body: SidebarGroup[];
  footer?: {
    user: SidebarUser;
    groups: SidebarFooterGroup[];
  };
}
