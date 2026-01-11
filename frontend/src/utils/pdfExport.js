// PDF Export Utility for CSME Move Planner
// Uses browser's print functionality as a simple PDF export solution

export const exportPlanToPDF = (plan, homeCountry, targetCountry, category, checklistState, isAuthenticated = false) => {
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  
  // Get current date for the document
  const currentDate = new Date().toLocaleDateString();
  
  // Calculate completed items
  const completedCount = plan?.checklist ? 
    plan.checklist.filter(item => checklistState[item.id]).length : 0;
  
  // Generate HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>CSME Move Plan - ${targetCountry}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .header {
          text-align: center;
          border-bottom: 3px solid #0d7377;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #0d7377;
          margin: 0;
          font-size: 28px;
        }
        
        .header .subtitle {
          font-size: 16px;
          color: #666;
          margin-top: 10px;
        }
        
        .move-details {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .move-details h2 {
          color: #0d7377;
          margin-top: 0;
        }
        
        .move-details .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .move-details .detail-item {
          background: white;
          padding: 10px;
          border-radius: 4px;
        }
        
        .move-details .detail-item strong {
          color: #0d7377;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section h2 {
          color: #0d7377;
          border-bottom: 2px solid #0d7377;
          padding-bottom: 10px;
        }
        
        .checklist {
          list-style: none;
          padding: 0;
        }
        
        .checklist li {
          padding: 10px;
          margin-bottom: 10px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        
        .checklist .checklist-item {
          display: flex;
          align-items: flex-start;
        }
        
        .checklist .checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid #0d7377;
          border-radius: 3px;
          margin-right: 15px;
          flex-shrink: 0;
          position: relative;
        }
        
        .checklist .checkbox.checked::after {
          content: '✓';
          position: absolute;
          top: -2px;
          left: 2px;
          color: #0d7377;
          font-weight: bold;
          font-size: 16px;
        }
        
        .checklist .item-content h4 {
          margin: 0 0 5px 0;
          color: #333;
        }
        
        .checklist .item-content p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .timeline {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }
        
        .timeline ul {
          list-style: none;
          padding: 0;
        }
        
        .timeline li {
          padding: 10px 0;
          border-bottom: 1px solid #ddd;
        }
        
        .timeline li:last-child {
          border-bottom: none;
        }
        
        .timeline strong {
          color: #0d7377;
        }
        
        .notes {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .notes h3 {
          color: #856404;
          margin-top: 0;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        
        .progress-summary {
          background: #d4edda;
          border: 1px solid #c3e6cb;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .progress-summary h3 {
          color: #155724;
          margin-top: 0;
        }
        
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CSME Move Plan</h1>
        <div class="subtitle">
          Caribbean Single Market and Economy<br>
          Free Movement of Skills
        </div>
        <div class="subtitle">
          Generated on ${currentDate}
        </div>
      </div>
      
      <div class="move-details">
        <h2>Move Details</h2>
        <div class="detail-grid">
          <div class="detail-item">
            <strong>Moving From:</strong><br>
            ${getCountryLabel(homeCountry)}
          </div>
          <div class="detail-item">
            <strong>Moving To:</strong><br>
            ${getCountryLabel(targetCountry)}
          </div>
          <div class="detail-item">
            <strong>Professional Category:</strong><br>
            ${getCategoryLabel(category)}
          </div>
          <div class="detail-item">
            <strong>Status:</strong><br>
            ${isAuthenticated ? 'Registered User' : 'Guest User'}
          </div>
        </div>
      </div>
      
      <div class="progress-summary">
        <h3>Progress Summary</h3>
        <p>You have completed <strong>${completedCount} of ${plan?.checklist?.length || 0}</strong> checklist items.</p>
        <p><strong>Progress: ${Math.round((completedCount / (plan?.checklist?.length || 1)) * 100)}%</strong></p>
      </div>
      
      <div class="section">
        <h2>Overview</h2>
        <p>${plan?.summary || 'This is your personalized CSME move plan.'}</p>
      </div>
      
      <div class="section">
        <h2>Document Checklist</h2>
        <p>Please complete the following requirements. Check off items as you complete them.</p>
        <ul class="checklist">
          ${plan?.checklist?.map(item => `
            <li>
              <div class="checklist-item">
                <div class="checkbox ${checklistState[item.id] ? 'checked' : ''}"></div>
                <div class="item-content">
                  <h4>${item.label}</h4>
                  <p>${item.description || ''}</p>
                </div>
              </div>
            </li>
          `).join('') || '<li>No checklist items available.</li>'}
        </ul>
      </div>
      
      <div class="section">
        <h2>Estimated Timeline</h2>
        <div class="timeline">
          <ul>
            ${plan?.timeline?.documents ? `
              <li><strong>Gather documents:</strong> ${plan.timeline.documents}</li>
            ` : ''}
            ${plan?.timeline?.skillsCertificate ? `
              <li><strong>Apply for Skills Certificate:</strong> ${plan.timeline.skillsCertificate}</li>
            ` : ''}
            ${plan?.timeline?.verification ? `
              <li><strong>Verification in host country:</strong> ${plan.timeline.verification}</li>
            ` : ''}
            ${!plan?.timeline?.documents && !plan?.timeline?.skillsCertificate && !plan?.timeline?.verification ? `
              <li>Timeline details will be added as coverage expands.</li>
            ` : ''}
          </ul>
        </div>
      </div>
      
      <div class="section">
        <h2>Important Notes</h2>
        <div class="notes">
          <h3>⚠️ Please Read</h3>
          <p>${plan?.notes || 'Always verify requirements with the official immigration and competent authority websites for both your home and destination countries, as procedures and documents can change.'}</p>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>CARICOM Single Market and Economy (CSME)</strong></p>
        <p>This document was generated by the Inter Regional Movement Planner.</p>
        <p>For the most up-to-date information, please consult official government sources.</p>
        <p>Generated on ${currentDate}</p>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="
          background: #0d7377;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        ">Print / Save as PDF</button>
      </div>
      
      <script>
        // Auto-print when page loads
        window.onload = function() {
          // Uncomment the line below if you want auto-print
          // window.print();
        };
      </script>
    </body>
    </html>
  `;
  
  // Write the HTML content to the new window
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// Helper function to get country label
const getCountryLabel = (code) => {
  const countries = {
    'TT': 'Trinidad and Tobago',
    'BB': 'Barbados',
    'JM': 'Jamaica',
    'GY': 'Guyana',
    'LC': 'Saint Lucia',
    'GD': 'Grenada',
    'DM': 'Dominica',
    'VC': 'St. Vincent and the Grenadines',
    'KN': 'St. Kitts and Nevis',
    'AG': 'Antigua and Barbuda',
    'SR': 'Suriname',
    'BZ': 'Belize'
  };
  return countries[code] || code;
};

// Helper function to get category label
const getCategoryLabel = (id) => {
  const categories = {
    'university_graduate': 'University Graduate',
    'artiste': 'Artiste',
    'musician': 'Musician',
    'media_worker': 'Media Worker',
    'sportsperson': 'Sportsperson',
    'nurse': 'Nurse',
    'teacher': 'Teacher',
    'artisan': 'Artisan',
    'associate_degree': 'Holder of Associate Degree',
    'domestic_worker': 'Domestic Worker',
    'agricultural_worker': 'Agricultural Worker',
    'private_security_officer': 'Private Security Officer'
  };
  return categories[id] || id;
};