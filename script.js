const btn = document.querySelector('.btn-primary');

if (btn) {
    btn.addEventListener('click', function (e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '120px';
        ripple.style.height = '120px';
        ripple.style.marginTop = '-60px';
        ripple.style.marginLeft = '-60px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

document.querySelectorAll('.protected-email').forEach(el => {
    const decoded = atob(el.getAttribute('data-addr'));
    el.innerHTML = `<a href="mailto:${decoded}" style="color: inherit; text-decoration: none; font-weight: inherit;">${decoded}</a>`;
});

const emailInput = document.querySelector('.input-field');
const submitBtn = document.querySelector('.email-capture .btn-primary');

if (submitBtn && emailInput) {
    submitBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            const originalPlaceholder = emailInput.placeholder;
            emailInput.value = '';
            emailInput.placeholder = 'Please enter a valid email';
            emailInput.style.boxShadow = '0 0 0 2px #ff4444';
            
            setTimeout(() => { 
                emailInput.placeholder = originalPlaceholder;
                emailInput.style.boxShadow = '';
            }, 2000);
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.pointerEvents = 'none';

        try {
            const apiEndpoint = 'https://discordwebhooksbeta.ampixel.net'; 
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
            });

            if (response.ok) {
                submitBtn.textContent = 'Subscribed!';
                submitBtn.style.backgroundColor = '#b7e4c7';
                submitBtn.style.color = '#1b4332';
                emailInput.value = '';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.pointerEvents = 'auto';
                }, 3000);
            } else {
                throw new Error('Webhook failed');
            }
        } catch (error) {
            console.error('Error:', error);
            submitBtn.textContent = 'Error';
            submitBtn.style.backgroundColor = '#ffb3b3';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
                submitBtn.style.pointerEvents = 'auto';
            }, 3000);
        }
    });
}
