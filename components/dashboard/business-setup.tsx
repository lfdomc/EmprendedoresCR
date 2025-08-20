'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Loader2, Store, MapPin, Phone, Globe, Clock, Trash2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { createClient } from '@/lib/supabase/client';
import { Business, Category, BusinessFormData } from '@/lib/types/database';
import { getCategories, createBusiness, updateBusiness, deleteBusiness } from '@/lib/supabase/database';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

const businessSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  category_id: z.string().min(1, 'Selecciona una categoría'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  canton: z.string().optional(),
  provincia: z.string().optional(),
  google_maps_link: z.string().url('URL inválida').optional().or(z.literal('')),
  logo_url: z.string().url('URL inválida').optional().or(z.literal('')),
  phone: z.string().regex(/^\+\d{1,4}\d{4,14}$/, 'Formato inválido. Use: +códigodepaísnúmero (ej: +50670120250)'),
  email: z.string().email('Email inválido'),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  whatsapp: z.string().regex(/^\+\d{1,4}\d{4,14}$/, 'Formato inválido. Use: +códigodepaísnúmero (ej: +50670120250)'),
  facebook: z.string().url('URL inválida').optional().or(z.literal('')),
  instagram: z.string().url('URL inválida').optional().or(z.literal('')),
  opening_hours: z.string().optional(),
  is_active: z.boolean().default(true),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

interface BusinessSetupProps {
  existingBusiness?: Business | null;
  onBusinessCreated: (business: Business) => void;
}

export function BusinessSetup({ existingBusiness, onBusinessCreated }: BusinessSetupProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: existingBusiness?.name || '',
      description: existingBusiness?.description || '',
      category_id: existingBusiness?.category_id || '',
      address: existingBusiness?.address || '',
      canton: existingBusiness?.canton || '',
      provincia: existingBusiness?.provincia || '',
      google_maps_link: existingBusiness?.google_maps_link || '',
      logo_url: existingBusiness?.logo_url || '',
      phone: existingBusiness?.phone || '',
      email: existingBusiness?.email || '',
      website: existingBusiness?.website || '',
      whatsapp: existingBusiness?.whatsapp || '',
      facebook: existingBusiness?.facebook || '',
      instagram: existingBusiness?.instagram || '',
      opening_hours: existingBusiness?.opening_hours || 'Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 9:00 AM - 4:00 PM\nDomingos: Cerrado',
      is_active: existingBusiness?.is_active ?? true,
    },
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoadingCategories(false);
    }
  };

  const onSubmit = async (values: BusinessFormValues) => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Debes estar autenticado');
        return;
      }

      const businessData: BusinessFormData = {
        ...values,
        user_id: user.id as string,
      };

      let result;
      
      if (existingBusiness) {
        result = await updateBusiness(existingBusiness.id, businessData);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success('🎉 ¡Emprendimiento actualizado exitosamente!', {
          description: 'Todos los cambios han sido guardados correctamente',
          duration: 4000,
        });
      } else {
        result = await createBusiness(businessData);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        toast.success('🚀 ¡Emprendimiento creado exitosamente!', {
          description: 'Tu emprendimiento ya está listo para comenzar a vender',
          duration: 4000,
        });
      }
      
      if (result.data) {
        onBusinessCreated(result.data);
      }
    } catch (error) {
      console.error('Error saving business:', error);
      toast.error('Error al guardar el emprendimiento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBusiness = async () => {
    if (!existingBusiness) return;
    
    try {
      setIsDeleting(true);
      await deleteBusiness(existingBusiness.id);
      toast.success('Emprendimiento eliminado exitosamente');
      router.push('/');
    } catch (error) {
      console.error('Error deleting business:', error);
      toast.error('Error al eliminar el emprendimiento');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Store className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="hidden sm:inline">{existingBusiness ? 'Editar Emprendimiento' : 'Configurar tu Emprendimiento'}</span>
          <span className="sm:hidden">{existingBusiness ? 'Editar' : 'Configurar'}</span>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {existingBusiness 
            ? 'Actualiza la información de tu emprendimiento'
            : 'Completa la información de tu emprendimiento para comenzar a vender'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Información Básica */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        <span className="hidden sm:inline">Nombre del Emprendimiento *</span>
                        <span className="sm:hidden">Nombre *</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Mi Emprendimiento" {...field} className="h-10 sm:h-11" />
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
                      <FormLabel className="text-sm sm:text-base">Categoría *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <FormLabel className="text-sm sm:text-base">Descripción *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe tu emprendimiento, qué productos o servicios ofreces..."
                        className="min-h-[80px] sm:min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Información de Contacto */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Información de Contacto</span>
                <span className="sm:hidden">Contacto</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Teléfono *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                            +
                          </span>
                          <Input 
                            placeholder="50670120250" 
                            className="h-10 sm:h-11 pl-8" 
                            value={field.value ? field.value.replace(/^\+/, '') : ''}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^\d]/g, '');
                              field.onChange(value ? `+${value}` : '');
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Código de país {"(+506)"} y número sin espacios {"(ej: 50670120250)"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Email *</FormLabel>
                      <FormControl>
                        <Input placeholder="contacto@miemprendimiento.com" {...field} className="h-10 sm:h-11" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">WhatsApp *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                          +
                        </span>
                        <Input 
                          placeholder="50670120250" 
                          className="h-10 sm:h-11 pl-8" 
                          value={field.value ? field.value.replace(/^\+/, '') : ''}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            field.onChange(value ? `+${value}` : '');
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Código de país {"(+506)"} y número sin espacios {"(ej: 50670120250)"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name="provincia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Provincia</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una provincia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="San José">San José</SelectItem>
                          <SelectItem value="Alajuela">Alajuela</SelectItem>
                          <SelectItem value="Cartago">Cartago</SelectItem>
                          <SelectItem value="Heredia">Heredia</SelectItem>
                          <SelectItem value="Guanacaste">Guanacaste</SelectItem>
                          <SelectItem value="Puntarenas">Puntarenas</SelectItem>
                          <SelectItem value="Limón">Limón</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="canton"
                  render={({ field }) => {
                    const selectedProvincia = form.watch('provincia');
                    
                    const cantonesPorProvincia: Record<string, string[]> = {
                      'San José': ['San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita', 'Vásquez de Coronado', 'Acosta', 'Tibás', 'Moravia', 'Montes de Oca', 'Turrubares', 'Dota', 'Curridabat', 'Pérez Zeledón'],
                      'Alajuela': ['Alajuela', 'San Ramón', 'Grecia', 'San Mateo', 'Atenas', 'Naranjo', 'Palmares', 'Poás', 'Orotina', 'San Carlos', 'Zarcero', 'Valverde Vega', 'Upala', 'Los Chiles', 'Guatuso'],
                      'Cartago': ['Cartago', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba', 'Alvarado', 'Oreamuno', 'El Guarco'],
                      'Heredia': ['Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael', 'San Isidro', 'Belén', 'Flores', 'San Pablo', 'Sarapiquí'],
                      'Guanacaste': ['Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 'Cañas', 'Abangares', 'Tilarán', 'Nandayure', 'La Cruz', 'Hojancha'],
                      'Puntarenas': ['Puntarenas', 'Esparza', 'Buenos Aires', 'Montes de Oro', 'Osa', 'Quepos', 'Golfito', 'Coto Brus', 'Parrita', 'Corredores', 'Garabito'],
                      'Limón': ['Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 'Guácimo']
                    };
                    
                    const cantonesDisponibles = selectedProvincia ? cantonesPorProvincia[selectedProvincia] || [] : [];
                    
                    return (
                      <FormItem>
                        <FormLabel>Cantón</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={!selectedProvincia}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={selectedProvincia ? "Selecciona un cantón" : "Primero selecciona una provincia"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cantonesDisponibles.map((canton) => (
                              <SelectItem key={canton} value={canton}>
                                {canton}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Cantón donde se ubica tu emprendimiento
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-sm sm:text-base">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                      Dirección *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="San José, Costa Rica" {...field} className="h-10 sm:h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              

              
              <FormField
                control={form.control}
                name="google_maps_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Enlace de Google Maps
                    </FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <FormControl className="flex-1">
                          <Input placeholder="https://maps.google.com/..." {...field} />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://maps.google.com', '_blank')}
                          className="shrink-0"
                        >
                          <MapPin className="h-4 w-4 mr-1" />
                          Buscar
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p><strong>Cómo obtener el enlace:</strong></p>
                        <ol className="list-decimal list-inside space-y-1 ml-2">
                          <li>Haz clic en &quot;Buscar&quot; para abrir Google Maps</li>
                          <li>Busca tu ubicación exacta</li>
                          <li>Haz clic en &quot;Compartir&quot; en Google Maps</li>
                          <li>Copia el enlace y pégalo aquí</li>
                        </ol>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            {/* Redes Sociales y Web */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Presencia Digital
              </h3>
              
              <FormField
                control={form.control}
                name="logo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo del Emprendimiento</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        onRemove={() => field.onChange('')}
                        disabled={loading}
                        label="Logo del Emprendimiento"
                        description="Sube una imagen para el logo de tu emprendimiento (máximo 5MB)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              

              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sitio Web</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
                            https://
                          </span>
                          <Input 
                            placeholder="miemprendimiento.com" 
                            className="pl-16"
                            value={field.value ? field.value.replace(/^https?:\/\//, '') : ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value) {
                                field.onChange(`https://${value}`);
                              } else {
                                field.onChange('');
                              }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/miemprendimiento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/miemprendimiento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Horarios y Estado */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horarios y Estado
              </h3>
              
              <FormField
                control={form.control}
                name="opening_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horarios de Atención</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Lunes a Viernes: 8:00 AM - 6:00 PM\nSábados: 9:00 AM - 4:00 PM\nDomingos: Cerrado"
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Describe tus horarios de atención
                    </FormDescription>
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
                      <FormLabel className="text-base">
                        Emprendimiento Activo
                      </FormLabel>
                      <FormDescription>
                        Tu emprendimiento será visible en el marketplace
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
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6">
              {existingBusiness && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting} className="w-full sm:w-auto h-11">
                      {isDeleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Eliminar Emprendimiento
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="mx-4 sm:mx-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente tu emprendimiento
                        y todos los datos asociados (productos, servicios).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteBusiness}
                        className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1 sm:flex-none h-11">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {existingBusiness ? 'Actualizar Emprendimiento' : 'Crear Emprendimiento'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}