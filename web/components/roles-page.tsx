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
import { IconPlus, IconEdit, IconTrash, IconLoader } from "@tabler/icons-react";

import { RoleService } from "@/services/RoleService";

const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  base_salary: z.number().nonnegative({
    message: "Base salary must be a non-negative number.",
  }),
  description: z.string().optional().nullable(),
});

type Role = z.infer<typeof roleSchema>;

export function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const defaultValues = {
    name: "",
    base_salary: 0,
    description: "",
  };

  const form = useForm<Role>({
    resolver: zodResolver(roleSchema),
    defaultValues: defaultValues,
  });

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const response = await RoleService.getAllRoles();

      const rolesData = z.array(roleSchema).parse(response.data.data);
      if (Array.isArray(rolesData)) {
        setRoles(rolesData);
        toast.success("Roles fetched successfully!");
      } else {
        console.error("API response data is not an array:", rolesData);
        toast.error("Invalid data format received from API.");
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      toast.error("Failed to load roles data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const onSubmit = async (values: Role) => {
    try {
      if (editingRole) {
        if (values.id) {
          await RoleService.updateRole(values.id, values);
          toast.success("Role updated successfully!");
        }
      } else {
        await RoleService.createRole(values);
        toast.success("New role created successfully!");
      }
      setIsDialogOpen(false);
      form.reset();
      fetchRoles();
    } catch (error) {
      console.error("Error submitting role:", error);
      toast.error("Failed to save role. Please try again.");
    }
  };

  const handleEditClick = (role: Role) => {
    setEditingRole(role);
    form.reset(role);
    setIsDialogOpen(true);
  };

  const handleCreateClick = () => {
    setEditingRole(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await RoleService.deleteRole(id);
      toast.success("Role deleted successfully!");
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role. Please try again.");
    }
  };

  return (
    <div className="py-12 px-4 lg:px-6 w-full mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Roles</CardTitle>
            <CardDescription>
              Manage employee roles and their base salaries.
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreateClick}>
                <IconPlus className="mr-2 h-4 w-4" /> Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingRole ? "Edit Role" : "Add New Role"}
                </DialogTitle>
                <DialogDescription>
                  {editingRole
                    ? "Make changes to the role here."
                    : "Fill in the details for a new role."}
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
                        <FormLabel>Role Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Software Engineer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="base_salary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Salary</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 15000000"
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
                            placeholder="Describe the role responsibilities."
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
                      {editingRole ? "Save changes" : "Create Role"}
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
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Description</TableHead>
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
                ) : roles.length > 0 ? (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        Rp{role.base_salary.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {role.description}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(role)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(role.id as string)}
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
                      No roles found.
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
