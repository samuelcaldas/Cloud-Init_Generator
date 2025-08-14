/**
 * Displays information about cloud-init components and download options
 * @deprecated ISO generation is deprecated, use component downloads instead
 */
function showCloudInitInfo() {
    // Create an information element to explain the new download options
    const infoEl = document.createElement('div');
    infoEl.innerHTML = `
        <div class="alert alert-info alert-dismissible fade show mt-3" role="alert">
            <h5>Cloud-Init Component Downloads</h5>
            <p>ISO generation is deprecated. Instead, you can now download individual cloud-init components:</p>
            <ul>
                <li><strong>user-data</strong>: Contains user configuration, packages, and commands</li>
                <li><strong>meta-data</strong>: Contains instance metadata like hostname and instance ID</li>
                <li><strong>network-config</strong>: Contains network configuration</li>
                <li><strong>vendor-data</strong>: Contains vendor-specific configuration</li>
            </ul>
            <p>For Proxmox users:</p>
            <ol>
                <li>Download the individual components or use the "Download All Components" option</li>
                <li>Upload the files to your Proxmox server</li>
                <li>Use the files with the Proxmox cloud-init drive</li>
            </ol>
            <p>For manual ISO creation (if needed):</p>
            <pre>genisoimage -output cloud-init.iso -volid cidata -joliet -rock user-data meta-data network-config vendor-data</pre>
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