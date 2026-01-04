import { useState, useEffect } from 'react';
import type { Project, CreateProjectDto, UpdateProjectDto } from './types/project';
import MainLayout from './layouts/MainLayout';
import SearchBar from './components/SearchBar';
import AddProjectButton from './components/AddProjectButton';
import ProjectCard from './components/ProjectCard';
import ProjectModal from './components/ProjectModal';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { getProjects, createProject, updateProject, searchProjects } from './services/api';
import { getAuthData, clearAuth, type User } from './utils/auth';
import './App.css';

type AuthView = 'signin' | 'signup';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('signin');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'view' | 'edit'>('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check for stored auth data on mount
  useEffect(() => {
    const authData = getAuthData();
    if (authData) {
      setUser(authData.user);
    }
    setLoading(false);
  }, []);

  const loadProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await getProjects(user.id);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await searchProjects(query, user.id);
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search projects');
      console.error('Error searching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load projects when user is available
  useEffect(() => {
    if (user) {
      loadProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Search projects
  useEffect(() => {
    if (user && searchQuery) {
      handleSearch(searchQuery);
    } else if (user) {
      loadProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, user]);

  const handleAddProject = () => {
    if (!user) return;
    
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
    if (!user) return;

    if (projectId) {
      // Update existing project
      const updated = await updateProject(projectId, user.id, projectData as UpdateProjectDto);
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

  const handleAuthSuccess = () => {
    // Re-fetch auth data after successful sign in/up
    const authData = getAuthData();
    if (authData) {
      setUser(authData.user);
    }
  };

  const handleSignOut = () => {
    clearAuth();
    setUser(null);
    setProjects([]);
    setAuthView('signin');
  };

  // Filter projects client-side as fallback (API search is primary)
  const filteredProjects = searchQuery
    ? projects.filter((project) =>
        project.projectName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projects;

  // Show authentication pages if user is not logged in
  if (!user) {
    if (authView === 'signup') {
      return (
        <SignUp
          onSignUpSuccess={handleAuthSuccess}
          onSwitchToSignIn={() => setAuthView('signin')}
        />
      );
    }
    
    return (
      <SignIn
        onSignInSuccess={handleAuthSuccess}
        onSwitchToSignUp={() => setAuthView('signup')}
      />
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Hero Section with User Info */}
        <div className="hero-section">
          <div>
            <h1 className="hero-title">All your projects, in one dashboard.</h1>
            <p className="hero-subtitle">
              Add projects, track progress, and keep everything organized.
            </p>
          </div>
          <div className="user-info">
            <span className="user-name">👋 Hi, {user.name}</span>
            <button onClick={handleSignOut} className="signout-button">
              Sign Out
            </button>
          </div>
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
          userId={user.id}
          onClose={handleCloseModal}
          onSave={handleSaveProject}
        />
      </div>
    </MainLayout>
  );
}

export default App;
