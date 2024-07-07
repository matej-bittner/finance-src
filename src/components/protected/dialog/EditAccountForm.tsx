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
import { UserAccount } from "@/types";
import {
  getTomorrowDate,
  removeEmptyStrings,
} from "@/helpers/generalFunctions";
import { deleteAccount } from "@/actions/delete";
import { categories, frequencies } from "@/constants";
import { useTranslations } from "next-intl";
import { editPaymentAccount } from "@/actions/edit-payment-account";
import { getAddAccountSchema, getEditAccountSchema } from "@/schemas";

// const formSchema = z.object({
//   number: z.string().optional(),
//   name: z.string().min(1),
//   balance: z.number().positive().min(1),
//   payment: z.number(),
//   currency: z.string().min(1),
//   date: z.string(),
//   frequency: z.string(),
//   category: z.string().optional(),
// });

interface EditAccountFormProps {
  data: UserAccount;
}

const EditAccountForm = ({ data }: EditAccountFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState(1);
  useEffect(() => {
    setSelectedType(data.type);
  }, []);
  const router = useRouter();
  const { toast } = useToast();

  const t = useTranslations("protected-dialog");
  const t1 = useTranslations("frequency");
  const t2 = useTranslations("form-messages");
  const EditAccountSchema = getEditAccountSchema(t2, selectedType);
  const t3 = useTranslations("category");

  const defaultValues = {
    number: data?.number || "",
    name: data.name,
    balance: data.balance,
    currency: data.currency,
    category: data?.periodicPayment
      ? data?.periodicPayment[0]?.category
        ? categories.find(
            // @ts-ignore
            (cat) => cat.id === data?.periodicPayment[0]?.category,
          )?.value
        : ""
      : "",
    // date: "",
    date: data?.periodicPayment
      ? data?.periodicPayment[0].toProcess.toISOString().slice(0, 10)
      : "",
    frequency: data?.periodicPayment
      ? data.periodicPayment[0].frequency.toString()
      : "",
    payment: data?.periodicPayment ? data.periodicPayment[0].amount : 0,
  };

  const tomorrowDate = getTomorrowDate();
  const form = useForm<z.infer<typeof EditAccountSchema>>({
    resolver: zodResolver(EditAccountSchema),
    defaultValues: defaultValues,
  });

  function onDelete() {
    startTransition(() => {
      deleteAccount(data.value, data.type).then((data) => {
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

  function onSubmit(values: z.infer<typeof EditAccountSchema>) {
    startTransition(() => {
      const category = categories.find((cat) => cat.value === values.category);

      let allValues = Object.assign(
        values,
        { id: data.value },
        { type: data.type },
        category ? { category: category?.id } : null,
      );
      if (data.type === 2 && data?.periodicPayment) {
        allValues = Object.assign(
          values,
          { id: data.value },
          { type: data.type },
          { periodicPaymentId: data.periodicPayment[0].id },
          category ? { category: category?.id } : null,
        );
      }
      const cleanedData = removeEmptyStrings(allValues);
      editPaymentAccount(cleanedData).then((data) => {
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
          {/*account number*/}
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-0">
                <FormLabel className="dialog-labels">
                  {t(`account-number`)}
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
            {/*balance currency*/}
            <div className="flex gap-2 max-[320px]:flex-col">
              {/*balance*/}
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
                        // value={field.value === 0 ? "" : field.value}
                        className="dialog-inputs min-[450px]:w-[120px]"
                        disabled
                        value={field.value}
                        // onChange={(event) =>
                        //   field.onChange(+event.target.value)
                        // }
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
          {/*payment date frequency*/}
          {selectedType === 2 && (
            <div className="flex flex-col space-y- sm:space-y-2">
              <div className="flex gap-1 max-[450px]:flex-col min-[450px]:gap-2">
                {/*name*/}
                <FormField
                  control={form.control}
                  name="payment"
                  render={({ field }) => (
                    <FormItem className="flex flex-col min-[450px]:flex-1 space-y-0">
                      <FormLabel className="dialog-labels">
                        {t(`loan-payment`)}
                      </FormLabel>
                      <FormControl>
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
                        <FormLabel className="dialog-labels">
                          {t(`next-payment`)}
                        </FormLabel>
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
          )}

          <div>
            <button
              type="submit"
              className="w-full font-medium bg-main-blue text-white rounded-lg py-2 mt-2 min-[450px]:py-3 min-[450px]:mt-3"
            >
              {t(`edit-account`)}
            </button>
          </div>
        </form>
      </Form>
      <button
        onClick={onDelete}
        disabled={isPending}
        className="py-1 px-2 bg-black text-white rounded-lg mt-2"
      >
        {t(`delete-account`)}
      </button>
    </>
  );
};

export default EditAccountForm;
