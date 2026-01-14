import express, { Router } from 'express';
import Resource from '../models/Resource.js';
import Category from '../models/Category.js';
import Industry from '../models/Industry.js';
import Demo from '../models/Demo.js';
import Capsule from '../models/Capsule.js';
import Material from '../models/Material.js';

const router: Router = express.Router();

// Get all capsules
router.get('/capsules', async (req, res) => {
  try {
    const capsules = await Capsule.find();
    res.json(capsules);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Create a capsule
router.post('/capsules', async (req, res) => {
  const capsule = new Capsule({
    title: req.body.title,
    videoUrl: req.body.videoUrl,
    downloadUrl: req.body.downloadUrl,
    description: req.body.description
  });

  try {
    const newCapsule = await capsule.save();
    res.status(201).json(newCapsule);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Update a capsule
router.put('/capsules/:id', async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);
    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }

    capsule.title = req.body.title || capsule.title;
    capsule.videoUrl = req.body.videoUrl || capsule.videoUrl;
    capsule.downloadUrl = req.body.downloadUrl || capsule.downloadUrl;
    capsule.description = req.body.description || capsule.description;

    const updatedCapsule = await capsule.save();
    res.json(updatedCapsule);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete a capsule
router.delete('/capsules/:id', async (req, res) => {
  try {
    const capsule = await Capsule.findById(req.params.id);
    if (!capsule) {
      return res.status(404).json({ message: 'Capsule not found' });
    }
    await capsule.deleteOne();
    res.json({ message: 'Capsule deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get all resources
router.get('/resources', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get all industries
router.get('/industries', async (req, res) => {
  try {
    const industries = await Industry.find();
    res.json(industries);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Create an industry
router.post('/industries', async (req, res) => {
  const industry = new Industry({
    name: req.body.name
  });

  try {
    const newIndustry = await industry.save();
    res.status(201).json(newIndustry);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Update an industry
router.put('/industries/:id', async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ message: 'Industry not found' });
    }

    industry.name = req.body.name || industry.name;
    const updatedIndustry = await industry.save();
    res.json(updatedIndustry);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete an industry
router.delete('/industries/:id', async (req, res) => {
  try {
    const industry = await Industry.findById(req.params.id);
    if (!industry) {
      return res.status(404).json({ message: 'Industry not found' });
    }
    
    // Also delete associated demos
    await Demo.deleteMany({ industryId: req.params.id });
    
    await industry.deleteOne();
    res.json({ message: 'Industry deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get all demos
router.get('/demos', async (req, res) => {
  try {
    const demos = await Demo.find();
    res.json(demos);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get demos by industry
router.get('/demos/industry/:industryId', async (req, res) => {
  try {
    const demos = await Demo.find({ industryId: req.params.industryId });
    res.json(demos);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Create a demo
router.post('/demos', async (req, res) => {
  const demo = new Demo({
    title: req.body.title,
    url: req.body.url,
    downloadUrl: req.body.downloadUrl,
    industryId: req.body.industryId
  });

  try {
    const newDemo = await demo.save();
    res.status(201).json(newDemo);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Update a demo
router.put('/demos/:id', async (req, res) => {
  try {
    const demo = await Demo.findById(req.params.id);
    if (!demo) {
      return res.status(404).json({ message: 'Demo not found' });
    }

    demo.title = req.body.title || demo.title;
    demo.url = req.body.url || demo.url;
    demo.downloadUrl = req.body.downloadUrl || demo.downloadUrl;
    demo.industryId = req.body.industryId || demo.industryId;

    const updatedDemo = await demo.save();
    res.json(updatedDemo);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete a demo
router.delete('/demos/:id', async (req, res) => {
  try {
    const demo = await Demo.findById(req.params.id);
    if (!demo) {
      return res.status(404).json({ message: 'Demo not found' });
    }
    await demo.deleteOne();
    res.json({ message: 'Demo deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Create a category
router.post('/categories', async (req, res) => {
  const category = new Category({
    title: req.body.title,
    description: req.body.description,
    image: req.body.image,
    link: req.body.link
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Update a category
router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.title = req.body.title || category.title;
    category.description = req.body.description || category.description;
    category.image = req.body.image || category.image;
    category.link = req.body.link || category.link;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete a category
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Create a resource
router.post('/resources', async (req, res) => {
  const resource = new Resource({
    title: req.body.title,
    type: req.body.type,
    url: req.body.url
  });

  try {
    const newResource = await resource.save();
    res.status(201).json(newResource);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Update a resource
router.put('/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.title = req.body.title || resource.title;
    resource.type = req.body.type || resource.type;
    resource.url = req.body.url || resource.url;

    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete a resource
router.delete('/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    await resource.deleteOne();
    res.json({ message: 'Resource deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get all materials
router.get('/materials', async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Create a material
router.post('/materials', async (req, res) => {
  const material = new Material({
    title: req.body.title,
    type: req.body.type,
    url: req.body.url,
    videoUrl: req.body.videoUrl
  });

  try {
    const newMaterial = await material.save();
    res.status(201).json(newMaterial);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Update a material
router.put('/materials/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    material.title = req.body.title || material.title;
    material.type = req.body.type || material.type;
    material.url = req.body.url || material.url;
    material.videoUrl = req.body.videoUrl || material.videoUrl;

    const updatedMaterial = await material.save();
    res.json(updatedMaterial);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Delete a material
router.delete('/materials/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    await material.deleteOne();
    res.json({ message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
