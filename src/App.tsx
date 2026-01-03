import { useState } from 'react';
import type { Project } from './types/project';
import MainLayout from './layouts/MainLayout';
import SearchBar from './components/SearchBar';
import AddProjectButton from './components/AddProjectButton';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import './App.css';

function App() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      title: 'Title',
      description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
      image: 'https://via.placeholder.com/400x200?text=Dashboard+Preview',
      tag: 'Draft',
      tagColor: 'yellow',
    },
    {
      id: '2',
      title: 'Title',
      description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
      image: 'https://via.placeholder.com/400x200?text=Dashboard+Preview',
      tag: 'Public',
      tagColor: 'green',
    },
    {
      id: '3',
      title: 'Title',
      description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
      image: 'https://via.placeholder.com/400x200?text=Dashboard+Preview',
      tag: 'Public',
      tagColor: 'green',
    },
    {
      id: '4',
      title: 'Title',
      description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
      image: 'https://via.placeholder.com/400x200?text=Dashboard+Preview',
      tag: 'Public',
      tagColor: 'green',
    },
    {
      id: '5',
      title: 'Title',
      description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
      image: 'https://via.placeholder.com/400x200?text=Dashboard+Preview',
      tag: 'Public',
      tagColor: 'green',
    },
    {
      id: '6',
      title: 'Title',
      description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
      image: 'https://via.placeholder.com/400x200?text=Dashboard+Preview',
      tag: 'Public',
      tagColor: 'green',
    },
    {
      id: '7',
      title: 'Title',
      description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
      image: 'https://via.placeholder.com/400x200?text=Dashboard+Preview',
      tag: 'Public',
      tagColor: 'green',
    },
    {
      id: '8',
      title: 'Title',
      description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
      image: 'https://via.placeholder.com/400x200?text=Dashboard+Preview',
      tag: 'Public',
      tagColor: 'green',
    },
    {
      id: '9',
      title: 'Title',
      description: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
      image: 'https://via.placeholder.com/400x200?text=Dashboard+Preview',
      tag: 'Public',
      tagColor: 'green',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'view' | 'edit'>('add');

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProject = () => {
    setSelectedProject(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    if (modalMode === 'add') {
      // Add new project
      const newProject: Project = {
        ...projectData,
        id: Date.now().toString(),
      };
      setProjects([...projects, newProject]);
    } else if (selectedProject) {
      // Update existing project
      setProjects(
        projects.map((p) =>
          p.id === selectedProject.id
            ? { ...projectData, id: selectedProject.id }
            : p
        )
      );
    }
    setModalOpen(false);
    setSelectedProject(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">All your projects, in one dashboard.</h1>
          <p className="hero-subtitle">
            Add projects, track progress, and keep everything organized.
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="search-add-section">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <AddProjectButton onClick={handleAddProject} />
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Projects Section */}
        <div className="projects-section">
          <h2 className="section-title">My Projects</h2>
          <div className="projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleCardClick(project)}
                />
              ))
            ) : (
              <div className="no-projects">
                <p>No projects found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <ProjectModal
          isOpen={modalOpen}
          project={selectedProject}
          mode={modalMode}
          onClose={handleCloseModal}
          onSave={handleSaveProject}
        />
      </div>
    </MainLayout>
  );
}

export default App;
