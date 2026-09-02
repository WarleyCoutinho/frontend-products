"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  useDeleteProduct,
  getListProductsQueryKey,
} from "@/app/_lib/api/rc-generated";

interface DeleteProductButtonProps {
  productId: string;
  productName: string;
}

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct(
      { productId },
      {
        onSuccess: (result) => {
          if (result.status !== 204) return;
          queryClient.invalidateQueries({
            queryKey: getListProductsQueryKey(),
          });
          router.push("/");
          router.refresh();
        },
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2 text-destructive">
          <Trash2 className="size-4" />
          Excluir produto
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir {productName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. O produto será removido
            permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
