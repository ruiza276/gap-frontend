import React, { useState } from 'react';
import { apiService } from '../services/apiService';

const AITimelineSearch = ({ onResultsFound }) => {
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
            setResults(searchResults);

            // Optional: notify parent component of results
            if (onResultsFound) {
                onResultsFound(searchResults);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        handleSearch(suggestion);
    };

    return (
        <div className="ai-search-container" style={{
            background: 'linear-gradient(135deg, var(--tech-bg-card) 0%, var(--tech-bg-glass) 100%)',
            borderRadius: 'var(--tech-radius-xl)', // Larger radius
            padding: 'var(--tech-space-8)', // More padding
            marginBottom: 'var(--tech-space-6)',
            border: '2px solid var(--tech-border-accent)', // More prominent border
            boxShadow: 'var(--tech-shadow-xl)', // Bigger shadow
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
                <h2 style={{ // Changed from h3 to h2 for more prominence
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--tech-space-3)',
                    color: 'var(--tech-text-primary)',
                    fontSize: '1.5rem', // Larger
                    fontWeight: '700', // Bolder
                    margin: '0 0 var(--tech-space-2) 0',
                    textAlign: 'center',
                    justifyContent: 'center'
                }}>
                    🤖 Ask AI About My Journey
                </h2>
                <p style={{
                    color: 'var(--tech-text-secondary)',
                    fontSize: '1rem', // Slightly larger
                    margin: 0,
                    textAlign: 'center',
                    fontWeight: '500'
                }}>
                    Search my timeline using natural language - powered by OpenAI
                </p>
            </div>
            {/* Header */}
            <div style={{ marginBottom: 'var(--tech-space-4)' }}>
                <h3 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--tech-space-2)',
                    color: 'var(--tech-text-primary)',
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    margin: '0 0 var(--tech-space-2) 0'
                }}>
                    🤖 Ask AI About My Journey
                </h3>
                <p style={{
                    color: 'var(--tech-text-secondary)',
                    fontSize: '0.875rem',
                    margin: 0
                }}>
                    Search my timeline using natural language
                </p>
            </div>

            {/* Search Input */}
            <div style={{ marginBottom: 'var(--tech-space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--tech-space-3)' }}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'What React projects did he work on?'"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                        disabled={loading}
                        style={{
                            flex: 1,
                            padding: 'var(--tech-space-3)',
                            border: '2px solid var(--tech-border)',
                            borderRadius: 'var(--tech-radius-md)',
                            fontSize: '1rem',
                            background: 'var(--tech-bg-primary)'
                        }}
                    />
                    <button
                        onClick={() => handleSearch(query)}
                        disabled={loading || !query.trim()}
                        className="btn btn-primary"
                        style={{ minWidth: '100px' }}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Searching...
                            </>
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>
            </div>

            {/* Suggestions */}
            <div style={{ marginBottom: 'var(--tech-space-4)' }}>
                <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--tech-text-muted)',
                    marginBottom: 'var(--tech-space-2)'
                }}>
                    Try asking:
                </p>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--tech-space-2)'
                }}>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={loading}
                            style={{
                                padding: 'var(--tech-space-1) var(--tech-space-3)',
                                background: 'var(--tech-bg-tertiary)',
                                border: '1px solid var(--tech-border)',
                                borderRadius: 'var(--tech-radius-lg)',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all var(--tech-transition)',
                                color: 'var(--tech-text-secondary)'
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

                        {results.skills.length > 0 && (
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

                    {results.entries.length > 0 && (
                        <div>
                            <h4 style={{
                                color: 'var(--tech-text-primary)',
                                fontSize: '1.125rem',
                                fontWeight: '600',
                                marginBottom: 'var(--tech-space-3)'
                            }}>
                                📅 Timeline Matches ({results.entries.length})
                            </h4>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--tech-space-3)'
                            }}>
                                {results.entries.map(entry => (
                                    <div
                                        key={entry.id}
                                        style={{
                                            padding: 'var(--tech-space-4)',
                                            background: 'var(--tech-bg-primary)',
                                            border: '1px solid var(--tech-border)',
                                            borderRadius: 'var(--tech-radius-md)',
                                            cursor: 'pointer',
                                            transition: 'all var(--tech-transition)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.borderColor = 'var(--tech-primary)';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.borderColor = 'var(--tech-border)';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
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
                                            margin: '0 0 var(--tech-space-2) 0'
                                        }}>
                                            {entry.title}
                                        </h5>
                                        <p style={{
                                            color: 'var(--tech-text-secondary)',
                                            fontSize: '0.875rem',
                                            lineHeight: '1.5',
                                            margin: 0
                                        }}>
                                            {entry.description.substring(0, 150)}
                                            {entry.description.length > 150 ? '...' : ''}
                                        </p>
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