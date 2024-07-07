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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { EditTransactionProps } from "@/types";
import {
  convertFrequencyToDate,
  getTomorrowDate,
  removeEmptyStrings,
} from "@/helpers/generalFunctions";
import { deleteTransaction } from "@/actions/delete";
import { editTransaction } from "@/actions/edit-transaction";
import { categories, frequencies } from "@/constants";
import { useTranslations } from "next-intl";
import { getAddGoalSchema, getEditTransactionSchema } from "@/schemas";

// const formSchema = z.object({
//   accountFrom: z.string(),
//   accountTo: z.string(),
//   name: z.string().min(1),
//   amount: z.number().positive().min(1),
//   currency: z.string().min(1),
//   description: z.string().optional(),
//   date: z.string().min(1),
//   frequency: z.string(),
//   category: z.string().optional(),
//   endOfPayment: z.string().optional(),
// });

interface EditTransactionFormProps {
  data: EditTransactionProps;
}

const EditTransactionForm = ({ data }: EditTransactionFormProps) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("protected-dialog");
  const t1 = useTranslations("frequency");
  const t2 = useTranslations("form-messages");
  const EditTransactionSchema = getEditTransactionSchema(t2);
  const t3 = useTranslations("category");

  const defaultValues = {
    accountFrom: data.accountFrom?.name || "",
    accountTo: data.accountTo?.name || "",
    name: data.name,
    amount: data.amount,
    currency: data.currency,
    description: data.description || "",
    date: data.date
      ? data.date.toISOString().slice(0, 10)
      : data.firstPayment
        ? data.firstPayment.toISOString().slice(0, 10)
        : "",
    frequency: data.frequency?.toString() || "",
    category: data.category
      ? categories.find((cat) => cat.id === data.category)?.value
      : "",
    endOfPayment: data.endOfPayment
      ? data.endOfPayment.toISOString().slice(0, 10)
      : "",
  };

  const tomorrowDate = getTomorrowDate();

  const form = useForm<z.infer<typeof EditTransactionSchema>>({
    resolver: zodResolver(EditTransactionSchema),
    defaultValues: defaultValues,
  });

  function onDelete() {
    startTransition(() => {
      deleteTransaction(data.id, data.transactionType).then((data) => {
        toast({
          variant: `${data?.error ? "destructive" : "default"}`,
          title: data?.error || data?.success,
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
        if (data?.success) {
          router.refresh();
        }
      });
    });
  }

  function onSubmit(values: z.infer<typeof EditTransactionSchema>) {
    startTransition(() => {
      const category = categories.find((cat) => cat.value === values.category);

      const allValues = Object.assign(
        values,
        { id: data.id },
        { transactionType: data.transactionType },
        category ? { category: category?.id } : null,
      );
      const cleanedData = removeEmptyStrings(allValues);
      editTransaction(cleanedData).then((data) => {
        toast({
          variant: `${data?.error ? "destructive" : "default"}`,
          title: data?.error || data?.success,
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
        if (data?.success) {
          router.refresh();
        }
      });
    });
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-1 sm:space-y-2"
          autoComplete="off"
        >
          {data.transactionType !== 2 &&
            data.transactionType !== 4 &&
            data.transactionType !== 5 && (
              <FormField
                control={form.control}
                name="accountTo"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-0">
                    <FormLabel className="dialog-labels">
                      {t(`to-account`)}
                    </FormLabel>
                    <FormControl>
                      <input
                        type="text"
                        value={field.value}
                        className="dialog-inputs"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          {data.transactionType !== 1 && (
            <FormField
              control={form.control}
              name="accountFrom"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-0">
                  <FormLabel className="dialog-labels">
                    {t(`from-account`)}
                  </FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      value={field.value}
                      className="dialog-inputs"
                      disabled
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
                  <input type="text" className="dialog-inputs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*date and frequency*/}
          <div
            className={`w-full flex  justify-between gap-x-2 gap-y-1 min-[450px]:gap-2 ${data.transactionType !== 4 && data.transactionType !== 5 ? "max-[370px]:flex-col" : "flex-col"}`}
          >
            <div className="flex justify-between w-full">
              {/*date*/}
              <div
                className={`${data.transactionType === 4 && "flex justify-between min-[400px]:justify-start  min-[400px]:gap-2 w-full "} ${data.transactionType === 5 && "flex justify-between min-[400px]:justify-start  min-[400px]:gap-2 w-full "}`}
              >
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-[280px]:max-w-[200px] space-y-0">
                      <FormLabel className="dialog-labels">
                        {data.transactionType !== 4 &&
                        data.transactionType !== 5
                          ? t(`date`)
                          : t(`first-payment`)}
                      </FormLabel>
                      <FormControl>
                        <input
                          disabled={!!data.firstPayment}
                          min={
                            data.transactionType === 4
                              ? tomorrowDate
                              : data.transactionType === 5
                                ? tomorrowDate
                                : undefined
                          }
                          type="date"
                          className="dialog-inputs py-[5px] sm:py-[7px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div
                  className={`${data.transactionType !== 4 && data.transactionType !== 5 && "hidden"}`}
                >
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
                            min={tomorrowDate}
                            type="date"
                            className="dialog-inputs py-[5px] sm:py-[7px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            {data.transactionType === 2 ||
            data.transactionType === 4 ||
            data.transactionType === 5 ? (
              <div
                className={`${data.transactionType === 4 && "flex w-full justify-between min-[400px]:justify-start  min-[400px]:gap-2"} ${data.transactionType === 5 && "flex w-full justify-between min-[400px]:justify-start  min-[400px]:gap-2"}`}
              >
                {data.transactionType === 4 || data.transactionType === 5 ? (
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
                            disabled
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
                ) : null}
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
                                {t3(category.value)}
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
            ) : null}
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full font-medium bg-main-blue text-white rounded-lg py-2 mt-2 min-[450px]:py-3 min-[450px]:mt-3"
            >
              {data.transactionType === 5
                ? t(`edit-subscription`)
                : t(`edit-transaction`)}
            </button>
          </div>
        </form>
      </Form>
      <button
        onClick={onDelete}
        disabled={isPending}
        className="py-1 px-2 bg-black text-white rounded-lg mt-2"
      >
        {data.transactionType === 5
          ? t(`delete-subscription`)
          : t(`delete-transaction`)}
      </button>
    </>
  );
};

export default EditTransactionForm;
