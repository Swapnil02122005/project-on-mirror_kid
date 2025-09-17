(function(){
	// Simulate a changing screen preview by drawing random UI blocks and text
	const canvas = document.getElementById('screenCanvas');
	const ctx = canvas ? canvas.getContext('2d') : null;
	let frame = 0;
	function drawScreen(){
		if(!ctx || !canvas) return;
		const w = canvas.width, h = canvas.height;
		ctx.fillStyle = '#0b1220';
		ctx.fillRect(0,0,w,h);
		// App bar
		ctx.fillStyle = '#111827';
		ctx.fillRect(0,0,w,36);
		ctx.fillStyle = '#93c5fd';
		ctx.font = '16px sans-serif';
		ctx.fillText('Child Device', 12, 24);
		// Random cards
		for(let i=0;i<5;i++){
			ctx.fillStyle = `hsl(${(frame*7+i*60)%360} 70% 35%)`;
			const x = 16 + (i%2)*(w/2 - 24);
			const y = 52 + Math.floor(i/2)*84 + (Math.sin((frame+i)/10)*6);
			ctx.fillRect(x, y, w/2 - 40, 64);
		}
		ctx.fillStyle = '#e5e7eb';
		ctx.fillText(`Now: ${new Date().toLocaleTimeString()}`, w-180, 24);
		frame++;
	}
	setInterval(drawScreen, 2000);
	drawScreen();

	// Live map using Leaflet with simulated movement
	const mapEl = document.getElementById('map');
	if(mapEl && window.L){
		const map = L.map('map').setView([28.6139, 77.2090], 12);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; OpenStreetMap'
		}).addTo(map);
		let lat = 28.6139, lng = 77.2090;
		const marker = L.marker([lat,lng]).addTo(map);
		function move(){
			lat += (Math.random()-0.5) * 0.0015;
			lng += (Math.random()-0.5) * 0.0015;
			marker.setLatLng([lat,lng]);
			map.panTo([lat,lng], { animate: true });
		}
		setInterval(move, 3000);
	}
})();



