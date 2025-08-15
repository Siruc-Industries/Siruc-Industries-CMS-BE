const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching projects');
  }
};

exports.getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({ where: { id: parseInt(id, 10) } });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching project');
  }
};

exports.createProject = async (req, res) => {
  let { title, text, author, tabs, imageDescription } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  // Safely parse tabs if it exists, otherwise set to null
  let parsedTabs = null;
  if (tabs && tabs !== 'undefined') {
    try {
      parsedTabs = JSON.parse(tabs);
    } catch (parseError) {
      console.error('Error parsing tabs:', parseError);
      parsedTabs = null;
    }
  }

  try {
    const newProject = await prisma.project.create({
      data: { title, text, author, image: imagePath, tabs: parsedTabs, imageDescription },
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating project');
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, text, author, tabs } = req.body;
  
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    // Prepare the data to be updated
    const updateData = {
      title,
      text,
      author,
    };

    // If a new image is uploaded, include it in the update
    if (imagePath) {
      updateData.image = imagePath;
    }

    // Safely handle tabs if provided
    if (tabs && tabs !== 'undefined') {
      try {
        updateData.tabs = JSON.parse(tabs);
      } catch (parseError) {
        console.error('Error parsing tabs:', parseError);
        // If parsing fails, don't update tabs
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });
    
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating project');
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.project.delete({ where: { id: parseInt(id, 10) } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting project');
  }
};
