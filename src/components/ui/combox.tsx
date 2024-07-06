"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./scroll-area";
import Link from "next/link";

export type ComboboxOptions = {
  value: string;
  label: string;
};

type Mode = "single" | "multiple";

interface ComboboxProps {
  mode?: Mode;
  options: ComboboxOptions[];
  selected: string | string[]; // Updated to handle multiple selections
  className?: string;
  popoverClassname?: string;
  placeholder?: string;
  onChange?: (event: string | string[]) => void; // Updated to handle multiple selections
  onCreate?: (value: string) => void;
  message?: string;
}

export function Combobox({
  options,
  selected,
  className,
  placeholder,
  mode = "single",
  onChange,
  popoverClassname,
  onCreate,
  message,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");
  return (
    <div className={cn("block", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            key={"combobox-trigger"}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between dialog-inputs h-fit font-normal"
          >
            {selected && selected.length > 0 ? (
              <div className="relative mr-auto flex flex-grow flex-wrap items-center overflow-hidden">
                <span>
                  {mode === "multiple" && Array.isArray(selected)
                    ? selected
                        .map(
                          (selectedValue: string) =>
                            options.find((item) => item.value === selectedValue)
                              ?.label,
                        )
                        .join(", ")
                    : mode === "single" &&
                      options.find((item) => item.value === selected)?.label}
                </span>
              </div>
            ) : (
              placeholder ?? "Select Item..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[calc(100vw-3rem)] p-0 min-[512px]:w-[462px]",
            popoverClassname,
          )}
        >
          {/*original*/}
          {/*<PopoverContent className="w-72 max-w-sm p-0">*/}
          <Command
            className="rounded-none w-full"
            filter={(value, search) => {
              if (value.includes(search)) return 1;
              return 0;
            }}
            // shouldFilter={true}
          >
            <CommandInput
              placeholder={placeholder ?? "Cari Item..."}
              value={query}
              onValueChange={(value: string) => setQuery(value)}
            />
            {/*<CommandEmpty*/}
            {/*  onClick={() => {*/}
            {/*    if (onCreate) {*/}
            {/*      onCreate(query);*/}
            {/*      setQuery("");*/}
            {/*    }*/}
            {/*  }}*/}
            {/*  className="flex cursor-pointer items-center justify-center gap-1 italic"*/}
            {/*>*/}
            {/*  <p>Create: </p>*/}
            {/*  <p className="block max-w-48 truncate font-semibold text-primary">*/}
            {/*    {query}*/}
            {/*  </p>*/}
            {/*</CommandEmpty>*/}
            <CommandEmpty className="h-fit text-center py-2 text-sm ">
              <Link
                href="/dashboard/accounts"
                className="font-medium w-full hover:font-semibold transition "
              >
                Vytvořit nový účet
              </Link>
            </CommandEmpty>
            <ScrollArea>
              <div className="max-h-80">
                <CommandGroup>
                  <CommandList>
                    {options.map((option) => (
                      <CommandItem
                        key={option.label}
                        // value={option.value}
                        value={option.label}
                        onSelect={(currentValue) => {
                          if (onChange) {
                            if (
                              mode === "multiple" &&
                              Array.isArray(selected)
                            ) {
                              onChange(
                                selected.includes(option.value)
                                  ? selected.filter(
                                      (item) => item !== option.value,
                                    )
                                  : [...selected, option.value],
                              );
                            } else {
                              onChange(option.value);
                            }
                          }
                        }}
                      >
                        {/*<CommandItem*/}
                        {/*  key={option.label}*/}
                        {/*  value={option.label}*/}
                        {/*  onSelect={(currentValue) => {*/}
                        {/*    if (onChange) {*/}
                        {/*      if (*/}
                        {/*        mode === "multiple" &&*/}
                        {/*        Array.isArray(selected)*/}
                        {/*      ) {*/}
                        {/*        onChange(*/}
                        {/*          selected.includes(option.value)*/}
                        {/*            ? selected.filter(*/}
                        {/*                (item) => item !== option.value,*/}
                        {/*              )*/}
                        {/*            : [...selected, option.value],*/}
                        {/*        );*/}
                        {/*      } else {*/}
                        {/*        onChange(option.value);*/}
                        {/*      }*/}
                        {/*    }*/}
                        {/*  }}*/}
                        {/*>*/}
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selected.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                    {/*create in dropdown*/}
                    <CommandItem className="flex flex-col gap-1">
                      {message && (
                        <p className="text-xs text-center italic py-1 border-black/10 border-y-[1px]">
                          {message}
                        </p>
                      )}
                      <Link
                        href="/"
                        className="font-medium text-center w-full hover:font-semibold transition"
                      >
                        Vytvořit nový účet
                      </Link>
                    </CommandItem>
                  </CommandList>
                </CommandGroup>
              </div>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
