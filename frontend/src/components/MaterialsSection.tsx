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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash, FileText, Folder, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { authenticatedFetch } from '@/utils/api';

interface Material {
  _id: string;
  title: string;
  type: 'presentation' | 'video' | 'chat_web';
  url: string;
  videoUrl?: string;
}

export const MaterialsSection = () => {
  const $searchTerm = useStore(searchTerm);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<Material>>({});
  const [isEditing, setIsEditing] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // Carousel State for Presentations
  const [presentationIndex, setPresentationIndex] = useState(0);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await authenticatedFetch('/api/materials');
      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const endpoint = isEditing
        ? `/api/materials/${currentMaterial._id}`
        : `/api/materials`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await authenticatedFetch(endpoint, {
        method,
        body: JSON.stringify(currentMaterial),
      });

      if (response.ok) {
        fetchMaterials();
        setIsDialogOpen(false);
        setCurrentMaterial({});
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await authenticatedFetch(`/api/materials/${itemToDelete}`, { method: 'DELETE' });
      fetchMaterials();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const openAddDialog = () => {
    setCurrentMaterial({ type: 'presentation' });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (material: Material) => {
    setCurrentMaterial(material);
    setIsEditing(true);
    setIsDialogOpen(true);
  };// ... (useEffect and fetchMaterials)

  const SECTION_TITLE = "Materiales comerciales";
  const normalizedSearch = normalizeText($searchTerm);
  const isSectionMatch = normalizeText(SECTION_TITLE).includes(normalizedSearch);

  const filteredMaterials = materials.filter(material => 
    isSectionMatch || normalizeText(material.title).includes(normalizedSearch)
  );

  if (!loading && filteredMaterials.length === 0 && $searchTerm) {
    return null;
  }

  // Filtered lists
  const presentations = filteredMaterials.filter(m => m.type === 'presentation');
  const videos = filteredMaterials.filter(m => m.type === 'video');
  const chatWebMaterials = filteredMaterials.filter(m => m.type === 'chat_web');

  // Carousel Logic
  const nextPresentation = () => {
    setPresentationIndex((prev) => (prev + 1) % presentations.length);
  };

  const prevPresentation = () => {
    setPresentationIndex((prev) => (prev - 1 + presentations.length) % presentations.length);
  };

  // Safe access to current presentation
  const currentPresentation = presentations[presentationIndex] || presentations[0];

  return (
    <div id="Material-section" className="container mx-auto px-4 mb-24 max-w-[1400px]">
      <div className="relative mb-12">
        <h2 className="text-3xl font-bold text-center text-[#A43E8A]">
          Materiales comerciales
        </h2>
        <div className="absolute top-0 right-0">
          <Button 
            onClick={openAddDialog}
            className="bg-black hover:bg-slate-800 text-white rounded-md px-6"
          >
            Agregar Material
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Column 1: Presentations */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-[#1e293b] mb-6">Presentaciones comerciales</h3>
          
          {presentations.length > 0 ? (
            <div className="relative w-full max-w-sm flex items-center justify-center">
              <button 
                onClick={prevPresentation}
                className="absolute left-0 p-2 text-[#A43E8A] hover:bg-purple-50 rounded-full transition-colors z-10"
                disabled={presentations.length <= 1}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="flex flex-col items-center w-full px-12">
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                  <FileText className="w-20 h-20 text-[#A43E8A] stroke-1" />
                </div>
                
                <h4 className="text-2xl font-bold text-[#1e293b] text-center mb-6 leading-tight min-h-[4rem] flex items-center justify-center">
                  {currentPresentation?.title}
                </h4>

                <Button 
                  className="w-48 rounded-full bg-[#A43E8A] hover:bg-[#8a3373] text-white font-medium shadow-md mb-4"
                  asChild
                >
                  <a href={currentPresentation?.url || '#'} target="_blank" rel="noopener noreferrer">
                    Ver y descargar
                  </a>
                </Button>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => openEditDialog(currentPresentation)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                  <div className="h-4 w-px bg-slate-300"></div>
                  <button 
                    onClick={() => confirmDelete(currentPresentation?._id)}
                    className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash className="w-4 h-4" /> Eliminar
                  </button>
                </div>
              </div>

              <button 
                onClick={nextPresentation}
                className="absolute right-0 p-2 text-[#A43E8A] hover:bg-purple-50 rounded-full transition-colors z-10"
                disabled={presentations.length <= 1}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          ) : (
             <div className="text-slate-400 italic py-12 text-center">No hay presentaciones disponibles</div>
          )}
        </div>

        {/* Column 2: Videos */}
        <div className="flex flex-col items-center border-x border-slate-100 px-4">
          <h3 className="text-xl font-bold text-[#1e293b] mb-6">Videos</h3>
          
          {videos.length > 0 ? (
            <div className="w-full flex flex-col items-center">
              {/* Only showing the latest video for layout simplicity as per image, or map them? Image shows 1. Let's show the latest one or map vertically. Image shows 1 big video. I'll show the first one. */}
               {videos.map((video) => (
                 <div key={video._id} className="flex flex-col items-center w-full mb-8">
                    <div className="relative w-full aspect-video bg-slate-100 rounded-lg overflow-hidden shadow-sm mb-4">
                      <iframe 
                        src={video.videoUrl} 
                        title={video.title}
                        className="w-full h-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    
                    <h4 className="font-bold text-[#1e293b] text-center mb-4 text-lg">{video.title}</h4>
                    
                    <Button 
                      className="w-48 rounded-full bg-[#A43E8A] hover:bg-[#8a3373] text-white font-medium shadow-md mb-3"
                      asChild
                    >
                      <a href={video.url || '#'} target="_blank" rel="noopener noreferrer">
                        Descargar
                      </a>
                    </Button>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => openEditDialog(video)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Pencil className="w-4 h-4" /> Editar
                      </button>
                      <div className="h-4 w-px bg-slate-300"></div>
                      <button 
                        onClick={() => confirmDelete(video._id)}
                        className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        <Trash className="w-4 h-4" /> Eliminar
                      </button>
                    </div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="text-slate-400 italic py-12 text-center">No hay videos disponibles</div>
          )}
        </div>

        {/* Column 3: Chat Web */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold text-[#1e293b] mb-6">Chat web</h3>
          
          {chatWebMaterials.length > 0 ? (
            <div className="w-full flex flex-col gap-8">
              {chatWebMaterials.map((item) => (
                <div key={item._id} className="flex flex-col items-center w-full">
                  <div className="w-24 h-24 mb-4 flex items-center justify-center">
                    <Folder className="w-20 h-20 text-[#1e293b] stroke-1 fill-slate-100" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-[#1e293b] text-center mb-6 leading-tight min-h-[3rem] flex items-center justify-center">
                    {item.title}
                  </h4>

                  <Button 
                    className="w-48 rounded-full bg-[#A43E8A] hover:bg-[#8a3373] text-white font-medium shadow-md mb-4"
                    asChild
                  >
                    <a href={item.url || '#'} target="_blank" rel="noopener noreferrer">
                      Ver y descargar
                    </a>
                  </Button>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => openEditDialog(item)}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Pencil className="w-4 h-4" /> Editar
                    </button>
                    <div className="h-4 w-px bg-slate-300"></div>
                    <button 
                      onClick={() => confirmDelete(item._id)}
                      className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <Trash className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 italic py-12 text-center">No hay materiales de chat web disponibles</div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Material' : 'Agregar Material'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edita los detalles del material comercial.' : 'Agrega un nuevo material comercial.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Título
              </Label>
              <Input
                id="title"
                value={currentMaterial.title || ''}
                onChange={(e) => setCurrentMaterial({ ...currentMaterial, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="type">
                Tipo
              </Label>
              <Select 
                value={currentMaterial.type || 'presentation'}
                onValueChange={(value: any) => setCurrentMaterial({ ...currentMaterial, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presentation">Presentación Comercial</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="chat_web">Chat Web</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {currentMaterial.type === 'video' && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="videoUrl">
                  URL Video (Embed)
                </Label>
                <Input
                  id="videoUrl"
                  value={currentMaterial.videoUrl || ''}
                  onChange={(e) => setCurrentMaterial({ ...currentMaterial, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="url">
                URL Descarga / Link
              </Label>
              <Input
                id="url"
                value={currentMaterial.url || ''}
                onChange={(e) => setCurrentMaterial({ ...currentMaterial, url: e.target.value })}
                placeholder="https://drive.google.com/..."
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
        title="¿Eliminar material?"
        description="Esta acción eliminará el material permanentemente. ¿Estás seguro de que deseas continuar?"
      />
    </div>
  );
};
