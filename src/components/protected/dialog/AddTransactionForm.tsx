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
import { UserAccountFormatted } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { currencies, transactionType } from "@/constants";
import { removeEmptyStrings } from "@/helpers/generalFunctions";
import { createTransaction } from "@/actions/create-transaction";

const formSchema = z.object({
  accountFrom: z.string(),
  accountTo: z.string(),
  name: z.string().min(1),
  amount: z.number().positive().min(1),
  currency: z.string().min(1),
  description: z.string().optional(),
  date: z.string().min(1),
  frequency: z.string(),
});
const AddTransactionForm = ({
  userAccounts,
  defaultCurrency,
}: {
  userAccounts: UserAccountFormatted;
  defaultCurrency?: string;
}) => {
  const [selectedType, setSelectedType] = useState(1);

  useEffect(() => {
    form.reset(defaultValues);
  }, [selectedType]);

  const defaultValues = {
    accountFrom: "",
    accountTo: "",
    name: "",
    amount: 0,
    currency: defaultCurrency,
    description: "",
    date: "",
    frequency: "",
  };
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const [isPending, startTransition] = useTransition();

  function onSubmit(values: z.infer<typeof formSchema>) {
    const allValues = Object.assign(values, { transactionType: selectedType });

    const cleanedData = removeEmptyStrings(allValues);

    startTransition(() => {
      createTransaction(cleanedData).then((data) => {
        toast({
          variant: `${data?.error ? "destructive" : "default"}`,
          title: data?.error || data?.success,
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
        if (data?.success) {
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
          {transactionType.map((item) => {
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
          {selectedType !== 2 && selectedType != 4 && (
            <FormField
              control={form.control}
              name="accountTo"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-0">
                  <FormLabel className="dialog-labels">Na účet</FormLabel>
                  <FormControl>
                    <Combobox
                      className="p-0 min-h-0 h-fit overflow-clip rounded-lg "
                      popoverClassname="min-[512px]:w-[416px]"
                      mode="single" //single or multiple
                      options={userAccounts}
                      placeholder="Vyberte účet"
                      selected={field.value}
                      onChange={(value) => field.onChange(value)}
                      // onCreate={(value) => {}}
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
                  <FormLabel className="dialog-labels">Z účtu</FormLabel>
                  <FormControl>
                    <Combobox
                      className="p-0 min-h-0 h-fit overflow-clip rounded-lg "
                      mode="single" //single or multiple
                      options={userAccounts}
                      placeholder="Vyberte účet"
                      selected={field.value}
                      onChange={(value) => field.onChange(value)}
                      // onCreate={(value) => {}}
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
                  <FormLabel className="dialog-labels"> Název:</FormLabel>
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
                    <FormLabel className="dialog-labels">Částka:</FormLabel>
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
                    <FormLabel className="dialog-labels">Měna:</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
          {/*desc*/}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-0">
                <FormLabel className="dialog-labels">Popis:</FormLabel>
                <FormControl>
                  <input type="text" className="dialog-inputs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*date and frequency*/}
          <div className="w-full flex max-[280px]:flex-col justify-between">
            {/*date*/}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col min-[280px]:max-w-[200px] space-y-0">
                  <FormLabel className="dialog-labels">Datum:</FormLabel>
                  <FormControl>
                    <input type="date" className="dialog-inputs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedType === 4 && (
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-0">
                    <FormLabel className="dialog-labels">Frekvence:</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="min-[320px]:w-[100px] min-[450px]:max-w-[80px] h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="min-w-0">
                          <SelectItem
                            className="px-0 py-1 justify-center items-center"
                            value="7"
                          >
                            7
                          </SelectItem>
                          <SelectItem
                            className="px-0 py-1 justify-center items-center"
                            value="14"
                          >
                            14
                          </SelectItem>
                          <SelectItem
                            className="px-0 py-1 justify-center items-center"
                            value="30"
                          >
                            30
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div>
            <button className="w-full font-medium bg-main-blue text-white rounded-lg py-2 mt-2 min-[450px]:py-3 min-[450px]:mt-3">
              Přidat
            </button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default AddTransactionForm;
