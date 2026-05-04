import { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    profileImage: ''
  });
  const [uploading, setUploading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropType, setCropType] = useState(null); // 'profile' or 'project'
  const [editingId, setEditingId] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: '',
    imageUrl: '',
    demoLink: '',
    githubLink: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchMessages();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch('http://localhost:5000/api/auth/profile');
    const data = await res.json();
    setProfile({
      username: data.username,
      profileImage: data.profileImage || ''
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profile)
    });
    
    if (res.ok) {
      alert('Profile updated!');
      setProfile({ ...profile, password: '' });
    } else {
      const error = await res.json();
      console.error('Update Profile Error:', error);
      alert('Error updating profile: ' + (error.message || 'Unknown error'));
    }
  };

  const onCropComplete = useCallback((reachedArea, reachedAreaPixels) => {
    setCroppedAreaPixels(reachedAreaPixels);
  }, []);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    setCropType(type);
    const reader = new FileReader();
    reader.addEventListener('load', () => setImageToCrop(reader.result));
    reader.readAsDataURL(file);
  };

  const handleCropDone = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const formData = new FormData();
      formData.append('image', croppedImageBlob, 'upload.jpg');
      
      setUploading(true);
      setImageToCrop(null);

      const token = localStorage.getItem('adminToken');
      const res = await fetch(`http://localhost:5000/api/upload?type=${cropType}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await res.json();

      if (cropType === 'profile') {
        const updatedProfile = { ...profile, profileImage: data.url };
        setProfile(updatedProfile);

        // Auto-save profile
        await fetch('http://localhost:5000/api/auth/profile', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(updatedProfile)
        });
        alert('Profile photo updated!');
      } else if (cropType === 'project') {
        setNewProject(prev => ({ ...prev, imageUrl: data.url }));
        console.log('Project Image Uploaded:', data.url);
        alert('Project image uploaded!');
      }

      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const fetchProjects = async () => {
    const res = await fetch('http://localhost:5000/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5000/api/messages', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setMessages(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.reload();
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = editingId ? `http://localhost:5000/api/projects/${editingId}` : 'http://localhost:5000/api/projects';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...newProject,
        techStack: typeof newProject.techStack === 'string' ? newProject.techStack.split(',').map(s => s.trim()) : newProject.techStack
      })
    });
    if (res.ok) {
      setShowAddForm(false);
      setEditingId(null);
      fetchProjects();
      setNewProject({ title: '', description: '', techStack: '', imageUrl: '', demoLink: '', githubLink: '' });
      alert(editingId ? 'Project updated!' : 'Project added!');
    } else {
      const error = await res.json();
      console.error('Project Save Error:', error);
      alert('Error saving project: ' + (error.message || 'Unknown error'));
    }
  };

  const handleEditClick = (p) => {
    setNewProject({
      title: p.title,
      description: p.description,
      techStack: p.techStack.join(', '),
      imageUrl: p.imageUrl,
      demoLink: p.demoLink || '',
      githubLink: p.githubLink || ''
    });
    setEditingId(p._id);
    setShowAddForm(true);
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchProjects();
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/messages/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchMessages();
  };

  return (
    <div className="admin-dashboard container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-outline">Logout</button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>Projects</button>
        <button className={activeTab === 'messages' ? 'active' : ''} onClick={() => setActiveTab('messages')}>
          Messages {messages.filter(m => !m.read).length > 0 && <span className="badge">{messages.filter(m => !m.read).length}</span>}
        </button>
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
      </div>

      <div className="admin-content">
        {activeTab === 'profile' && (
          <div className="profile-admin">
            <h2>Edit Profile</h2>
            <form className="add-project-form glass-morphism" onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Profile Image URL</label>
                {profile.profileImage && (
                  <div className="profile-form-preview">
                    <img 
                      src={profile.profileImage.startsWith('http') ? profile.profileImage : `http://localhost:5000${profile.profileImage}`} 
                      alt="Profile" 
                      style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }}
                    />
                  </div>
                )}
                <input type="text" value={profile.profileImage} onChange={e => setProfile({...profile, profileImage: e.target.value})} />
                <input type="file" onChange={e => handleFileUpload(e, 'profile')} accept="image/*" style={{ marginTop: '10px' }} />
                {uploading && <p>Uploading...</p>}
              </div>
              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  onChange={e => setProfile({...profile, password: e.target.value})} 
                />
              </div>
              <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-admin">
            <div className="section-header">
              <h2>Manage Projects</h2>
              <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>Add New Project</button>
            </div>

            {showAddForm && (
              <form className="add-project-form glass-morphism" onSubmit={handleAddProject}>
                <input type="text" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
                <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
                <input type="text" placeholder="Tech Stack (comma separated)" value={newProject.techStack} onChange={e => setNewProject({...newProject, techStack: e.target.value})} />
                <div className="form-group">
                  <label>Project Image</label>
                  {newProject.imageUrl && (
                    <div className="project-form-preview">
                      <img 
                        src={newProject.imageUrl.startsWith('http') ? newProject.imageUrl : `http://localhost:5000${newProject.imageUrl}`} 
                        alt="Preview" 
                        style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '0.4rem', marginBottom: '10px' }}
                      />
                    </div>
                  )}
                  <input type="text" placeholder="Image URL" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} />
                  <input type="file" onChange={e => handleFileUpload(e, 'project')} accept="image/*" style={{ marginTop: '10px' }} />
                </div>
                <input type="text" placeholder="Demo Link" value={newProject.demoLink} onChange={e => setNewProject({...newProject, demoLink: e.target.value})} />
                <input type="text" placeholder="GitHub Link" value={newProject.githubLink} onChange={e => setNewProject({...newProject, githubLink: e.target.value})} />
                <div className="form-btns">
                  <button type="submit" className="btn btn-primary">{editingId ? 'Update Project' : 'Save Project'}</button>
                  <button type="button" className="btn btn-outline" onClick={() => { setShowAddForm(false); setEditingId(null); }}>Cancel</button>
                </div>
              </form>
            )}

            <div className="admin-list">
              {projects.map(p => (
                <div key={p._id} className="admin-item glass-morphism">
                  <div className="admin-item-preview">
                    <img 
                      src={p.imageUrl?.startsWith('http') ? p.imageUrl : `http://localhost:5000${p.imageUrl}`} 
                      alt={p.title} 
                      className="admin-project-thumb"
                    />
                    <div>
                      <h3>{p.title}</h3>
                      <p>{p.techStack.join(', ')}</p>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => handleEditClick(p)} className="edit-btn">Edit</button>
                    <button onClick={() => deleteProject(p._id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-admin">
            <h2>User Messages</h2>
            <div className="admin-list">
              {messages.map(m => (
                <div key={m._id} className={`admin-item glass-morphism ${!m.read ? 'unread' : ''}`}>
                  <div>
                    <h3>{m.name} ({m.email})</h3>
                    <p className="subject">{m.subject}</p>
                    <p className="msg-body">{m.message}</p>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => deleteMessage(m._id)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {imageToCrop && (
        <div className="crop-modal">
          <div className="crop-container">
            <Cropper
              image={imageToCrop}
              crop={crop}
              zoom={zoom}
              aspect={cropType === 'profile' ? 1 : 16/9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className="crop-controls">
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(e.target.value)}
            />
            <div className="crop-btns">
              <button type="button" onClick={() => setImageToCrop(null)} className="btn btn-outline">Cancel</button>
              <button type="button" onClick={handleCropDone} className="btn btn-primary">Crop & Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
