"use client";
import React, { useTransition } from "react";
import { accountType } from "@/constants";
import { UserAccount } from "@/types";
import { number, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { findCurrencySymbol } from "@/helpers/generalFunctions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { addInvestment } from "@/actions/add-investment";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DialogContentWrapper from "@/components/protected/dialog/DialogContentWrapper";
import EditAccountForm from "@/components/protected/dialog/EditAccountForm";
import Image from "next/image";
import { deleteInvestmentHistoryItem } from "@/actions/delete";
const formSchema = z.object({
  amount: number().min(1).positive(),
});

const AccountItem = ({ data }: { data: UserAccount }) => {
  const router = useRouter();
  const { toast } = useToast();

  const defaultValues = {
    amount: 0,
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });
  const [isPending, startTransition] = useTransition();

  function deleteInvestmentData(id: string, isFirstBalance?: boolean) {
    if (isFirstBalance === true) {
      toast({
        variant: "destructive",
        title: "tento nelzse odstranit",
        description: "Friday, February 10, 2023 at 5:57 PM",
      });
      return;
    }
    startTransition(() => {
      deleteInvestmentHistoryItem(id, data.value).then((data) => {
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      const allValues = Object.assign(values, {
        id: data.value,
        type: data.type,
      });
      console.log(allValues);
      addInvestment(allValues).then((data) => {
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

  let displayFormToAddInvestmentBalance = false;
  if (data.type === 4 && data.updateBalance) {
    let todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    displayFormToAddInvestmentBalance =
      data.updateBalance?.length === 0 || // if data.updateBalance is null
      (data.updateBalance.length > 0 &&
        data.updateBalance[0].date.getTime() !== todayDate.getTime()) || // if first object's date is not equal to today's date
      !data.balance; // if data.balance is null
  }

  return (
    <div className="w-full flex flex-col justify-between p-2 min-[520px]:p-4 bg-main-gray rounded-xl mx-auto gap-2 max-w-[600px] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="flex max-[520px]:flex-col gap-4 px-2">
        <div className="flex flex-col flex-1 gap-1 max-[520px]:items-center max-[500px]:text-center">
          <p className="font-semibold">
            {accountType.find((acc) => acc.id === data.type)?.title}
          </p>
          <p>{data.name}</p>
          {data.number && <p>Číslo: {data.number}</p>}
        </div>
        <div className="flex flex-col items-center text-center justify-center min-[520px]:pl-2">
          <p className="font-semibold">Zůstatek</p>
          <p>
            {Intl.NumberFormat().format(data.balance)}{" "}
            {findCurrencySymbol(data.currency)}
          </p>
        </div>
      </div>
      {data.type === 4 && (
        <div className="flex max-[520px]:flex-col w-full gap-1 min-[520px]:justify-between">
          {displayFormToAddInvestmentBalance && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex w-full justify-between min-[300px]:gap-2 min-[520px]:w-[50%]"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="">
                      {/*<FormLabel className="dialog-labels">částka</FormLabel>*/}
                      <FormControl>
                        <input
                          type="number"
                          placeholder="Dnešní částka"
                          value={field.value === 0 ? "" : field.value}
                          className="border-[2px] border-main-blue bg-transparent px-2 py-1 min-[300px]:px-3 text-black rounded-md outline-none placeholder-black font-medium max-[300px]:text-sm max-w-[130px] min-[300px]:max-w-[160px]   h-full"
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  className="bg-black rounded-md text-white px-2 max-[300px]:text-sm min-[300px]:px-6 min-[300px]:py-1.5"
                >
                  Přidat
                </button>
              </form>
            </Form>
          )}
          {data.updateBalance && data?.updateBalance.length > 0 && (
            <div className="  flex justify-center">
              <Dialog>
                <DialogTrigger>
                  <p className="">historie</p>
                </DialogTrigger>
                <DialogContent
                  id="dialog-content"
                  className="bg-main-gray text-black rounded-md max-w-[400px]"
                >
                  <DialogContentWrapper title="Editovat účet" titleCenter>
                    <div className="flex flex-col gap-2 max-h-[90%] overflow-auto">
                      {data.updateBalance.map((item, i) => (
                        <div key={i} className=" w-full flex justify-between">
                          <p>{item.date.toLocaleDateString()}</p>
                          <div className="flex gap-2">
                            <p>
                              {Intl.NumberFormat().format(item.amount)}{" "}
                              {findCurrencySymbol(item.currency)}
                            </p>

                            <button
                              className={`${item.firstBalance === true && "hidden"}`}
                              onClick={() =>
                                deleteInvestmentData(item.id, item.firstBalance)
                              }
                            >
                              <Image
                                src="/icons/close.svg"
                                width={20}
                                height={20}
                                alt="delete"
                                className="invert"
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContentWrapper>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      )}

      <Dialog>
        <DialogTrigger>
          <p
            className={`w-full  text-white py-1.5 rounded-md cursor-pointer ${data.type === 2 ? "bg-main-error" : data.type === 3 ? "bg-green-600" : data.type === 4 ? "bg-main-yellow" : "bg-main-blue "}`}
          >
            Upravit
          </p>
        </DialogTrigger>
        <DialogContent
          id="dialog-content"
          className="bg-main-gray text-black rounded-md"
        >
          <DialogContentWrapper
            title="Editovat účet"
            description="editovat účet"
            titleCenter
          >
            <EditAccountForm data={data} />
          </DialogContentWrapper>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountItem;
