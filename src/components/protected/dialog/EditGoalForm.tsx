"use client";
import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { GoalData, UserAccount } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox } from "@/components/ui/combox";
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
import { colors, icons } from "@/constants";
import { removeEmptyStrings } from "@/helpers/generalFunctions";
import { editGoal } from "@/actions/edit-goal";
import { useRouter } from "next/navigation";
import { deleteGoal } from "@/actions/delete";
import { useTranslations } from "next-intl";

const formSchema = z.object({
  account: z.any(),
  name: z.string().min(1),
  amount: z.number().positive().min(1),
  date: z.string().min(1),
  color: z.string().min(1),
  icon: z.string().min(1),
});

const EditGoalForm = ({
  defaultCurrency,
  userAccounts,
  goalData,
}: {
  userAccounts: UserAccount[];
  defaultCurrency?: string;
  goalData: GoalData;
}) => {
  useEffect(() => {
    setSelectedAccount(goalData.paymentAccount.map((acc) => acc.id));
  }, []);
  const t = useTranslations("protected-dialog");

  const { toast } = useToast();
  const router = useRouter();
  const matchingAccounts = userAccounts.filter((account) =>
    goalData.paymentAccount.some((target) => target.id === account.value),
  );
  const filteredAccounts = userAccounts.filter(
    (account) => !account.blockedForGoals || matchingAccounts,
  );

  const defaultValues = {
    name: goalData.name,
    amount: goalData.amount,
    date: goalData.finishDate.toISOString().slice(0, 10),
    color: goalData.color,
    icon: goalData.icon,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const [selectedAccount, setSelectedAccount] = useState<string | string[]>([]);
  const [isPending, startTransition] = useTransition();

  function onDelete() {
    startTransition(() => {
      deleteGoal(goalData.id).then((data) => {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      const allValues = Object.assign(
        values,
        { accounts: selectedAccount },
        { id: goalData.id },
      );
      const cleanedData = removeEmptyStrings(allValues);
      editGoal(cleanedData).then((data) => {
        toast({
          variant: `${data?.error ? "destructive" : "default"}`,
          title: data?.error || data?.success,
          description: "Friday, February 10, 2023 at 5:57 PM",
        });
        if (data?.success) {
          router.refresh();
          form.reset(defaultValues);
          setSelectedAccount([]);
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
          <FormField
            control={form.control}
            name="account"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-0">
                <FormLabel className="dialog-labels">
                  {t(`connected-accounts`)}
                </FormLabel>
                <FormControl>
                  <Combobox
                    className="p-0 min-h-0 h-fit overflow-clip rounded-lg "
                    mode="multiple" //single or multiple
                    options={filteredAccounts}
                    placeholder={t(`choose-account`)}
                    message={t(`choose-account-placeholder`)}
                    // selected={field.value}
                    selected={selectedAccount}
                    // selected={selectedAccount}
                    onChange={(value) => setSelectedAccount(value)}
                    // onChange={field.onChange}
                    onCreate={() => {}}
                    // onCreate={(value) => {}}
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
                  <FormLabel className="dialog-labels">{t(`name`)}</FormLabel>
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
                  <FormLabel className="dialog-labels">{t(`amount`)}</FormLabel>
                  <FormControl>
                    <input
                      type="number"
                      placeholder={defaultCurrency?.toUpperCase()}
                      value={field.value === 0 ? "" : field.value}
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
                  <FormLabel className="dialog-labels">
                    {t(`goal-finish-date`)}
                  </FormLabel>
                  <FormControl>
                    <input
                      type="date"
                      className="dialog-inputs py-[5px] sm:py-[7px]"
                      {...field}
                    />
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
                    <FormLabel className="dialog-labels">
                      {t(`color`)}
                    </FormLabel>
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
                    <FormLabel className="dialog-labels">{t(`icon`)}</FormLabel>
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
              disabled={isPending}
              className="w-full font-medium bg-main-blue text-white rounded-lg py-2 mt-2 min-[450px]:py-3 min-[450px]:mt-3"
            >
              {t(`edit-goal`)}
            </button>
          </div>
        </form>
      </Form>
      <button
        onClick={onDelete}
        disabled={isPending}
        className="py-1 px-2 bg-black text-white rounded-lg mt-2"
      >
        {t(`delete-goal`)}
      </button>
    </>
  );
};

export default EditGoalForm;
