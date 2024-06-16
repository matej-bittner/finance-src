"use client";
import React from "react";
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

const formSchema = z.object({
  account: z.string(),
  name: z.string(),
  amount: z.number().positive(),
  currency: z.string(),
  description: z.string(),
  date: z.string(),
});

const yourOptions: { value: string; label: string }[] = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];
const EditTransactionForm = ({ data }: any) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: "",
      name: "",
      amount: 0,
      currency: "czk",
      description: "",
      date: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-1 sm:space-y-2"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="account"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-0">
              <FormLabel className="dialog-labels">Na účet</FormLabel>
              <FormControl>
                <Combobox
                  className="p-0 min-h-0 h-fit overflow-clip rounded-lg "
                  mode="single" //single or multiple
                  options={yourOptions}
                  placeholder="Vyberte účet"
                  selected={field.value}
                  onChange={(value) => field.onChange(value)}
                  onCreate={(value) => {}}
                />
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
                      type="text"
                      className="dialog-inputs min-[450px]:w-[120px]"
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
                        <SelectItem
                          className="px-0 py-1 justify-center items-center"
                          value="czk"
                        >
                          CZK
                        </SelectItem>
                        <SelectItem
                          className="px-0 py-1 justify-center items-center"
                          value="eur"
                        >
                          EUR
                        </SelectItem>
                        <SelectItem
                          className="px-0 py-1 justify-center items-center"
                          value="gpb"
                        >
                          GBP
                        </SelectItem>
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

        {/*date*/}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col max-w-[200px] space-y-0">
              <FormLabel className="dialog-labels">Datum:</FormLabel>
              <FormControl>
                <input type="date" className="dialog-inputs" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <button className="w-full font-medium bg-main-blue text-white rounded-lg py-2 mt-2 min-[450px]:py-3 min-[450px]:mt-3">
            Uložit Změny
          </button>
        </div>
      </form>
    </Form>
  );
};

export default EditTransactionForm;
