"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconBuilding,
  IconMail,
  IconPhone,
  IconWorld,
  IconMapPin,
  IconClock,
  IconCalendar,
  IconTimeline,
} from "@tabler/icons-react";
import { Label } from "@/components/ui/label";

// Zod schema for form validation, combining fields from both company and companySetting models
const formSchema = z.object({
  // Company Profile fields
  name: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Company address must be at least 5 characters.",
  }),
  phone: z.string().optional(),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  website: z
    .string()
    .url({
      message: "Invalid website URL format.",
    })
    .optional()
    .or(z.literal("")), // Allows empty string as optional

  // Company Settings fields
  standard_work_hours_per_day: z.coerce.number().min(1).max(24, {
    message: "Work hours must be between 1 and 24.",
  }),
  standard_work_days_per_week: z.coerce.number().min(1).max(7, {
    message: "Work days must be between 1 and 7.",
  }),
  start_work_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:MM.",
  }),
  end_work_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Invalid time format. Use HH:MM.",
  }),
  overtime_rate_multiplier: z.coerce.number().positive({
    message: "Overtime rate must be a positive number.",
  }),
});

// Dummy data to simulate fetching existing company settings
// Default values are now numbers to match the Zod schema's final type.
const mockCompanyData = {
  name: "PT. Maju Mundur",
  address: "Jl. Contoh No. 123, Jakarta",
  phone: "+628123456789",
  email: "contact@maju-mundur.com",
  website: "https://www.maju-mundur.com",
  standard_work_hours_per_day: 8,
  standard_work_days_per_week: 5,
  start_work_time: "09:00",
  end_work_time: "17:00",
  overtime_rate_multiplier: 1.5,
};

export function CompanySettingsForm() {
  type CompanySettingsFormValues = z.infer<typeof formSchema>;

  const form = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: mockCompanyData,
  });

  // Function to handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    // This is where you would send the updated company data to your API
    console.log("Saving company settings:", values);
    toast.success("Company settings updated successfully!");
  }

  return (
    <div className="w-full py-12 px-4 lg:px-6 mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">
        Company Settings
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Company Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBuilding size={20} /> Company Profile
              </CardTitle>
              <CardDescription>
                Update your company's general information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconBuilding className="h-4 w-4" /> Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconMail className="h-4 w-4" /> Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconPhone className="h-4 w-4" /> Phone
                      </FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+62..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconWorld className="h-4 w-4" /> Website
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="flex items-center gap-2">
                        <IconMapPin className="h-4 w-4" /> Address
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Jl. Company No. 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Company Work Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconClock size={20} /> Work Settings
              </CardTitle>
              <CardDescription>
                Define standard working hours and policies for your company.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="standard_work_hours_per_day"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconClock className="h-4 w-4" /> Daily Hours
                      </FormLabel>
                      <FormControl>
                        {/* Ensure input value is a number */}
                        <Input
                          type="number"
                          placeholder="8"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="standard_work_days_per_week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconCalendar className="h-4 w-4" /> Weekly Days
                      </FormLabel>
                      <FormControl>
                        {/* Ensure input value is a number */}
                        <Input
                          type="number"
                          placeholder="5"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_work_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconClock className="h-4 w-4" /> Start Time
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_work_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconClock className="h-4 w-4" /> End Time
                      </FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="overtime_rate_multiplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconTimeline className="h-4 w-4" /> Overtime Rate
                      </FormLabel>
                      <FormControl>
                        {/* Ensure input value is a number */}
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="1.5"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
