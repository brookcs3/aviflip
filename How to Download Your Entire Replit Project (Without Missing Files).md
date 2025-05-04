# How to Download Your Entire Replit Project (Without Missing Files)

> **By Cameron Brooks**
> *Frustrated by Replit's incomplete "Download Project" feature? Here's how to get your actual full workspace using SSH — including `node_modules`, `.tsx` files, and other critical files Replit often leaves out.*

---

### 🧨 The Problem: Replit's "Download Project" Button Is a Lie

Replit's default "Download Project" feature gives the illusion that you're exporting your full project. But if you've tried running your app locally after downloading, you might've hit errors or noticed key files missing:

* No `node_modules/`
* Missing `.tsx`, `.d.ts`, `.mts` files
* Incomplete folder structures
* A misleading `.replit` file that differs from what you actually ran

This isn't just bad UX — it's ecosystem lock-in. Here's how to break free and get your **real** project files.

---

### 🔐 Step 1: Enable SSH Access to Your Repl

1. In your Replit project, open the **Shell tab** (bottom panel).
2. Run this command to generate an SSH key:

   ```bash
   ssh-keygen -t ed25519 -C "yourname@youremail.com"
   ```
3. Copy the public key:

   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
4. Go to Replit settings > SSH and paste in the public key.

---

### 🔗 Step 2: Find Your Repl's SSH Address

In the shell, run:

```bash
whoami
hostname
```

You'll get a username (usually `runner`) and a long hostname string like:

```
1e1658df-73ca-4a0d-a80c-7c872dc4e6b8-00-abc123xyz.riker.replit.dev
```

Use that to construct the full SSH address.

---

### 💾 Step 3: Download Everything via SCP

On your **local machine** (Mac/Linux terminal), run:

```bash
scp -r -P 22 \
  -i ~/.ssh/id_ed25519 \
  "runner@your-replit-hostname:/home/runner/workspace/*" \
  ~/Documents/FlipMyFIle/
```

Replace `your-replit-hostname` with the real hostname, and change the local path as needed.

This will pull down **every file**, including:

* `node_modules/`
* all `.tsx`, `.d.ts`, and `.mts` files
* folders Replit may have hidden
* a `.replit` file that actually reflects your live environment

---

### 🧹 Optional Cleanup (De-Replitize Your Project)

After the download, you might want to:

* Delete `.replit` and `replit.nix` files
* Run `npm install` to rebuild `node_modules` locally
* Rename `.tsx` files to `.jsx` if you're not using TypeScript

```bash
rm -f .replit replit.nix
npm install
```

---

### 🧠 Final Thoughts

Replit is great for prototyping and instant collaboration, but its ecosystem can quietly trap your project inside unless you know how to break it out.

With SSH and `scp`, you take full control of your files — no surprises, no lock-in. Save this tutorial for next time you want a **real** export.

---

*Got questions or want a one-click script to automate this? Ping me.*
