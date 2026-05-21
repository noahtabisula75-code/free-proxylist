import express from 'express';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

const app = express();

// Use JSON middleware
app.use(express.json());

// Proxy API route
app.get('/api/proxies', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      sort_by = 'lastChecked', 
      sort_type = 'desc',
      protocols = '',
      anonymityLevel = '',
      country = ''
    } = req.query;
    
    let url = `https://proxylist.geonode.com/api/proxy-list?page=${page}&limit=${limit}&sort_by=${sort_by}&sort_type=${sort_type}`;
    
    if (protocols) url += `&protocols=${protocols}`;
    if (anonymityLevel) url += `&anonymityLevel=${anonymityLevel}`;
    if (country) url += `&country=${country}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch from geonode: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching proxies:', error);
    res.status(500).json({ error: 'Failed to fetch proxies' });
  }
});

// Raw plain text endpoint
app.get('/api/proxies/raw', async (req, res) => {
  try {
    const { limit = 500, protocols = '' } = req.query;
    let url = `https://proxylist.geonode.com/api/proxy-list?limit=${limit}&sort_by=lastChecked&sort_type=desc`;
    if (protocols) {
      url += `&protocols=${protocols}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    
    const data = await response.json();
    const rawList = data.data.map((p: any) => `${p.ip}:${p.port}`).join('\n');
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(rawList);
  } catch (error) {
    console.error('Error fetching raw proxies:', error);
    res.status(500).send('Error fetching proxy list');
  }
});

// Proxy Checker endpoint
app.post('/api/check-proxy', async (req, res) => {
  try {
    const { proxy, protocol, website } = req.body;
    
    if (!proxy || !protocol || !website) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const proxyUrl = `${protocol.toLowerCase()}://${proxy}`;
    let httpsAgent;

    if (protocol.toLowerCase().startsWith('socks')) {
      httpsAgent = new SocksProxyAgent(proxyUrl);
    } else {
      httpsAgent = new HttpsProxyAgent(proxyUrl);
    }

    const startTime = Date.now();
    
    const response = await axios.get(website, {
      httpsAgent,
      timeout: 10000,
      validateStatus: () => true
    });

    const latency = Date.now() - startTime;

    res.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      latency,
    });

  } catch (error: any) {
    res.json({
      success: false,
      error: error.message || 'Connection failed'
    });
  }
});

export default app;
