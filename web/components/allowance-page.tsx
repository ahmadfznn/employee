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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCash,
  IconLoader,
} from "@tabler/icons-react";

// Import the real AllowanceService
import { AllowanceService } from "@/services/AllowanceService";

// --- SCHEMA & TYPES ---

// Define the Zod schema for the Allowance model
const allowanceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  description: z.string().optional().nullable(),
  default_amount: z
    .number()
    .min(0, { message: "Default amount cannot be negative." }),
  is_fixed: z.boolean(),
});

// Infer the type from the schema
type Allowance = z.infer<typeof allowanceSchema>;

// --- MAIN COMPONENT ---

export function AllowancesPage() {
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAllowance, setEditingAllowance] = useState<Allowance | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Define default values with the correct type explicitly
  const defaultValues: Allowance = {
    name: "",
    description: "",
    default_amount: 0,
    is_fixed: false,
  };

  // Initialize the form with zodResolver and the explicit defaultValues
  const form = useForm<Allowance>({
    resolver: zodResolver(allowanceSchema),
    defaultValues: defaultValues,
  });

  // Function to fetch allowances from the API
  const fetchAllowances = async () => {
    setIsLoading(true);
    try {
      const response = await AllowanceService.getAllAllowances();
      const allowancesData = response.data.data;
      if (Array.isArray(allowancesData)) {
        setAllowances(allowancesData);
        toast.success("Allowances fetched successfully!");
      } else {
        console.error("API response data is not an array:", allowancesData);
        toast.error("Invalid data format received from API.");
      }
    } catch (error) {
      console.error("Failed to fetch allowances:", error);
      toast.error("Failed to load allowances data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch allowances on component mount
  useEffect(() => {
    fetchAllowances();
  }, []);

  // Function to handle form submission (Create & Update)
  const onSubmit = async (values: Allowance) => {
    try {
      if (editingAllowance) {
        // Logic for editing an existing allowance
        if (values.id) {
          await AllowanceService.updateAllowance(values.id, values);
          toast.success("Allowance updated successfully!");
        }
      } else {
        // Logic for creating a new allowance
        await AllowanceService.createAllowance(values);
        toast.success("New allowance created successfully!");
      }
      setIsDialogOpen(false);
      form.reset();
      fetchAllowances(); // Refresh data after submission
    } catch (error) {
      console.error("Error submitting allowance:", error);
      toast.error("Failed to save allowance. Please try again.");
    }
  };

  // Handle dialog opening for editing
  const handleEditClick = (allowance: Allowance) => {
    setEditingAllowance(allowance);
    form.reset(allowance); // Reset the form with the allowance's data
    setIsDialogOpen(true);
  };

  // Handle dialog opening for creating
  const handleCreateClick = () => {
    setEditingAllowance(null);
    form.reset(defaultValues); // Reset the form to empty values
    setIsDialogOpen(true);
  };

  // Handle allowance deletion
  const handleDeleteClick = async (id: string) => {
    try {
      await AllowanceService.deleteAllowance(id);
      toast.success("Allowance deleted successfully!");
      fetchAllowances(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting allowance:", error);
      toast.error("Failed to delete allowance. Please try again.");
    }
  };

  return (
    <div className="py-12 px-4 lg:px-6 w-full mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Allowances</CardTitle>
            <CardDescription>
              Manage types of allowances for employees.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateClick}>
                <IconPlus className="mr-2 h-4 w-4" /> Add Allowance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingAllowance ? "Edit Allowance" : "Add New Allowance"}
                </DialogTitle>
                <DialogDescription>
                  {editingAllowance
                    ? "Make changes to the allowance here."
                    : "Fill in the details for a new allowance."}
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
                        <FormLabel>Allowance Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Transport Allowance"
                            {...field}
                          />
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
                            placeholder="Describe the purpose of this allowance."
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
                    name="default_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Amount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 500000"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_fixed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Fixed Amount</FormLabel>
                          <FormDescription>
                            Is this allowance a fixed amount or variable?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">
                      {editingAllowance ? "Save changes" : "Create Allowance"}
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
                  <TableHead>Default Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <IconLoader className="animate-spin" /> Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : allowances.length > 0 ? (
                  allowances.map((allowance) => (
                    <TableRow key={allowance.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <IconCash className="h-4 w-4 text-muted-foreground" />
                        {allowance.name}
                      </TableCell>
                      <TableCell>
                        Rp{allowance.default_amount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        {allowance.is_fixed ? "Fixed" : "Variable"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {allowance.description}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(allowance)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteClick(allowance.id as string)
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
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No allowances found.
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
