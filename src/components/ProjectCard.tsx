import type { Project } from '../types/project';
import './ProjectCard.css';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-image-container">
        <img 
          src={project.image || 'https://via.placeholder.com/400x200?text=Project+Image'} 
          alt={project.projectName} 
          className="project-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== 'https://via.placeholder.com/400x200?text=Image+Not+Found') {
              console.error('Failed to load image:', project.image);
              target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
            }
          }}
        />
      </div>
      <div className="project-content">
        <h3 className="project-title">{project.projectName}</h3>
        <p className="project-description">{project.description || 'No description'}</p>
      </div>
    </div>
  );
}

export default ProjectCard;

