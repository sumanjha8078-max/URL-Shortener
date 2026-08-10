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

  const showError = (message) => {
    errorText.textContent = message;
    errorContainer.classList.add('show');
    resultContainer.classList.remove('show');
  };

  const hideError = () => {
    errorContainer.classList.remove('show');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const originalUrl = urlInput.value.trim();
    if (!originalUrl) return;

    // Loading State
    submitBtn.disabled = true;
    submitText.textContent = 'Shortening...';
    loadingSpinner.classList.add('show');
    resultContainer.classList.remove('show');

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      // Success
      currentShortUrl = `http://sl/${data.shortCode}`;
      shortUrlLink.href = currentShortUrl;
      shortUrlLink.textContent = currentShortUrl;
      
      resultContainer.classList.add('show');
      urlInput.value = '';

    } catch (err) {
      showError(err.message);
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitText.textContent = 'Shorten URL';
      loadingSpinner.classList.remove('show');
    }
  });

  copyBtn.addEventListener('click', async () => {
    if (!currentShortUrl) return;

    try {
      await navigator.clipboard.writeText(currentShortUrl);
      
      // UX Feedback
      const originalText = copyText.textContent;
      copyText.textContent = 'Copied!';
      copyBtn.classList.add('success');
      
      setTimeout(() => {
        copyText.textContent = originalText;
        copyBtn.classList.remove('success');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      showError('Failed to copy to clipboard.');
    }
  });
});
