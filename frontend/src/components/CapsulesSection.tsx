import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { searchTerm } from '@/stores/searchStore';
import { normalizeText } from '@/utils/textUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, Plus } from "lucide-react";

import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { authenticatedFetch } from '@/utils/api';

interface Capsule {
  _id: string;
  title: string;
  videoUrl: string;
  downloadUrl: string;
  description: string;
}

export const CapsulesSection = () => {
  const $searchTerm = useStore(searchTerm);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCapsuleId, setExpandedCapsuleId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCapsule, setCurrentCapsule] = useState<Partial<Capsule>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCapsules();
  }, []);

  const fetchCapsules = async () => {
    try {
      const response = await authenticatedFetch('/api/capsules');
      const data = await response.json();
      setCapsules(data);
    } catch (error) {
      console.error('Error fetching capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const endpoint = isEditing
        ? `/api/capsules/${currentCapsule._id}`
        : `/api/capsules`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await authenticatedFetch(endpoint, {
        method,
        body: JSON.stringify(currentCapsule),
      });

      if (response.ok) {
        fetchCapsules();
        setIsDialogOpen(false);
        setCurrentCapsule({});
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving capsule:', error);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await authenticatedFetch(`/api/capsules/${itemToDelete}`, { method: 'DELETE' });
      fetchCapsules();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting capsule:', error);
    }
  };

  const openAddDialog = () => {
    setCurrentCapsule({});
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (capsule: Capsule) => {
    setCurrentCapsule(capsule);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const toggleDescription = (id: string) => {
    setExpandedCapsuleId(expandedCapsuleId === id ? null : id);
  };// ... (useEffect and fetchCapsules)

  const SECTION_TITLE = "Cápsulas de conocimiento";
  const normalizedSearch = normalizeText($searchTerm);
  const isSectionMatch = normalizeText(SECTION_TITLE).includes(normalizedSearch);

  const filteredCapsules = capsules.filter(capsule => 
    isSectionMatch || normalizeText(capsule.title).includes(normalizedSearch)
  );

  if (!loading && filteredCapsules.length === 0 && $searchTerm) {
    return null;
  }  return (
    <div id="capsules-section" className="container mx-auto px-4 mb-24 max-w-[1400px]">
      <div className="relative mb-12">
        <h2 className="text-3xl font-bold text-center text-[#A43E8A]">
          Cápsulas de conocimiento
        </h2>
        <div className="absolute top-0 right-0">
          <Button 
            onClick={openAddDialog}
            className="bg-black hover:bg-slate-800 text-white rounded-md px-6"
          >
            Agregar Cápsula
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-center col-span-4 text-slate-500">Cargando cápsulas...</p>
        ) : (
          filteredCapsules.slice(0, visibleCount).map((capsule) => (
            <div key={capsule._id} className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300">
              <div className="relative aspect-video bg-slate-100">
                <iframe 
                  src={capsule.videoUrl} 
                  title={capsule.title}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-bold text-[#1e293b] text-center mb-3 text-lg leading-tight">{capsule.title}</h4>
                
                <div className="text-center mb-4">
                  <button 
                    onClick={() => toggleDescription(capsule._id)}
                    className="text-[#A43E8A] hover:text-[#8a3373] text-sm font-medium bg-purple-50 px-3 py-1 rounded-md"
                  >
                    Más info
                  </button>
                  
                  {expandedCapsuleId === capsule._id && (
                    <div className="mt-3 text-sm text-slate-600 text-center bg-slate-50 p-3 rounded-md animate-in fade-in zoom-in-95 duration-200">
                      {capsule.description || "Sin descripción disponible."}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center gap-3 mt-auto">
                  <Button 
                    className="w-36 rounded-full bg-[#A43E8A] hover:bg-[#8a3373] text-white font-medium shadow-md"
                    asChild
                  >
                    <a href={capsule.downloadUrl || '#'} target="_blank" rel="noopener noreferrer">
                      Descargar
                    </a>
                  </Button>

                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => openEditDialog(capsule)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Pencil className="w-4 h-4" /> Editar
                    </button>
                    <div className="h-4 w-px bg-slate-300"></div>
                    <button 
                      onClick={() => confirmDelete(capsule._id)}
                      className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <Trash className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {!loading && filteredCapsules.length < visibleCount && (
          <div 
            onClick={openAddDialog}
            className="flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#A43E8A] hover:bg-purple-50 transition-all duration-300 cursor-pointer min-h-[350px] gap-4 group"
          >
             <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-slate-400 group-hover:text-[#A43E8A]" />
             </div>
             <span className="font-medium text-slate-500 group-hover:text-[#A43E8A]">Agregar Cápsula</span>
          </div>
        )}
      </div>

      {!loading && visibleCount < filteredCapsules.length + 1 && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => setVisibleCount(prev => prev + 8)}
            className="w-36 rounded-full bg-[#A43E8A] hover:bg-[#8a3373] text-white font-medium shadow-md"
          >
            Ver más
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Cápsula' : 'Agregar Cápsula'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edita los detalles de la cápsula.' : 'Agrega una nueva cápsula de conocimiento.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Título
              </Label>
              <Input
                id="title"
                value={currentCapsule.title || ''}
                onChange={(e) => setCurrentCapsule({ ...currentCapsule, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="videoUrl">
                URL Video (Embed)
              </Label>
              <Input
                id="videoUrl"
                value={currentCapsule.videoUrl || ''}
                onChange={(e) => setCurrentCapsule({ ...currentCapsule, videoUrl: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="downloadUrl">
                URL Descarga (Drive)
              </Label>
              <Input
                id="downloadUrl"
                value={currentCapsule.downloadUrl || ''}
                onChange={(e) => setCurrentCapsule({ ...currentCapsule, downloadUrl: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                Descripción (Más info)
              </Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={currentCapsule.description || ''}
                onChange={(e) => setCurrentCapsule({ ...currentCapsule, description: e.target.value })}
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
        title="¿Eliminar cápsula?"
        description="Esta acción eliminará la cápsula de conocimiento permanentemente. ¿Estás seguro de que deseas continuar?"
      />
    </div>
  );
};
