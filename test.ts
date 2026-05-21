fetch('http://0.0.0.0:3000/api/proxies').then(res => res.json()).then(data => console.log(data.data.length));
