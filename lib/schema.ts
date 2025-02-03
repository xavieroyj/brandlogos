import * as z from "zod";
import { iconStyles, type IconStyle } from "./styles";

export const brandFormSchema = z.object({
  brandName: z
    .string()
    .min(1, "Brand name is required")
    .max(50, "Brand name must be less than 50 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed"),
  style: z.custom<IconStyle>(
    (val) => Object.keys(iconStyles).includes(val as string),
    "Please select a valid icon style"
  ),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;