(function () {
	const isProtected = document.body.dataset.protected === 'true';
	const currentPath = location.pathname.split('/').pop() || 'index.html';

	// Nav active state
	document.querySelectorAll('.nav-links a').forEach((a) => {
		if (a.getAttribute('href') === currentPath) a.classList.add('active');
	});

	// Simple auth state using localStorage
	const auth = {
		get isAuthenticated() { return localStorage.getItem('isAuthenticated') === 'true'; },
		get userEmail() { return localStorage.getItem('userEmail') || ''; },
		get userRole() { return localStorage.getItem('userRole') || 'parent'; },
		login(email, role) { localStorage.setItem('isAuthenticated', 'true'); localStorage.setItem('userEmail', email); localStorage.setItem('userRole', role); },
		logout() { localStorage.removeItem('isAuthenticated'); localStorage.removeItem('userEmail'); localStorage.removeItem('userRole'); localStorage.removeItem('pairedCode'); localStorage.removeItem('pairedChild'); }
	};

	// If already logged in and on login page, go to home
	if (!isProtected && currentPath === 'index.html' && auth.isAuthenticated) {
		location.href = 'home.html';
		return;
	}

	if (isProtected && !auth.isAuthenticated) {
		location.href = 'index.html';
		return;
	}

	// Hide protected links if logged out (index only has login link)
	if (!auth.isAuthenticated) {
		const nav = document.querySelector('.nav-links');
		if (nav && currentPath !== 'index.html') {
			nav.innerHTML = '<a href="index.html" class="active">Login</a>';
		}
	}

	function showMessage(targetId, message, type = 'ok') {
		const el = document.getElementById(targetId);
		if (!el) return;
		el.textContent = message;
		el.style.color = type === 'ok' ? '#2563eb' : '#b91c1c';
		el.style.display = message ? 'block' : 'none';
	}

	// PROFILE
	const profileName = document.getElementById('profileName');
	if (profileName) profileName.textContent = auth.userEmail || 'User';
	const profileRole = document.getElementById('profileRole');
	if (profileRole) profileRole.textContent = auth.userRole.charAt(0).toUpperCase() + auth.userRole.slice(1);
	const logoutBtn = document.getElementById('logoutBtn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', () => { auth.logout(); location.href = 'index.html'; });
	}

	const profileChild = document.getElementById('profileChild');
	const profilePairCode = document.getElementById('profilePairCode');
	const profileUsage = document.getElementById('profileUsage');
	if (profileChild) profileChild.textContent = localStorage.getItem('pairedChild') || 'None';
	if (profilePairCode) profilePairCode.textContent = localStorage.getItem('pairedCode') || '-';
	if (profileUsage) {
		const usage = [ { app: 'YouTube', time: '45m' }, { app: 'Chat', time: '30m' }, { app: 'Browser', time: '25m' } ];
		profileUsage.innerHTML = usage.map(u => `<tr><td>${u.app}</td><td>${u.time}</td></tr>`).join('');
	}

	// HOME (Parent/Child)
	const parentSection = document.getElementById('parent-section');
	const childSection = document.getElementById('child-section');
	if (parentSection && childSection) {
		if (auth.userRole === 'parent') {
			parentSection.style.display = '';
			childSection.style.display = 'none';

			// Multi-children management
			const defaultAvatars = [
				'https://api.dicebear.com/7.x/thumbs/svg?seed=Alex',
				'https://api.dicebear.com/7.x/thumbs/svg?seed=Sam',
				'https://api.dicebear.com/7.x/thumbs/svg?seed=Riley',
				'https://api.dicebear.com/7.x/thumbs/svg?seed=Jordan'
			];
			function getChildren(){
				try{ return JSON.parse(localStorage.getItem('children')||'[]'); }catch{ return []; }
			}
			function setChildren(list){ localStorage.setItem('children', JSON.stringify(list)); }
			function renderChildren(){
				const container = document.getElementById('childList');
				if(!container) return;
				const children = getChildren();
				if(children.length===0){ container.innerHTML = '<p class="muted">No children added. Add one to begin.</p>'; return; }
				const activeId = localStorage.getItem('activeChildId');
				container.innerHTML = children.map(c=>
					`<div class="child-card ${String(c.id)===activeId?'active':''}" data-id="${c.id}">
						<img src="${c.avatar}" alt="${c.name}"/>
						<div>
							<div style="font-weight:700;">${c.name}</div>
							<div class="muted" style="font-size:12px;">Code: ${c.code||'-'}</div>
						</div>
					</div>`
				).join('');
				container.querySelectorAll('.child-card').forEach(card=>{
					card.addEventListener('click',()=>{
						localStorage.setItem('activeChildId', String(card.dataset.id));
						updateConnectionLabel();
						updateStatsAndTables();
						renderChildren();
					});
				});
			}
			const addChildBtn = document.getElementById('addChildBtn');
			if(addChildBtn){
				addChildBtn.addEventListener('click', ()=>{
					const name = String(document.getElementById('newChildName').value||'').trim();
					if(!name) return;
					const children = getChildren();
					const id = Date.now();
					children.push({ id, name, avatar: defaultAvatars[children.length%defaultAvatars.length], code: (localStorage.getItem('pairedCode')||'') });
					setChildren(children);
					localStorage.setItem('activeChildId', String(id));
					document.getElementById('newChildName').value = '';
					renderChildren();
					updateConnectionLabel();
					updateStatsAndTables();
				});
			}

			// Pair by code
			const pairForm = document.getElementById('pairForm');
			if (pairForm) {
				pairForm.addEventListener('submit', (e) => {
					e.preventDefault();
					const code = String(document.getElementById('pairCodeInput').value || '').trim();
					if (!code) return showMessage('pairMsg', 'Enter pairing code', 'err');
					localStorage.setItem('pairedCode', code);
					localStorage.setItem('pairedChild', 'Child Device');
					showMessage('pairMsg', 'Devices paired successfully!', 'ok');
					updateConnectionLabel();
					updateStatsAndTables();
				});
			}

			// Camera + jsQR
			const video = document.getElementById('qrVideo');
			const canvas = document.getElementById('qrCanvas');
			const ctx = canvas ? canvas.getContext('2d') : null;
			const startScan = document.getElementById('startScan');
			const stopScan = document.getElementById('stopScan');
			let mediaStream; let scanHandle;
			const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';

			async function requestCamera() {
				if (!isSecure) { showMessage('scanMsg', 'Camera requires HTTPS or localhost', 'err'); return; }
				try {
					mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
					if (video) video.srcObject = mediaStream;
					showMessage('scanMsg', 'Scanner started. Point camera at child QR.', 'ok');
					scanHandle = requestAnimationFrame(scanLoop);
				} catch { showMessage('scanMsg', 'Camera access denied or unavailable', 'err'); }
			}

			function stopCamera() {
				if (mediaStream) mediaStream.getTracks().forEach(t => t.stop());
				mediaStream = null; if (video) video.srcObject = null; if (scanHandle) cancelAnimationFrame(scanHandle);
			}

			function scanLoop() {
				if (!canvas || !ctx || !video) return;
				const w = canvas.width, h = canvas.height;
				ctx.drawImage(video, 0, 0, w, h);
				const imgData = ctx.getImageData(0, 0, w, h);
				if (window.jsQR) {
					const code = jsQR(imgData.data, w, h);
					if (code && code.data) {
						localStorage.setItem('pairedCode', code.data);
						localStorage.setItem('pairedChild', 'Child Device');
						showMessage('scanMsg', `Paired via QR: ${code.data}`, 'ok');
						updateConnectionLabel(); updateStatsAndTables();
						stopCamera();
						return;
					}
				}
				scanHandle = requestAnimationFrame(scanLoop);
			}

			if (startScan && stopScan && video) {
				startScan.addEventListener('click', requestCamera);
				stopScan.addEventListener('click', () => { stopCamera(); showMessage('scanMsg', 'Scanner stopped', 'ok'); });
				setTimeout(() => requestCamera(), 300);
			}

			// Mock data: activity log and usage analytics
			const activityLog = document.getElementById('activityLog');
			const usageTable = document.getElementById('usageTable');
			const statScreenTime = document.getElementById('statScreenTime');
			const statActivities = document.getElementById('statActivities');
			const statTopApp = document.getElementById('statTopApp');

			function updateStatsAndTables() {
				const demo = [ { time: '09:00', activity: 'App opened' }, { time: '09:05', activity: 'YouTube - 5m' }, { time: '09:12', activity: 'Chat App - 7m' }, { time: '09:20', activity: 'Browser - 10m' } ];
				if (activityLog) activityLog.innerHTML = demo.map(a => `<tr><td>${a.time}</td><td>${a.activity}</td></tr>`).join('');
				const usage = [ { app: 'YouTube', time: 45 }, { app: 'Chat', time: 30 }, { app: 'Browser', time: 25 }, { app: 'Games', time: 15 } ];
				if (usageTable) usageTable.innerHTML = usage.map(u => `<tr><td>${u.app}</td><td>${u.time}m</td></tr>`).join('');
				if (statScreenTime) statScreenTime.textContent = `${usage.reduce((a,b)=>a+b.time,0)}m`;
				if (statActivities) statActivities.textContent = String(demo.length);
				if (statTopApp) statTopApp.textContent = usage.sort((a,b)=>b.time-a.time)[0].app;
				const badge = document.getElementById('childStatusBadge');
				if(badge){
					const statuses = [ { cls: 'success', text: 'Online' }, { cls: 'muted', text: 'Idle' } ];
					const pick = statuses[Date.now()%2];
					badge.className = `badge ${pick.cls}`;
					badge.textContent = pick.text;
				}
			}

			// Disconnect
			const disconnectBtn = document.getElementById('disconnectBtn');
			if (disconnectBtn) {
				disconnectBtn.addEventListener('click', () => {
					localStorage.removeItem('pairedCode');
					localStorage.removeItem('pairedChild');
					updateConnectionLabel();
					if (activityLog) activityLog.innerHTML = '';
					if (usageTable) usageTable.innerHTML = '';
					if (statScreenTime) statScreenTime.textContent = '0m';
					if (statActivities) statActivities.textContent = '0';
					if (statTopApp) statTopApp.textContent = '-';
					showMessage('pairMsg', 'Disconnected from child', 'ok');
				});
			}

			function updateConnectionLabel() {
				const label = document.getElementById('connectedChildLabel');
				const children = getChildren();
				const activeId = localStorage.getItem('activeChildId');
				const active = children.find(c=>String(c.id)===activeId);
				if(active){
					label.textContent = `Active child: ${active.name} (code ${active.code||localStorage.getItem('pairedCode')||'-'})`;
				}else{
					const fallback = localStorage.getItem('pairedChild');
					label.textContent = fallback ? `Connected to: ${fallback} (code ${localStorage.getItem('pairedCode') || '-'})` : 'No child connected.';
				}
			}
			updateConnectionLabel();
			updateStatsAndTables();
			renderChildren();

		} else {
			parentSection.style.display = 'none';
			childSection.style.display = '';

			// Generate pairing code and QR "like" canvas (simple squares grid)
			const code = generateCode();
			localStorage.setItem('childPairCode', code);
			const codeText = document.getElementById('childCodeText');
			if (codeText) codeText.textContent = `Code: ${code}`;
			const qrContainer = document.getElementById('childQr');
			if (qrContainer && window.QRCode) {
				qrContainer.innerHTML = '';
				new QRCode(qrContainer, { text: code, width: 220, height: 220, colorDark: "#111827", colorLight: "#ffffff" });
			}

			document.getElementById('watchingParent').textContent = localStorage.getItem('parentName') || 'Parent';
			const childActivityList = document.getElementById('childActivityList');
			if (childActivityList) {
				const demo = [ 'App opened at 09:00', 'Visited YouTube at 09:05', 'Chat App at 09:12', 'Browser at 09:20' ];
				childActivityList.innerHTML = demo.map(a => `<li>${a}</li>`).join('');
			}
		}
	}

	function generateCode() {
		const part = () => Math.random().toString(36).toUpperCase().slice(2, 5);
		return `${part()}-${part()}-${part()}`;
	}
})();

