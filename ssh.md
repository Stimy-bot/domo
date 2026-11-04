# GitHub SSH Connection Troubleshooting

Even though `id_ed25519` was added to your local `ssh-agent`, GitHub rejected the connection. The most common causes are that the public key is not registered under your GitHub account, file permissions are too open, or SSH is not explicitly configured to present `id_ed25519` for github.com.

## Step 1: Verify Public Key File and Get Fingerprint

Check if your public key file exists and print its SHA256 fingerprint:

```bash
ssh-keygen -l -f ~/.ssh/id_ed25519.pub
```

**Verification:** You should see output resembling `256 SHA256:... patrick.totaldata.dominic@gmail.com (ED25519)`. If `~/.ssh/id_ed25519.pub` does not exist, generate it from your private key:

```bash
ssh-keygen -y -f ~/.ssh/id_ed25519 > ~/.ssh/id_ed25519.pub
```

## Step 2: Fix File and Directory Permissions

Strict OpenSSH security rules cause key rejection if file permissions are too permissive. Set correct permissions on your SSH directory:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

**Verification:** Run `ls -ld ~/.ssh` and `ls -l ~/.ssh/id_ed25519*` to confirm `drwx------` for the directory and `-rw-------` for the private key.

## Step 3: Enforce id_ed25519 in SSH Config

Configure SSH to explicitly offer `id_ed25519` for GitHub connections:

```bash
cat << 'EOF' >> ~/.ssh/config
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519
  IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
```

## Step 4: Verify SSH Connection Verbose Output

Run a verbose connection check to see which key is being offered to GitHub:

```bash
ssh -vT git@github.com 2>&1 | grep -E "Offering|Authentications that can continue|Hi "
```

**Verification:** If you see `Offering public key: /home/patricktotaldatadominic/.ssh/id_ed25519` followed by `Permission denied (publickey)`, the key is not added on GitHub yet. If you see `Hi Stimy-bot! You've successfully authenticated...`, your connection is established!

## Step 5: Print Public Key for GitHub Registration

If the key is not yet registered on GitHub, copy the output of this command and add it under your GitHub profile settings:

```bash
cat ~/.ssh/id_ed25519.pub
```
