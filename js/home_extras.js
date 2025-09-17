(function(){
	// Only run on Home parent section
	const parentSection = document.getElementById('parent-section');
	if(!parentSection) return;

	// Screen preview
	const c = document.getElementById('homeScreenCanvas');
	const ctx = c ? c.getContext('2d') : null;
	let f = 0;
	function draw(){
		if(!ctx || !c) return;
		const w=c.width,h=c.height;
		ctx.fillStyle='#0b1220'; ctx.fillRect(0,0,w,h);
		ctx.fillStyle='#111827'; ctx.fillRect(0,0,w,36);
		ctx.fillStyle='#93c5fd'; ctx.font='16px sans-serif'; ctx.fillText('Child Device',12,24);
		for(let i=0;i<5;i++){
			ctx.fillStyle=`hsl(${(f*9+i*50)%360} 70% 40%)`;
			const x=16+(i%2)*(w/2-24); const y=52+Math.floor(i/2)*84+(Math.sin((f+i)/10)*6);
			ctx.fillRect(x,y,w/2-40,64);
		}
		ctx.fillStyle='#e5e7eb'; ctx.fillText(new Date().toLocaleTimeString(), w-150, 24);
		f++;
	}
	setInterval(draw, 2000); draw();

	// Live map
	if(window.L){
		const map = L.map('homeMap').setView([28.6139,77.2090], 12);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap' }).addTo(map);
		let lat=28.6139,lng=77.2090; const marker=L.marker([lat,lng]).addTo(map);
		setInterval(()=>{ lat+=(Math.random()-0.5)*0.0015; lng+=(Math.random()-0.5)*0.0015; marker.setLatLng([lat,lng]); map.panTo([lat,lng],{animate:true}); }, 3000);
	}

	// Usage chart
	const chartEl = document.getElementById('homeUsageChart');
	if(chartEl && window.Chart){
		const data=[
			{name:'YouTube',m:120},
			{name:'Roblox',m:95},
			{name:'Minecraft',m:80},
			{name:'Instagram',m:60},
			{name:'WhatsApp',m:45}
		];
		new Chart(chartEl,{ type:'bar', data:{ labels:data.map(d=>d.name), datasets:[{ label:'Minutes', data:data.map(d=>d.m), backgroundColor:data.map((_,i)=>`hsl(${i*40} 70% 50%)`) }] }, options:{ plugins:{legend:{display:false}}, scales:{ y:{ beginAtZero:true } } } });
	}
})();





