import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { authClient } from "@/app/_lib/auth-client";
import { listProducts } from "@/app/_lib/api/fetch-generated";
import { BottomNav } from "@/app/_components/bottom-nav";
import { ProductList } from "@/app/_components/product-list";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const products = await listProducts();
  const userName = session.data.user.name?.split(" ")[0] ?? "";

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex flex-col gap-1 px-5 pt-8">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Olá, {userName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Seus produtos cadastrados
        </p>
      </div>

      <ProductList initialData={products} />

      <BottomNav activePage="home" />
    </div>
  );
}
