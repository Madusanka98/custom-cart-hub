
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, List, Trash2, Edit, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Form schema for categories
const categorySchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters" }),
  icon: z.string().min(1, { message: "Icon is required" }),
  slug: z.string().optional()
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: "📦",
      slug: ""
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editingCategory) {
      form.reset({
        name: editingCategory.name,
        icon: editingCategory.icon,
        slug: editingCategory.slug || ""
      });
    } else {
      form.reset({
        name: "",
        icon: "📦",
        slug: ""
      });
    }
  }, [editingCategory, form]);

  async function fetchCategories() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Error loading categories', {
        description: error.message
      });
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(values: CategoryFormValues) {
    try {
      const slug = values.slug || values.name.toLowerCase().replace(/\s+/g, '-');
      
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: values.name,
            icon: values.icon,
            slug: slug,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        
        toast.success('Category updated successfully');
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([{
            name: values.name,
            icon: values.icon,
            slug: slug
          }]);

        if (error) throw error;
        
        toast.success('Category created successfully');
      }
      
      // Reset form and refetch categories
      form.reset();
      setEditingCategory(null);
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(editingCategory ? 'Error updating category' : 'Error creating category', {
        description: error.message
      });
      console.error('Error saving category:', error);
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      // Check if any products are using this category
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('category', categories.find(c => c.id === categoryId)?.name || '')
        .limit(1);

      if (productsError) throw productsError;

      if (products && products.length > 0) {
        toast.error('Cannot delete category', {
          description: 'This category is being used by one or more products.'
        });
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error('Error deleting category', {
        description: error.message
      });
      console.error('Error deleting category:', error);
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search" 
              placeholder="Search categories..."
              className="pl-8 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCategory(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                <DialogDescription>
                  {editingCategory 
                    ? 'Update the category details below'
                    : 'Fill in the category details to create a new category'}
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input placeholder="Category icon (emoji or URL)" {...field} />
                        </FormControl>
                        <FormDescription>
                          Use an emoji (📱) or icon URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="category-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL-friendly identifier. If left empty, it will be generated from the name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading categories...</span>
        </div>
      ) : filteredCategories.length === 0 ? (
        searchTerm ? (
          <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground mb-4">No categories found matching "{searchTerm}"</p>
            <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
          </div>
        ) : (
          <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground mb-4">No categories found</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingCategory(null);
                  setIsDialogOpen(true);
                }}>Add Your First Category</Button>
              </DialogTrigger>
            </Dialog>
          </div>
        )
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.icon}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setEditingCategory(category);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
