"use client";
import React, { useEffect, useState, useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { categories, currencies, frequencies } from "@/constants";
import { removeEmptyStrings } from "@/helpers/generalFunctions";
import { UserAccount } from "@/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { createPaymentAccount } from "@/actions/create-payment-account";

const formSchema = z.object({
  number: z.string().optional(),
  name: z.string().min(1),
  balance: z.number().positive().min(1),
  payment: z.number(),
  currency: z.string().min(1),
  date: z.string(),
  frequency: z.string(),
  category: z.string().optional(),
});
const AddAccountForm = ({ defaultCurrency }: { defaultCurrency?: string }) => {
  const [selectedType, setSelectedType] = useState(1);
  const t = useTranslations("protected-dialog");
  const t1 = useTranslations("account-types");
  const accountTypes = [
    {
      title: t1(`current`),
      id: 1,
    },
    {
      title: t1(`credit`),
      id: 2,
    },
    {
      title: t1(`saving`),
      id: 3,
    },
    {
      title: t1(`investment`),
      id: 4,
    },
  ];
  useEffect(() => {
    form.reset(defaultValues);
  }, [selectedType]);

  const defaultValues = {
    number: "",
    name: "",
    balance: 0,
    currency: defaultCurrency,
    date: "",
    frequency: "",
    payment: 0,
    category: "",
  };
  const router = useRouter();
  const { toast } = useToast();
  const tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .slice(0, 10);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const category = categories.find((cat) => cat.value === values.category);

    startTransition(() => {
      const allValues = Object.assign(
        values,
        {
          type: selectedType,
        },
        category ? { category: category?.id } : null,
      );
      const cleanedData = removeEmptyStrings(allValues);

      createPaymentAccount(cleanedData).then((data) => {
        toast({
          variant: `${data?.error ? "destructive" : "default"}`,
          title: data?.error || data?.success,
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
        if (data?.success) {
          router.refresh();
          form.reset(defaultValues);
        }
      });
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-1 sm:space-y-2"
        autoComplete="off"
      >
        {/*select transaction type*/}
        <div className="h-fit w-full grid grid-cols-2 min-[432px]:grid-cols-4 gap-x-2 gap-y-1">
          {accountTypes.map((item) => {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedType(item.id)}
                className={`border-2 border-white rounded-md w-full pl-2 py-1 flex items-center text-left   ${selectedType === item.id && "bg-main-blue text-white"}`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
        <div className="space-y-1 sm:space-y-2 min-[512px]:w-[90%] mx-auto">
          {/*to account*/}
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-0">
                <FormLabel className="dialog-labels">
                  {t(`number-contract`)}
                </FormLabel>
                <FormControl>
                  <input type="text" className="dialog-inputs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*name ammount currency*/}
          <div className="flex gap-1 max-[450px]:flex-col min-[450px]:gap-2">
            {/*name*/}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col min-[450px]:flex-1 space-y-0">
                  <FormLabel className="dialog-labels">{t(`name`)}</FormLabel>
                  <FormControl>
                    <input type="text" className="dialog-inputs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*ammount currency*/}
            <div className="flex gap-2 max-[320px]:flex-col">
              {/*ammount*/}
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem className="flex flex-col max-[450px]:flex-1 space-y-0">
                    <FormLabel className="dialog-labels">
                      {t(`balance`)}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        value={field.value === 0 ? "" : field.value}
                        className="dialog-inputs min-[450px]:w-[120px]"
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*currency*/}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-0">
                    <FormLabel className="dialog-labels">
                      {t(`currency`)}
                    </FormLabel>
                    <FormControl>
                      {/*<input*/}
                      {/*  type="text"*/}
                      {/*  className="dialog-inputs min-[320px]:w-[100px] min-[450px]:max-w-[80px]"*/}
                      {/*  value={field.value.toUpperCase()}*/}
                      {/*  onChange={field.onChange}*/}
                      {/*  disabled*/}
                      {/*/>*/}
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="min-[320px]:w-[100px] min-[450px]:max-w-[80px] h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
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
            </div>
          </div>
          {/*payment date ftrequency*/}
          {selectedType === 2 && (
            <div className="flex flex-col space-y-1 sm:space-y-2">
              <div className="flex gap-1 max-[450px]:flex-col min-[450px]:gap-2">
                {/*name*/}
                <FormField
                  control={form.control}
                  name="payment"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-[450px]:flex-1 space-y-0">
                      <FormLabel className="dialog-labels">Splátka</FormLabel>
                      <FormControl>
                        {/*<input type="text" className="dialog-inputs" {...field} />*/}
                        <input
                          type="number"
                          value={field.value === 0 ? "" : field.value}
                          className="dialog-inputs"
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/*ammount currency*/}
                <div className="flex gap-2 max-[320px]:flex-col">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col max-[450px]:flex-1 space-y-0">
                        <FormLabel className="dialog-labels">K datu</FormLabel>
                        <FormControl>
                          <input
                            min={tomorrowDate}
                            type="date"
                            className="dialog-inputs py-[5px] sm:py-[7px] min-[450px]:w-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/*currency*/}
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-0">
                        <FormLabel className="dialog-labels">
                          {t(`frequency`)}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="min-[320px]:w-[100px] min-[450px]:max-w-[80px] h-fit min-h-[32px] sm:min-h-[36px] focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="min-w-0">
                              {frequencies.map((freq, i) => (
                                <SelectItem
                                  className="px-0 py-1 justify-center items-center"
                                  value={freq.value}
                                  key={i}
                                >
                                  {freq.selectText}
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
              </div>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-0">
                    <FormLabel className="dialog-labels">
                      {t(`category`)}
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px] h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
                          <SelectValue
                            placeholder={t(`category-placeholder`)}
                          />
                        </SelectTrigger>
                        <SelectContent className="min-w-0">
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              className="px-0 py-1 justify-center items-center"
                              value={category.value}
                            >
                              {category.value}
                            </SelectItem>
                          ))}
                          <button
                            className="px-0 py-1 justify-center items-center  text-sm outline-none focus:bg-accent focus:text-accent-foreground  w-full font-semibold"
                            onClick={() => {
                              form.setValue("category", "");
                            }}
                          >
                            {t(`clear-input`)}
                          </button>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full font-medium bg-main-blue text-white rounded-lg py-2 mt-2 min-[450px]:py-3 min-[450px]:mt-3"
            >
              {t(`add-transaction`)}
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddAccountForm;
