import { z } from 'zod';
export const userSignUpSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not exceed 64 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      "Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*)."
    ),
  });
  
  // TypeScript type for the form
  export type UserSignUpForm = z.infer<typeof userSignUpSchema>;