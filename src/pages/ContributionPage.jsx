import React from 'react';

const ContributionPage = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Contribution Page</h2>
      
      {/* Bootstrap Tabs */}
      <ul className="nav nav-tabs" id="contributionTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="me-tab"
            data-bs-toggle="tab"
            data-bs-target="#me"
            type="button"
            role="tab"
            aria-controls="me"
            aria-selected="true"
          >
            Me
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="community-tab"
            data-bs-toggle="tab"
            data-bs-target="#community"
            type="button"
            role="tab"
            aria-controls="community"
            aria-selected="false"
          >
            Community
          </button>
        </li>
      </ul>

      <div className="tab-content" id="contributionTabsContent">
        {/* Me Tab Content */}
        <div
          className="tab-pane fade show active"
          id="me"
          role="tabpanel"
          aria-labelledby="me-tab"
        >
          <div className="p-3">
            <h4>Your Contributions</h4>
            <p>Review or update your contributions here.</p>
          </div>
        </div>

        {/* Community Tab Content */}
        <div
          className="tab-pane fade"
          id="community"
          role="tabpanel"
          aria-labelledby="community-tab"
        >
          <div className="p-3">
            <h4>Community Contributions</h4>
            <p>Explore contributions from the community here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionPage;
