const form = document.querySelector('form');
const fileUpload = document.getElementById('fileUpload');
const checkbox = document.getElementById('enablePassword');
const passwordInput = document.getElementById('passwordInput');

fileUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file && !file.name.endsWith('.docx')) {
        alert('Please upload only .docx files');
        this.value = '';
    }
});

checkbox.addEventListener('change', function() {
    passwordInput.disabled = !this.checked;
    if (!this.checked) {
        passwordInput.value = '';
    }
});

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!fileUpload.files[0]) {
        alert('Please select a file to convert');
        return;
    }
    
    if (checkbox.checked && (!passwordInput.value || passwordInput.value.length < 6)) {
        alert('Please enter a password with at least 6 characters');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileUpload.files[0]);
    if (checkbox.checked) {
        formData.append('password', passwordInput.value); // Appending password here
    }
    try {
        const response = await fetch('/convert', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Conversion failed');
        }

        // Create a blob from the PDF file
        const blob = await response.blob();
        
        // Create a download link and trigger it
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'converted.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
    } catch (error) {
        alert('Error converting file: ' + error.message);
    }
});
