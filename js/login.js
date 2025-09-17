(function(){
	// Tab switching
	const tabs = document.querySelectorAll('.tab-btn');
	const loginTab = document.getElementById('login-tab');
	const registerTab = document.getElementById('register-tab');
	tabs.forEach(btn=>{
		btn.addEventListener('click', ()=>{
			tabs.forEach(b=>b.classList.remove('active'));
			btn.classList.add('active');
			if(btn.dataset.tab==='login'){ loginTab.style.display=''; registerTab.style.display='none'; }
			else { loginTab.style.display='none'; registerTab.style.display=''; }
		});
	});

	function getSelectedRole(){
		const r = document.querySelector('input[name="role"]:checked');
		return r ? r.value : 'parent';
	}
	function showMessage(id, msg, isErr){ const el=document.getElementById(id); if(!el) return; el.textContent=msg; el.style.color=isErr?'#b91c1c':'#2563eb'; }

	// Login
	const loginForm = document.getElementById('loginForm');
	if(loginForm){
		loginForm.addEventListener('submit', (e)=>{
			e.preventDefault();
			const data = new FormData(loginForm);
			const email = String(data.get('email')||'').trim();
			const password = String(data.get('password')||'');
			if(!email || !password){ return showMessage('loginMsg','Please enter email and password', true); }
			localStorage.setItem('isAuthenticated','true');
			localStorage.setItem('userEmail', email);
			localStorage.setItem('userRole', getSelectedRole());
			showMessage('loginMsg','Signed in! Redirecting...');
			setTimeout(()=> location.href = 'home.html', 400);
		});
	}

	// Register
	const registerForm = document.getElementById('registerForm');
	if(registerForm){
		registerForm.addEventListener('submit', (e)=>{
			e.preventDefault();
			const data = new FormData(registerForm);
			const fullName = String(data.get('fullName')||'').trim();
			const email = String(data.get('email')||'').trim();
			const password = String(data.get('password')||'');
			const confirmPassword = String(data.get('confirmPassword')||'');
			const phone = String(data.get('phone')||'').trim();
			const age = Number(data.get('age')||0);
			const gender = String(data.get('gender')||'');
			const terms = !!data.get('terms');
			if(!fullName || !email || !password){ return showMessage('registerMsg','Please fill all required fields', true); }
			if(password !== confirmPassword){ return showMessage('registerMsg','Passwords do not match', true); }
			if(!terms){ return showMessage('registerMsg','Please accept Terms & Privacy', true); }
			// Persist minimal profile locally for demo
			localStorage.setItem('isAuthenticated','true');
			localStorage.setItem('userEmail', email);
			localStorage.setItem('userRole', getSelectedRole());
			localStorage.setItem('profile_fullName', fullName);
			localStorage.setItem('profile_phone', phone);
			localStorage.setItem('profile_age', String(age));
			localStorage.setItem('profile_gender', gender);
			showMessage('registerMsg','Account created! Redirecting...');
			setTimeout(()=> location.href = 'home.html', 500);
		});
	}
})();





