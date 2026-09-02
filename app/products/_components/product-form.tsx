"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateProduct,
  useUpdateProduct,
  getListProductsQueryKey,
  getGetProductQueryKey,
} from "@/app/_lib/api/rc-generated";
import { useQueryClient } from "@tanstack/react-query";
import type { Product } from "@/app/_lib/api/fetch-generated";

const productFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Informe o nome do produto." }),
  description: z
    .string()
    .trim()
    .min(1, { message: "Informe a descrição do produto." }),
  price: z
    .string()
    .trim()
    .refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, {
      message: "Informe um preço válido.",
    }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product ? String(product.priceInCents / 100) : "0",
      status: product?.status ?? "ACTIVE",
    },
  });

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: ProductFormValues) => {
    const data = {
      name: values.name,
      description: values.description,
      priceInCents: Math.round(Number(values.price) * 100),
      status: values.status,
    };

    if (product) {
      updateProduct(
        { productId: product.id, data },
        {
          onSuccess: (result) => {
            if (result.status !== 200) {
              form.setError("root", { message: result.data.error });
              return;
            }
            queryClient.invalidateQueries({
              queryKey: getListProductsQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getGetProductQueryKey(product.id),
            });
            router.push(`/products/${product.id}`);
            router.refresh();
          },
          onError: () => {
            form.setError("root", {
              message: "Erro ao atualizar o produto.",
            });
          },
        }
      );
      return;
    }

    createProduct(
      { data },
      {
        onSuccess: (result) => {
          if (result.status !== 201) {
            form.setError("root", { message: result.data.error });
            return;
          }
          queryClient.invalidateQueries({
            queryKey: getListProductsQueryKey(),
          });
          router.push(`/products/${result.data.id}`);
          router.refresh();
        },
        onError: () => {
          form.setError("root", { message: "Erro ao criar o produto." });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Tênis de corrida" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o produto"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={isPending}>
          {product ? "Salvar alterações" : "Criar produto"}
        </Button>
      </form>
    </Form>
  );
}
