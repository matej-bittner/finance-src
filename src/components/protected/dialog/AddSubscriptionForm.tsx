"use client";
import React, { useEffect, useState, useTransition } from "react";
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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox } from "@/components/ui/combox";
import { useToast } from "@/components/ui/use-toast";
import { categories, frequencies } from "@/constants";
import {
  convertFrequencyToDate,
  getTomorrowDate,
  removeEmptyStrings,
} from "@/helpers/generalFunctions";
import { createTransaction } from "@/actions/create-transaction";
import { UserAccount } from "@/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { getAddGoalSchema, getAddSubscriptionSchema } from "@/schemas";

// const formSchema = z.object({
//   accountFrom: z.string(),
//   name: z.string().min(1),
//   amount: z.number().positive().min(1),
//   currency: z.string().min(1),
//   description: z.string().optional(),
//   date: z.string().min(1),
//   frequency: z.string(),
//   category: z.string().optional(),
//   endOfPayment: z.string().optional(),
// });
const AddSubscriptionForm = ({
  userAccounts,
  defaultCurrency,
}: {
  userAccounts: UserAccount[];
  defaultCurrency?: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = {
    accountFrom: "",
    name: "",
    amount: 0,
    currency: defaultCurrency,
    description: "",
    date: "",
    frequency: "",
    category: "",
    endOfPayment: "",
  };

  const t = useTranslations("protected-dialog");
  const t1 = useTranslations("frequency");
  const t2 = useTranslations("form-messages");
  const AddSubscriptionSchema = getAddSubscriptionSchema(t2);
  const t3 = useTranslations("category");

  const tomorrowDate = getTomorrowDate();

  const [dateLimit, setDateLimit] = useState({
    firstPaymentDate: tomorrowDate,
    endPaymentDate: tomorrowDate,
    frequency: 0,
  });

  useEffect(() => {
    if (dateLimit.frequency != 0) {
      let date = convertFrequencyToDate(
        dateLimit.frequency,
        dateLimit.firstPaymentDate,
      );

      date.setDate(date.getDate() + 1);
      setDateLimit({
        ...dateLimit,
        endPaymentDate: date.toISOString().slice(0, 10),
      });
    }
  }, [dateLimit.firstPaymentDate, dateLimit.frequency]);

  const form = useForm<z.infer<typeof AddSubscriptionSchema>>({
    resolver: zodResolver(AddSubscriptionSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(values: z.infer<typeof AddSubscriptionSchema>) {
    const category = categories.find((cat) => cat.value === values.category);

    startTransition(() => {
      const allValues = Object.assign(
        values,
        {
          transactionType: 5,
        },
        category ? { category: category?.id } : null,
      );

      const cleanedData = removeEmptyStrings(allValues);

      createTransaction(cleanedData).then((data) => {
        toast({
          variant: `${data?.error ? "destructive" : "default"}`,
          title: data?.error || data?.success,
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
        {/*from which account will I cut subscription*/}
        <FormField
          control={form.control}
          name="accountFrom"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-0">
              <FormLabel className="dialog-labels">
                {t(`from-account`)}*
              </FormLabel>
              <FormControl>
                <Combobox
                  className="p-0 min-h-0 h-fit overflow-clip rounded-lg "
                  popoverClassname="min-[512px]:w-[416px]"
                  mode="single" //single or multiple
                  options={userAccounts}
                  placeholder={t(`choose-account-placeholder`)}
                  selected={field.value}
                  onChange={(value) => {
                    field.onChange(value);

                    const account = userAccounts.find(
                      (item) => item.value === value,
                    );

                    if (account?.currency) {
                      form.setValue("currency", account.currency);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*name amount currency*/}
        <div className="flex gap-1 max-[450px]:flex-col min-[450px]:gap-2">
          {/*name*/}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col min-[450px]:flex-1 space-y-0">
                <FormLabel className="dialog-labels">{t(`name`)}*</FormLabel>
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
          {/*amount currency*/}
          <div className="flex gap-2 max-[320px]:flex-col">
            {/*amount*/}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex flex-col max-[450px]:flex-1 space-y-0">
                  <FormLabel className="dialog-labels">
                    {t(`amount`)}*
                  </FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      value={field.value === 0 ? "" : field.value}
                      className="dialog-inputs min-[450px]:w-[120px]"
                      disabled={isPending}
                      onChange={(event) => field.onChange(+event.target.value)}
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
                    {t(`currency`)}*
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      className="dialog-inputs min-[320px]:w-[100px] min-[450px]:max-w-[80px]"
                      value={field.value.toUpperCase()}
                      onChange={field.onChange}
                      disabled
                    />
                    {/*TODO : let user to in which currency take money*/}
                    {/*<Select*/}
                    {/*  onValueChange={field.onChange}*/}
                    {/*  value={field.value}*/}
                    {/*>*/}
                    {/*  <SelectTrigger className="min-[320px]:w-[100px] min-[450px]:max-w-[80px] h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">*/}
                    {/*    <SelectValue />*/}
                    {/*  </SelectTrigger>*/}
                    {/*  <SelectContent className="min-w-0">*/}
                    {/*    {currencies.map((currency) => (*/}
                    {/*      <SelectItem*/}
                    {/*        key={currency.id}*/}
                    {/*        className="px-0 py-1 justify-center items-center"*/}
                    {/*        value={currency.value}*/}
                    {/*      >*/}
                    {/*        {currency.value.toUpperCase()}*/}
                    {/*      </SelectItem>*/}
                    {/*    ))}*/}
                    {/*  </SelectContent>*/}
                    {/*</Select>*/}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/*description*/}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-0">
              <FormLabel className="dialog-labels">
                {t(`description`)}
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
        {/*date and frequency category*/}
        <div
          className={`w-full flex  justify-between gap-x-2 gap-y-1 min-[450px]:gap-2 flex-col`}
        >
          <div className="flex justify-between w-full">
            {/*date and end of payment*/}
            <div
              className={`flex justify-between min-[400px]:justify-start  min-[400px]:gap-2 w-full `}
            >
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col min-[280px]:max-w-[200px] space-y-0">
                    <FormLabel className="dialog-labels">
                      {t(`first-payment`)}*
                    </FormLabel>
                    <FormControl>
                      {/*<input*/}
                      {/*  min={tomorrowDate}*/}
                      {/*  type="date"*/}
                      {/*  className="dialog-inputs py-[5px] sm:py-[7px]"*/}
                      {/*  {...field}*/}
                      {/*/>*/}
                      <input
                        min={dateLimit.firstPaymentDate}
                        type="date"
                        disabled={isPending}
                        className="dialog-inputs py-[5px] sm:py-[7px]"
                        value={field.value}
                        onChange={(event) => {
                          field.onChange(event.target.value);
                          setDateLimit({
                            ...dateLimit,
                            firstPaymentDate: event.target.value,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endOfPayment"
                render={({ field }) => (
                  <FormItem className="flex flex-col min-[280px]:max-w-[200px] space-y-0">
                    <FormLabel className="dialog-labels">
                      {t(`end-date`)}
                    </FormLabel>
                    <FormControl>
                      <input
                        min={dateLimit.endPaymentDate}
                        type="date"
                        className="dialog-inputs py-[5px] sm:py-[7px]"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/*frequency and category*/}
          <div
            className={`flex w-full justify-between min-[400px]:justify-start  min-[400px]:gap-2`}
          >
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-0">
                  <FormLabel className="dialog-labels">
                    {t(`frequency`)}*
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setDateLimit({
                          ...dateLimit,
                          frequency: Number(value),
                        });
                      }}
                      disabled={isPending}
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
                            {t1(freq.selectText)}
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
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-[180px] h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
                        <SelectValue placeholder={t(`category-placeholder`)} />
                      </SelectTrigger>
                      <SelectContent className="min-w-0">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            className="px-0 py-1 justify-center items-center"
                            value={category.value}
                          >
                            {t3(category.value)}
                          </SelectItem>
                        ))}
                        <button
                          className="px-0 py-1 justify-center items-center  text-sm outline-none focus:bg-accent focus:text-accent-foreground  w-full font-semibold"
                          onClick={() => {
                            form.setValue("category", "");
                          }}
                          disabled={isPending}
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
        </div>

        <div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full font-medium bg-main-blue text-white rounded-lg py-2 mt-2 min-[450px]:py-3 min-[450px]:mt-3"
          >
            {t(`add-subscription`)}
          </button>
        </div>
      </form>
    </Form>
  );
};

export default AddSubscriptionForm;
