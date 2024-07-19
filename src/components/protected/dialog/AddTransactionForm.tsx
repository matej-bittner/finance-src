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
import { categories, frequencies, transactionType } from "@/constants";
import {
  convertFrequencyToDate,
  getTomorrowDate,
  removeEmptyStrings,
} from "@/helpers/generalFunctions";
import { createTransaction } from "@/actions/create-transaction";
import { UserAccount } from "@/types";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { getAddSubscriptionSchema, getAddTransactionSchema } from "@/schemas";

const AddTransactionForm = ({
  userAccounts,
  defaultCurrency,
}: {
  userAccounts: UserAccount[];
  defaultCurrency?: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  const t = useTranslations("protected-dialog");
  const t1 = useTranslations("transaction-types");
  const t2 = useTranslations("frequency");
  const t3 = useTranslations("form-messages");
  const t4 = useTranslations("category");

  const AddTransactionSchema = getAddTransactionSchema(t3, selectedType);
  const defaultValues = {
    accountFrom: "",
    accountTo: "",
    name: "",
    amount: 0,
    currency: defaultCurrency,
    description: "",
    date: "",
    frequency: "",
    category: "",
    endOfPayment: "",
  };

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

  const form = useForm<z.infer<typeof AddTransactionSchema>>({
    resolver: zodResolver(AddTransactionSchema),
    defaultValues: defaultValues,
  });

  function onSubmit(values: z.infer<typeof AddTransactionSchema>) {
    const category = categories.find((cat) => cat.value === values.category);

    startTransition(() => {
      const allValues = Object.assign(
        values,
        {
          transactionType: selectedType,
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

  function changeType(type: number) {
    setSelectedType(type);
    form.reset(defaultValues);
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
          {transactionType.map((item) => {
            return (
              <button
                key={item.id}
                type="button"
                disabled={isPending}
                onClick={() => changeType(item.id)}
                className={`border-2 border-white rounded-md w-full pl-2 py-1 flex items-center text-left   ${selectedType === item.id && "bg-main-blue text-white"}`}
              >
                {t1(item.title)}
              </button>
            );
          })}
        </div>
        <div className="space-y-1 sm:space-y-2 min-[512px]:w-[90%] mx-auto">
          {/*to account*/}
          {selectedType !== 2 && selectedType != 4 && (
            <FormField
              control={form.control}
              name="accountTo"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-0">
                  <FormLabel className="dialog-labels">
                    {t(`to-account`)}
                  </FormLabel>
                  <FormControl>
                    <Combobox
                      className="p-0 min-h-0 h-fit overflow-clip rounded-lg"
                      popoverClassname="min-[512px]:w-[416px]"
                      mode="single" //single or multiple
                      options={userAccounts}
                      placeholder={t(`choose-account-placeholder`)}
                      selected={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (selectedType === 1) {
                          const account = userAccounts.find(
                            (item) => item.value === value,
                          );
                          if (account?.currency) {
                            form.setValue("currency", account.currency);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {selectedType !== 1 && (
            <FormField
              control={form.control}
              name="accountFrom"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-0">
                  <FormLabel className="dialog-labels">
                    {t(`from-account`)}
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
                        if (selectedType !== 1) {
                          const account = userAccounts.find(
                            (item) => item.value === value,
                          );
                          if (account?.currency) {
                            form.setValue("currency", account.currency);
                          }
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
            {/*ammount currency*/}
            <div className="flex gap-2 max-[320px]:flex-col">
              {/*ammount*/}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col max-[450px]:flex-1 space-y-0">
                    <FormLabel className="dialog-labels">
                      {t(`amount`)}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        value={field.value === 0 ? "" : field.value}
                        className="dialog-inputs min-[450px]:w-[120px]"
                        onChange={(event) =>
                          field.onChange(+event.target.value)
                        }
                        disabled={isPending}
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
                      <input
                        type="text"
                        className="dialog-inputs min-[320px]:w-[100px] min-[450px]:max-w-[80px]"
                        value={field.value.toUpperCase()}
                        onChange={field.onChange}
                        disabled
                      />
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
          {/*desc*/}
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
            className={`w-full flex  justify-between gap-x-2 gap-y-1 min-[450px]:gap-2 ${selectedType !== 4 ? "max-[370px]:flex-col" : "flex-col"}`}
          >
            <div className="flex justify-between w-full">
              {/*date*/}
              <div
                className={`${selectedType === 4 && "flex justify-between min-[400px]:justify-start  min-[400px]:gap-2 w-full "}`}
              >
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-[280px]:max-w-[200px] space-y-0">
                      <FormLabel className="dialog-labels">
                        {selectedType !== 4 ? t(`date`) : t(`first-payment`)}
                      </FormLabel>
                      <FormControl>
                        {/*{...field}*/}
                        <input
                          min={
                            selectedType === 4
                              ? dateLimit.firstPaymentDate
                              : undefined
                          }
                          disabled={isPending}
                          type="date"
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
                <div className={`${selectedType !== 4 && "hidden"}`}>
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
                            min={
                              selectedType === 4
                                ? dateLimit.endPaymentDate
                                : undefined
                            }
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
            </div>
            {selectedType === 2 || selectedType === 4 ? (
              <div
                className={`${selectedType === 4 && "flex w-full justify-between min-[400px]:justify-start  min-[400px]:gap-2"}`}
              >
                {selectedType === 4 && (
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
                                  {t2(freq.selectText)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                                {t4(category.value)}
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
            ) : null}
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
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

export default AddTransactionForm;
