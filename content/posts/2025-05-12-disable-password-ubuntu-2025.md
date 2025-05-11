+++
title = "How I Disabled Password Login on Ubuntu (And Why It Didn't Work at First)"
date = "2025-05-12"

[taxonomies]
categories = [ "Linux" ]
tags = [
  "ssh",
  "ubuntu",
  "cloud-init",
  "security",
  "debugging"
]
+++

I recently set up a small VM running Ubuntu and wanted to secure it a bit. One of the first things I usually do is disable SSH password authentication and use only key-based login. It’s more secure and makes SSH a lot more convenient if you’re jumping between machines often.

So I did the usual stuff:

1. Generated an SSH key using `ssh-keygen`
2. Copied the public key over with `ssh-copy-id`
3. Edited `/etc/ssh/sshd_config` and set:

   ```
   PasswordAuthentication no
   ```
4. Restarted the SSH service:

   ```
   sudo systemctl restart ssh
   ```

I tested it… and it **still allowed password login**. Weird.

### Turns out: Ubuntu cloud-init strikes again

After some digging, I found out that **Ubuntu (especially cloud images or VMs provisioned via cloud-init)** may create a file at:

```
/etc/ssh/sshd_config.d/50-cloud-init.conf
```

This file can contain:

```
PasswordAuthentication yes
```

Which overrides what you set in the main `sshd_config` file.

### How I fixed it

Simple fix: I just removed the file.

```
sudo rm -f /etc/ssh/sshd_config.d/50-cloud-init.conf
```

Then restarted SSH again:

```
sudo systemctl restart ssh
```

After that, I tested with:

```
ssh -o PreferredAuthentications=password -o PubkeyAuthentication=no user@host
```

This time, it correctly rejected the password login with:

```
Permission denied (publickey).
```

### Final thoughts

I like how Ubuntu modularizes sshd config with the `sshd_config.d` directory, but it’s easy to miss overrides like this if you're used to managing just a single file.

So if you’ve disabled password login and it’s **still working**, double-check that no other config file is sneaking in behind the scenes.

**Reference:**
[AskUbuntu – Disable password authentication in ssh](https://askubuntu.com/questions/435615/disable-password-authentication-in-ssh)

