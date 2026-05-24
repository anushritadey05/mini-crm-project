import React, { useState, useEffect } from 'react';
import * as leadAPI from '../api';
import './Analytics.css';

const Analytics = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalValue: 0,
    conversionRate: 0,
    averageValue: 0,
    avgHandlingTime: 0,
    projectedRevenue: 0,
    expectedConversions: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await leadAPI.getLeads();
      setLeads(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const calculateStats = (allLeads) => {
    const totalLeads = allLeads.length;
    const totalValue = allLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const convertedLeads = allLeads.filter((l) => l.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;
    const averageValue = totalLeads > 0 ? (totalValue / totalLeads).toFixed(0) : 0;

    // Avg Handling Time (days between creation and now)
    const avgHandlingTime =
      totalLeads > 0
        ? (
            allLeads.reduce((sum, lead) => {
              const days = Math.floor(
                (new Date() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24)
              );
              return sum + days;
            }, 0) / totalLeads
          ).toFixed(1)
        : 0;

    // Projected Revenue (next 30 days) - leads in negotiating stage
    const negotiatingLeads = allLeads.filter((l) => l.status === 'negotiating');
    const projectedRevenue = negotiatingLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);

    // Expected Conversions (based on current conversion rate)
    const expectedConversions = Math.ceil((projectedRevenue / averageValue) * (conversionRate / 100));

    setStats({
      totalLeads,
      totalValue,
      conversionRate,
      averageValue,
      avgHandlingTime,
      projectedRevenue,
      expectedConversions,
    });
  };

  // Source Distribution
  const sourceData = () => {
    const sources = {};
    leads.forEach((lead) => {
      sources[lead.source] = (sources[lead.source] || 0) + 1;
    });
    return Object.entries(sources)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  // Status Distribution
  const statusData = () => {
    const statuses = {};
    leads.forEach((lead) => {
      statuses[lead.status] = (statuses[lead.status] || 0) + 1;
    });
    return statuses;
  };

  // Team Performance (simulated)
  const getTeamPerformance = () => {
    return [
      {
        name: 'Your Team',
        totalDeals: stats.totalLeads,
        conversions: leads.filter((l) => l.status === 'converted').length,
        totalRevenue: leads.filter((l) => l.status === 'converted').reduce((sum, l) => sum + (l.value || 0), 0),
      },
    ];
  };

  // Monthly Performance
  const getMonthlyData = () => {
    const monthlyStats = {};
    leads.forEach((lead) => {
      const month = new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;
    });
    return Object.entries(monthlyStats).slice(-6);
  };

  // Top Valued Leads
  const topLeads = leads.sort((a, b) => (b.value || 0) - (a.value || 0)).slice(0, 5);

  // Search Analytics (most searched)
  const searchAnalytics = () => {
    const companies = {};
    leads.forEach((lead) => {
      if (lead.company) {
        companies[lead.company] = (companies[lead.company] || 0) + 1;
      }
    });
    return Object.entries(companies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const statusColors = {
    new: '#00d4ff',
    contacted: '#ffa502',
    qualified: '#29cc39',
    negotiating: '#9b59b6',
    converted: '#1abc9c',
    lost: '#e74c3c',
  };

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">📊 Advanced Analytics & Reports</h2>

      {/* Main KPI Cards */}
      <div className="kpi-section">
        <div className="kpi-card">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <h4>Total Pipeline Value</h4>
            <p className="kpi-value">${stats.totalValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <h4>Conversion Rate</h4>
            <p className="kpi-value">{stats.conversionRate}%</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">💵</div>
          <div className="kpi-content">
            <h4>Average Deal Value</h4>
            <p className="kpi-value">${stats.averageValue}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">🎯</div>
          <div className="kpi-content">
            <h4>Total Leads</h4>
            <p className="kpi-value">{stats.totalLeads}</p>
          </div>
        </div>
      </div>

      {/* Forecasting Section */}
      <div className="forecast-section">
        <h3 className="section-title">🔮 30-Day Forecast</h3>
        <div className="forecast-cards">
          <div className="forecast-card primary">
            <div className="forecast-icon">💸</div>
            <div className="forecast-content">
              <h4>Projected Revenue</h4>
              <p className="forecast-value">${stats.projectedRevenue.toLocaleString()}</p>
              <span className="forecast-subtitle">From negotiating deals</span>
            </div>
          </div>

          <div className="forecast-card success">
            <div className="forecast-icon">✅</div>
            <div className="forecast-content">
              <h4>Expected Conversions</h4>
              <p className="forecast-value">{stats.expectedConversions}</p>
              <span className="forecast-subtitle">Deals likely to close</span>
            </div>
          </div>

          <div className="forecast-card info">
            <div className="forecast-icon">⏱️</div>
            <div className="forecast-content">
              <h4>Avg Handling Time</h4>
              <p className="forecast-value">{stats.avgHandlingTime} days</p>
              <span className="forecast-subtitle">Per lead</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Status Distribution */}
        <div className="chart-card">
          <h3>📊 Lead Status Distribution</h3>
          <div className="status-bars">
            {Object.entries(statusData()).map(([status, count]) => (
              <div key={status} className="status-bar-item">
                <div className="status-bar-label">
                  <span className="status-name">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  <span className="status-bar-count">{count}</span>
                </div>
                <div className="status-bar-container">
                  <div
                    className="status-bar-fill"
                    style={{
                      width: `${stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0}%`,
                      backgroundColor: statusColors[status],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Distribution */}
        <div className="chart-card">
          <h3>🔗 Lead Source Breakdown</h3>
          <div className="source-list">
            {sourceData().map(([source, count]) => (
              <div key={source} className="source-item">
                <div className="source-info">
                  <span className="source-name">
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </span>
                  <span className="source-percentage">
                    {stats.totalLeads > 0 ? ((count / stats.totalLeads) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="source-bar">
                  <div
                    className="source-bar-fill"
                    style={{
                      width: `${stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="team-section">
        <h3 className="section-title">👥 Team Performance</h3>
        <div className="team-cards">
          {getTeamPerformance().map((team, index) => (
            <div key={index} className="team-card">
              <div className="team-header">
                <h4>{team.name}</h4>
                <span className="team-badge">Active</span>
              </div>
              <div className="team-stats">
                <div className="team-stat">
                  <span className="team-stat-label">Total Deals</span>
                  <span className="team-stat-value">{team.totalDeals}</span>
                </div>
                <div className="team-stat">
                  <span className="team-stat-label">Conversions</span>
                  <span className="team-stat-value converted">{team.conversions}</span>
                </div>
                <div className="team-stat">
                  <span className="team-stat-label">Revenue</span>
                  <span className="team-stat-value revenue">${team.totalRevenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="team-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${team.totalDeals > 0 ? (team.conversions / team.totalDeals) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="progress-text">
                  {team.totalDeals > 0 ? ((team.conversions / team.totalDeals) * 100).toFixed(1) : 0}% Win Rate
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="chart-card full-width">
        <h3>📅 Monthly Lead Trend</h3>
        <div className="monthly-chart">
          {getMonthlyData().length > 0 ? (
            getMonthlyData().map(([month, count], index) => (
              <div key={index} className="month-bar">
                <div className="month-bar-container">
                  <div
                    className="month-bar-fill"
                    style={{
                      height: `${count * 20}px`,
                    }}
                  />
                </div>
                <span className="month-label">{month}</span>
                <span className="month-count">{count}</span>
              </div>
            ))
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>
      </div>

      {/* Search Analytics */}
      <div className="chart-card">
        <h3>🔍 Top Companies by Frequency</h3>
        <div className="search-analytics">
          {searchAnalytics().length > 0 ? (
            searchAnalytics().map(([company, count], index) => (
              <div key={index} className="search-item">
                <div className="search-rank">{index + 1}</div>
                <div className="search-info">
                  <span className="search-company">{company}</span>
                  <span className="search-count">{count} leads</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No company data available</p>
          )}
        </div>
      </div>

      {/* Top Valued Leads */}
      <div className="chart-card full-width">
        <h3>🏆 Top 5 Valued Leads</h3>
        <div className="top-leads-table">
          {topLeads.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Lead Name</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Deal Value</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {topLeads.map((lead, index) => (
                  <tr key={lead._id} className={`rank-${index + 1}`}>
                    <td>
                      <span className="rank-badge">{index + 1}</span>
                    </td>
                    <td className="lead-name-cell">{lead.name}</td>
                    <td>{lead.company || '-'}</td>
                    <td>
                      <span
                        className="status-badge-small"
                        style={{ backgroundColor: statusColors[lead.status] }}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="value-cell">${lead.value || 0}</td>
                    <td className="date-cell">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No leads yet</p>
          )}
        </div>
      </div>

      {/* Export Section */}
      <div className="export-section">
        <button className="export-btn primary" onClick={() => exportToCSV()}>
          📥 Export to CSV
        </button>
        <button className="export-btn secondary" onClick={() => window.print()}>
          🖨️ Print Report
        </button>
        <button className="export-btn tertiary" onClick={() => emailReport()}>
          📧 Email Report
        </button>
      </div>
    </div>
  );
};

const exportToCSV = () => {
  alert('📥 CSV Export Feature - Coming Soon!\n\nYou can share this feature in your presentation!');
};

const emailReport = () => {
  alert('📧 Email Report Feature - Coming Soon!\n\nAutomatic report generation & email capability!');
};

export default Analytics;