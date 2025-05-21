/**
 * Generates a YAML configuration for cloud-init based on form inputs
 * @returns {string} The generated cloud-init YAML configuration
 */
function generateYamlConfig() {
    let yaml = '#cloud-config\n';
    
    // Basic user configuration
    const username = $('#username').val();
    const password = $('#password').val();
    
    if (username) {
        yaml += '\n# User Configuration\n';
        yaml += 'users:\n';
        yaml += `  - name: ${username}\n`;
        yaml += '    sudo: ALL=(ALL) NOPASSWD:ALL\n';
        yaml += '    groups: sudo\n';
        yaml += '    shell: /bin/bash\n';
        
        if (password) {
            // In a real app, you'd want to hash this password
            yaml += `    passwd: ${password}\n`;
            yaml += '    lock_passwd: false\n';
        }
        
        const sshKey = $('#sshKey').val();
        if (sshKey) {
            yaml += '    ssh_authorized_keys:\n';
            yaml += `      - ${sshKey}\n`;
        }
    }
    
    // System configuration
    const domain = $('#domain').val();
    if (domain) {
        yaml += '\n# Domain Configuration\n';
        yaml += 'manage_etc_hosts: true\n';
        yaml += `fqdn: ${username}-host.${domain}\n`;
    }
    
    // DNS configuration
    const dns = $('#dns').val();
    if (dns) {
        yaml += '\n# DNS Configuration\n';
        yaml += 'manage_resolv_conf: true\n';
        yaml += 'resolv_conf:\n';
        yaml += '  nameservers:\n';
        
        const dnsServers = dns.split(',').map(server => server.trim());
        for (const server of dnsServers) {
            yaml += `    - ${server}\n`;
        }
    }
    
    // Network configuration
    yaml += '\n# Network Configuration\n';
    yaml += 'network:\n';
    yaml += '  version: 2\n';
    yaml += '  ethernets:\n';
    yaml += '    eth0:\n';
    
    const ipConfigType = $('#ipConfigType').val();
    
    if (ipConfigType === 'dhcp') {
        yaml += '      dhcp4: true\n';
    } else if (ipConfigType === 'static') {
        const ipAddress = $('#ipAddress').val();
        const subnetMask = $('#subnetMask').val();
        const gateway = $('#gateway').val();
        
        if (ipAddress && subnetMask) {
            yaml += '      dhcp4: false\n';
            
            // Handle different formats of subnet mask
            let cidr = subnetMask;
            if (subnetMask.includes('.')) {
                // Convert subnet mask to CIDR
                cidr = '/24'; // Default, would need proper conversion
            }
            
            yaml += '      addresses:\n';
            yaml += `        - ${ipAddress}${cidr}\n`;
            
            if (gateway) {
                yaml += '      routes:\n';
                yaml += '        - to: default\n';
                yaml += `          via: ${gateway}\n`;
            }
        }
    } else if (ipConfigType === 'pattern') {
        const ipPattern = $('#ipPattern').val();
        const vmId = $('#vmId').val();
        
        if (ipPattern && vmId) {
            const lastThreeDigits = vmId.slice(-3);
            const ipAddress = `${ipPattern}${lastThreeDigits}`;
            
            yaml += '      dhcp4: false\n';
            yaml += '      addresses:\n';
            yaml += `        - ${ipAddress}/24\n`; // Assuming /24 subnet
        }
    }
    
    // IPv6 configuration
    const enableIpv6 = $('#enableIpv6').is(':checked');
    if (enableIpv6) {
        const ipv6Type = $('input[name="ipv6Type"]:checked').val();
        
        if (ipv6Type === 'slaac') {
            yaml += '      dhcp6: false\n';
            yaml += '      accept-ra: true\n';
        } else if (ipv6Type === 'static') {
            const ipv6Address = $('#ipv6Address').val();
            const ipv6Gateway = $('#ipv6Gateway').val();
            const ipv6PrefixLength = $('#ipv6PrefixLength').val() || '64';
            
            if (ipv6Address) {
                yaml += '      dhcp6: false\n';
                yaml += '      accept-ra: false\n';
                yaml += '      addresses:\n';
                yaml += `        - ${ipv6Address}/${ipv6PrefixLength}\n`;
                
                if (ipv6Gateway) {
                    yaml += '      routes:\n';
                    yaml += '        - to: ::/0\n';
                    yaml += `          via: ${ipv6Gateway}\n`;
                }
            }
        }
    }
    
    // Package upgrades
    const upgradePackages = $('#upgradePackages').is(':checked');
    yaml += '\n# Package Configuration\n';
    yaml += `package_update: ${upgradePackages}\n`;
    yaml += `package_upgrade: ${upgradePackages}\n`;
    
    // Advanced tab configuration
    if ($('#advanced-tab').attr('aria-selected') === 'true' || 
        $('#machineName').val() || $('#timezone').val() !== 'UTC' || 
        $('#locale').val() !== 'en_US.UTF-8' || $('#packages').val() || 
        $('#runCmd').val() || $('#bootCmd').val()) {
        
        yaml += '\n# Advanced Configuration\n';
        
        // Machine name
        const machineName = $('#machineName').val();
        if (machineName) {
            yaml += `hostname: ${machineName}\n`;
        }
        
        // Timezone
        const timezone = $('#timezone').val();
        if (timezone && timezone !== 'UTC') {
            yaml += `timezone: ${timezone}\n`;
        }
        
        // Locale
        const locale = $('#locale').val();
        if (locale && locale !== 'en_US.UTF-8') {
            yaml += 'locale: ' + locale + '\n';
        }
        
        // Packages
        const packages = $('#packages').val();
        if (packages) {
            yaml += 'packages:\n';
            const packageList = packages.split('\n');
            for (const pkg of packageList) {
                if (pkg.trim()) {
                    yaml += `  - ${pkg.trim()}\n`;
                }
            }
        }
        
        // Run commands
        const runCmd = $('#runCmd').val();
        if (runCmd) {
            yaml += 'runcmd:\n';
            const cmdList = runCmd.split('\n');
            for (const cmd of cmdList) {
                if (cmd.trim()) {
                    yaml += `  - ${cmd.trim()}\n`;
                }
            }
        }
        
        // Boot commands
        const bootCmd = $('#bootCmd').val();
        if (bootCmd) {
            yaml += 'bootcmd:\n';
            const bootCmdList = bootCmd.split('\n');
            for (const cmd of bootCmdList) {
                if (cmd.trim()) {
                    yaml += `  - ${cmd.trim()}\n`;
                }
            }
        }
    }
    
    return yaml;
}