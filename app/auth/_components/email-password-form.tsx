"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/app/_lib/auth-client";
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

const signInSchema = z.object({
  email: z.email({
    message: "Informe um e-mail válido.",
  }),
  password: z.string().min(1, {
    message: "Informe sua senha.",
  }),
});

const signUpSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Informe seu nome.",
  }),
  email: z.email({
    message: "Informe um e-mail válido.",
  }),
  password: z.string().min(8, {
    message: "A senha precisa ter pelo menos 8 caracteres.",
  }),
});

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export function EmailPasswordForm() {
  const router = useRouter();

  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const isSignUp = mode === "sign-up";

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSignIn = async (values: SignInValues) => {
    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    if (error) {
      signInForm.setError("root", {
        message: error.message ?? "Não foi possível entrar.",
      });

      return;
    }

    router.push("/");
    router.refresh();
  };

  const onSignUp = async (values: SignUpValues) => {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    if (error) {
      signUpForm.setError("root", {
        message: error.message ?? "Não foi possível criar a conta.",
      });

      return;
    }

    setSignUpSuccess(true);
  };

  if (signUpSuccess) {
    return (
      <div className="flex w-full flex-col items-center gap-3 text-center">
        <p className="text-sm text-primary-foreground">
          Conta criada! Enviamos um link de confirmação pro seu e-mail —
          confirme antes de entrar.
        </p>

        <button
          type="button"
          onClick={() => {
            setSignUpSuccess(false);
            setMode("sign-in");
          }}
          className="text-xs text-primary-foreground/70 underline underline-offset-2"
        >
          Já confirmou? Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {isSignUp ? (
        <form
          onSubmit={signUpForm.handleSubmit(onSignUp)}
          className="flex flex-col gap-3"
        >
          {" "}
          {/* NOME */}{" "}
          <div className="flex flex-col gap-2">
            {" "}
            <label
              htmlFor="signup-name"
              className="text-sm text-primary-foreground"
            >
              {" "}
              Nome{" "}
            </label>{" "}
            <input
              id="signup-name"
              type="text"
              placeholder="Seu nome"
              autoComplete="name"
              {...signUpForm.register("name")}
              className="h-9 w-full rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-3 py-1 text-base text-primary-foreground outline-none placeholder:text-primary-foreground/50 focus:border-primary-foreground focus:ring-2 focus:ring-primary-foreground/20"
            />{" "}
            {signUpForm.formState.errors.name && (
              <p className="text-sm text-destructive">
                {" "}
                {signUpForm.formState.errors.name.message}{" "}
              </p>
            )}{" "}
          </div>{" "}
          {/* E-MAIL */}{" "}
          <div className="flex flex-col gap-2">
            {" "}
            <label
              htmlFor="signup-email"
              className="text-sm text-primary-foreground"
            >
              {" "}
              E-mail{" "}
            </label>{" "}
            <input
              id="signup-email"
              type="email"
              placeholder="voce@email.com"
              autoComplete="email"
              {...signUpForm.register("email")}
              className="h-9 w-full rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-3 py-1 text-base text-primary-foreground outline-none placeholder:text-primary-foreground/50 focus:border-primary-foreground focus:ring-2 focus:ring-primary-foreground/20"
            />{" "}
            {signUpForm.formState.errors.email && (
              <p className="text-sm text-destructive">
                {" "}
                {signUpForm.formState.errors.email.message}{" "}
              </p>
            )}{" "}
          </div>{" "}
          {/* SENHA */}{" "}
          <div className="flex flex-col gap-2">
            {" "}
            <label
              htmlFor="signup-password"
              className="text-sm text-primary-foreground"
            >
              {" "}
              Senha{" "}
            </label>{" "}
            <input
              id="signup-password"
              type="password"
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
              {...signUpForm.register("password")}
              className="h-9 w-full rounded-md border border-primary-foreground/30 bg-primary-foreground/5 px-3 py-1 text-base text-primary-foreground outline-none placeholder:text-primary-foreground/50 focus:border-primary-foreground focus:ring-2 focus:ring-primary-foreground/20"
            />{" "}
            {signUpForm.formState.errors.password && (
              <p className="text-sm text-destructive">
                {" "}
                {signUpForm.formState.errors.password.message}{" "}
              </p>
            )}{" "}
          </div>{" "}
          {/* ERRO GERAL */}{" "}
          {signUpForm.formState.errors.root && (
            <p className="text-sm text-destructive">
              {" "}
              {signUpForm.formState.errors.root.message}{" "}
            </p>
          )}{" "}
          {/* BOTÃO */}{" "}
          <Button
            type="submit"
            variant="secondary"
            disabled={signUpForm.formState.isSubmitting}
          >
            {" "}
            {signUpForm.formState.isSubmitting
              ? "Criando conta..."
              : "Criar conta"}{" "}
          </Button>{" "}
        </form>
      ) : (
        <Form {...signInForm}>
          <form
            onSubmit={signInForm.handleSubmit(onSignIn)}
            className="flex flex-col gap-3"
          >
            {/* E-MAIL */}
            <FormField
              control={signInForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    E-mail
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="voce@email.com"
                      autoComplete="email"
                      className="border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/50"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SENHA */}
            <FormField
              control={signInForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground">
                    Senha
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Sua senha"
                      autoComplete="current-password"
                      className="border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/50"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ERRO GERAL */}
            {signInForm.formState.errors.root && (
              <p className="text-sm text-destructive">
                {signInForm.formState.errors.root.message}
              </p>
            )}

            {/* BOTÃO */}
            <Button
              type="submit"
              variant="secondary"
              disabled={signInForm.formState.isSubmitting}
            >
              {signInForm.formState.isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>
      )}

      {/* ALTERNAR ENTRE LOGIN E CADASTRO */}
      <button
        type="button"
        onClick={() => {
          setMode(isSignUp ? "sign-in" : "sign-up");
          setSignUpSuccess(false);
        }}
        className="text-center text-xs text-primary-foreground/70 underline underline-offset-2"
      >
        {isSignUp ? "Já tem conta? Entrar" : "Não tem conta? Criar conta"}
      </button>
    </div>
  );
}
