document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shorten-form');
  const urlInput = document.getElementById('url');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const loadingSpinner = document.getElementById('loading-spinner');
  
  const errorContainer = document.getElementById('error-container');
  const errorText = document.getElementById('error-text');
  
  const resultContainer = document.getElementById('result-container');
  const shortUrlLink = document.getElementById('short-url-link');
  const copyBtn = document.getElementById('copy-btn');
  const copyText = document.getElementById('copy-text');

  let currentShortUrl = '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Reset state
    errorContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    submitText.textContent = 'Shortening...';
    loadingSpinner.classList.remove('hidden');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalUrl: urlInput.value.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      // Success
      currentShortUrl = `http://sl/${data.shortCode}`;
      shortUrlLink.href = currentShortUrl;
      shortUrlLink.textContent = currentShortUrl;
      
      form.reset();
      resultContainer.classList.remove('hidden');
      
    } catch (err) {
      errorText.textContent = err.message;
      errorContainer.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      submitText.textContent = 'Shorten URL';
      loadingSpinner.classList.add('hidden');
    }
  });

  copyBtn.addEventListener('click', async () => {
    if (!currentShortUrl) return;

    try {
      await navigator.clipboard.writeText(currentShortUrl);
      
      // UX Feedback
      const originalText = copyText.textContent;
      copyText.textContent = 'Copied!';
      copyBtn.classList.add('bg-green-600', 'text-white', 'border-green-500', 'hover:bg-green-500', 'hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]');
      copyBtn.classList.remove('text-brand-400', 'bg-brand-950/30', 'border-brand-500/50', 'hover:bg-brand-500', 'hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]');
      
      setTimeout(() => {
        copyText.textContent = originalText;
        copyBtn.classList.remove('bg-green-600', 'text-white', 'border-green-500', 'hover:bg-green-500', 'hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]');
        copyBtn.classList.add('text-brand-400', 'bg-brand-950/30', 'border-brand-500/50', 'hover:bg-brand-500', 'hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback or alert if needed
    }
  });
});
