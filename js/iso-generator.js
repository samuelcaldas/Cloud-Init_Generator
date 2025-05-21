/**
 * Generates and downloads an ISO file based on a YAML configuration
 * @param {string} yamlConfig - The cloud-init YAML configuration
 */
function generateAndDownloadIso(yamlConfig) {
    // In a real-world application, generating an ISO would typically be done server-side
    // For this client-side only application, we'll implement a simple approach
    
    // Create a metadata file that cloud-init expects
    const metadata = JSON.stringify({
        'instance-id': 'cloud-init-' + Date.now(),
        'local-hostname': $('#machineName').val() || $('#username').val() + '-host'
    });
    
    // Create a dummy ISO (in reality, this would require server-side processing)
    alert('ISO generation requires server-side processing. In a real application, this would create an ISO file with your configuration.');
    
    // For demonstration purposes, we'll just download the yaml file for now
    downloadFile('cloud-init-config.yaml', yamlConfig);
    
    // Additional information for the user about manual ISO creation
    const infoEl = document.createElement('div');
    infoEl.innerHTML = `
        <div class="alert alert-info alert-dismissible fade show mt-3" role="alert">
            <h5>How to manually create a cloud-init ISO</h5>
            <p>To create a cloud-init ISO with your configuration, follow these steps:</p>
            <ol>
                <li>Save the YAML as <code>user-data</code> (no file extension)</li>
                <li>Create a file named <code>meta-data</code> with the following content:</li>
                <pre>${metadata}</pre>
                <li>Run the following command to create the ISO:</li>
                <pre>genisoimage -output cloud-init.iso -volid cidata -joliet -rock user-data meta-data</pre>
            </ol>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Add the information after the main container
    document.querySelector('.container').appendChild(infoEl);
}

/**
 * Helper function to download a file
 * @param {string} filename - The name of the file to download
 * @param {string} content - The content of the file
 */
function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}