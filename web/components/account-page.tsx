"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconUser,
  IconEdit,
  IconCheck,
  IconX,
  IconBuildingSkyscraper,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconCurrencyDollar,
  IconListDetails,
  IconLock,
} from "@tabler/icons-react";

// --- SCHEMA & TYPES ---

// Define the Zod schema for the form.
// Password and photo_url are optional for editing and not required for display.
const profileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().optional(),
  position: z.string().min(2, { message: "Position is required." }),
  department: z.string().min(2, { message: "Department is required." }),
  salary: z.number().min(0, { message: "Salary cannot be negative." }),
  address: z.string().optional(),
});

// Infer the type from the schema
type ProfileFormValues = z.infer<typeof profileSchema>;

// --- MOCK DATA ---

// Mock data to simulate the currently logged-in user
const mockUser = {
  id: "user_12345",
  name: "Ahmad Riyadi",
  email: "ahmad.riyadi@example.com",
  phone: "081234567890",
  position: "Software Engineer",
  role: "employee",
  department: "IT",
  salary: 10000000,
  photo_url: "https://placehold.co/128x128/f0f9ff/1e3a8a?text=AR",
  address: "Jalan Pahlawan No. 123, Jakarta",
  status: "active",
};

// --- MAIN COMPONENT ---

export function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form with mock user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: mockUser,
  });

  // Function to handle form submission
  function onSubmit(values: ProfileFormValues) {
    // In a real application, you would send this data to your backend
    console.log("Saving user data:", values);
    toast.success("Profile updated successfully!");
    setIsEditing(false); // Exit edit mode after saving
  }

  return (
    <div className="py-12 px-4 lg:px-6 w-full mx-auto">
      <Card>
        <CardHeader className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="h-28 w-28 border-4 border-gray-200 shadow-md">
              <AvatarImage src={mockUser.photo_url} alt={mockUser.name} />
              <AvatarFallback className="text-3xl bg-primary/20 text-primary">
                <IconUser className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="mt-4 text-3xl">{mockUser.name}</CardTitle>
          <CardDescription className="text-lg text-primary">
            {mockUser.position}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-muted-foreground">
                    <IconUser className="h-5 w-5" /> Personal Information
                  </h3>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            {...field}
                            readOnly={!isEditing}
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
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
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Phone Number"
                            {...field}
                            readOnly={!isEditing}
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
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
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Address"
                            {...field}
                            readOnly={!isEditing}
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Professional Details Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2 text-muted-foreground">
                    <IconBriefcase className="h-5 w-5" /> Professional Details
                  </h3>
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Position"
                            {...field}
                            readOnly={!isEditing}
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Department"
                            {...field}
                            readOnly={!isEditing}
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Salary"
                            {...field}
                            readOnly={!isEditing}
                            className={
                              !isEditing ? "bg-muted cursor-not-allowed" : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        form.reset(); // Reset form to original values on cancel
                      }}
                    >
                      <IconX className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button type="submit">
                      <IconCheck className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    <IconEdit className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
