"use client";
import React, { useState } from "react";
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

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox } from "@/components/ui/combox";
import Image from "next/image";

const formSchema = z.object({
  account: z.any(),
  name: z.string(),
  amount: z.number().positive(),
  date: z.string(),
  color: z.string(),
  icon: z.string(),
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

const icons = [
  "brush",
  "building",
  "cake",
  "calendar",
  "car",
  "game",
  "gameboy",
  "gift",
  "holiday",
  "hospital",
  "house",
  "mobile",
  "snow",
  "teacher",
  "truck",
];

const colors = [
  {
    color: "red",
    background: "bg-[#E90000]",
    stroke: "stroke-[#E90000]",
    fill: "fill-[#E90000]",
  },
  {
    color: "blue",
    background: "bg-[#007BFF]",
    stroke: "stroke-[#007BFF]",
    fill: "fill-[#007BFF]",
  },
  {
    color: "green",
    background: "bg-[#28A745]",
    stroke: "stroke-[#28A745]",
    fill: "fill-[#28A745]",
  },
  {
    color: "yellow",
    background: "bg-[#ffc107]",
    stroke: "stroke-[#ffc107]",
    fill: "fill-[#ffc107]",
  },
  {
    color: "purple",
    background: "bg-[#6F42C1]",
    stroke: "stroke-[#6F42C1]",
    fill: "fill-[#6F42C1]",
  },
  {
    color: "orange",
    background: "bg-[#fd7e14]",
    stroke: "stroke-[#fd7e14]",
    fill: "fill-[#fd7e14]",
  },
  {
    color: "pink",
    background: "bg-[#ffc0cb]",
    stroke: "stroke-[#ffc0cb]",
    fill: "fill-[#ffc0cb]",
  },
  {
    color: "teal",
    background: "bg-[#00BDBE]",
    stroke: "stroke-[#00BDBE]",
    fill: "fill-[#00BDBE]",
  },
  {
    color: "gray",
    background: "bg-[#808080]",
    stroke: "stroke-[#808080]",
    fill: "fill-[#808080]",
  },
];

const AddGoalForm = ({ data }: any) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
      date: "",
      color: "red",
      icon: "house",
    },
  });
  const [selectedTest, setSelectedTest] = useState<string | string[]>([]);
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    console.log(selectedTest);
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
              <FormLabel className="dialog-labels">Připojené účty</FormLabel>
              <FormControl>
                <Combobox
                  className="p-0 min-h-0 h-fit overflow-clip rounded-lg "
                  mode="multiple" //single or multiple
                  options={yourOptions}
                  placeholder="Vyberte účet"
                  // selected={field.value}
                  selected={selectedTest}
                  onChange={(value) => setSelectedTest(value)}
                  // onChange={field.onChange}
                  onCreate={(value) => {}}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*name ammount currency*/}
        <div className="flex gap-1 max-[400px]:flex-col min-[450px]:gap-2">
          {/*name*/}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col flex-1 space-y-0">
                <FormLabel className="dialog-labels"> Název:</FormLabel>
                <FormControl>
                  <input type="text" className="dialog-inputs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*ammount*/}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem className="flex flex-col  space-y-0">
                <FormLabel className="dialog-labels">Částka:</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    className="dialog-inputs min-[400px]:w-[120px] sm:w-[150px]"
                    onChange={(event) => field.onChange(+event.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/*date color icon*/}
        <div className="flex max-[500px]:flex-col max-[500px]:space-y-2 min-[500px]:justify-between">
          {/*date*/}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col max-w-[200px] space-y-0">
                <FormLabel className="dialog-labels">Splnit do:</FormLabel>
                <FormControl>
                  <input type="date" className="dialog-inputs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/*color + icon*/}
          <div className="flex gap-2 ">
            {/*color*/}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-0">
                  <FormLabel className="dialog-labels">Barva:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[60px] h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-0  w-[calc(100vw-3rem)] p-0 min-[512px]:w-[462px]">
                        <div className="grid grid-cols-5 ">
                          {colors.map((color, i) => (
                            <SelectItem
                              key={i}
                              hideCheck
                              className="px-0 py-1 justify-center items-center"
                              value={color.color}
                            >
                              <div
                                className={`w-[20px] aspect-square rounded-lg ${color.background}`}
                              />
                            </SelectItem>
                          ))}
                        </div>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/*icon*/}
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-0">
                  <FormLabel className="dialog-labels">Ikona:</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[60px] h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="min-w-0  w-[calc(100vw-3rem)] p-0 min-[512px]:w-[462px]">
                        <div className="grid grid-cols-5 ">
                          {icons.map((icon, i) => (
                            <SelectItem
                              key={i}
                              hideCheck
                              className="px-0 py-1 justify-center items-center"
                              value={icon}
                            >
                              <Image
                                src={`/goal-icons/${icon}.svg`}
                                alt={icon}
                                width={20}
                                height={20}
                              />
                            </SelectItem>
                          ))}
                        </div>
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
            className="w-full font-medium bg-main-blue text-white rounded-lg py-2 mt-2 min-[450px]:py-3 min-[450px]:mt-3"
          >
            Přidat Cíl
          </button>
        </div>
      </form>
    </Form>
  );
};

export default AddGoalForm;
