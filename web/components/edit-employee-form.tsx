"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconUserPlus,
  IconPhoto,
  IconMapPin,
  IconLoader,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { EmployeeService } from "@/services/EmployeeService";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z.string().optional().nullable(),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .optional()
    .or(z.literal("")),
  position: z.string().min(2, {
    message: "Position is required.",
  }),
  role: z.enum(["admin", "manager", "employee"]),
  department: z.string().min(2, {
    message: "Department is required.",
  }),
  salary: z.number().positive({
    message: "Salary must be a positive number.",
  }),
  photo_url: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

type Employee = z.infer<typeof formSchema>;

export function EditEmployeeForm({ params }: { params: { id_user: string } }) {
  const { id_user } = params;
  const [isLoading, setIsLoading] = useState(true);
  const route = useRouter();

  const form = useForm<Employee>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      position: "",
      role: "employee",
      department: "IT",
      salary: 0,
      photo_url: "",
      address: "",
    },
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!id_user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await EmployeeService.getEmployeeById(id_user);
        const employeeData = response.data.data;
        if (employeeData) {
          const populatedData = {
            ...employeeData,
            password: "",
            salary: Number(employeeData.salary) || 0,
          };
          form.reset(populatedData);
          toast.success("Employee data loaded successfully!");
        } else {
          toast.error("Employee not found.");
        }
      } catch (error) {
        console.error("Failed to fetch employee data:", error);
        toast.error("Failed to load employee data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [id_user]);

  async function onSubmit(values: Employee) {
    try {
      const payload = {
        ...values,
        id: id_user,
      };

      if (payload.password === "") {
        delete payload.password;
      }

      await EmployeeService.updateEmployee(id_user, payload);
      toast.success("Employee updated successfully!");
      route.push("/employee");
    } catch (error) {
      console.error("Failed to update employee:", error);
      toast.error("Failed to update employee. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <IconLoader className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading employee data...</span>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Employee</CardTitle>
          <CardDescription>
            Update the details for this employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+62..."
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Leave blank to keep current password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Employment Details Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Software Engineer" {...field} />
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
                          <Input placeholder="IT" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
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
                          {/* Use type="number" with onChange to ensure correct data type */}
                          <Input
                            type="number"
                            placeholder="5000000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="photo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <IconPhoto className="h-4 w-4" /> Photo URL
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/photo.jpg"
                            {...field}
                            value={field.value ?? ""}
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
                        <FormLabel className="flex items-center gap-2">
                          <IconMapPin className="h-4 w-4" /> Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jl. Contoh No. 123"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
