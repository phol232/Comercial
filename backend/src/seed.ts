import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Resource from './models/Resource.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Category.deleteMany({});
    await Resource.deleteMany({});
    console.log('Data cleared');

    // Seed Categories
    const categories = [
      {
        title: "Recursos Gráficos",
        description: "Recursos gráficos para estructurar presentaciones, acceder a logos y compartir material con clientes.",
        image: "https://laraigo.com/wp-content/uploads/2026/01/recursos-graficos1.png"
      },
      {
        title: "Demo Clientes",
        description: "Demo diseñadas para nuestros clientes y también de algunas verticales específicas",
        image: "https://laraigo.com/wp-content/uploads/2026/01/Demo-claro-300x199.png"
      },
      {
        title: "Cápsulas de Conocimiento",
        description: "Cápsulas de conocimiento con descripciones breves y enlace directo para acceder a cada video.",
        image: "https://laraigo.com/wp-content/uploads/2026/01/respuestas-rapidas.png"
      },
      {
        title: "Casos de Uso",
        description: "Casos de uso que muestran el potencial de Laraigo a través de funcionalidades específicas.",
        image: "https://laraigo.com/wp-content/uploads/2026/01/casos-de-uso.png"
      },
      {
        title: "Materiales Comerciales",
        description: "Materiales gráficos y audiovisuales para presentar a clientes y potenciales clientes.",
        image: "https://laraigo.com/wp-content/uploads/2026/01/materiales-comerciales1.png"
      }
    ];

    await Category.insertMany(categories);
    console.log('Categories seeded');

    // Seed Resources
    const resources = [
      { title: "Logos Laraigo", type: "logo", url: "https://drive.google.com" },
      { title: "Logos VCA", type: "logo", url: "https://drive.google.com" },
      { title: "Imágenes Laraigo", type: "image", url: "https://drive.google.com" },
      { title: "Plantillas para presentaciones", type: "template", url: "https://drive.google.com" },
      { title: "Firma pie de mail", type: "mail", url: "https://drive.google.com" },
      { title: "Fondo para Google Meet", type: "video", url: "https://drive.google.com" },
      { title: "Membretes", type: "doc", url: "https://drive.google.com" },
    ];

    await Resource.insertMany(resources);
    console.log('Resources seeded');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
