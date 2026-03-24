document.addEventListener('DOMContentLoaded', () => {
    // Basic navigation interaction for sidebar
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const views = document.querySelectorAll('.view-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Allow default behavior for items without a specific view like Settings/Sign Out if needed later.
            // For now they are all dead links "#"
            
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add to clicked
            item.classList.add('active');
            
            // Check if there is a target view
            const targetId = item.getAttribute('data-target');
            if (targetId) {
                // Hide all views
                views.forEach(view => {
                    view.style.display = 'none';
                });
                
                // Show target view
                const targetView = document.getElementById(targetId);
                if (targetView) {
                    targetView.style.display = 'block';
                }
            }
        });
    });

    // Handle generic toggle buttons outside of sidebar
    const targetButtons = document.querySelectorAll('[data-target]:not(.nav-item)');
    
    targetButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            if (targetId) {
                // Hide all views
                views.forEach(view => {
                    view.style.display = 'none';
                });
                
                // Show target view
                const targetView = document.getElementById(targetId);
                if (targetView) {
                    targetView.style.display = 'block';
                }
                
                // Keep sidebar state updated visually
                if (targetId === 'create-campaign-view') {
                    navItems.forEach(nav => nav.classList.remove('active'));
                    const campaignsNav = document.querySelector('.sidebar-nav .nav-item[data-target="campaigns-view"]');
                    if (campaignsNav) campaignsNav.classList.add('active');
                }
            }
        });
    });

    // File upload logic for campaign view
    const uploadZone = document.getElementById('upload-zone-area');
    const fileInput = document.getElementById('csv-upload');
    const createBtn = document.getElementById('create-campaign-btn');

    if (uploadZone && fileInput && createBtn) {
        uploadZone.addEventListener('click', () => {
            fileInput.click();
        });

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#2563eb';
            uploadZone.style.backgroundColor = '#eff6ff';
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#cbd5e1';
            uploadZone.style.backgroundColor = '#ffffff';
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.style.borderColor = '#cbd5e1';
            uploadZone.style.backgroundColor = '#ffffff';
            
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect();
            }
        });

        fileInput.addEventListener('change', handleFileSelect);

        function handleFileSelect() {
            if (fileInput.files && fileInput.files.length > 0) {
                const fileName = fileInput.files[0].name;
                uploadZone.querySelector('h5').textContent = fileName;
                uploadZone.querySelector('p').textContent = 'File attached ready for upload.';
                
                // Change icon
                const iconWrapper = uploadZone.querySelector('.upload-icon-wrapper i');
                if (iconWrapper) {
                    iconWrapper.setAttribute('data-lucide', 'file-check');
                    if (window.lucide) window.lucide.createIcons();
                }

                // Enable button
                createBtn.removeAttribute('disabled');
            }
        }
    }

    // Explorer Items Logic
    const explorerItems = document.querySelectorAll('.explorer-item');
    const middleEmpty = document.querySelector('.middle-empty');
    const accountsPanel = document.getElementById('accounts-panel');
    const accountsListContent = document.getElementById('accounts-list-content');
    const accountsCount = document.getElementById('accounts-count');

    const campaignsData = {
        'SunBridge Auto Loans': [],
        'Metro Finance Spring': [
            { name: 'Patricia Lane', id: 'MF-220001', campaign: 'Metro Finance', date: 'Mar 15', status: 'in progress', statusClass: 'badge-purple' },
            { name: 'Derek Thompson', id: 'MF-220002', campaign: 'Metro Finance', date: 'Mar 15', status: 'reached', statusClass: 'badge-blue' },
            { name: 'Susan Carter', id: 'MF-220003', campaign: 'Metro Finance', date: 'Mar 15', status: 'escalated', statusClass: 'badge-red' },
            { name: 'Michael Brown', id: 'MF-220004', campaign: 'Metro Finance', date: 'Mar 15', status: 'pending', statusClass: 'badge-gray' }
        ],
        'Ace Cash Q1 Recovery': [
            { name: 'John Doe', id: 'ACE-121212', campaign: 'Ace Cash', date: 'Mar 8', status: 'reached', statusClass: 'badge-blue' },
            { name: 'Maria Santos', id: 'ACE-131313', campaign: 'Ace Cash', date: 'Mar 8', status: 'unable to reach', statusClass: 'badge-yellow' },
            { name: 'Robert Kim', id: 'ACE-141414', campaign: 'Ace Cash', date: 'Mar 8', status: 'escalated', statusClass: 'badge-red' },
            { name: 'Linda Reyes', id: 'ACE-151515', campaign: 'Ace Cash', date: 'Mar 8', status: 'resolved', statusClass: 'badge-green' },
            { name: 'James Wu', id: 'ACE-161516', campaign: 'Ace Cash', date: 'Mar 8', status: 'reached', statusClass: 'badge-blue' }
        ]
    };

    if (explorerItems.length > 0) {
        explorerItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all
                explorerItems.forEach(i => i.classList.remove('active'));
                // Add to clicked
                item.classList.add('active');
                
                // Get campaign name
                const campaignName = item.querySelector('.item-name').textContent.trim();
                const data = campaignsData[campaignName] || [];
                
                // Update UI
                if (middleEmpty) middleEmpty.style.display = 'none';
                if (accountsPanel) {
                    accountsPanel.style.display = 'flex';
                    accountsCount.textContent = data.length;
                }
                
                // Render list
                if (accountsListContent) {
                    accountsListContent.innerHTML = '';
                    if (data.length === 0) {
                        accountsListContent.innerHTML = '<div class="no-accounts">No accounts found.</div>';
                    } else {
                        data.forEach(acc => {
                            const html = `
                                <div class="account-item">
                                    <div class="account-icon">
                                        <i data-lucide="user"></i>
                                    </div>
                                    <div class="account-details">
                                        <div class="account-name-row">
                                            <span class="account-name">${acc.name}</span>
                                            <span class="account-badge ${acc.statusClass}">${acc.status}</span>
                                        </div>
                                        <div class="account-meta">${acc.id}</div>
                                        <div class="account-meta">${acc.campaign}</div>
                                        <div class="account-meta">Last contact: ${acc.date}</div>
                                    </div>
                                </div>
                            `;
                            accountsListContent.insertAdjacentHTML('beforeend', html);
                        });
                        if (window.lucide) window.lucide.createIcons();
                    }
                }
            });
        });
    }

    // Escalation Toggles Logic
    const escalationToggles = document.querySelectorAll('#escalation-toggles .toggle-btn');
    if (escalationToggles.length > 0) {
        escalationToggles.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all
                escalationToggles.forEach(t => t.classList.remove('active'));
                // Add active to clicked
                btn.classList.add('active');
                
                // Hide all lists
                document.getElementById('open-tasks-list').style.display = 'none';
                document.getElementById('resolved-tasks-list').style.display = 'none';
                
                // Show target list
                const targetId = btn.getAttribute('data-target-list');
                if (targetId) {
                    document.getElementById(targetId).style.display = 'flex';
                }
            });
        });
    }

    // Resolve Form Interactions
    const taskCardsForAction = document.querySelectorAll('.task-card');
    taskCardsForAction.forEach(card => {
        const resolveBtn = card.querySelector('.resolve-btn');
        const resolveForm = card.querySelector('.resolve-form');
        const cancelBtn = card.querySelector('.cancel-resolve-btn');
        
        if (resolveBtn && resolveForm && cancelBtn) {
            resolveBtn.addEventListener('click', () => {
                resolveBtn.style.display = 'none';
                resolveForm.style.display = 'flex';
            });
            
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                resolveForm.style.display = 'none';
                resolveBtn.style.display = 'block';
            });
        }
    });

    getEmailCount();
});

// The new function to fetch GHL data from your Vercel API
async function getEmailCount() {
    try {
        // Calling your new Vercel Serverless Function here
        const response = await fetch('/api'); 
        const data = await response.json();
        
        // Update the HTML element with the count
        const emailDisplay = document.getElementById('email-count');
        
        // This check prevents an error if the ID isn't found in your HTML
        if (emailDisplay) {
            emailDisplay.innerText = data.count || "0";
        }
    } catch (error) {
        console.error("Error fetching email stats:", error);
    }
}
async function loadDashboardStats() {
    try {
        const response = await fetch('/api/email-stats');
        const data = await response.json();
        
        // Find the HTML element where the "1,610" number is
        // and update it with the real data from GHL
        document.getElementById('email-count-display').innerText = data.emailCount.toLocaleString();
    } catch (err) {
        console.error("Error loading stats:", err);
    }
}

// Run this when the page opens
window.onload = loadDashboardStats;
  
