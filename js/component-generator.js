/**
 * Component Generator for Cloud-Init
 * Handles generation and download of individual cloud-init components
 */

/**
 * Generates the user-data component for cloud-init
 * @returns {string} The user-data content
 */
function generateUserData() {
    return generateYamlConfig();
}

/**
 * Generates the meta-data component for cloud-init
 * @returns {string} The meta-data content in YAML format
 */
function generateMetaData() {
    const machineName = $('#machineName').val() || $('#username').val() + '-host';
    
    let metadata = '';
    metadata += 'instance-id: cloud-init-' + Date.now() + '\n';
    metadata += 'local-hostname: ' + machineName + '\n';
    
    return metadata;
}

/**
 * Generates the network-config component for cloud-init
 * @returns {string} The network-config content in YAML format
 */
function generateNetworkConfig() {
    let networkConfig = 'version: 2\n';
    networkConfig += 'ethernets:\n';
    networkConfig += '  eth0:\n';
    
    const ipConfigType = $('#ipConfigType').val();
    
    if (ipConfigType === 'dhcp') {
        networkConfig += '    dhcp4: true\n';
    } else if (ipConfigType === 'static') {
        const ipAddress = $('#ipAddress').val();
        const subnetMask = $('#subnetMask').val();
        const gateway = $('#gateway').val();
        
        if (ipAddress && subnetMask) {
            networkConfig += '    dhcp4: false\n';
            
            // Handle different formats of subnet mask
            let cidr = subnetMask;
            if (subnetMask.includes('.')) {
                // Convert subnet mask to CIDR
                cidr = '/24'; // Default, would need proper conversion
            }
            
            networkConfig += '    addresses:\n';
            networkConfig += `      - ${ipAddress}${cidr}\n`;
            
            if (gateway) {
                networkConfig += '    routes:\n';
                networkConfig += '      - to: default\n';
                networkConfig += `        via: ${gateway}\n`;
            }
        }
    } else if (ipConfigType === 'pattern') {
        const ipPattern = $('#ipPattern').val();
        const vmId = $('#vmId').val();
        
        if (ipPattern && vmId) {
            const lastThreeDigits = vmId.slice(-3);
            const ipAddress = `${ipPattern}${lastThreeDigits}`;
            
            networkConfig += '    dhcp4: false\n';
            networkConfig += '    addresses:\n';
            networkConfig += `      - ${ipAddress}/24\n`; // Assuming /24 subnet
        }
    }
    
    // IPv6 configuration
    const enableIpv6 = $('#enableIpv6').is(':checked');
    if (enableIpv6) {
        const ipv6Type = $('input[name="ipv6Type"]:checked').val();
        
        if (ipv6Type === 'slaac') {
            networkConfig += '    dhcp6: false\n';
            networkConfig += '    accept-ra: true\n';
        } else if (ipv6Type === 'static') {
            const ipv6Address = $('#ipv6Address').val();
            const ipv6Gateway = $('#ipv6Gateway').val();
            const ipv6PrefixLength = $('#ipv6PrefixLength').val() || '64';
            
            if (ipv6Address) {
                networkConfig += '    dhcp6: false\n';
                networkConfig += '    accept-ra: false\n';
                networkConfig += '    addresses:\n';
                networkConfig += `      - ${ipv6Address}/${ipv6PrefixLength}\n`;
                
                if (ipv6Gateway) {
                    networkConfig += '    routes:\n';
                    networkConfig += '      - to: ::/0\n';
                    networkConfig += `        via: ${ipv6Gateway}\n`;
                }
            }
        }
    }
    
    return networkConfig;
}

/**
 * Generates the vendor-data component for cloud-init (if needed)
 * @returns {string} The vendor-data content in YAML format
 */
function generateVendorData() {
    // For now, we'll return a simple vendor-data file
    // This could be expanded in the future
    return '#cloud-config\n\n# Vendor provided configuration\n';
}

/**
 * Downloads a specific cloud-init component
 * @param {string} componentType - The type of component to download (user, meta, network, vendor)
 */
function downloadComponent(componentType) {
    let content = '';
    let filename = '';
    
    switch(componentType) {
        case 'user':
            content = generateUserData();
            filename = 'user-data';
            break;
        case 'meta':
            content = generateMetaData();
            filename = 'meta-data';
            break;
        case 'network':
            content = generateNetworkConfig();
            filename = 'network-config';
            break;
        case 'vendor':
            content = generateVendorData();
            filename = 'vendor-data';
            break;
        default:
            alert('Invalid component type');
            return;
    }
    
    downloadFile(filename, content);
}

/**
 * Downloads all cloud-init components as a zip file
 */
function downloadAllComponents() {
    // In a real implementation, this would create a zip file with all components
    // For this client-side only application, we'll download each file separately
    
    alert('Downloading all components separately. In a real application, this would create a zip file.');
    
    downloadComponent('user');
    downloadComponent('meta');
    downloadComponent('network');
    downloadComponent('vendor');
}