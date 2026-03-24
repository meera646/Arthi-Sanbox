const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;
const GHL_API_KEY = process.env.GHL_API_KEY; 

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// 1. ROUTE TO GET EMAIL COUNT FOR YOUR DASHBOARD
app.get('/api/email-stats', async (req, res) => {
    try {
        const response = await axios.get('https://services.leadconnectorhq.com/emails/schedule', {
            params: { 
                locationId: 'location/vkYbMbFSNqqb0o9GbAc0', // Get this from GHL Settings
                showStats: true 
            },
            headers: {
                'Authorization': `Bearer ${GHL_API_KEY}`,
                'Version': '2021-07-28'
            }
        });

        // Sum up the 'deliveredCount' from all your email campaigns
        const totalSent = response.data.emails.reduce((sum, email) => sum + (email.deliveredCount || 0), 0);
        
        res.status(200).json({ emailCount: totalSent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not fetch email stats" });
    }
});

// 2. YOUR OLD SUBMIT ROUTE (Keep this if you still have a contact form)
app.post('/api/submit', async (req, res) => {
    // ... (Your existing contact form code stays here)
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

module.exports = app;
