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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Image from 'next/image';
import { toast } from 'sonner';
import { 
  Plus, 
  Wrench, 
  Edit, 
  Trash2, 
  Loader2, 
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { Service, Category, ServiceFormData, Business } from '@/lib/types/database';
import { 
  getServicesByBusinessId, 
  getCategories, 
  createService, 
  updateService, 
  deleteService,
  getBusinessById 
} from '@/lib/supabase/database';
import { createClient } from '@/lib/supabase/client';
import { convertToWebP, isValidImageFile, getCompressionInfo, formatFileSize } from '@/lib/utils/image-processing';

const supabase = createClient();

const serviceSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  currency: z.enum(['CRC', 'USD']),
  image_file: z.instanceof(File).optional(),
  image_url: z.string().optional(),
  is_active: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServicesManagerProps {
  businessId: string;
}

export function ServicesManager({ businessId }: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      category_id: '',
      price: 0,
      currency: 'CRC',
      image_file: undefined,
      image_url: '',
      is_active: true,
    },
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [servicesData, categoriesData] = await Promise.all([
        getServicesByBusinessId(businessId),
        getCategories()
      ]);
      setServices(servicesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  const loadBusiness = useCallback(async () => {
    try {
      const businessData = await getBusinessById(businessId, true);
      setBusiness(businessData);
    } catch (error) {
      console.error('Error loading business:', error);
    }
  }, [businessId]);

  useEffect(() => {
    loadData();
    loadBusiness();
  }, [loadData, loadBusiness]);

  const onSubmit = async (values: ServiceFormValues) => {
    try {
      setSubmitting(true);
      setImageError(null); // Limpiar errores previos
      
      let imageUrl = values.image_url || '';
      
      // Si hay un archivo de imagen, procesarlo y subirlo a Supabase Storage
      if (values.image_file) {
        const file = values.image_file;
        
        // Validar tipo de archivo
        if (!isValidImageFile(file)) {
          const errorMsg = 'Por favor selecciona un archivo de imagen válido (JPEG, PNG, GIF, WebP)';
          setImageError(errorMsg);
          toast.error('❌ Formato de imagen no válido', {
            description: errorMsg,
            duration: 5000,
          });
          throw new Error(errorMsg);
        }

        // Validar tamaño (máximo 10MB para el archivo original)
        if (file.size > 10 * 1024 * 1024) {
          const errorMsg = 'La imagen debe ser menor a 10MB';
          setImageError(errorMsg);
          toast.error('📁 Archivo muy grande', {
            description: errorMsg,
            duration: 5000,
          });
          throw new Error(errorMsg);
        }

        // Convertir a WebP y comprimir
        toast.info('Procesando imagen...');
        const processedFile = await convertToWebP(file, {
          quality: 0.85,
          maxWidth: 1200,
          maxHeight: 1200
        });

        // Mostrar información de compresión
        const compressionInfo = getCompressionInfo(file, processedFile);
        console.log('Compresión aplicada:', compressionInfo);
        
        if (compressionInfo.reduction > 0) {
          toast.success(
            `Imagen optimizada: ${formatFileSize(file.size)} → ${formatFileSize(processedFile.size)} (${compressionInfo.reduction}% reducción)`
          );
        }
        
        const fileName = `${businessId}-${Date.now()}.webp`;
        
        const { error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(fileName, processedFile);
          
        if (uploadError) {
          throw new Error('Error al subir la imagen: ' + uploadError.message);
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }
      
      const serviceData: ServiceFormData = {
        name: values.name,
        description: values.description,
        category_id: values.category_id,
        price: values.price,
        currency: values.currency,
        image_url: imageUrl,
        is_active: values.is_active,
        business_id: businessId,
      };

      if (editingService) {
        const result = await updateService(editingService.id, serviceData);
        if (result.error) {
          throw new Error(result.error);
        }
        setServices(services.map(s => s.id === editingService.id ? result.data! : s));
        toast.success('Servicio actualizado exitosamente');
      } else {
        const result = await createService(serviceData);
        if (result.error) {
          throw new Error(result.error);
        }
        setServices([result.data!, ...services]);
        toast.success('Servicio creado exitosamente');
      }
      
      setIsDialogOpen(false);
      setEditingService(null);
      setImageError(null); // Limpiar errores de imagen
      form.reset();
    } catch (error) {
      console.error('Error saving service:', error);
      
      // Manejo específico de errores de validación de imagen
       if (error instanceof Error) {
         if (error.message.includes('archivo de imagen válido') || error.message.includes('menor a 10MB')) {
           // Ya se estableció el imageError y se mostró el toast específico arriba
           return;
         } else {
           // Otros errores
           setImageError(null); // Limpiar errores de imagen si es otro tipo de error
           toast.error('❌ Error al guardar servicio', {
             description: error.message,
             duration: 5000,
           });
         }
       } else {
         setImageError(null);
         toast.error('❌ Error al guardar servicio', {
           description: 'Ocurrió un error inesperado',
           duration: 5000,
         });
       }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setImageError(null); // Limpiar errores de imagen
    form.reset({
      name: service.name,
      description: service.description,
      category_id: service.category_id,
      price: service.price,
      currency: service.currency as 'CRC' | 'USD',
      image_file: undefined,
      image_url: service.image_url || '',
      is_active: service.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      setServices(services.filter(s => s.id !== serviceId));
      toast.success('Servicio eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Error al eliminar el servicio');
    }
  };

  const handleNewService = () => {
    setEditingService(null);
    setImageError(null); // Limpiar errores de imagen
    form.reset();
    setIsDialogOpen(true);
  };



  const filteredServices = services.filter(service => {
    const matchesSearch = (service.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (service.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category_id === selectedCategory;
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
              placeholder="Buscar servicios..."
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
            <Button onClick={handleNewService}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto mx-4 sm:mx-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl sm:text-2xl">
                {editingService ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
              </DialogTitle>
              <DialogDescription className="text-base">
                {editingService 
                  ? 'Actualiza la información del servicio'
                  : 'Completa la información del nuevo servicio'
                }
              </DialogDescription>
            </DialogHeader>
            
            {imageError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {imageError}
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Servicio *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del servicio" {...field} />
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
                          placeholder="Describe tu servicio..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Provincia</label>
                    <Input 
                      value={business?.provincia || 'No especificada'}
                      disabled
                      className="bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500">Heredado de la información del emprendimiento</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cantón</label>
                    <Input 
                      value={business?.canton || 'No especificado'}
                      disabled
                      className="bg-gray-50 text-gray-600"
                    />
                    <p className="text-xs text-gray-500">Heredado de la información del emprendimiento</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            value={field.value === 0 ? '' : field.value}
                            onFocus={() => {
                              if (field.value === 0) {
                                field.onChange('');
                              }
                            }}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                field.onChange(0);
                              } else {
                                field.onChange(parseFloat(value) || 0);
                              }
                            }}
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
                  
                  <FormField
                    control={form.control}
                    name="image_file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagen del Servicio</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              field.onChange(file);
                              // Limpiar error de imagen cuando se seleccione un nuevo archivo
                              if (file && imageError) {
                                setImageError(null);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Sube una imagen para tu servicio (opcional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                

                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Servicio Activo</FormLabel>
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
                    {editingService ? 'Actualizar' : 'Crear'} Servicio
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay servicios</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'No se encontraron servicios con los filtros aplicados'
                : 'Aún no has agregado servicios a tu emprendimiento'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Button onClick={handleNewService}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar tu primer servicio
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredServices.map((service) => {
            const category = categories.find(c => c.id === service.category_id);
            return (
              <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow w-full">
                <div className="aspect-[4/3] bg-muted relative h-24">
                  {service.image_url ? (
                    <Image 
                      src={service.image_url} 
                      alt={service.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute top-0.5 left-0.5 flex gap-0.5">
                    {!service.is_active && (
                      <Badge key={`${service.id}-inactive`} variant="secondary" className="text-xs px-1 py-0">Inactivo</Badge>
                    )}
                  </div>
                  
                  <div className="absolute top-0.5 right-0.5 flex gap-0.5">
                    <Button
                       variant="ghost"
                       size="sm"
                       className="h-5 w-5 p-0 bg-white/80 hover:bg-white text-black"
                       onClick={() => handleEdit(service)}
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
                          <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El servicio será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(service.id)}>
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
                      <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{service.name}</h3>
                      {category && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 w-fit">
                          {category.name.length > 10 ? category.name.substring(0, 10) + '...' : category.name}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p className="line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">
                        {service.currency === 'USD' ? '$' : '₡'}
                        {(service.price || 0).toLocaleString()}
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