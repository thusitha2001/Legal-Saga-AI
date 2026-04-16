import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Scale, PlusCircle, LayoutDashboard, BookOpen, PenLine, MapPin } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "New Document", url: "/documents/new", icon: PlusCircle },
    { title: "Document Writer", url: "/document-writer", icon: PenLine },
    { title: "Legal Adviser Near You", url: "/legal-adviser-nearby", icon: MapPin },
    { title: "Law Library", url: "/law-library", icon: BookOpen },
  ];

  return (
    <SidebarProvider style={{ "--sidebar-width": "18rem" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-slate-50/50">
        <Sidebar variant="sidebar" collapsible="icon">
          <SidebarContent className="bg-slate-950 border-r-slate-800">
            <div className="p-8 flex items-center gap-3">
              <div className="p-2.5 bg-primary rounded-lg shadow-lg shadow-primary/20">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-white tracking-tight">LegalSaga</h1>
            </div>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 px-8">
                Main Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="px-4 gap-1.5">
                  {navItems.map((item) => {
                    const isActive = location === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className={`
                            rounded-lg transition-all duration-200 py-6 px-4
                            ${isActive
                              ? "bg-white/10 text-white shadow-inner"
                              : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}
                          `}
                        >
                          <Link href={item.url} className="flex items-center gap-3.5 w-full">
                            <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : "text-slate-500"}`} />
                            <span className="font-semibold tracking-wide text-sm">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-6">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  LegalSaga uses AI to help you understand documents. It is not a substitute for professional legal advice.
                </p>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}