const form = document.querySelector('form');
const fileUpload = document.getElementById('fileUpload');
const checkbox = document.getElementById('enablePassword');
const passwordInput = document.getElementById('passwordInput');
const btns = document.getElementById('btnsubmit');
const al1 = document.getElementById('alert1');
const al2 = document.getElementById('alert2');
function validateDocx(file) {
    return file.arrayBuffer() // Read the file as an ArrayBuffer
        .then((arrayBuffer) => JSZip.loadAsync(arrayBuffer)) // Load it as a ZIP file
        .then((zip) => {
            // Check for required .docx file structure
            if (!zip.files['[Content_Types].xml']) {
                throw new Error('Invalid .docx file structure');
            }
            // Return true if validation passes
            return true;
        })
        .catch((error) => {
            // Return false if the file is invalid or corrupted
            console.error(error);
            return false;
        });
}


fileUpload.addEventListener('change', async function () {
    const file = this.files[0];
    const metadataDiv = document.getElementById('fileMetadata');
    if (!file) {
        al1.textContent = '';
        al2.textContent = '';
        metadataDiv.value = '';
        this.value = '';// Clear metadata if no file is selected
        return;
    }
    if (file && !file.name.endsWith('.docx')) {
        al1.textContent = '';
        al2.textContent = '';
        metadataDiv.value = '';
        this.value = '';
        alert('Please upload only .docx files');
        return;
    }
    const fileSizeInKB = (file.size / 1024).toFixed(2); // File size in KB
    const lastModified = new Date(file.lastModified).toLocaleString(); // Last modified date
    if (fileSizeInKB > 10100) {
        al1.textContent = '';
        al2.textContent = '';
        this.value = '';
        metadataDiv.value = '';
        alert('file exceed the permitted size of 10MB');
        return;
    }
    metadataDiv.value = `
File Name: ${file.name}
File Size: ${fileSizeInKB} KB
Last Modified: ${lastModified}
`.trim();

    validateDocx(file).then((isValid) => {
        if (!isValid) {
            this.value = ''; // Clear the file input
            metadataDiv.value = '';
            al1.textContent = '';
            al2.textContent = '';
            alert('The uploaded .docx file is corrupted or invalid. Please upload a valid file.');
            return;
        } else {
            al1.textContent = ('File is valid and ready for upload.');
        }
    });
});

checkbox.addEventListener('change', function () {
    passwordInput.disabled = !this.checked;
    if (!this.checked) {
        passwordInput.value = '';
    }
});

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    btns.disabled = true;
    btns.textContent = 'Processing...';
    if (!fileUpload.files[0]) {
        metadataDiv.value = '';
        al1.textContent = '';
        al2.textContent = '';
        btns.disabled = false;
        btns.textContent = 'Convert to PDF';
        alert('Please select a file to convert');
        return;
    }

    if (checkbox.checked && (!passwordInput.value || passwordInput.value.length < 6)) {
        al2.textContent = '';
        btns.disabled = false;
        btns.textContent = 'Convert to PDF';
        alert('Please enter a password with at least 6 characters');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileUpload.files[0]);
    al2.textContent = ('Please wait, Download for your converted file will begin shortly.')
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
        form.reset();
        passwordInput.disabled = true;
        btns.disabled = false;
        btns.textContent = 'Convert to PDF';
        al1.textContent = '';
        al2.textContent = '';

    } catch (error) {
        alert('Error converting file: ' + error.message);
    }
    finally{
        al1.textContent = '';
        al2.textContent = '';
        form.reset();
    }
});
