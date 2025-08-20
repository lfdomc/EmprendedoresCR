'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { toast } from 'sonner';
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Loader2, 
  Search,
  Filter
} from 'lucide-react';
import { Product, Category, ProductFormData, Business } from '@/lib/types/database';
import { 
  getProductsByBusinessId, 
  getCategories, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getBusinessById 
} from '@/lib/supabase/database';

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  currency: z.enum(['CRC', 'USD']),
  sku: z.string().optional().or(z.literal('')),
  image_url: z.string().optional().or(z.literal('')),
  canton: z.string().optional().or(z.literal('')),
  provincia: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductsManagerProps {
  businessId: string;
}

export function ProductsManager({ businessId }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
      price: 0,
      currency: 'CRC',
      sku: '',
      image_url: '',
      canton: '',
      provincia: '',
      is_active: true,
    },
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, businessData] = await Promise.all([
        getProductsByBusinessId(businessId),
        getCategories(),
        getBusinessById(businessId, true) // Incluir emprendimientos inactivos en el dashboard
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBusiness(businessData);
      
      // Actualizar valores por defecto del formulario con datos del emprendimiento
      if (businessData) {
        form.reset({
          ...form.getValues(),
          canton: businessData.canton || '',
          provincia: businessData.provincia || ''
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [businessId, form]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setSubmitting(true);
      
      const productData: ProductFormData = {
        name: values.name,
        description: values.description,
        category_id: values.category_id,
        price: values.price,
        currency: values.currency,
        sku: values.sku || undefined,
        image_url: values.image_url || undefined,
        canton: values.canton || undefined,
        provincia: values.provincia || undefined,
        is_active: values.is_active,
        business_id: businessId,
      };

      if (editingProduct) {
        const response = await updateProduct(editingProduct.id, productData);
        if (response.error) {
          toast.error(response.error);
          return;
        }
        if (response.data) {
          setProducts(products.map(p => p.id === editingProduct.id ? response.data! : p));
          toast.success('Producto actualizado exitosamente');
        }
      } else {
        const response = await createProduct(productData);
        if (response.error) {
          toast.error(response.error);
          return;
        }
        if (response.data) {
          setProducts([response.data, ...products]);
          toast.success('Producto creado exitosamente');
        }
      }
      
      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error al guardar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description,
      category_id: product.category_id,
      price: product.price,
      currency: product.currency as 'CRC' | 'USD',
      sku: product.sku || '',
      image_url: product.image_url || '',
      canton: business?.canton || '',
      provincia: business?.provincia || '',
      is_active: product.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      const response = await deleteProduct(productId);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar el producto');
    }
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    form.reset({
      name: '',
      description: '',
      category_id: '',
      price: 0,
      currency: 'CRC',
      sku: '',
      image_url: '',
      canton: business?.canton || '',
      provincia: business?.provincia || '',
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto mx-4 sm:mx-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl sm:text-2xl">
                {editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </DialogTitle>
              <DialogDescription className="text-base">
                {editingProduct 
                  ? 'Actualiza la información del producto'
                  : 'Completa la información del nuevo producto'
                }
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Producto *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del producto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe tu producto..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moneda *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CRC">₡ Colones</SelectItem>
                            <SelectItem value="USD">$ Dólares</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU (Código de Producto)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: PROD-001"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Código único para identificar el producto
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="canton"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantón</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Heredado del emprendimiento"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Se hereda automáticamente del emprendimiento
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="provincia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provincia</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Heredado del emprendimiento"
                            disabled
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Se hereda automáticamente del emprendimiento
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen Principal</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={() => field.onChange('')}
                          label="Imagen Principal"
                          description="Imagen principal del producto"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                

                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Producto Activo</FormLabel>
                        <FormDescription>
                          Visible en el marketplace
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
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={submitting} className="w-full sm:w-auto order-1 sm:order-2">
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay productos</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No se encontraron productos con los filtros aplicados'
                : 'Aún no has agregado productos a tu emprendimiento'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Button onClick={handleNewProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar tu primer producto
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => {
            const category = categories.find(c => c.id === product.category_id);
            return (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow w-full">
                <div className="aspect-[4/3] bg-muted relative h-24">
                  {product.image_url ? (
                    <Image 
                      src={product.image_url} 
                      alt={product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute top-0.5 left-0.5 flex gap-0.5">
                    {!product.is_active && (
                      <Badge key={`${product.id}-inactive`} variant="secondary" className="text-xs px-1 py-0">Inactivo</Badge>
                    )}

                  </div>
                  
                  <div className="absolute top-0.5 right-0.5 flex gap-0.5">
                    <Button
                       variant="ghost"
                       size="sm"
                       className="h-5 w-5 p-0 bg-white/80 hover:bg-white text-black"
                       onClick={() => handleEdit(product)}
                     >
                       <Edit className="h-2.5 w-2.5" />
                     </Button>
                     <AlertDialog>
                       <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="sm" className="h-5 w-5 p-0 bg-white/80 hover:bg-white text-black">
                           <Trash2 className="h-2.5 w-2.5" />
                         </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{product.name}</h3>
                      {category && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 w-fit">
                          {category.name.length > 10 ? category.name.substring(0, 10) + '...' : category.name}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-xs text-muted-foreground">
                      {product.sku && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">SKU:</span>
                          <span>{product.sku}</span>
                        </div>
                      )}
                      
                      {(product.canton || product.provincia) && (
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span>{product.canton}{product.canton && product.provincia ? ', ' : ''}{product.provincia}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-1 border-t">
                      <p className="font-bold text-base text-primary">
                        {product.currency === 'USD' ? '$' : '₡'}
                        {(product.price || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}