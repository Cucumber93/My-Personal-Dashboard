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
        <img src={project.image} alt={project.title} className="project-image" />
        {project.tag && (
          <span className={`project-tag tag-${project.tagColor || 'default'}`}>
            {project.tag}
          </span>
        )}
      </div>
      <div className="project-content">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
      </div>
    </div>
  );
}

export default ProjectCard;

