"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconBuildingCommunity,
  IconLoader,
} from "@tabler/icons-react";

// Import the real DepartmentService
import { DepartmentService } from "@/services/DepartmentService";

// --- SCHEMA & TYPES ---

// Define the Zod schema for the Department model
const departmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional().nullable(),
});

// Infer the type from the schema
type Department = z.infer<typeof departmentSchema>;

// --- MAIN COMPONENT ---

export function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Define default values with the correct type explicitly
  const defaultValues: Department = {
    name: "",
    description: "",
  };

  // Initialize the form with zodResolver and the explicit defaultValues
  const form = useForm<Department>({
    resolver: zodResolver(departmentSchema),
    defaultValues: defaultValues,
  });

  // Function to fetch departments from the API
  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const response = await DepartmentService.getAllDepartments();
      const departmentsData = response.data.data;
      if (Array.isArray(departmentsData)) {
        setDepartments(departmentsData);
        toast.success("Departments fetched successfully!");
      } else {
        console.error("API response data is not an array:", departmentsData);
        toast.error("Invalid data format received from API.");
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to load departments data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch departments on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Function to handle form submission (Create & Update)
  const onSubmit = async (values: Department) => {
    try {
      if (editingDepartment) {
        // Logic for editing an existing department
        if (values.id) {
          await DepartmentService.updateDepartment(values.id, values);
          toast.success("Department updated successfully!");
        }
      } else {
        // Logic for creating a new department
        await DepartmentService.createDepartment(values);
        toast.success("New department created successfully!");
      }
      setIsDialogOpen(false);
      form.reset();
      fetchDepartments(); // Refresh data after submission
    } catch (error) {
      console.error("Error submitting department:", error);
      toast.error("Failed to save department. Please try again.");
    }
  };

  // Handle dialog opening for editing
  const handleEditClick = (department: Department) => {
    setEditingDepartment(department);
    form.reset(department); // Reset the form with the department's data
    setIsDialogOpen(true);
  };

  // Handle dialog opening for creating
  const handleCreateClick = () => {
    setEditingDepartment(null);
    form.reset(defaultValues); // Reset the form to empty values
    setIsDialogOpen(true);
  };

  // Handle department deletion
  const handleDeleteClick = async (id: string) => {
    try {
      await DepartmentService.deleteDepartment(id);
      toast.success("Department deleted successfully!");
      fetchDepartments(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Failed to delete department. Please try again.");
    }
  };

  return (
    <div className="py-12 px-4 lg:px-6 w-full mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Departments</CardTitle>
            <CardDescription>
              Manage your company's departments.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateClick}>
                <IconPlus className="mr-2 h-4 w-4" /> Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingDepartment ? "Edit Department" : "Add New Department"}
                </DialogTitle>
                <DialogDescription>
                  {editingDepartment
                    ? "Make changes to the department here."
                    : "Fill in the details for a new department."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Finance" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the department responsibilities."
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">
                      {editingDepartment ? "Save changes" : "Create Department"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <IconLoader className="animate-spin" /> Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : departments.length > 0 ? (
                  departments.map((department) => (
                    <TableRow key={department.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <IconBuildingCommunity className="h-4 w-4 text-muted-foreground" />
                        {department.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {department.description}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(department)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteClick(department.id as string)
                          }
                        >
                          <IconTrash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No departments found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
