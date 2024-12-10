+++
title = "How to upgrade Debian to SID"
description = "Instruction for upgrading debian from stable to SID, sudo command setup, installing non-free packages(non open source)"
date = "2015-06-08"

[taxonomies]
tags = [ "Debian", "How to", "Firmware Linux" ]
categories = [ "Debian" ]

[extra]
last_modified_at = 2016-02-16T00:00:00.000Z
id = "l0ywmex"
unsplashImgCoverId = "yGPxCYPS8H4"
+++

**Optional:** Add `sudo` into your user

```
$ su
# aptitude install sudo
# usermod -a -G sudo [USERNAME]
# exit
```

> Note: If `sudo` don't work, try logout and login again.

1. Replace the belowing text into `/etc/apt/sources.list` with your favorite editor. In my case I use
`$ sudo vi /etc/apt/sources.list`

    ```bash
    deb http://ftp.th.debian.org/debian/ sid main contrib non-free
    deb-src http://ftp.th.debian.org/debian/ sid main contrib non-free

    deb http://ftp.th.debian.org/debian/ stable main contrib non-free
    deb http://ftp.th.debian.org/debian/ testing main contrib non-free
    deb http://ftp.th.debian.org/debian/ experimental main contrib non-free
    ```
    > Read more about Archive areas:
    > [main](https://www.debian.org/doc/debian-policy/ch-archive.html#s-main),
    > [contrib](https://www.debian.org/doc/debian-policy/ch-archive.html#s-contrib),
    > [non-free](https://www.debian.org/doc/debian-policy/ch-archive.html#s-non-free)

    > Note: Replace `http://ftp.th.debian.org/debian/` to your nearest repository

2. Update a list of repositories

    ```bash
    $ sudo aptitude update
    ```

2. Upgrade your debian version into sid version

    ```bash
    $ sudo aptitude dist-upgrade
    ```
3. After it finished, reboot system

    ```bash
    $ sudo reboot
    ```

**Optional:**

- For installing firmware for various drivers in consist of [non-free](https://www.debian.org/doc/debian-policy/ch-archive.html#s-non-free) packages or drivers using:

    ```
    $ sudo aptitude install firmware-linux
    ```
- For installing some thai font:

    ```
    $ sudo aptitude install xfonts-thai
    ```


