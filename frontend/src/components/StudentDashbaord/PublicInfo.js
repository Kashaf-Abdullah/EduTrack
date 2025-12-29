// import React, { useEffect, useState, useContext } from 'react';
// import { getPublicInfo } from '../api/publicInfoApi';


// const PublicInfo = () => {
//     const [publicInfos, setPublicInfos] = useState([]);
//     useEffect(()=>{
//         const fetchPublicInfos = async () => {
//             const data = await getPublicInfo();
//         setPublicInfos(data);
//         }
//         fetchPublicInfos();
//         })
//   return (
//     <div>
//       <ul>
//         {
//             publicInfos.map((info) => (
        

//     <li key={info._id}>
//     {info.title} - {info.content}
//     </li>
//             ))
//         }
//       </ul>
//     </div>
//   )
// }

// export default PublicInfo

import React, { useEffect, useState } from 'react';
import { getPublicInfo } from '../api/publicInfoApi';

const PublicInfo = () => {
    const [publicInfos, setPublicInfos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPublicInfos = async () => {
            try {
                setLoading(true);
                const data = await getPublicInfo();
                setPublicInfos(data);
            } catch (err) {
                setError('Failed to fetch public information');
                console.error('Error fetching public info:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicInfos();
    }, []); // Added empty dependency array

    const handleViewClick = (info) => {
        setSelectedInfo(info);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedInfo(null);
    };

    // Function to get category badge style
    const getCategoryBadgeStyle = (category) => {
        const baseStyle = {
            fontSize: '0.75rem',
            fontWeight: '600',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.375rem'
        };

        switch (category?.toLowerCase()) {
            case 'news':
                return { ...baseStyle, backgroundColor: 'var(--primary)', color: 'white' };
            case 'notice':
                return { ...baseStyle, backgroundColor: 'var(--warning)', color: 'var(--text-primary)' };
            case 'alert':
                return { ...baseStyle, backgroundColor: 'var(--error)', color: 'white' };
            case 'update':
                return { ...baseStyle, backgroundColor: 'var(--info)', color: 'white' };
            case 'event':
                return { ...baseStyle, backgroundColor: 'var(--success)', color: 'white' };
            default:
                return { ...baseStyle, backgroundColor: 'var(--secondary)', color: 'white' };
        }
    };

    // Function to truncate content for list view
    const truncateContent = (content, wordCount = 8) => {
        if (!content) return '';
        const words = content.split(' ');
        if (words.length <= wordCount) return content;
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
                                    backgroundColor: 'var(--accent-1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '1rem'
                                }}
                            >
                                <span style={{ color: 'white', fontSize: '1.5rem' }}>📰</span>
                            </div>
                            <div>
                                <h1 
                                    className="h2 mb-1" 
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    Public Information
                                </h1>
                                <p 
                                    className="mb-0" 
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Important updates and announcements for everyone
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Public Info Cards Grid */}
                <div className="row">
                    {publicInfos.length === 0 ? (
                        <div className="col-12">
                            <div 
                                className="text-center py-5"
                                style={{ 
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderRadius: '0.75rem'
                                }}
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
                                <h5 style={{ color: 'var(--text-secondary)' }}>
                                    No Public Information Available
                                </h5>
                                <p style={{ color: 'var(--text-secondary)' }}>
                                    Check back later for updates and announcements
                                </p>
                            </div>
                        </div>
                    ) : (
                        publicInfos.map((info) => (
                            <div key={info._id} className="col-lg-4 col-md-6 mb-4">
                                <div 
                                    className="card h-100 shadow-sm"
                                    style={{
                                        border: 'none',
                                        borderRadius: '0.75rem',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                    }}
                                    onClick={() => handleViewClick(info)}
                                >
                                    {/* Card Header with Category */}
                                    <div 
                                        className="card-header border-0"
                                        style={{
                                            backgroundColor: 'transparent',
                                            padding: '1rem 1rem 0.5rem 1rem'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span style={getCategoryBadgeStyle(info.category)}>
                                                {info.category || 'General'}
                                            </span>
                                            {info.isImportant && (
                                                <span 
                                                    style={{
                                                        color: 'var(--error)',
                                                        fontSize: '1.2rem'
                                                    }}
                                                    title="Important"
                                                >
                                                    ⚡
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="card-body">
                                        <h5 
                                            className="card-title"
                                            style={{ 
                                                color: 'var(--text-primary)',
                                                marginBottom: '0.75rem'
                                            }}
                                        >
                                            {info.title}
                                        </h5>
                                        <p 
                                            className="card-text"
                                            style={{ 
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.9rem',
                                                lineHeight: '1.5'
                                            }}
                                        >
                                            {truncateContent(info.content)}
                                        </p>
                                    </div>

                                    {/* Card Footer */}
                                    <div 
                                        className="card-footer border-0"
                                        style={{
                                            backgroundColor: 'transparent',
                                            padding: '0.75rem 1rem 1rem 1rem'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small 
                                                style={{ color: 'var(--text-secondary)' }}
                                            >
                                                {info.date ? new Date(info.date).toLocaleDateString() : 'No date'}
                                            </small>
                                            <button 
                                                className="btn btn-sm"
                                                style={{
                                                    border: '1px solid var(--accent-1)',
                                                    color: 'var(--accent-1)',
                                                    backgroundColor: 'transparent',
                                                    borderRadius: '0.375rem',
                                                    padding: '0.25rem 0.75rem',
                                                    fontSize: '0.8rem'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = 'var(--accent-1)';
                                                    e.target.style.color = 'white';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.color = 'var(--accent-1)';
                                                }}
                                            >
                                                Read More
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Quick Stats */}
                {publicInfos.length > 0 && (
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
                                                {publicInfos.length}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                Total Items
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
                                                {publicInfos.filter(info => info.category?.toLowerCase() === 'notice').length}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                Notices
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div 
                                                style={{
                                                    color: 'var(--error)',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.5rem'
                                                }}
                                            >
                                                {publicInfos.filter(info => info.category?.toLowerCase() === 'alert').length}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                Alerts
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
                                                {publicInfos.filter(info => info.isImportant).length}
                                            </div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                Important
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal for Full Public Info Details */}
            {showModal && selectedInfo && (
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
                                    backgroundColor: 'var(--accent-1)',
                                    color: 'white',
                                    borderBottom: 'none'
                                }}
                            >
                                <h5 className="modal-title">
                                    <span style={{ marginRight: '0.5rem' }}>📰</span>
                                    Public Information Details
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>

                            {/* Modal Body */}
                            <div className="modal-body">
                                {/* Info Header */}
                                <div className="row mb-4">
                                    <div className="col-md-8">
                                        <h3 style={{ color: 'var(--text-primary)' }}>
                                            {selectedInfo.title}
                                        </h3>
                                        <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                                            <span style={getCategoryBadgeStyle(selectedInfo.category)}>
                                                {selectedInfo.category || 'General'}
                                            </span>
                                            {selectedInfo.isImportant && (
                                                <span 
                                                    style={{
                                                        backgroundColor: 'var(--error)',
                                                        color: 'white',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '0.375rem',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    ⚡ Important
                                                </span>
                                            )}
                                            {selectedInfo.date && (
                                                <span 
                                                    style={{
                                                        color: 'var(--text-secondary)',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    <span style={{ marginRight: '0.25rem' }}>📅</span>
                                                    {new Date(selectedInfo.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Full Content */}
                                <div className="mb-4">
                                    <h6 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
                                        Content
                                    </h6>
                                    <div 
                                        style={{
                                            color: 'var(--text-secondary)',
                                            lineHeight: '1.6',
                                            whiteSpace: 'pre-line',
                                            backgroundColor: 'var(--bg-secondary)',
                                            padding: '1rem',
                                            borderRadius: '0.5rem'
                                        }}
                                    >
                                        {selectedInfo.content || 'No content provided.'}
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
                                                Information ID
                                            </h6>
                                            <p style={{ color: 'var(--text-secondary)', margin: 0, fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                {selectedInfo._id}
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
                                        backgroundColor: 'var(--accent-1)',
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

export default PublicInfo;