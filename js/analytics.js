(function(){
	const ctx = document.getElementById('usageChart');
	if(!ctx || !window.Chart) return;
	const usage = [
		{ name: 'YouTube', minutes: 120 },
		{ name: 'Roblox', minutes: 95 },
		{ name: 'Minecraft', minutes: 80 },
		{ name: 'Instagram', minutes: 60 },
		{ name: 'WhatsApp', minutes: 45 },
		{ name: 'Browser', minutes: 30 }
	];
	usage.sort((a,b)=>b.minutes-a.minutes);
	new Chart(ctx, {
		type: 'bar',
		data: {
			labels: usage.map(u=>u.name),
			datasets: [{
				label: 'Minutes',
				data: usage.map(u=>u.minutes),
				backgroundColor: usage.map((_,i)=>`hsl(${i*40} 70% 50%)`)
			}]
		},
		options: {
			plugins: { legend: { display: false } },
			scales: { y: { beginAtZero: true, title: { display: true, text: 'Minutes' } } }
		}
	});
})();



