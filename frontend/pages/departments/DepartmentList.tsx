import { useEffect, useState } from "react";
import { useBackend } from "../../lib/backend";
import type { Department } from "~backend/department/list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DepartmentList() {
  const backend = useBackend();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const { toast } = useToast();

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await backend.department.list();
      setDepartments(data.departments);
    } catch (error) {
      console.error("Failed to load departments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load departments",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dept: Department) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description || "" });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingDept(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await backend.department.update({
          id: editingDept.id,
          name: formData.name,
          description: formData.description || undefined,
        });
        toast({
          title: "Success",
          description: "Department updated successfully",
        });
      } else {
        await backend.department.create({
          name: formData.name,
          description: formData.description || undefined,
        });
        toast({
          title: "Success",
          description: "Department created successfully",
        });
      }
      setIsDialogOpen(false);
      loadDepartments();
    } catch (error) {
      console.error("Failed to save department:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save department",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await backend.department.deleteDepartment({ id: deleteId });
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
      loadDepartments();
    } catch (error) {
      console.error("Failed to delete department:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete department",
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-muted-foreground mt-1">Manage hospital departments</p>
        </div>
        <Button onClick={handleAdd} style={{ backgroundColor: "#2196F3" }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No departments found
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.description || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(dept)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(dept.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDept ? "Edit" : "Add"} Department</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" style={{ backgroundColor: "#2196F3" }}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the department.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
