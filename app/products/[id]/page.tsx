import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { authClient } from "@/app/_lib/auth-client";
import { getProduct } from "@/app/_lib/api/fetch-generated";
import { ProductForm } from "@/app/products/_components/product-form";
import { DeleteProductButton } from "@/app/products/_components/delete-product-button";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const result = await getProduct(id);

  if (result.status === 404) notFound();
  if (result.status !== 200) {
    throw new Error("Failed to fetch product");
  }

  const product = result.data;

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
        {product.name}
      </h1>

      <ProductForm product={product} />

      <div className="mt-8 border-t border-border pt-6">
        <DeleteProductButton productId={product.id} productName={product.name} />
      </div>
    </div>
  );
}
