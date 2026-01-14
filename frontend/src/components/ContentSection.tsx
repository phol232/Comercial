import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Pencil, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { API_URL } from '@/config/api';

interface Category {
  _id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export const ContentSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [isEditing, setIsEditing] = useState(false);
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = isEditing 
        ? `${API_URL}/api/categories/${currentCategory._id}`
        : `${API_URL}/api/categories`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentCategory),
      });

      if (response.ok) {
        fetchCategories();
        setIsDialogOpen(false);
        setCurrentCategory({});
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      await fetch(`${API_URL}/api/categories/${itemToDelete}`, {
        method: 'DELETE',
      });
      fetchCategories();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const openAddDialog = () => {
    setCurrentCategory({});
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 -mt-7 mb-20 relative z-10 max-w-[1400px]">
      {/* Search Bar */}
      <div className="w-full relative mb-16">
        <Input 
          type="text" 
          placeholder="Buscar en esta página..." 
          className="w-full h-14 pl-6 pr-12 border border-slate-400 bg-white text-lg shadow-sm placeholder:text-slate-500 rounded-sm focus-visible:ring-[#a855f7]"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Section Title and Add Button */}
      <div className="relative mb-12">
        <h2 className="text-3xl font-bold text-center text-[#A43E8A]">
          Contenidos Laraigo
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

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {loading ? (
           <p className="text-center col-span-5 text-slate-500">Cargando contenidos...</p>
        ) : (
          categories.map((category) => (
            <div key={category._id} className="flex flex-col items-center">
               <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col h-full group">
                  <div className="h-32 bg-slate-100 overflow-hidden relative">
                      <img 
                        src={category.image} 
                        alt={category.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                  </div>
                  <div className="p-4 flex flex-col flex-1 items-center text-center">
                      <h3 className="font-bold text-[#1e293b] mb-2 text-lg leading-tight">{category.title}</h3>
                      <p className="text-xs text-slate-600 mb-6 flex-1 line-clamp-4">{category.description}</p>
                      
                      <Button 
                        className="w-full rounded-full text-white text-sm font-semibold h-9"
                        style={{ backgroundColor: '#A43E8A', padding: '13px 24px' }}
                        asChild
                      >
                        <a 
                          href={category.link || '#'} 
                          target={category.link?.startsWith('#') ? '_self' : '_blank'}
                          rel={category.link?.startsWith('#') ? undefined : 'noopener noreferrer'}
                        >
                          Ver Más
                        </a>
                      </Button>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-center gap-3 mt-4 w-full pt-2">
                        <button 
                          onClick={() => openEditDialog(category)}
                          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Pencil className="w-4 h-4" /> Editar
                        </button>
                        <div className="h-4 w-px bg-slate-300"></div>
                        <button 
                          onClick={() => confirmDelete(category._id)}
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Categoría' : 'Agregar Categoría'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Edita los detalles de la categoría.' : 'Agrega una nueva categoría al sistema.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">
                Título
              </Label>
              <Input
                id="title"
                value={currentCategory.title || ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, title: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">
                Descripción
              </Label>
              <Input
                id="description"
                value={currentCategory.description || ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">
                URL Imagen
              </Label>
              <Input
                id="image"
                value={currentCategory.image || ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, image: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="link">
                URL Enlace (Ver Más)
              </Label>
              <Input
                id="link"
                value={currentCategory.link || ''}
                onChange={(e) => setCurrentCategory({ ...currentCategory, link: e.target.value })}
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
        title="¿Eliminar categoría?"
        description="Esta acción eliminará la categoría permanentemente. ¿Estás seguro de que deseas continuar?"
      />
    </div>
  );
};
