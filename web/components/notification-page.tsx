"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconBell,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { nanoid } from "nanoid";

// --- SCHEMA & TYPES ---

// Define the Zod schema for the Notification model
const notificationSchema = z.object({
  id: z.string().optional(),
  employee_id: z.string().optional(), // In a real app, this would be auto-set by the backend
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  message: z
    .string()
    .min(2, { message: "Message must be at least 2 characters." }),
  type: z.enum(["salary", "leave", "general"]),
  is_read: z.boolean(),
});

// Infer the type from the schema
type Notification = z.infer<typeof notificationSchema>;

// --- MOCK DATA ---

// Mock data to simulate fetching from a backend
const mockNotifications: Notification[] = [
  {
    id: nanoid(),
    employee_id: nanoid(),
    title: "Gaji Bulan Januari",
    message:
      "Gaji bulan Januari telah diproses dan dikirimkan ke rekening Anda.",
    type: "salary",
    is_read: true,
  },
  {
    id: nanoid(),
    employee_id: nanoid(),
    title: "Permohonan Cuti Disetujui",
    message:
      "Permohonan cuti Anda untuk tanggal 20-22 Februari telah disetujui.",
    type: "leave",
    is_read: false,
  },
  {
    id: nanoid(),
    employee_id: nanoid(),
    title: "Pengumuman Kantor",
    message: "Ada rapat penting besok pagi jam 09.00.",
    type: "general",
    is_read: false,
  },
];

// --- MAIN COMPONENT ---

export function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotification, setEditingNotification] =
    useState<Notification | null>(null);

  // Define default values with the correct type explicitly
  const defaultValues: Notification = {
    title: "",
    message: "",
    type: "general",
    is_read: false,
  };

  // Initialize the form with zodResolver and the explicit defaultValues
  const form = useForm<Notification>({
    resolver: zodResolver(notificationSchema),
    defaultValues: defaultValues,
  });

  // Function to handle form submission
  function onSubmit(values: Notification) {
    if (editingNotification) {
      // Logic for editing an existing notification
      setNotifications(
        notifications.map((n) =>
          n.id === editingNotification.id ? { ...values, id: n.id } : n
        )
      );
      toast.success("Notification updated successfully!");
    } else {
      // Logic for creating a new notification
      setNotifications([
        ...notifications,
        { ...values, id: nanoid(), employee_id: nanoid() },
      ]);
      toast.success("New notification created successfully!");
    }
    setIsDialogOpen(false);
    form.reset();
  }

  // Handle dialog opening for editing
  const handleEditClick = (notification: Notification) => {
    setEditingNotification(notification);
    form.reset(notification); // Reset the form with the notification's data
    setIsDialogOpen(true);
  };

  // Handle dialog opening for creating
  const handleCreateClick = () => {
    setEditingNotification(null);
    form.reset(); // Reset the form to empty values
    setIsDialogOpen(true);
  };

  // Handle notification deletion
  const handleDeleteClick = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
    toast.success("Notification deleted successfully!");
  };

  return (
    <div className="py-12 px-4 lg:px-6 w-full mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Manage and view system announcements.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateClick}>
                <IconPlus className="mr-2 h-4 w-4" /> Add Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingNotification
                    ? "Edit Notification"
                    : "Add New Notification"}
                </DialogTitle>
                <DialogDescription>
                  {editingNotification
                    ? "Make changes to the notification here."
                    : "Fill in the details for a new notification."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Gaji Bulan Ini" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write the notification message here."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a notification type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="salary">Salary</SelectItem>
                            <SelectItem value="leave">Leave</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_read"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Status</FormLabel>
                          <FormDescription>
                            Is this notification already read?
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
                      {editingNotification
                        ? "Save changes"
                        : "Create Notification"}
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
                  <TableHead className="w-[150px]">Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <TableRow
                      key={notification.id}
                      className={
                        !notification.is_read
                          ? "bg-gray-50 dark:bg-gray-900"
                          : ""
                      }
                    >
                      <TableCell className="font-medium flex items-center gap-2">
                        <IconBell className="h-4 w-4 text-muted-foreground" />
                        {notification.title}
                      </TableCell>
                      <TableCell>{notification.message}</TableCell>
                      <TableCell>
                        <span className="capitalize">{notification.type}</span>
                      </TableCell>
                      <TableCell>
                        {notification.is_read ? (
                          <div className="flex items-center gap-2 text-green-500">
                            <IconCheck className="h-4 w-4" /> Read
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-500">
                            <IconX className="h-4 w-4" /> Unread
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(notification)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteClick(notification.id as string)
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
                      No notifications found.
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
