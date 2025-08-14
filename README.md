# Cloud‑Init Generator

A lightweight, client‑side web app to compose, preview, and export cloud‑init user‑data YAML for Linux VMs. Works fully offline as a PWA and runs from any static host (including GitHub Pages).

> Cloud‑init is the de‑facto standard for early‑boot instance configuration across many clouds and hypervisors.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Exporting Your cloud-init YAML](#exporting-your-cloud-init-yaml)
- [Sample cloud-init](#sample-cloud-init)
- [PWA (Offline) Support](#pwa-offline-support)
- [Project Structure](#project-structure)
- [Tech Stack and CDNs](#tech-stack-and-cdns)
- [Development](#development)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [Security](#security)
- [License](#license)

---

## Features

- Interactive form to build cloud‑init user‑data (YAML) without memorizing syntax
- Live preview with YAML formatting
- One‑click copy/download of generated config
- Works offline (PWA with service worker + manifest)
- No backend required — all logic runs in your browser
- Designed to be compatible with common cloud‑init consumers (e.g., Ubuntu, Debian, CentOS, RHEL, Fedora, Alpine) and platforms (clouds, hypervisors, bare‑metal)

> Note: Actual supported fields and generators depend on the current UI. If you don’t see an option, you can always extend it or paste custom YAML sections into the preview.

---

## Quick Start

You can run the app locally in seconds.

Option A: Use a simple local server (recommended for PWA support)
1. Clone the repo:
   ```bash
   git clone https://github.com/samuelcaldas/Cloud-Init_Generator.git
   cd Cloud-Init_Generator
   ```
2. Start a static server (choose one):
   - Python 3:
     ```bash
     python -m http.server 8000
     ```
   - Node (if installed):
     ```bash
     npx http-server -p 8000
     ```
3. Open http://localhost:8000 in your browser.

Option B: Open directly
- Double‑click index.html to open in your browser.
- Note: Service workers require HTTPS or localhost to fully enable PWA features. Direct file:// opening disables offline caching, but the generator UI still works.

Deploy to GitHub Pages (optional)
- Enable GitHub Pages for this repository (Settings → Pages → Deploy from branch: main, folder: root).
- Access it via the Pages URL once published.

---

## Usage

1. Open the app in your browser.
2. Fill in the generator fields:
   - Users, SSH keys, packages, write_files, runcmd/bootcmd, timezone/locale/hostname, etc.
3. Review the live YAML preview.
4. Copy or download the resulting user‑data.
5. Provide the YAML to your cloud or hypervisor when launching the VM.

Tips
- Keep user‑data under any provider size limits.
- Validate sensitive multiline content (e.g., SSH keys) to avoid indentation issues.
- Where possible, prefer stable package names and explicit versions.

---

## Exporting Your cloud‑init YAML

- Download: use the Download button to save as user-data.yaml.
- Manual: select the preview text and copy/paste into your tooling.

---

## Generated cloud‑init Sample

```yaml
#cloud-config
hostname: demo-vm
users:
  - name: dev
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: [sudo]
    shell: /bin/bash
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExampleKeyGoesHere user@example
package_update: true
package_upgrade: true
packages:
  - curl
  - git
  - htop
write_files:
  - path: /etc/motd
    permissions: '0644'
    content: |
      Welcome to your new instance!
runcmd:
  - [ bash, -lc, "echo 'Provisioned via cloud-init' >> /var/log/provision.log" ]
final_message: "The system is finally up, after $UPTIME seconds"
```

For more on supported directives, see official docs:
- https://cloud-init.io/
- https://cloudinit.readthedocs.io/

---

## PWA (Offline) Support

This project includes:
- manifest.json for installable metadata
- service-worker.js for caching static assets

Requirements
- Served over HTTPS or localhost
- First load must be online to prime the cache
- After that, the UI continues to work offline

To reset the cache
- In your browser dev tools, unregister the service worker and clear site data, then reload.

---

## Project Structure

```text
Cloud-Init_Generator/
├─ css/                     # Stylesheets
├─ js/                      # JavaScript modules / helpers
├─ index.html               # App shell and UI
├─ manifest.json            # PWA manifest
└─ service-worker.js        # PWA service worker (offline cache)
```

---

## Tech Stack and CDNs

- HTML5, CSS3, JavaScript (no backend)
- Bootstrap 5 and Bootstrap Icons (via CDN)
- jQuery (via CDN) — optional, depending on UI interactions
- PWA: Service Worker + Web App Manifest

---

## Development

Prerequisites
- Any static web server (for full PWA behavior); otherwise, a modern browser is sufficient.

Local dev loop
1. Serve the root folder (see Quick Start).
2. Edit files in js/, css/, and index.html.
3. Reload the page (hard refresh to bypass cached assets if needed).
4. When modifying service-worker.js, bump a cache version string to force an update.

---

## Contributing

We welcome contributions!

- Fork the repo and create a feature branch from main.
- Keep changes focused and incremental.
- Add/expand UI elements in index.html and corresponding logic in js/.
- Follow good coding standards (readability, small functions, clear error handling).
- Test both online and offline flows (PWA).
- Submit a PR with:
  - What changed and why
  - Screenshots or short GIF if it affects UI
  - Any notes about caching/service worker updates

Commit message convention
- Use concise, imperative form: feat: add write_files section; fix: correct YAML indentation; refactor: split preview renderer

---

## Roadmap

- Field coverage expansion (network config, disks, cloud‑config modules)
- YAML schema hints and inline validation
- Import existing user‑data to edit in the UI
- Presets/recipes for common distributions
- One‑click copy as multipart MIME for cloud platforms that require it
- Save/load configurations to local storage
- Dark mode and accessibility polish
- Optional syntax highlighting in the preview

Have ideas? Please open an issue or PR.

---

## FAQ

- Does this require an internet connection?
  - Only for the first load if using the PWA features or CDNs. After that, it can run offline.
- Is any data sent to a server?
  - No. All generation happens in your browser.
- Which providers are supported?
  - Any platform that consumes standard cloud‑init user‑data. Always consult your provider’s limits and quirks.

---

## Security

- Treat generated user‑data as sensitive: it may contain usernames, SSH keys, or credentials.
- Validate YAML carefully; improper indentation can cause unexpected behavior.
- Prefer using SSH keys over passwords.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- The cloud‑init community and documentation maintainers
- Bootstrap and jQuery projects
