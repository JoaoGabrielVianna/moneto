// import { AppSidebar } from "@/components/app-sidebar";

import { Header } from "@/components/header";
import { Search } from "@/components/search";
import { AppSidebar } from "@/components/sidebar/index";
import { ThemeSwitch } from "@/components/theme-swicht";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CategoryProvider } from "@/context/category-provider";
import { DashboardProvider } from "@/context/dahsboard-provider";
import { SearchProvider } from "@/context/search-provider";
import { TransactionProvider } from "@/context/transactions-provider";
import { Outlet } from "react-router-dom";


export default function DashboardLayout() {
  return (
    <DashboardProvider>

      <TransactionProvider>

        <CategoryProvider>
          <SearchProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <Header>
                  <Search />
                  <div className='ms-auto flex items-center gap-4'>
                    <ThemeSwitch />
                    {/* <ConfigDrawer /> */}
                    {/* <ProfileDropdown /> */}
                  </div>
                </Header>
                <main className='m-4 space-y-4'>
                  <Outlet />
                </main>
              </SidebarInset>
            </SidebarProvider >
          </SearchProvider>
        </CategoryProvider>
      </TransactionProvider>
    </DashboardProvider>
  );
}
