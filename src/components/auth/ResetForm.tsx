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
import { ResetSchema } from "@/schemas";
import { login } from "@/actions/login";
import { useTranslations } from "next-intl";
import { reset } from "@/actions/reset";

const ResetForm = () => {
  const t = useTranslations("login-form");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };
  return (
    <section className="size-full flex items-center justify-center">
      <Card title="zapomenuté heslo" backLink1="/" backText1="back to login">
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
                    <FormLabel className="pl-3 text-base">
                      {t("email")}
                    </FormLabel>
                    <input
                      {...field}
                      type="text"
                      disabled={isPending}
                      className="form-inputs"
                      placeholder={t("email-placeholder")}
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
              reset Email
            </button>
          </form>
        </Form>
      </Card>
    </section>
  );
};

export default ResetForm;
