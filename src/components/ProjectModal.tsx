import { useState, useEffect } from 'react';
import type { Project } from '../types/project';
import './ProjectModal.css';

interface ProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  mode: 'add' | 'view' | 'edit';
  onClose: () => void;
  onSave: (project: Omit<Project, 'id'>) => void;
}

function ProjectModal({ isOpen, project, mode, onClose, onSave }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    tag: '',
    tagColor: 'default',
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (project && mode !== 'add') {
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        tag: project.tag || '',
        tagColor: project.tagColor || 'default',
      });
      setIsEditing(mode === 'edit');
    } else {
      setFormData({
        title: '',
        description: '',
        image: '',
        tag: '',
        tagColor: 'default',
      });
      setIsEditing(true);
    }
  }, [project, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      onSave({
        title: formData.title,
        description: formData.description,
        image: formData.image || 'https://via.placeholder.com/400x200?text=Project+Image',
        tag: formData.tag || undefined,
        tagColor: formData.tagColor || undefined,
      });
      onClose();
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const canEdit = mode === 'add' || isEditing;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Add New Project' : isEditing ? 'Edit Project' : 'Project Details'}</h2>
          <button className="close-btn" onClick={handleClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="image">Project Image URL</label>
            {canEdit ? (
              <input
                type="url"
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="form-input"
              />
            ) : (
              <div className="form-preview-image">
                <img src={formData.image || 'https://via.placeholder.com/400x200?text=Project+Image'} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            {canEdit ? (
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter project title"
                className="form-input"
                required
              />
            ) : (
              <div className="form-display">{formData.title}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            {canEdit ? (
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                className="form-textarea"
                rows={5}
                required
              />
            ) : (
              <div className="form-display">{formData.description}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tag">Tag (Optional)</label>
            {canEdit ? (
              <div className="form-row">
                <input
                  type="text"
                  id="tag"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="e.g., Public, Draft"
                  className="form-input"
                />
                <select
                  value={formData.tagColor}
                  onChange={(e) => setFormData({ ...formData, tagColor: e.target.value })}
                  className="form-select"
                >
                  <option value="default">Default</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            ) : (
              formData.tag && (
                <span className={`project-tag tag-${formData.tagColor}`}>{formData.tag}</span>
              )
            )}
          </div>

          <div className="modal-actions">
            {mode === 'view' && !isEditing && (
              <button type="button" className="btn-edit" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            )}
            {canEdit && (
              <>
                <button type="button" className="btn-cancel" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;

