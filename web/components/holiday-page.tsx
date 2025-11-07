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
import { Switch } from "@/components/ui/switch";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCalendarDue,
  IconLoader,
} from "@tabler/icons-react";

// Import the real HolidayService
import { HolidayService } from "@/services/HolidayService";

// --- SCHEMA & TYPES ---

// Define the Zod schema for the Holiday model
const holidaySchema = z.object({
  id: z.string().optional(),
  date: z.string().min(1, { message: "Date is required." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  is_national_holiday: z.boolean(),
});

// Infer the type from the schema
type Holiday = z.infer<typeof holidaySchema>;

// --- MAIN COMPONENT ---

export function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define default values with the correct type explicitly
  const defaultValues: Holiday = {
    date: "",
    name: "",
    is_national_holiday: true,
  };

  // Initialize the form with zodResolver and the explicit defaultValues
  const form = useForm<Holiday>({
    resolver: zodResolver(holidaySchema),
    defaultValues: defaultValues,
  });

  // Function to fetch holidays from the API
  const fetchHolidays = async () => {
    setIsLoading(true);
    try {
      const response = await HolidayService.getAllHolidays();
      const holidaysData = response.data.data;
      if (Array.isArray(holidaysData)) {
        setHolidays(holidaysData);
        toast.success("Holidays fetched successfully!");
      } else {
        console.error("API response data is not an array:", holidaysData);
        toast.error("Invalid data format received from API.");
      }
    } catch (error) {
      console.error("Failed to fetch holidays:", error);
      toast.error("Failed to load holidays data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch holidays on component mount
  useEffect(() => {
    fetchHolidays();
  }, []);

  // Function to handle form submission
  const onSubmit = async (values: Holiday) => {
    try {
      if (editingHoliday) {
        // Logic for editing an existing holiday
        if (values.id) {
          await HolidayService.updateHoliday(values.id, values);
          toast.success("Holiday updated successfully!");
        }
      } else {
        // Logic for creating a new holiday
        await HolidayService.createHoliday(values);
        toast.success("New holiday created successfully!");
      }
      setIsDialogOpen(false);
      form.reset();
      fetchHolidays(); // Refresh data after submission
    } catch (error) {
      console.error("Error submitting holiday:", error);
      toast.error("Failed to save holiday. Please try again.");
    }
  };

  // Handle dialog opening for editing
  const handleEditClick = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    form.reset(holiday); // Reset the form with the holiday's data
    setIsDialogOpen(true);
  };

  // Handle dialog opening for creating
  const handleCreateClick = () => {
    setEditingHoliday(null);
    form.reset(defaultValues); // Reset the form to empty values
    setIsDialogOpen(true);
  };

  // Handle holiday deletion
  const handleDeleteClick = async (id: string) => {
    try {
      await HolidayService.deleteHoliday(id);
      toast.success("Holiday deleted successfully!");
      fetchHolidays(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Failed to delete holiday. Please try again.");
    }
  };

  return (
    <div className="py-12 px-4 lg:px-6 w-full mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Holidays</CardTitle>
            <CardDescription>
              Manage national and company holidays.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateClick}>
                <IconPlus className="mr-2 h-4 w-4" /> Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
                </DialogTitle>
                <DialogDescription>
                  {editingHoliday
                    ? "Make changes to the holiday here."
                    : "Fill in the details for a new holiday."}
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
                        <FormLabel>Holiday Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Christmas Day" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_national_holiday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>National Holiday</FormLabel>
                          <FormDescription>
                            Is this a national public holiday?
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
                      {editingHoliday ? "Save changes" : "Create Holiday"}
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
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead>Holiday Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <IconLoader className="animate-spin" /> Loading...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : holidays.length > 0 ? (
                  holidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell className="font-medium">
                        {new Date(holiday.date).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>{holiday.name}</TableCell>
                      <TableCell>
                        {holiday.is_national_holiday ? "National" : "Company"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(holiday)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteClick(holiday.id as string)
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
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No holidays found.
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
