// "use client";
// import React, { useTransition } from "react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createPaymentAccount } from "@/actions/create-payment-account";
// import { useToast } from "@/components/ui/use-toast";
// import { currencies } from "@/constants";
//
// const formSchema = z.object({
//   number: z.string().optional(),
//   name: z.string().min(1),
//   balance: z.number(),
//   currency: z.string(),
//   type: z.string().optional(),
// });
//
// const CreateAccountForm = ({
//   defaultCurrency,
// }: {
//   defaultCurrency?: string;
// }) => {
//   const [isPending, startTransition] = useTransition();
//   const { toast } = useToast();
//   const defaultValues = {
//     number: "",
//     name: "",
//     balance: 0,
//     currency: defaultCurrency,
//     type: "",
//   };
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: defaultValues,
//   });
//
//   function onSubmit(values: z.infer<typeof formSchema>) {
//     startTransition(() => {
//       createPaymentAccount(values).then((data) => {
//         toast({
//           variant: `${data?.error ? "destructive" : "default"}`,
//           title: data?.error || data?.success,
//           description: "Friday, February 10, 2023 at 5:57 PM",
//         });
//         if (data?.success) {
//           form.reset(defaultValues);
//         }
//       });
//     });
//   }
//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="w-full space-y-1 sm:space-y-2"
//         autoComplete="off"
//       >
//         <FormField
//           control={form.control}
//           name="number"
//           render={({ field }) => (
//             <FormItem className="flex flex-col min-[450px]:flex-1 space-y-0">
//               <FormLabel className="dialog-labels"> Číslo:</FormLabel>
//               <FormControl>
//                 <input type="text" className="dialog-inputs" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//
//         {/*name ammount currency*/}
//         <div className="flex gap-1 max-[450px]:flex-col min-[450px]:gap-2">
//           {/*name*/}
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem className="flex flex-col min-[450px]:flex-1 space-y-0">
//                 <FormLabel className="dialog-labels"> Název:</FormLabel>
//                 <FormControl>
//                   <input type="text" className="dialog-inputs" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="type"
//             render={({ field }) => (
//               <FormItem className="flex flex-col min-[450px]:flex-1 space-y-0">
//                 <FormLabel className="dialog-labels"> Typ účtu:</FormLabel>
//                 <FormControl>
//                   <input type="text" className="dialog-inputs" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//
//           {/*ammount currency*/}
//           <div className="flex gap-2 max-[320px]:flex-col">
//             {/*ammount*/}
//             <FormField
//               control={form.control}
//               name="balance"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col max-[450px]:flex-1 space-y-0">
//                   <FormLabel className="dialog-labels">
//                     Momentální zůstatek:
//                   </FormLabel>
//                   <FormControl>
//                     <input
//                       type="number"
//                       value={field.value === 0 ? "" : field.value}
//                       className="dialog-inputs min-[450px]:w-[120px]"
//                       onChange={(event) => field.onChange(+event.target.value)}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//
//             {/*currency*/}
//             <FormField
//               control={form.control}
//               name="currency"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col space-y-0">
//                   <FormLabel className="dialog-labels">Měna:</FormLabel>
//                   <FormControl>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <SelectTrigger className="min-[320px]:w-[100px] min-[450px]:max-w-[80px] h-fit focus:outline-none focus:ring-0  focus:ring-offset-0 pl-3 pr-1 py-1.5 sm:py-2 border-none rounded-lg">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent className="min-w-0">
//                         {currencies.map((currency) => (
//                           <SelectItem
//                             key={currency.id}
//                             className="px-0 py-1 justify-center items-center"
//                             value={currency.value}
//                           >
//                             {currency.value.toUpperCase()}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>
//         {/*desc*/}
//
//         <div>
//           <button className="w-full font-medium bg-main-blue text-white rounded-lg py-2 mt-2 min-[450px]:py-3 min-[450px]:mt-3">
//             Uložit Změny
//           </button>
//         </div>
//       </form>
//     </Form>
//   );
// };
//
// export default CreateAccountForm;
