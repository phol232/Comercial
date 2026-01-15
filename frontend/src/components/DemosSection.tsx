import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { searchTerm } from '@/stores/searchStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash, Play, Plus } from "lucide-react";

import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { API_URL } from '@/config/api';

interface Industry {
  _id: string;
  name: string;
}

interface Demo {
  _id: string;
  title: string;
  url: string; 
  downloadUrl?: string;
  industryId: string;
}

export const DemosSection = () => {
  const $searchTerm = useStore(searchTerm);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [loading, setLoading] = useState(true);

  // Industry Dialog State
  const [isIndustryDialogOpen, setIsIndustryDialogOpen] = useState(false);
  const [currentIndustry, setCurrentIndustry] = useState<Partial<Industry>>({});
  const [isEditingIndustry, setIsEditingIndustry] = useState(false);

  // Demo Dialog State
  const [isDemoDialogOpen, setIsDemoDialogOpen] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<Partial<Demo>>({});
  const [isEditingDemo, setIsEditingDemo] = useState(false);
  const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'industry' | 'demo' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [industriesRes, demosRes] = await Promise.all([
        fetch(`${API_URL}/api/industries`),
        fetch(`${API_URL}/api/demos`)
      ]);
      
      const industriesData = await industriesRes.json();
      const demosData = await demosRes.json();
      
      setIndustries(industriesData);
      setDemos(demosData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Industry Handlers
  const handleSaveIndustry = async () => {
    try {
      const url = isEditingIndustry
        ? `${API_URL}/api/industries/${currentIndustry._id}`
        : `${API_URL}/api/industries`;
      
      const method = isEditingIndustry ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentIndustry),
      });

      if (response.ok) {
        fetchData();
        setIsIndustryDialogOpen(false);
        setCurrentIndustry({});
        setIsEditingIndustry(false);
      }
    } catch (error) {
      console.error('Error saving industry:', error);
    }
  };

  const confirmDeleteIndustry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete({ id, type: 'industry' });
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteDemo = (id: string) => {
    setItemToDelete({ id, type: 'demo' });
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    const { id, type } = itemToDelete;
    const url = type === 'industry' 
      ? `${API_URL}/api/industries/${id}`
      : `${API_URL}/api/demos/${id}`;

    try {
      await fetch(url, { method: 'DELETE' });
      fetchData();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const openAddIndustryDialog = () => {
    setCurrentIndustry({});
    setIsEditingIndustry(false);
    setIsIndustryDialogOpen(true);
  };

  const openEditIndustryDialog = (industry: Industry, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndustry(industry);
    setIsEditingIndustry(true);
    setIsIndustryDialogOpen(true);
  };

  // Demo Handlers
  const handleSaveDemo = async () => {
    try {
      const url = isEditingDemo
        ? `${API_URL}/api/demos/${currentDemo._id}`
        : `${API_URL}/api/demos`;
      
      const method = isEditingDemo ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentDemo, industryId: selectedIndustryId }),
      });

      if (response.ok) {
        fetchData();
        setIsDemoDialogOpen(false);
        setCurrentDemo({});
        setIsEditingDemo(false);
      }
    } catch (error) {
      console.error('Error saving demo:', error);
    }
  };

  const openAddDemoDialog = (industryId: string) => {
    setSelectedIndustryId(industryId);
    setCurrentDemo({});
    setIsEditingDemo(false);
    setIsDemoDialogOpen(true);
  };

  const openEditDemoDialog = (demo: Demo) => {
    setSelectedIndustryId(demo.industryId);
    setCurrentDemo(demo);
    setIsEditingDemo(true);
    setIsDemoDialogOpen(true);
  };

  const getDemosByIndustry = (industryId: string) => {
    return demos.filter(demo => demo.industryId === industryId);
  };

  const getFilteredDemos = (industryId: string) => {
    const SECTION_TITLE = "Demos clientes";
    const isSectionMatch = SECTION_TITLE.toLowerCase().includes($searchTerm.toLowerCase());
    if (isSectionMatch) return getDemosByIndustry(industryId);

    const industry = industries.find(i => i._id === industryId);
    const industryMatches = industry?.name.toLowerCase().includes($searchTerm.toLowerCase());
    
    let relevantDemos = getDemosByIndustry(industryId);
    
    // If search is active and industry name doesn't match, filter demos by title
    if ($searchTerm && !industryMatches) {
      relevantDemos = relevantDemos.filter(demo => 
        demo.title.toLowerCase().includes($searchTerm.toLowerCase())
      );
    }
    
    return relevantDemos;
  };

  const filteredIndustries = industries.filter(industry => {
    if (!$searchTerm) return true;
    
    const SECTION_TITLE = "Demos clientes";
    const isSectionMatch = SECTION_TITLE.toLowerCase().includes($searchTerm.toLowerCase());
    if (isSectionMatch) return true;
    
    const industryMatches = industry.name.toLowerCase().includes($searchTerm.toLowerCase());
    const industryDemos = getDemosByIndustry(industry._id);
    const hasMatchingDemo = industryDemos.some(demo => 
      demo.title.toLowerCase().includes($searchTerm.toLowerCase())
    );
    
    return industryMatches || hasMatchingDemo;
  });

  if (!loading && filteredIndustries.length === 0 && $searchTerm) {
    return null;
  }

  return (
    <div id="demos-section" className="container mx-auto px-4 mb-24 max-w-[1400px]">
      <div className="relative mb-12">
        <h2 className="text-3xl font-bold text-center text-[#A43E8A]">
          Demos clientes
        </h2>
        <div className="absolute top-0 right-0">
          <Button 
            onClick={openAddIndustryDialog}
            className="bg-black hover:bg-slate-800 text-white rounded-md px-6"
          >
            Agregar Industria
          </Button>
        </div>
      </div>

      <div>
        {loading ? (
          <p className="text-center text-slate-500">Cargando demos...</p>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredIndustries.map((industry) => (
              <AccordionItem key={industry._id} value={industry._id} className="border border-[#a855f7] rounded-lg px-4 bg-white">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center justify-between w-full pr-4">
                    <span className="font-bold text-[#4a044e] text-lg">Industria: {industry.name}</span>
                    <div className="flex items-center gap-2">
                      <div 
                        role="button"
                        onClick={(e) => openEditIndustryDialog(industry, e)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                        title="Editar Industria"
                      >
                        <Pencil className="w-4 h-4" />
                      </div>
                      <div 
                        role="button"
                        onClick={(e) => confirmDeleteIndustry(industry._id, e)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        title="Eliminar Industria"
                      >
                        <Trash className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="py-6">
                    <div className="flex justify-end mb-6">
                      <Button 
                        onClick={() => openAddDemoDialog(industry._id)}
                        className="bg-black hover:bg-slate-800 text-white text-sm h-8"
                      >
                        Agregar Demo
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {getFilteredDemos(industry._id).map((demo) => (
                        <div key={demo._id} className="flex flex-col">
                          <div className="relative rounded-xl overflow-hidden shadow-md mb-3 group aspect-video bg-slate-100">
                            <iframe 
                              src={demo.url} 
                              title={demo.title}
                              className="w-full h-full object-cover"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                            
                            {/* Demo Actions Overlay - Removed */}
                          </div>
                          
                          <h4 className="font-bold text-[#1e293b] text-center mb-3">{demo.title}</h4>
                          
                          <div className="flex flex-col items-center gap-3 mt-2">
                            <Button 
                              className="w-36 rounded-full bg-[#A43E8A] hover:bg-[#8a3373] text-white font-medium shadow-md"
                              asChild
                            >
                              <a href={demo.downloadUrl || '#'} target="_blank" rel="noopener noreferrer">
                                Descargar
                              </a>
                            </Button>

                            <div className="flex items-center justify-center gap-3">
                              <button 
                                onClick={() => openEditDemoDialog(demo)}
                                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                <Pencil className="w-4 h-4" /> Editar
                              </button>
                              <div className="h-4 w-px bg-slate-300"></div>
                              <button 
                                onClick={() => confirmDeleteDemo(demo._id)}
                                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                <Trash className="w-4 h-4" /> Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div 
                        onClick={() => openAddDemoDialog(industry._id)}
                        className="flex flex-col items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#A43E8A] hover:bg-purple-50 transition-all duration-300 cursor-pointer min-h-[320px] gap-4 group"
                      >
                          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Plus className="w-8 h-8 text-slate-400 group-hover:text-[#A43E8A]" />
                          </div>
                          <span className="font-medium text-slate-500 group-hover:text-[#A43E8A]">Agregar Demo</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Industry Dialog */}
      <Dialog open={isIndustryDialogOpen} onOpenChange={setIsIndustryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditingIndustry ? 'Editar Industria' : 'Agregar Industria'}</DialogTitle>
            <DialogDescription>
              {isEditingIndustry ? 'Edita el nombre de la industria.' : 'Agrega una nueva industria para clasificar demos.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="industry-name">
                Nombre de Industria
              </Label>
              <Input
                id="industry-name"
                value={currentIndustry.name || ''}
                onChange={(e) => setCurrentIndustry({ ...currentIndustry, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsIndustryDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" onClick={handleSaveIndustry}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Demo Dialog */}
      <Dialog open={isDemoDialogOpen} onOpenChange={setIsDemoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditingDemo ? 'Editar Demo' : 'Agregar Demo'}</DialogTitle>
            <DialogDescription>
              {isEditingDemo ? 'Edita los detalles de la demo.' : 'Agrega una nueva demo a esta industria.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-title">
                Título
              </Label>
              <Input
                id="demo-title"
                value={currentDemo.title || ''}
                onChange={(e) => setCurrentDemo({ ...currentDemo, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-url">
                URL Video (Embed)
              </Label>
              <Input
                id="demo-url"
                value={currentDemo.url || ''}
                onChange={(e) => setCurrentDemo({ ...currentDemo, url: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-download">
                URL Descarga (Drive)
              </Label>
              <Input
                id="demo-download"
                value={currentDemo.downloadUrl || ''}
                onChange={(e) => setCurrentDemo({ ...currentDemo, downloadUrl: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDemoDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" onClick={handleSaveDemo}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={itemToDelete?.type === 'industry' ? "¿Eliminar industria?" : "¿Eliminar demo?"}
        description={
          itemToDelete?.type === 'industry' 
            ? "Esta acción eliminará la industria y todas sus demos asociadas permanentemente. ¿Estás seguro?"
            : "Esta acción eliminará la demo permanentemente. ¿Estás seguro?"
        }
      />
    </div>
  );
};
