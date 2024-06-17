import * as z from "zod";

export const ResetSchema = z.object({
  email: z.string().email(),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Heslo je příliž krátké" }),
});

export const LoginSchema = z.object({
  email: z.string().email().min(2).max(50),
  password: z.string().min(2).max(50),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
