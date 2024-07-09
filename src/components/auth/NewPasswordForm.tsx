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
import { getNewPasswordSchema } from "@/schemas";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import newPassword from "@/actions/new-password";

const NewPasswordForm = () => {
  const t = useTranslations("login-form");
  const t1 = useTranslations("form-messages");
  const NewPasswordSchema = getNewPasswordSchema(t1);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <section className="size-full flex items-center justify-center">
      <Card
        title={t("new-password")}
        backLink1="/login"
        backText1={t("back-to-login")}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-2"
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-[2px]">
                    <FormLabel className="pl-3 text-base">
                      {t("password")}
                    </FormLabel>
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
              {t("change-password")}
            </button>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default NewPasswordForm;
