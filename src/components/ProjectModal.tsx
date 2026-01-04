import { useState, useEffect, useRef } from 'react';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../types/project';
import { uploadImage } from '../services/api';
import './ProjectModal.css';

interface ProjectModalProps {
  isOpen: boolean;
  project: Project | null;
  mode: 'add' | 'view' | 'edit';
  userId: number;
  onClose: () => void;
  onSave: (data: CreateProjectDto | UpdateProjectDto, projectId?: number) => Promise<void>;
}

function ProjectModal({ isOpen, project, mode, userId, onClose, onSave }: ProjectModalProps) {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project && mode !== 'add') {
      setFormData({
        projectName: project.projectName,
        description: project.description || '',
        image: project.image || '',
      });
      setImagePreview(project.image || '');
      setIsEditing(mode === 'edit');
      setSelectedFile(null); // Reset selected file when viewing/editing existing project
    } else {
      setFormData({
        projectName: '',
        description: '',
        image: '',
      });
      setImagePreview('');
      setIsEditing(true);
      setSelectedFile(null); // Reset selected file when adding new project
    }
    setError('');
  }, [project, mode, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');

    // Store file for later upload (when Save is clicked)
    setSelectedFile(file);

    // Create preview only (don't upload yet)
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.projectName.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setUploading(false);
    
    try {
      let imageUrl = formData.image; // Use existing image URL if editing and no new file selected

      // If a new file was selected, upload it to MinIO first
      if (selectedFile) {
        setUploading(true);
        try {
          console.log('📤 Uploading image to MinIO...');
          imageUrl = await uploadImage(selectedFile);
          console.log('✅ Image uploaded to MinIO:', imageUrl);
          setUploading(false);
        } catch (uploadError) {
          setUploading(false);
          setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload image');
          return;
        }
      }

      // Now save the project with the image URL
      if (mode === 'add') {
        await onSave({
          userId,
          projectName: formData.projectName,
          description: formData.description || null,
          image: imageUrl || null,
        });
      } else if (project) {
        await onSave({
          projectName: formData.projectName,
          description: formData.description || null,
          image: imageUrl || null,
        }, project.id);
      }
      
      // Reset file selection after successful save
      setSelectedFile(null);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setLoading(false);
      setUploading(false);
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
            <label htmlFor="image">Project Image</label>
            {canEdit ? (
              <div className="image-upload-container">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                  disabled={uploading}
                />
                {uploading && <div className="upload-status">Uploading to MinIO...</div>}
                {loading && selectedFile && <div className="upload-status">Saving project...</div>}
                {(imagePreview || formData.image) && (
                  <div className="image-preview-container">
                    <img
                      src={imagePreview || formData.image}
                      alt="Preview"
                      className="image-preview"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="remove-image-btn"
                      disabled={uploading}
                    >
                      Remove
                    </button>
                  </div>
                )}
                {!imagePreview && !formData.image && (
                  <label htmlFor="image" className="file-input-label">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="upload-icon"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    <span>Click to upload image</span>
                    <span className="file-hint">PNG, JPG, GIF up to 5MB</span>
                  </label>
                )}
              </div>
            ) : (
              <div className="form-preview-image">
                <img
                  src={formData.image || 'https://via.placeholder.com/400x200?text=Project+Image'}
                  alt="Preview"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== 'https://via.placeholder.com/400x200?text=Image+Not+Found') {
                      console.error('Failed to load image:', formData.image);
                      target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                    }
                  }}
                />
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="projectName">Project Name</label>
            {canEdit ? (
              <input
                type="text"
                id="projectName"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="Enter project name"
                className="form-input"
                required
              />
            ) : (
              <div className="form-display">{formData.projectName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            {canEdit ? (
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description (optional)"
                className="form-textarea"
                rows={5}
              />
            ) : (
              <div className="form-display">{formData.description || 'No description'}</div>
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
                <button type="submit" className="btn-save" disabled={loading || uploading}>
                  {uploading ? 'Uploading Image...' : loading ? 'Saving...' : 'Save'}
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

