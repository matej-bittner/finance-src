"use client";
import React, { startTransition, useEffect, useTransition } from "react";
import { z } from "zod";
import { removeEmptyStrings } from "@/helpers/generalFunctions";
import { createGoal } from "@/actions/create-goal";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSettingsSchema } from "@/schemas";
import { useTranslations } from "next-intl";
import { settings } from "@/actions/settings";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies, languages } from "@/constants";

const ChangeSecurityInfoForm = ({ user }: { user: any }) => {
  const t = useTranslations("form-messages");
  const t1 = useTranslations("settings-page");
  const SettingsSchema = getSettingsSchema(t);
  const router = useRouter();
  const { toast } = useToast();
  const defaultValues = {
    name: user?.name || undefined,
    email: user?.email || undefined,
    password: undefined,
    newPassword: undefined,
    mainCurrency: user?.mainCurrency,
    mainLanguage: user?.mainLanguage,
  };

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: defaultValues,
  });

  // default values = name: user?name || undefined, user?.email ♀4| undefined, password undefined
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  function onSubmit(values: z.infer<typeof SettingsSchema>) {
    startTransition(() => {
      settings(values).then((data) => {
        toast({
          variant: `${data?.error ? "destructive" : "default"}`,
          title: data?.error || data?.success,
        });
        if (data?.success) {
          update();
          if (values.mainLanguage !== user?.mainLanguage) {
            router.push(`/${values.mainLanguage}/settings`, {
              scroll: false,
            });
          } else {
            router.refresh();
          }
        }
      });
    });
  }

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className={`flex flex-col space-y-3 w-full max-w-[300px] tb:max-w-[550px] mx-auto`}
      >
        <div
          className={`${user?.isOAuth ? "flex flex-col" : "grid grid-cols-1 tb:grid-cols-2 tb:place-items-center tb:gap-y-2 "}  max-tb:space-y-1 w-full `}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem
                className={` flex flex-col  w-full tb:max-w-[250px] ${user?.isOAuth && "mx-auto"}`}
              >
                <FormLabel className="dialog-labels">
                  {t1("first-name")}
                </FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="dialog-inputs"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!user?.isOAuth && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className=" flex flex-col w-full tb:max-w-[250px]">
                    <FormLabel className="dialog-labels">
                      {t1("email")}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        className="dialog-inputs"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className=" flex flex-col w-full tb:max-w-[250px]">
                    <FormLabel className="dialog-labels">
                      {t1("password")}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        className="dialog-inputs"
                        placeholder="********"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className=" flex flex-col w-full tb:max-w-[250px]">
                    <FormLabel className="dialog-labels">
                      {t1("new-password")}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        className="dialog-inputs"
                        placeholder="********"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        <div
          className={`flex max-[320px]:flex-col gap-1 w-full  tb:gap-4 tb:pl-3`}
        >
          <FormField
            control={form.control}
            name="mainCurrency"
            render={({ field }) => (
              <FormItem className="flex flex-col ">
                <FormLabel className="dialog-labels">
                  {t1(`main-currency`)}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[100px] h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-0">
                      {currencies.map((currency) => (
                        <SelectItem
                          key={currency.id}
                          className="px-0 py-1 justify-center items-center"
                          value={currency.value}
                        >
                          {currency.value.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mainLanguage"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1 tb:max-w-[200px]">
                <FormLabel className="dialog-labels">
                  {t1(`language`)}
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-full h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-0">
                      {languages.map((language) => (
                        <SelectItem
                          key={language.value}
                          className="px-0 py-1 justify-center items-center"
                          value={language.value}
                        >
                          {language.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <button
          type="submit"
          className="bg-black rounded-md py-1 text-white tb:w-fit tb:mx-auto tb:px-8"
          disabled={isPending}
        >
          {t1("save-changes")}
        </button>
      </form>
    </Form>
  );
};

export default ChangeSecurityInfoForm;
