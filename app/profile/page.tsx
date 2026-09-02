import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/app/_lib/auth-client";
import { listProducts } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Package } from "lucide-react";
import { LogoutButton } from "./_components/logout-button";

export default async function ProfilePage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const productsResult = await listProducts();
  const productsCount =
    productsResult.status === 200 ? productsResult.data.pagination.total : 0;

  const user = session.data.user;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex h-[56px] items-center px-5">
        <p className="font-heading text-lg font-semibold text-foreground">
          Perfil
        </p>
      </div>

      <div className="flex flex-col items-center gap-5 px-5 pt-5">
        <div className="flex w-full items-center gap-3">
          <Avatar className="size-[52px]">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-lg font-semibold leading-[1.05] text-foreground">
              {user.name}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 rounded-xl bg-primary/8 p-5">
          <div className="flex items-center rounded-full bg-primary/8 p-[9px]">
            <Package className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-semibold text-foreground">
              {productsCount}
            </span>
            <span className="text-xs text-muted-foreground">
              produtos cadastrados
            </span>
          </div>
        </div>

        <LogoutButton />
      </div>

      <BottomNav activePage="profile" />
    </div>
  );
}
