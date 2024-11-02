const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());


app.get('/api/ideas', async (req, res) => {
   
    const page = parseInt(req.query['page[number]']) || 1; 
    const size = parseInt(req.query['page[size]']) || 10; 
    const append = req.query.append || 'small_image,medium_image'; 
    const sort = req.query.sort || '-published_at'; 

    try {
        
        const apiUrl = `https://suitmedia-backend.suitdev.com/api/ideas?page[number]=${page}&page[size]=${size}&append[]=small_image&append[]=medium_image&sort=${sort}`;

        
        const response = await axios.get(apiUrl, {
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json', 
            },
        });

        
        res.json(response.data);
    } catch (error) {
        
        console.error('Error fetching data from API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch data from API', details: error.response ? error.response.data : error.message });
    }
});


app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});
