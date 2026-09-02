import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { ProductForm } from "@/app/products/_components/product-form";

export default async function NewProductPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  return (
    <div className="flex min-h-svh flex-col bg-background px-5 pb-16 pt-8">
      <Link
        href="/"
        className="mb-6 flex w-fit items-center gap-2 text-sm text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>

      <h1 className="mb-6 font-heading text-2xl font-semibold text-foreground">
        Novo produto
      </h1>

      <ProductForm />
    </div>
  );
}
