+++
title = "How to Install Google Chrome on Debian"
description = "Installation instuction by using Google repository, and troubleshooting a error of public key is not available."
date = "2015-06-22"

[taxonomies]
tags = [ "Debian", "Chrome", "How to" ]
categories = [ "Debian" ]

[extra]
id = "lay4u9o"
unsplashImgCoverId = "CD2aics5pU0"
+++

# *Deprecated post!
Please go to [my new post](/a-very-short-ubuntu-debian-packages-installation-sheet-0967oym/)

<hr>

## Prerequisite
- chromium via `$ sudo aptitude install chromium`

## Installation
1. Add Google Chrome repository from [unofficial debian repository](https://wiki.debian.org/UnofficialRepositories) by add `deb http://dl.google.com/linux/chrome/deb/ stable main` into last line of `/etc/apt/source.list`

    ```bash
    $ sudo echo 'deb http://dl.google.com/linux/chrome/deb/ stable main' >> /etc/apt/source.list
    $ sudo aptitude update
    ```

2. If you got the error look like this

    ```
    W: GPG error: http://dl.google.com stable Release: The following signatures couldn't be verified because the public key is not available: NO_PUBKEY A040830F7FAC5991
    ```
    It means your public key (In my case, (`A040830F7FAC5991` is my public key) can't verify. Use the belowing command to sign & trust the new repository from google. using ` $ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys [Your public KEY]`

    *example*

    ```
    $ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys A040830F7FAC5991
    ```

3. It's time to Install Google Chrome!

    ```
    $ sudo aptitude update
    $ sudo aptitude install google-chrome-stable
    ```

> Note: Google Chrome has 3 version: `google-chrome-beta`, `google-chrome-stable` and `google-chrome-unstable`. My case uses `google-chrome-stable` for daily use.

