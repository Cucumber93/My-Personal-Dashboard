import { useState, useEffect } from 'react';
import type { Project, CreateProjectDto, UpdateProjectDto } from './types/project';
import MainLayout from './layouts/MainLayout';
import SearchBar from './components/SearchBar';
import AddProjectButton from './components/AddProjectButton';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import SignUpModal from './components/SignUpModal';
import { getProjects, createProject, updateProject, searchProjects } from './services/api';
import './App.css';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'view' | 'edit'>('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for stored userId on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    } else {
      setSignUpModalOpen(true);
    }
  }, []);

  const loadProjects = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await getProjects(userId);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const data = await searchProjects(query, userId);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search projects');
      console.error('Error searching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load projects when userId is available
  useEffect(() => {
    if (userId) {
      loadProjects();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Search projects
  useEffect(() => {
    if (userId && searchQuery) {
      handleSearch(searchQuery);
    } else if (userId) {
      loadProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, userId]);

  const handleAddProject = () => {
    if (!userId) {
      setSignUpModalOpen(true);
      return;
    }
    setSelectedProject(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleSaveProject = async (
    projectData: CreateProjectDto | UpdateProjectDto,
    projectId?: number
  ) => {
    if (!userId) return;

    if (projectId) {
      // Update existing project
      const updated = await updateProject(projectId, userId, projectData as UpdateProjectDto);
      setProjects(projects.map((p) => (p.id === projectId ? updated : p)));
    } else {
      // Create new project
      const newProject = await createProject(projectData as CreateProjectDto);
      setProjects([newProject, ...projects]);
    }
    setModalOpen(false);
    setSelectedProject(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  const handleSignUpSuccess = (newUserId: number) => {
    setUserId(newUserId);
    localStorage.setItem('userId', newUserId.toString());
    setSignUpModalOpen(false);
  };

  // Filter projects client-side as fallback (API search is primary)
  const filteredProjects = searchQuery
    ? projects.filter((project) =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  if (!userId) {
    return (
      <MainLayout>
        <div className="dashboard-container">
          <div className="hero-section">
            <h1 className="hero-title">Welcome to Your Dashboard</h1>
            <p className="hero-subtitle">Please sign up to get started</p>
          </div>
          <SignUpModal
            isOpen={signUpModalOpen}
            onClose={() => {}}
            onSuccess={handleSignUpSuccess}
          />
        </div>
      </MainLayout>
    );
  }

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

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* Projects Section */}
        <div className="projects-section">
          <h2 className="section-title">My Projects</h2>
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : (
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
                  <p>
                    {searchQuery
                      ? `No projects found matching "${searchQuery}"`
                      : 'No projects yet. Click "ADD PROJECT" to create your first project!'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <ProjectModal
          isOpen={modalOpen}
          project={selectedProject}
          mode={modalMode}
          userId={userId}
          onClose={handleCloseModal}
          onSave={handleSaveProject}
        />
      </div>
    </MainLayout>
  );
}

export default App;
