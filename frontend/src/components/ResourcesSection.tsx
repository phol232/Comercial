import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { searchTerm } from '@/stores/searchStore';
import { normalizeText } from '@/utils/textUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, LayoutTemplate, Mail, Video, FileText, Diamond, Star, Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { authenticatedFetch } from '@/utils/api';

interface Resource {
  _id: string;
  title: string;
  imageUrl: string;
  url: string;
}

const iconMap: Record<string, any> = {
  'logo': Star,
  'image': Image,
  'template': LayoutTemplate,
  'mail': Mail,
  'video': Video,
  'doc': FileText
};

export const ResourcesSection = () => {
  const $searchTerm = useStore(searchTerm);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentResource, setCurrentResource] = useState<Partial<Resource>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);// ... (useEffect and fetchResources)

  const SECTION_TITLE = "Recursos gráficos";
  const normalizedSearch = normalizeText($searchTerm);
  const isSectionMatch = normalizeText(SECTION_TITLE).includes(normalizedSearch);

  const filteredResources = resources.filter(resource => 
    isSectionMatch || normalizeText(resource.title).includes(normalizedSearch)
  );

  if (!loading && filteredResources.length === 0 && $searchTerm) {
    return null;
  }

  const fetchResources = async () => {
    try {
      const response = await authenticatedFetch('/api/resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    // Basic validation
    if (!currentResource.title || !currentResource.imageUrl || !currentResource.url) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      const endpoint = isEditing 
        ? `/api/resources/${currentResource._id}`
        : `/api/resources`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await authenticatedFetch(endpoint, {
        method,
        body: JSON.stringify(currentResource),
      });

      if (response.ok) {
        fetchResources();
        setIsDialogOpen(false);
        setCurrentResource({});
        setIsEditing(false);
      } else {
         setError("Error al guardar. Verifica los datos.");
      }
    } catch (error) {
      console.error('Error saving resource:', error);
      setError("Error de conexión al guardar.");
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await authenticatedFetch(`/api/resources/${itemToDelete}`, {
        method: 'DELETE',
      });
      fetchResources();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const openAddDialog = () => {
    setCurrentResource({ imageUrl: 'image' }); // Changed from type
    setIsEditing(false);
    setError(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (resource: Resource) => {
    setCurrentResource(resource);
    setIsEditing(true);
    setError(null);
    setIsDialogOpen(true);
  };

  const getIcon = (resource: Resource) => {
    if (resource.title?.includes('VCA')) return Diamond;
    return iconMap[resource.imageUrl || 'image'] || Star;
  };

  return (
    <div id="resources-section" className="container mx-auto px-4 mb-24">
      <div className="relative mb-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#A43E8A]">
          Recursos gráficos
        </h2>
        <div className="absolute top-0 right-0">
          <Button 
            onClick={openAddDialog}
            className="bg-black hover:bg-slate-800 text-white rounded-md px-6"
          >
            Agregar
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 gap-y-12 max-w-5xl mx-auto">
        {loading ? (
           <p className="text-center w-full text-slate-500">Cargando recursos...</p>
        ) : (
          filteredResources.map((resource) => {
            const Icon = getIcon(resource as Resource);
            return (
              <div key={resource._id} className="flex flex-col items-center group w-full max-w-[220px]">
                <div className="w-40 h-40 rounded-3xl border border-[#a855f7] flex items-center justify-center mb-4 bg-white group-hover:shadow-md transition-all duration-300 relative overflow-hidden p-2">
                   <img 
                      src={resource.imageUrl} 
                      alt={resource.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.classList.add('fallback-icon-mode');
                      }}
                   />
                   <div className="hidden fallback-icon-mode:flex w-full h-full items-center justify-center absolute inset-0">
                      <Image className="w-16 h-16 text-[#1e293b] stroke-[1.5]" />
                   </div>
                </div>
                <h3 className="text-lg font-bold text-[#1e293b] text-center mb-2 min-h-[3rem] flex items-start justify-center leading-tight">
                  {resource.title}
                </h3>
                
                <Button 
                  className="w-36 rounded-full bg-[#A43E8A] hover:bg-[#8a3373] text-white font-medium shadow-md"
                  asChild
                >
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    Descargar
                  </a>
                </Button>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3 mt-4 w-full">
                  <button 
                    onClick={() => openEditDialog(resource as Resource)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                  <div className="h-4 w-px bg-slate-300"></div>
                  <button 
                    onClick={() => confirmDelete(resource._id)}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Recurso' : 'Agregar Recurso'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edita los detalles del recurso.' : 'Agrega un nuevo recurso al sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className={!currentResource.title && error ? "text-red-500" : ""}>
                Título *
              </Label>
              <Input
                id="title"
                value={currentResource.title || ''}
                onChange={(e) => setCurrentResource({ ...currentResource, title: e.target.value })}
                className={!currentResource.title && error ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="imageUrl" className={!currentResource.imageUrl && error ? "text-red-500" : ""}>
                URL de Imagen (Vista previa) *
              </Label>
              <Input
                id="imageUrl"
                value={currentResource.imageUrl || ''}
                onChange={(e) => setCurrentResource({ ...currentResource, imageUrl: e.target.value })}
                placeholder="https://..."
                className={!currentResource.imageUrl && error ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="url" className={!currentResource.url && error ? "text-red-500" : ""}>
                URL Descarga *
              </Label>
              <Input
                id="url"
                value={currentResource.url || ''}
                onChange={(e) => setCurrentResource({ ...currentResource, url: e.target.value })}
                className={!currentResource.url && error ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="¿Eliminar recurso?"
        description="Esta acción eliminará el recurso permanentemente. ¿Estás seguro de que deseas continuar?"
      />
    </div>
  );
};
