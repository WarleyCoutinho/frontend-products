import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/app/_lib/api/fetch-generated";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex flex-col gap-2 rounded-xl border border-border p-4 transition-colors hover:bg-accent"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          {product.name}
        </h3>
        <Badge variant={product.status === "ACTIVE" ? "default" : "secondary"}>
          {product.status === "ACTIVE" ? "Ativo" : "Inativo"}
        </Badge>
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {product.description}
      </p>
      <span className="font-heading text-base font-semibold text-foreground">
        {priceFormatter.format(product.priceInCents / 100)}
      </span>
    </Link>
  );
}
