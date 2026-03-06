type ApiErrorPayload = {
  message?: string;
  error?: string | { details?: Array<{ message?: string }> };
};

interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
}
