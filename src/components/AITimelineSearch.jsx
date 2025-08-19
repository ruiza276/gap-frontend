import React, { useState } from 'react';
import { apiService } from '../services/apiService';

const AITimelineSearch = ({ onResultsFound, onDateSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const suggestions = [
        "Bikes?",
        "Chicago",
        "Time Duncan?",
    ];

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const searchResults = await apiService.searchTimelineWithAI(searchQuery);
            console.log('🔍 AI Search Results:', searchResults);
            setResults(searchResults);

            if (onResultsFound) {
                onResultsFound(searchResults);
            }
        } catch (err) {
            console.error('❌ AI Search Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    };

    // Handle clicking on a search result - pass full entry data
    const handleResultClick = (entry) => {
        console.log('🎯 Search result clicked:', entry);
        
        if (!entry || !entry.date) {
            console.error('❌ Invalid entry data:', entry);
            return;
        }

        // Pass the full entry to the parent component
        if (onDateSelect) {
            console.log('📤 Passing entry to parent:', entry);
            onDateSelect(entry); // Pass the entire entry, not just the date
        }
        
        // Add visual feedback
        const resultElement = document.querySelector(`[data-entry-id="${entry.id}"]`);
        if (resultElement) {
            resultElement.classList.add('search-result-selected');
            setTimeout(() => {
                resultElement.classList.remove('search-result-selected');
            }, 600);
        }
        
        // Scroll to content area on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                const contentSection = document.querySelector('.content-section');
                if (contentSection) {
                    contentSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                }
            }, 100);
        }
    };

    return (
        <div className="ai-search-container" style={{
            background: 'linear-gradient(135deg, var(--tech-bg-card) 0%, var(--tech-bg-glass) 100%)',
            borderRadius: 'var(--tech-radius-xl)',
            padding: 'var(--tech-space-8)',
            marginBottom: 'var(--tech-space-6)',
            border: '2px solid var(--tech-border-accent)',
            boxShadow: 'var(--tech-shadow-xl)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, var(--tech-primary), var(--tech-accent), var(--tech-primary))',
                borderRadius: 'var(--tech-radius-xl) var(--tech-radius-xl) 0 0'
            }}></div>

            <div style={{ marginBottom: 'var(--tech-space-4)', position: 'relative', zIndex: 2 }}>
                <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--tech-space-3)',
                    color: 'var(--tech-text-primary)',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    margin: '0 0 var(--tech-space-2) 0',
                    textAlign: 'center',
                    justifyContent: 'center'
                }}>
                    🤖 Ask AI About My Journey
                </h2>
                <p style={{
                    color: 'var(--tech-text-secondary)',
                    fontSize: '1rem',
                    margin: 0,
                    textAlign: 'center',
                    fontWeight: '500'
                }}>
                    Search my timeline using natural language - powered by OpenAI
                </p>
            </div>

            {/* Search Input */}
            <div style={{ marginBottom: 'var(--tech-space-4)' }}>
                <div style={{
                    display: 'flex',
                    gap: 'var(--tech-space-2)',
                    flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
                }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What did Alex do in August 2024?"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: 'var(--tech-space-3)',
                            border: '2px solid var(--tech-border)',
                            borderRadius: 'var(--tech-radius-md)',
                            fontSize: window.innerWidth <= 768 ? '16px' : '1rem',
                            background: 'var(--tech-bg-primary)',
                            minHeight: '44px',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button
                        onClick={() => handleSearch(query)}
                        disabled={loading || !query.trim()}
                        className="btn btn-primary"
                        style={{
                            minWidth: window.innerWidth <= 480 ? '100%' : '100px',
                            minHeight: '44px',
                            fontSize: window.innerWidth <= 768 ? '0.875rem' : '1rem'
                        }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                {window.innerWidth <= 480 ? 'Searching...' : 'Search'}
                            </>
                        ) : (
                            window.innerWidth <= 480 ? 'Search Timeline' : 'Search'
                        )}
                    </button>
                </div>
            </div>

            {/* Suggestions */}
            <div style={{ marginBottom: 'var(--tech-space-4)' }}>
                <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--tech-text-muted)',
                    marginBottom: 'var(--tech-space-2)',
                    textAlign: window.innerWidth <= 480 ? 'center' : 'left'
                }}>
                    Try asking:
                </p>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--tech-space-2)',
                    justifyContent: window.innerWidth <= 480 ? 'center' : 'flex-start'
                }}>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={loading}
                            style={{
                                padding: window.innerWidth <= 480
                                    ? 'var(--tech-space-2) var(--tech-space-4)'
                                    : 'var(--tech-space-1) var(--tech-space-3)',
                                background: 'var(--tech-bg-tertiary)',
                                border: '1px solid var(--tech-border)',
                                borderRadius: 'var(--tech-radius-lg)',
                                fontSize: window.innerWidth <= 480 ? '0.875rem' : '0.75rem',
                                cursor: 'pointer',
                                transition: 'all var(--tech-transition)',
                                color: 'var(--tech-text-secondary)',
                                minHeight: '36px'
                            }}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="alert alert-error">
                    <div className="alert-icon">⚠</div>
                    <div>
                        <strong>Search Error</strong>
                        <p>{error}</p>
                        {process.env.NODE_ENV === 'development' && (
                            <details style={{ marginTop: '10px', fontSize: '0.75rem' }}>
                                <summary>Debug Info</summary>
                                <div>Check console for detailed error information</div>
                            </details>
                        )}
                    </div>
                </div>
            )}

            {/* Results */}
            {results && (
                <div style={{
                    borderTop: '1px solid var(--tech-border)',
                    paddingTop: 'var(--tech-space-4)'
                }}>
                    <div style={{ marginBottom: 'var(--tech-space-4)' }}>
                        <h4 style={{
                            color: 'var(--tech-text-primary)',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            marginBottom: 'var(--tech-space-2)'
                        }}>
                            🎯 AI Summary
                        </h4>
                        <p style={{
                            color: 'var(--tech-text-secondary)',
                            lineHeight: '1.6'
                        }}>
                            {results.summary}
                        </p>

                        {results.skills && results.skills.length > 0 && (
                            <div style={{ marginTop: 'var(--tech-space-3)' }}>
                                <strong style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--tech-text-secondary)'
                                }}>
                                    Skills Identified:
                                </strong>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 'var(--tech-space-2)',
                                    marginTop: 'var(--tech-space-1)'
                                }}>
                                    {results.skills.map(skill => (
                                        <span key={skill} className="tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {results.entries && results.entries.length > 0 && (
                        <div>
                            <h4 style={{
                                color: 'var(--tech-text-primary)',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                marginBottom: 'var(--tech-space-3)'
                            }}>
                                📅 Timeline Matches ({results.entries.length})
                                <span style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--tech-text-muted)',
                                    fontWeight: '400',
                                    marginLeft: 'var(--tech-space-2)',
                                    display: window.innerWidth <= 480 ? 'block' : 'inline'
                                }}>
                                    Click to view in content area →
                                </span>
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--tech-space-3)'
                            }}>
                                {results.entries.map(entry => (
                                    <div
                                        key={entry.id}
                                        data-entry-id={entry.id}
                                        onClick={() => handleResultClick(entry)}
                                        className="ai-search-result-card"
                                        style={{
                                            padding: 'var(--tech-space-4)',
                                            background: 'var(--tech-bg-primary)',
                                            border: '2px solid var(--tech-border)',
                                            borderRadius: 'var(--tech-radius-md)',
                                            cursor: 'pointer',
                                            transition: 'all var(--tech-transition)',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (window.innerWidth > 768) {
                                                e.currentTarget.style.borderColor = 'var(--tech-primary)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = 'var(--tech-shadow-lg)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (window.innerWidth > 768) {
                                                e.currentTarget.style.borderColor = 'var(--tech-border)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }
                                        }}
                                    >
                                        {/* Click indicator */}
                                        <div className="search-result-click-indicator" style={{
                                            position: 'absolute',
                                            top: 'var(--tech-space-3)',
                                            right: 'var(--tech-space-3)',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: 'var(--tech-primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            opacity: '0.7',
                                            transition: 'all var(--tech-transition)'
                                        }}>
                                            →
                                        </div>

                                        <div style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--tech-text-muted)',
                                            marginBottom: 'var(--tech-space-1)'
                                        }}>
                                            {new Date(entry.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <h5 style={{
                                            color: 'var(--tech-text-primary)',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            marginBottom: 'var(--tech-space-2)',
                                            margin: '0 0 var(--tech-space-2) 0',
                                            paddingRight: 'var(--tech-space-8)'
                                        }}>
                                            {entry.title}
                                        </h5>
                                        <p style={{
                                            color: 'var(--tech-text-secondary)',
                                            fontSize: '0.875rem',
                                            lineHeight: '1.5',
                                            margin: 0,
                                            paddingRight: 'var(--tech-space-8)'
                                        }}>
                                            {entry.description && entry.description.substring(0, 150)}
                                            {entry.description && entry.description.length > 150 ? '...' : ''}
                                        </p>
                                        
                                        {/* Enhanced hint */}
                                        <div className="search-result-hint" style={{
                                            marginTop: 'var(--tech-space-2)',
                                            fontSize: '0.75rem',
                                            color: 'var(--tech-primary)',
                                            fontWeight: '600',
                                            opacity: '0.8',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--tech-space-1)'
                                        }}>
                                            <span>👆</span>
                                            Click to view in content area
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AITimelineSearch;