import * as z from "zod";

export type Translate = (key: string) => string;

export function getResetSchema(t: Translate) {
  return z.object({
    email: z.string({ message: t("string") }).email({ message: t("email") }),
  });
}
export function getNewPasswordSchema(t: Translate) {
  return z.object({
    password: z
      .string({ message: t("string") })
      .min(6, { message: t("min-b") }),
  });
}

export function getLoginSchema(t: Translate) {
  return z.object({
    email: z
      .string({ message: t("string") })
      .email({ message: t("email") })
      .min(2, { message: t("min-a") })
      .max(40, { message: t("max-a") }),
    password: z
      .string({ message: t("string") })
      .min(6, { message: t("min-b") })
      .max(40, { message: t("max-a") }),
  });
}

export function getRegisterSchema(t: Translate) {
  return z.object({
    email: z.string({ message: t("string") }).email({ message: t("email") }),
    password: z
      .string({ message: t("string") })
      .min(6, { message: t("min-b") }),
  });
}

export function getAddAccountSchema(t: Translate, type: number) {
  return z
    .object({
      number: z.string({ message: t("string") }).optional(),
      name: z
        .string({ message: t("string") })
        .min(1, { message: t("field-required") }),
      balance: z
        .number({ message: t("number") })
        .min(1, { message: t("field-required") })
        .positive({ message: t("positive") }),
      payment: z.number({ message: t("number") }),
      currency: z
        .string({ message: t("string") })
        .min(1, { message: t("dropdown-required") }),
      date: z.string({ message: t("string") }),
      frequency: z.string({ message: t("string") }),
      category: z.string({ message: t("string") }).optional(),
    })
    .superRefine(({ payment, date, frequency }, ctx) => {
      if (type === 2) {
        if (payment === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("field-required"),
            path: ["payment"],
          });
        }
        if (payment < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "positive",
            path: ["payment"],
          });
        }
        if (date === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("field-required"),
            path: ["date"],
          });
        }
        if (frequency == "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("dropdown-required"),
            path: ["frequency"],
          });
        }
      }
    });
}

export function getAddGoalSchema(t: Translate) {
  return z.object({
    account: z.any(),
    name: z
      .string({ message: t("string") })
      .min(1, { message: t("field-required") }),
    amount: z
      .number({ message: t("number") })
      .min(1, { message: t("field-required") })
      .positive({ message: t("positive") }),
    date: z
      .string({ message: t("string") })
      .min(1, { message: t("field-required") }),
    color: z
      .string({ message: t("string") })
      .min(1, { message: t("dropdown-required") }),
    icon: z
      .string({ message: t("string") })
      .min(1, { message: t("dropdown-required") }),
  });
}
export function getAddSubscriptionSchema(t: Translate) {
  return z.object({
    accountFrom: z.string({ message: t("string") }),
    name: z
      .string({ message: t("string") })
      .min(1, { message: t("field-required") }),
    amount: z
      .number({ message: t("number") })
      .min(1, { message: t("field-required") })
      .positive({ message: t("positive") }),
    currency: z
      .string({ message: t("string") })
      .min(1, { message: t("dropdown-required") }),
    description: z.string({ message: t("string") }).optional(),
    date: z
      .string({ message: t("string") })
      .min(1, { message: t("field-required") }),
    frequency: z
      .string({ message: t("string") })
      .min(1, { message: t("dropdown-required") }),
    category: z.string({ message: t("string") }).optional(),
    endOfPayment: z.string({ message: t("string") }).optional(),
  });
}
export function getAddTransactionSchema(t: Translate, type: number) {
  return z
    .object({
      accountFrom: z.string({ message: t("string") }),
      accountTo: z.string({ message: t("string") }),
      name: z
        .string({ message: t("string") })
        .min(1, { message: t("field-required") }),
      amount: z
        .number({ message: t("number") })
        .positive({ message: t("positive") })
        .min(1, { message: t("field-required") }),
      currency: z
        .string({ message: t("string") })
        .min(1, { message: t("dropdown-required") }),
      description: z.string({ message: t("string") }).optional(),
      date: z
        .string({ message: t("string") })
        .min(1, { message: t("field-required") }),
      frequency: z.string({ message: t("string") }),
      category: z.string({ message: t("string") }).optional(),
      endOfPayment: z.string({ message: t("string") }).optional(),
    })
    .superRefine(({ frequency }, ctx) => {
      if (type === 4) {
        if (frequency == "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("dropdown-required"),
            path: ["frequency"],
          });
        }
      }
    });
}

export function getEditAccountSchema(t: Translate, type: number) {
  return z
    .object({
      number: z.string({ message: t("string") }).optional(),
      name: z
        .string({ message: t("string") })
        .min(1, { message: t("field-required") }),
      balance: z.any(),
      payment: z.number({ message: t("number") }),
      currency: z
        .string({ message: t("string") })
        .min(1, { message: t("dropdown-required") }),
      date: z.string({ message: t("string") }),
      frequency: z.string({ message: t("string") }),
      category: z.string({ message: t("string") }).optional(),
    })
    .superRefine(({ payment, date, frequency }, ctx) => {
      if (type === 2) {
        if (payment === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("field-required"),
            path: ["payment"],
          });
        }
        if (payment < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "positive",
            path: ["payment"],
          });
        }
        if (date === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("field-required"),
            path: ["date"],
          });
        }
        if (frequency == "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("dropdown-required"),
            path: ["frequency"],
          });
        }
      }
    });
}

export function getEditTransactionSchema(t: Translate) {
  return z.object({
    accountFrom: z.string({ message: t("string") }),
    accountTo: z.string({ message: t("string") }),
    name: z
      .string({ message: t("string") })
      .min(1, { message: t("field-required") }),
    amount: z
      .number({ message: t("number") })
      .min(1, { message: t("field-required") })
      .positive({ message: t("positive") }),
    currency: z
      .string({ message: t("string") })
      .min(1, { message: t("dropdown-required") }),
    description: z.string({ message: t("string") }).optional(),
    date: z
      .string({ message: t("string") })
      .min(1, { message: t("field-required") }),
    frequency: z.string({ message: t("string") }),
    category: z.string({ message: t("string") }).optional(),
    endOfPayment: z.string({ message: t("string") }).optional(),
  });
}
