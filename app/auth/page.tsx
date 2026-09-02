import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { SignInWithGoogle } from "./_components/sign-in-with-google";
import { EmailPasswordForm } from "./_components/email-password-form";

export default async function AuthPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.data?.user) redirect("/");

  return (
    <div className="relative flex min-h-svh flex-col bg-foreground">
      <div className="flex-1" />

      <div className="relative z-10 flex flex-col items-center gap-8 rounded-t-4xl bg-primary px-5 pb-10 pt-12">
        <div className="flex w-full flex-col items-center gap-6">
          <h1 className="w-full text-center font-heading text-[32px] font-semibold leading-[1.05] text-primary-foreground">
            Gerencie seus produtos em um só lugar.
          </h1>

          <SignInWithGoogle />

          <div className="flex w-full items-center gap-3">
            <span className="h-px flex-1 bg-primary-foreground/20" />
            <span className="text-xs text-primary-foreground/70">ou</span>
            <span className="h-px flex-1 bg-primary-foreground/20" />
          </div>

          <EmailPasswordForm />
        </div>

        <p className="font-heading text-xs leading-[1.4] text-primary-foreground/70">
          © 2026 Copyright. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}
