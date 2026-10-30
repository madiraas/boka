import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAdminSiteData } from "@/lib/data";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const revalidate = 0;

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: middleware already redirects unauthenticated
  // requests, but every server-rendered page should stand on its own.
  if (!user) redirect("/admin/login");

  const data = await getAdminSiteData(supabase);

  return <AdminDashboard initialData={data} userEmail={user.email ?? ""} />;
}
