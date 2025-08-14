/**
 * Helper function for downloading files with YAML format
 * @param {string} filename - The name of the file to download
 * @param {string} content - The content to be downloaded
 * @returns {boolean} - Success status of the download operation
 */
function downloadFile(filename, content) {
    try {
        // Ensure filename has .yaml extension
        if (!filename.endsWith('.yaml')) {
            filename += '.yaml';
        }
        
        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/x-yaml;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        return true;
    } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download file: ' + error.message);
        return false;
    }
}

$(document).ready(function() {
    // Initialize state
    let configUpdateTimeout = null;
    const DEBOUNCE_DELAY = 500; // ms

    // Function to trigger config update with debounce
    function triggerConfigUpdate() {
        // Clear any pending timeout
        if (configUpdateTimeout) {
            clearTimeout(configUpdateTimeout);
        }
        
        // Set new timeout for debounce
        configUpdateTimeout = setTimeout(() => {
            const yamlConfig = generateYamlConfig();
            $('#yamlOutput').text(yamlConfig);
            
            // Update preview
            const previewHtml = formatPreview(yamlConfig);
            $('#previewOutput').html(previewHtml);
        }, DEBOUNCE_DELAY);
    }

    // Attach change event handlers to all form inputs
    $('#basicConfigForm input, #basicConfigForm select, #basicConfigForm textarea').on('input change', function() {
        triggerConfigUpdate();
    });
    
    $('#advancedConfigForm input, #advancedConfigForm select, #advancedConfigForm textarea').on('input change', function() {
        triggerConfigUpdate();
    });
    
    // IP Configuration Type Toggle
    $('#ipConfigType').on('change', function() {
        $('.ip-config-section').addClass('d-none');
        
        const selectedType = $(this).val();
        if (selectedType === 'static') {
            $('#staticIpConfig').removeClass('d-none');
        } else if (selectedType === 'pattern') {
            $('#patternIpConfig').removeClass('d-none');
        }
        
        triggerConfigUpdate();
    });
    
    // IPv6 Toggle
    $('#enableIpv6').on('change', function() {
        if ($(this).is(':checked')) {
            $('#ipv6Config').removeClass('d-none');
        } else {
            $('#ipv6Config').addClass('d-none');
        }
        
        triggerConfigUpdate();
    });
    
    // IPv6 Type Toggle
    $('input[name="ipv6Type"]').on('change', function() {
        if ($('#ipv6Static').is(':checked')) {
            $('#staticIpv6Config').removeClass('d-none');
        } else {
            $('#staticIpv6Config').addClass('d-none');
        }
        
        triggerConfigUpdate();
    });
    
    // Password Toggle
    $('#togglePassword').on('click', function() {
        const passwordInput = $('#password');
        const icon = $(this).find('i');
        
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('bi-eye').addClass('bi-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('bi-eye-slash').addClass('bi-eye');
        }
    });
    
    // SSH Key File Upload
    $('#loadSshKey').on('click', function() {
        const fileInput = $('#sshKeyFile')[0];
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                $('#sshKey').val(e.target.result);
                triggerConfigUpdate();
            };
            
            reader.readAsText(file);
        } else {
            alert('Please select a file first.');
        }
    });
    
    // Tab change event to update config when switching tabs
    $('#configTabs button').on('shown.bs.tab', function (e) {
        triggerConfigUpdate();
    });
    
    // Generate Configuration Button removed as it was redundant
    // Configuration is automatically updated when form inputs change
    
    // Download YAML Button
    $('#downloadYamlBtn').on('click', function() {
        try {
            const yamlConfig = $('#yamlOutput').text();
            if (!yamlConfig || yamlConfig.trim() === '') {
                throw new Error('No configuration generated');
            }
            downloadFile('cloud-init.yaml', yamlConfig);
        } catch (error) {
            console.error('Error downloading YAML:', error);
            alert('Failed to download YAML: ' + error.message);
        }
    });
    
    // Download Components Button
    $('#downloadComponentsBtn').on('click', function(e) {
        e.stopPropagation();
    });
    
    // Individual component download handlers
    $('#downloadUserData').on('click', function() {
        downloadComponent('user');
    });
    
    $('#downloadMetaData').on('click', function() {
        downloadComponent('meta');
    });
    
    $('#downloadNetworkConfig').on('click', function() {
        downloadComponent('network');
    });
    
    $('#downloadVendorData').on('click', function() {
        downloadComponent('vendor');
    });
    
    // Download All Components
    $('#downloadAllComponents').on('click', function() {
        downloadAllComponents();
    });
    
    // The downloadFile function has been moved to global scope
    
    // Format preview from YAML
    function formatPreview(yaml) {
        // Simple formatting of YAML to HTML
        // In a real application, you would parse the YAML and format it nicely
        let html = '<h5>Configuration Preview</h5>';
        
        try {
            // Split by lines and process
            const lines = yaml.split('\n');
            let inList = false;
            let listHtml = '';
            
            for (let line of lines) {
                if (line.trim() === '') continue;
                
                // Remove comment markers
                if (line.trim().startsWith('#')) {
                    line = line.replace(/^#\s*/, '');
                    html += `<div class="text-muted mb-2">${line}</div>`;
                    continue;
                }
                
                // Check if line contains a colon (key-value pair)
                if (line.includes(':')) {
                    const parts = line.split(':');
                    const key = parts[0].trim();
                    const value = parts.slice(1).join(':').trim();
                    
                    if (value) {
                        html += `<div class="mb-2"><strong>${key}:</strong> ${value}</div>`;
                    } else {
                        html += `<div class="mb-2"><strong>${key}:</strong></div>`;
                    }
                } else {
                    // It's probably a list item or continuation
                    html += `<div class="ps-4 mb-1">${line}</div>`;
                }
            }
            
            return html;
        } catch (e) {
            return `<div class="alert alert-warning">Error parsing configuration: ${e.message}</div>`;
        }
    }
    
    // Initialize the configuration on page load
    triggerConfigUpdate();
    
    // Initialize tooltips and dropdowns
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    
    // Ensure dropdowns work correctly
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));
});