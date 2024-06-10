"use client";
import React, { useState, useTransition } from "react";
import Card from "@/components/auth/Card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CardError from "@/components/auth/CardError";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CardSuccess from "@/components/auth/CardSuccess";
import { LoginSchema } from "@/schemas";
import { login } from "@/actions/login";

const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  }
  return (
    <section className="size-full flex items-center justify-center">
      <Card
        title="Přihlášení"
        backLink1="/"
        backText1="Obnovit zapomenuté heslo"
        backLink2="/"
        backText2="Ještě nemáte účet? Registrovat"
        showSocials
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-2"
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-[2px]">
                    <FormLabel className="pl-3 text-base">E-mail</FormLabel>
                    <input
                      {...field}
                      type="text"
                      disabled={isPending}
                      className="form-inputs"
                      placeholder="tomas-novak@seznam.cz"
                    />
                    <FormMessage className="text-main-error pl-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-[2px]">
                    <FormLabel className="pl-3 text-base">Heslo</FormLabel>
                    <input
                      {...field}
                      type="password"
                      disabled={isPending}
                      className="form-inputs"
                      placeholder="***********"
                    />
                    <FormMessage className="text-main-error pl-3" />
                  </FormItem>
                )}
              />
            </div>
            <CardError message={error} />
            <CardSuccess message={success} />
            <button
              disabled={isPending}
              type="submit"
              className="text-white bg-black border-2 border-white rounded-lg text-xl py-2 my-1 tracking-wide"
            >
              Přihlásit
            </button>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default LoginForm;
