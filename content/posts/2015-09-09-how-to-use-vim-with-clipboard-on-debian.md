+++
title = "How to Use Vim with Clipboard on Debian"
description = "Shortly steps for using Vim Clipboard and breifly vim register Vim usage"
date = "2015-09-09"

[taxonomies]
tags = [ "Vim", "Clipboard", "Linux" ]
categories = [ "Vim" ]

[extra]
uuid = "rfih9o0"
unsplashImgCoverId = "TDV1i2f7rcc"
+++

## Instructions
1. Install extra package that can complete more features on Vim with GUI. There many packages are available on the repository. That is `vim-athena`, `vim-gnome`, `vim-gtk` and `vim-nox`. In this case, I have used [Xfce](http://www.xfce.org/) which applies GTK GUI. I will install `vim-gtk` for enable clipboard feature and others. For [Gnome](https://www.gnome.org/) user, you should installing `vim-gnome`. [Read more](https://packages.debian.org/search?keywords=vim)

    ```bash
    $ sudo aptitude install vim-gtk
    ```

2. Now, you will found `+` registers in `:reg` in Vim. Trick is use Vim
   registers
  - `"+yy` for yank to `+` register which is binding to clipboard
  - `"+p` (Normal mode) for paste from `+` register which is binding to clipboard
  - `Ctrl r` `+` (Insert mode) for paste from `+` register which is binding to clipboard

## How to use registers in Vim
- **Show a list of registers**: press `:reg` in normal mode
- **Access Vim registers**: Press `"` and following *name of register*.
Ex.

  - `"0` for accessing `0` register
  - `"+` for accessing `+` register
- **Vim registers use**: Press `"` `[name]` and vim command. Ex.
  - `"0yy` means to yank to `0` register
  - `"5yy` means to yank to `5` register
  - `"5p` means to paste from `5` register

For more detail about Vim register, I will write a post later.

## Links
- [How to make vim paste from (and copy to) system's clipboard? from stackoverflow](http://stackoverflow.com/a/11489440)
