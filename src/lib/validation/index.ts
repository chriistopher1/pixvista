import * as z from "zod";

import { isEmailAvailable } from "../appwrite/api";

export const signUpValidation = z.object({
  name: z.string().min(2, { message: "*Must be at least 2 characters." }),
  username: z.string().min(2, { message: "*Must be at least 2 characters." }),
  email: z
    .string()
    .email({ message: "*Invalid format" })
    .refine((email) => isEmailAvailable(email), {
      message: "*Email is already in use",
    }),
  password: z.string().min(8, { message: "*Must be at least 8 characters." }),
});

export const SigninValidation = z.object({
  email: z.string().email({ message: "*Invalid format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});

export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});