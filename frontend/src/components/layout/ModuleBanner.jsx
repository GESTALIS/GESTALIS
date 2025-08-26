import React from 'react';

export default function ModuleBanner({ 
  icon = "", 
  title, 
  description, 
  className = "",
  children 
}) {
  const bannerStyle = {
    borderRadius: '16px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #1B275A, #06B6D4)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div className={`module-banner ${className}`} style={bannerStyle}>
      <div className="module-icon" style={{ fontSize: '1.8rem' }}>{icon}</div>
      <div>
        <div className="module-title" style={{ fontWeight: 700, fontSize: '1.5rem' }}>{title}</div>
        {description && (
          <div className="module-description" style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '4px' }}>{description}</div>
        )}
      </div>
      {children && (
        <div className="ml-auto">
          {children}
        </div>
      )}
    </div>
  );
}

export const AchatsBanner = ({ description, children }) => {
  const achatsStyle = {
    borderRadius: '16px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #1B275A, #06B6D4)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div className="module-banner achats-banner" style={achatsStyle}>
      <div className="module-icon" style={{ fontSize: '1.8rem' }}>��</div>
      <div>
        <div className="module-title" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Module Achats</div>
        {description && (
          <div className="module-description" style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '4px' }}>{description}</div>
        )}
      </div>
      {children && (
        <div className="ml-auto">
          {children}
        </div>
      )}
    </div>
  );
};

export const DashboardBanner = ({ description, children }) => {
  const dashboardStyle = {
    borderRadius: '16px',
    padding: '20px 24px',
    background: 'linear-gradient(135deg, #1B275A, #06B6D4)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div className="dashboard-banner" style={dashboardStyle}>
      <div className="module-icon" style={{ fontSize: '1.8rem' }}>📊</div>
      <div>
        <div className="module-title" style={{ fontWeight: 700, fontSize: '1.5rem' }}>Tableau de Bord</div>
        {description && (
          <div className="module-description" style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '4px' }}>{description}</div>
        )}
      </div>
      {children && (
        <div className="ml-auto">
          {children}
        </div>
      )}
    </div>
  );
};
