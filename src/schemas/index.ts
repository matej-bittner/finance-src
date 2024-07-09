import * as z from "zod";

export type Translate = (key: string) => string;

export function getResetSchema(t: Translate) {
  return z.object({
    email: z.string({ message: t("string") }).email({ message: t("email") }),
  });
}
export const ResetSchema = z.object({
  email: z.string().email(),
});

export function getNewPasswordSchema(t: Translate) {
  return z.object({
    password: z
      .string({ message: t("string") })
      .min(6, { message: t("min-b") }),
  });
}
export const NewPasswordSchema = z.object({
  password: z.string().min(6),
});

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
export const LoginSchema = z.object({
  email: z.string().email().min(2).max(40),
  password: z.string().min(6).max(40),
});

export function getSettingsSchema(t: Translate) {
  return z
    .object({
      name: z.optional(z.string({ message: t("string") })),
      email: z.optional(
        z.string({ message: t("string") }).email({ message: t("email") }),
      ),
      password: z.optional(
        z.string({ message: t("string") }).min(6, { message: t("min-b") }),
      ),
      newPassword: z.optional(
        z.string({ message: t("string") }).min(6, { message: t("min-b") }),
      ),
      mainCurrency: z.string().min(1, { message: t("field-required") }),
      mainLanguage: z.string().min(1, { message: t("field-required") }),
    })
    .superRefine(({ password, newPassword }, ctx) => {
      if (password && !newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("field-required"),
          path: ["newPassword"],
        });
      }
      if (newPassword && !password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("field-required"),
          path: ["password"],
        });
      }
    });
}
export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
    mainCurrency: z.string().min(1),
    mainLanguage: z.string().min(1),
  })
  .refine(({ password, newPassword }) => {
    if (password && !newPassword) {
      return false;
    }
    if (newPassword && !password) {
      return false;
    }
    return true;
  });

export function getRegisterSchema(t: Translate) {
  return z.object({
    email: z.string({ message: t("string") }).email({ message: t("email") }),
    password: z
      .string({ message: t("string") })
      .min(6, { message: t("min-b") }),
  });
}

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export function getAddAccountSchema(t: Translate, type: number) {
  return z
    .object({
      number: z.string({ message: t("string") }).optional(),
      name: z
        .string({ message: t("string") })
        .min(1, { message: t("field-required") })
        .max(25, { message: t("max-b") }),
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
      .min(1, { message: t("field-required") })
      .max(15, { message: t("max-c") }),
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
      .min(1, { message: t("field-required") })
      .max(15, { message: t("max-c") }),

    amount: z
      .number({ message: t("number") })
      .min(1, { message: t("field-required") })
      .positive({ message: t("positive") }),
    currency: z
      .string({ message: t("string") })
      .min(1, { message: t("dropdown-required") }),
    description: z
      .string({ message: t("string") })
      .max(50, { message: t("max-d") })
      .optional(),
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
        .min(1, { message: t("field-required") })
        .max(15, { message: t("max-c") }),

      amount: z
        .number({ message: t("number") })
        .positive({ message: t("positive") })
        .min(1, { message: t("field-required") }),
      currency: z
        .string({ message: t("string") })
        .min(1, { message: t("dropdown-required") }),
      description: z
        .string({ message: t("string") })
        .max(50, { message: t("max-d") })
        .optional(),
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
        .min(1, { message: t("field-required") })
        .max(25, { message: t("max-b") }),

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
      .min(1, { message: t("field-required") })
      .max(15, { message: t("max-c") }),

    amount: z
      .number({ message: t("number") })
      .min(1, { message: t("field-required") })
      .positive({ message: t("positive") }),
    currency: z
      .string({ message: t("string") })
      .min(1, { message: t("dropdown-required") }),
    description: z
      .string({ message: t("string") })
      .max(50, { message: t("max-d") })
      .optional(),
    date: z
      .string({ message: t("string") })
      .min(1, { message: t("field-required") }),
    frequency: z.string({ message: t("string") }),
    category: z.string({ message: t("string") }).optional(),
    endOfPayment: z.string({ message: t("string") }).optional(),
  });
}
