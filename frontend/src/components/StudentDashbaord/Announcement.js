import React, { useEffect, useState } from 'react';
import { getAnnouncements } from '../api/announcementApi';

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncements();
        console.log(data);
        setAnnouncements(data);
      } catch (err) {
        setError('Failed to fetch announcements');
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnnouncements();
  }, []);

  // Function to handle view button click
  const handleViewClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAnnouncement(null);
  };

  // Function to get badge color based on announcement type
  const getTypeBadgeStyle = (type) => {
    const baseStyle = {
      fontSize: '0.75rem',
      fontWeight: '600',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem'
    };

    switch (type?.toLowerCase()) {
      case 'important':
        return { ...baseStyle, backgroundColor: 'var(--error)', color: 'white' };
      case 'update':
        return { ...baseStyle, backgroundColor: 'var(--primary)', color: 'white' };
      case 'event':
        return { ...baseStyle, backgroundColor: 'var(--success)', color: 'white' };
      case 'maintenance':
        return { ...baseStyle, backgroundColor: 'var(--warning)', color: 'var(--text-primary)' };
      default:
        return { ...baseStyle, backgroundColor: 'var(--secondary)', color: 'white' };
    }
  };

  // Function to truncate description for list view
  const truncateDescription = (description, wordCount = 4) => {
    if (!description) return '';
    const words = description.split(' ');
    if (words.length <= wordCount) return description;
    return words.slice(0, wordCount).join(' ') + '...';
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div 
            className="spinner-border" 
            style={{ color: 'var(--primary)' }} 
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div 
          className="alert alert-danger" 
          style={{ 
            backgroundColor: 'var(--error)', 
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem'
          }} 
          role="alert"
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center mb-3">
              <div 
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: 'var(--primary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}
              >
                <span style={{ color: 'white', fontSize: '1.5rem' }}>📢</span>
              </div>
              <div>
                <h1 
                  className="h2 mb-1" 
                  style={{ color: 'var(--text-primary)' }}
                >
                  Announcements
                </h1>
                <p 
                  className="mb-0" 
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Stay updated with the latest news and updates
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="row">
          <div className="col-12">
            <div 
              className="card shadow-sm" 
              style={{ 
                border: 'none',
                borderRadius: '0.75rem'
              }}
            >
              <div 
                className="card-header py-3"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderTopLeftRadius: '0.75rem',
                  borderTopRightRadius: '0.75rem'
                }}
              >
                <h3 className="card-title mb-0">
                  <span style={{ marginRight: '0.5rem' }}>📋</span>
                  Existing Announcements ({announcements.length})
                </h3>
              </div>
              <div className="card-body p-0">
                {announcements.length === 0 ? (
                  <div 
                    className="text-center py-5"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <div 
                      style={{
                        fontSize: '3rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem'
                      }}
                    >
                      📭
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      No announcements available
                    </p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement._id}
                        className="list-group-item p-4"
                        style={{
                          border: 'none',
                          borderBottom: '1px solid var(--border-light)',
                          transition: 'all 0.3s ease',
                          borderLeft: '4px solid transparent',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                          e.currentTarget.style.borderLeftColor = 'var(--secondary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.borderLeftColor = 'transparent';
                        }}
                      >
                        <div className="row align-items-center">
                          {/* Date */}
                          <div className="col-md-2 mb-3 mb-md-0">
                            <div className="text-center">
                              <div 
                                style={{
                                  backgroundColor: 'var(--bg-secondary)',
                                  borderRadius: '0.5rem',
                                  padding: '0.5rem',
                                  border: '1px solid var(--border-light)'
                                }}
                              >
                                <div 
                                  style={{
                                    color: 'var(--primary)',
                                    fontWeight: 'bold',
                                    fontSize: '1.25rem'
                                  }}
                                >
                                  {new Date(announcement.dateAnnounced).getDate()}
                                </div>
                                <div 
                                  style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase'
                                  }}
                                >
                                  {new Date(announcement.dateAnnounced).toLocaleDateString('en-US', {
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="col-md-8 mb-3 mb-md-0">
                            <h5 
                              className="card-title mb-2"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {announcement.title}
                            </h5>
                            {announcement.description && (
                              <p 
                                className="card-text mb-2"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                {truncateDescription(announcement.description)}
                              </p>
                            )}
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                              {/* Type Badge */}
                              <span style={getTypeBadgeStyle(announcement.type)}>
                                {announcement.type}
                              </span>
                              
                              {/* Featured User */}
                              {announcement.featuredUser && (
                                <span 
                                  className="d-flex align-items-center"
                                  style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  <span style={{ marginRight: '0.25rem' }}>👤</span>
                                  Featured: {announcement.featuredUser?.name || announcement.featuredUser}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="col-md-2 text-md-end">
                            <button 
                              className="btn btn-sm"
                              style={{
                                border: '1px solid var(--primary)',
                                color: 'var(--primary)',
                                backgroundColor: 'transparent',
                                borderRadius: '0.375rem',
                                padding: '0.375rem 0.75rem'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'var(--primary)';
                                e.target.style.color = 'white';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = 'var(--primary)';
                              }}
                              onClick={() => handleViewClick(announcement)}
                            >
                              <span style={{ marginRight: '0.25rem' }}>👁️</span>
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {announcements.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div 
                className="card"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: 'none',
                  borderRadius: '0.75rem'
                }}
              >
                <div className="card-body py-3">
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div 
                        style={{
                          color: 'var(--primary)',
                          fontWeight: 'bold',
                          fontSize: '1.5rem'
                        }}
                      >
                        {announcements.length}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Total Announcements
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div 
                        style={{
                          color: 'var(--success)',
                          fontWeight: 'bold',
                          fontSize: '1.5rem'
                        }}
                      >
                        {announcements.filter(a => a.type?.toLowerCase() === 'important').length}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Important
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div 
                        style={{
                          color: 'var(--info)',
                          fontWeight: 'bold',
                          fontSize: '1.5rem'
                        }}
                      >
                        {announcements.filter(a => a.type?.toLowerCase() === 'update').length}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Updates
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div 
                        style={{
                          color: 'var(--warning)',
                          fontWeight: 'bold',
                          fontSize: '1.5rem'
                        }}
                      >
                        {announcements.filter(a => a.type?.toLowerCase() === 'event').length}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Events
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Full Announcement Details */}
      {showModal && selectedAnnouncement && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              {/* Modal Header */}
              <div 
                className="modal-header"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  borderBottom: 'none'
                }}
              >
                <h5 className="modal-title">
                  <span style={{ marginRight: '0.5rem' }}>📢</span>
                  Announcement Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                {/* Announcement Header */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <h3 style={{ color: 'var(--text-primary)' }}>
                      {selectedAnnouncement.title}
                    </h3>
                    <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                      <span style={getTypeBadgeStyle(selectedAnnouncement.type)}>
                        {selectedAnnouncement.type}
                      </span>
                      <span 
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.875rem'
                        }}
                      >
                        <i className="bi bi-calendar me-1"></i>
                        {new Date(selectedAnnouncement.dateAnnounced).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Featured User */}
                {selectedAnnouncement.featuredUser && (
                  <div 
                    className="mb-4 p-3 rounded"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderLeft: '4px solid var(--secondary)'
                    }}
                  >
                    <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      <span style={{ marginRight: '0.5rem' }}>⭐</span>
                      Featured User
                    </h6>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                      {selectedAnnouncement.featuredUser?.name || selectedAnnouncement.featuredUser}
                    </p>
                  </div>
                )}

                {/* Full Description */}
                <div className="mb-4">
                  <h6 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    Description
                  </h6>
                  <div 
                    style={{
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {selectedAnnouncement.description || 'No description provided.'}
                  </div>
                </div>

                {/* Additional Details */}
                <div className="row">
                  <div className="col-md-6">
                    <div 
                      className="p-3 rounded"
                      style={{
                        backgroundColor: 'var(--bg-secondary)'
                      }}
                    >
                      <h6 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        Announcement ID
                      </h6>
                      <p style={{ color: 'var(--text-secondary)', margin: 0, fontFamily: 'monospace' }}>
                        {selectedAnnouncement._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'white'
                  }}
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Announcement;