import PanelHeader from "@/components/PanelHeader";
import AdminNav from "@/components/AdminNav";
import PanelFooter from "@/components/PanelFooter";
import { ToastProvider } from "@/components/Toast";

// shared page frame: pink header, admin navigation, page body, footer, toast messages
export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PanelHeader />
      <div className="page-body">
        <AdminNav />
        {children}
        <PanelFooter />
      </div>
    </ToastProvider>
  );
}
