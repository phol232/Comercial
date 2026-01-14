import React, { useEffect, useState } from 'react';
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

interface Resource {
  _id: string;
  title: string;
  type: string;
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
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/resources');
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = isEditing 
        ? `http://localhost:5001/api/resources/${currentResource._id}`
        : 'http://localhost:5001/api/resources';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentResource),
      });

      if (response.ok) {
        fetchResources();
        setIsDialogOpen(false);
        setCurrentResource({});
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await fetch(`http://localhost:5001/api/resources/${itemToDelete}`, {
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
    setCurrentResource({ type: 'image' });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (resource: Resource) => {
    setCurrentResource(resource);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const getIcon = (resource: Resource) => {
    if (resource.title?.includes('VCA')) return Diamond;
    return iconMap[resource.type || 'image'] || Star;
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
          resources.map((resource) => {
            const Icon = getIcon(resource as Resource);
            return (
              <div key={resource._id} className="flex flex-col items-center group w-full max-w-[220px]">
                <div className="w-40 h-40 rounded-3xl border border-[#a855f7] flex items-center justify-center mb-4 bg-white group-hover:shadow-md transition-all duration-300 relative">
                  <Icon className="w-16 h-16 text-[#1e293b] stroke-[1.5]" />
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Título
              </Label>
              <Input
                id="title"
                value={currentResource.title || ''}
                onChange={(e) => setCurrentResource({ ...currentResource, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">
                Tipo
              </Label>
              <div>
                 <Select 
                    value={currentResource.type || 'image'}
                    onValueChange={(value: string) => setCurrentResource({ ...currentResource, type: value })}
                 >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="template">Plantilla</SelectItem>
                      <SelectItem value="mail">Mail</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="doc">Documento</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="url">
                URL Descarga
              </Label>
              <Input
                id="url"
                value={currentResource.url || ''}
                onChange={(e) => setCurrentResource({ ...currentResource, url: e.target.value })}
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
