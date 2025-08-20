'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  label = "Imagen",
  description
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }

      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `business-logos/${fileName}`;

      // Subir archivo a Supabase Storage
      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        toast.error('Error al subir la imagen');
        return;
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success('Imagen subida exitosamente');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleRemove = () => {
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {value ? (
        <div className="relative">
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Imagen subida"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemove}
            disabled={disabled || uploading}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
             onClick={() => fileInputRef.current?.click()}>
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Subir imagen</span>
            </>
          )}
        </div>
      )}
      
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
        className="hidden"
      />
      
      {!value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Seleccionar imagen
            </>
          )}
        </Button>
      )}
      
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}