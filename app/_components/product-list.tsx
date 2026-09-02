"use client";

import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/app/_components/product-card";
import {
  useListProducts,
  getListProductsQueryKey,
} from "@/app/_lib/api/rc-generated";
import type { listProductsResponse } from "@/app/_lib/api/fetch-generated";

interface ProductListProps {
  initialData: listProductsResponse;
}

export function ProductList({ initialData }: ProductListProps) {
  const { data: result } = useListProducts(undefined, {
    query: {
      queryKey: getListProductsQueryKey(),
      initialData,
    },
  });

  const products = result?.status === 200 ? result.data.data : [];

  return (
    <div className="flex flex-col gap-3 px-5 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Produtos
        </h2>
        <Button asChild size="sm">
          <Link href="/products/new">
            <Plus className="size-4" />
            Novo produto
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Package className="size-8 text-muted-foreground" />
          <div className="flex flex-col gap-1">
            <p className="font-heading text-sm font-semibold text-foreground">
              Nenhum produto cadastrado
            </p>
            <p className="text-sm text-muted-foreground">
              Cadastre o primeiro produto pra começar.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
