# Word2PDF
## Web App Documentation: DOCX to PDF Converter with Encryption
### Overview
This web application provides a service to convert .docx files into .pdf format. Users have the option to apply encryption to the converted PDF file for enhanced security. The app leverages LibreOffice for converting DOCX files to PDF and qpdf for encrypting the PDF files.

### Key Features
- Convert .docx to .pdf: Converts Microsoft Word documents to PDF format.
- Encrypt PDFs: Allows users to encrypt PDF files using a password.
- Security: Supports password encryption using qpdf.

### Technologies Used
- Node.js: Server-side JavaScript framework for building the web application.
- Express.js: Web framework for Node.js to handle HTTP requests.
- LibreOffice: Used for converting .docx to .pdf.
- qpdf: Command-line tool used to encrypt PDF files.
- Multer: Middleware for handling file uploads in Express.

### App Workflow
- User Uploads DOCX File:
- The user uploads a .docx file using a file input on the web interface.
- Conversion to PDF:
- The app invokes LibreOffice in headless mode to convert the .docx file to a .pdf.
- Encryption (Optional):
- After the PDF is generated, users can opt to encrypt the file using a password.
- If encryption is requested, qpdf is used to apply password protection.
- Download PDF:
  - The converted and (optionally) encrypted PDF file is made available for download.

### How To Access this Application
#### Using URL
 - Open your browser and go to below URL
 ```code
    https://www.rajneeshb.live
```
#### Using Docker Image
 - Ensure you have docker installed on your system with below command.

     - Open terminal and type the following command

    ```code
        docker --version
    ```
 - run following commands to get docker image on your system and run app
    ```code
    docker pull rajneesh768/word2pdf
    docker run --name word2pdf-container -p 3000:3000 -d rajneesh768/word2pdf
    ```
  - Using localhost
    - Install LibreOffice from official Website [Download Libre Office](https://www.libreoffice.org/download/download-libreoffice/)
    - Install qpdf from official website [Download qpdf](https://github.com/qpdf/qpdf/releases/tag/v11.9.1)
    - Make sure you have NodeJs installed
    ```code
      node --version
    ````
    - Download the git repositry
    ```code
      git clone https://github.com/rajneesh231/Word2Pdf
    ```
    - Navigate to project folder using "cd" command.
    - Run node app.js
    - Open your preferred browser and open below url
    ```code
      localhost:3000
    ```
