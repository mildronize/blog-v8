+++
title = "Mildy: My Debian customization"
description = "Debian desktop customization for look good desktop in my style. It contains many applications such as Xfce, Plank and terminal customization."

[taxonomies]
tags = [ "Debian", "Xfce", "Linux Desktop Customization" ]
categories = [ "Debian" ]

[extra]
uuid = "gtg6emr"
unsplashImgCoverId = "hWgsxV_VQW0"
+++

Are you boring in Desktop of Debian. Here are some configurations for
making your Debian to good look Debian.

> Note: This post is only configuration that I'm used to customize
> my desktop. It isn't suitable for beginner. I may write a post for
> beginner in the future. If you have any question about this, please
> contact me following in `About` menu.

## Easy instruction for customizing linux desktop
1. Choose a desktop environment
2. Choose a theme
3. Install some packages for best experience
4. Config something

This is my Linux desktop

![mildy-my-debian-customizing-screenshot](2015-09-08-mildy-my-debian-customization.jpg)

## My customizatioan
- Desktop environment: [Xfce](http://www.xfce.org/)
- Theme ( Recommended GTK 2.0):
  - In `Appearance`:
      - Style: [Adwaita](http://gnome-look.org/content/show.php/?content=144237)
      - Icons: [Faenza](http://gnome-look.org/content/show.php/?content=128143)
  - In `Window Manager`:
      - Style: [axiom](http://xfce-look.org/content/show.php/axiom+xfwm?content=90145)
- Extra package:
  - Dock: [Plank](https://launchpad.net/plank) (which is used in [Elementary OS](https://elementary.io/) )

    > In Debian, Plank is now available on testing and sid only, [see more](https://packages.debian.org/plank)

- Items in `Panel` on Xfce:
  - Separator: style=Transparent, expand=true
  - Separator: style=Transparent, expand=true
  - Clock: Format=Custom Format (`%I:%M %p | %a %d %b %Y`)
  - Separator: style=Transparent, expand=true
  - Workspace Switcher
  - Keyboard Layouts
  - Notification Area: Show frame=false
  - Audio Mixer
  - Action Buttons
  - Separator: style=Separator
  - Applications Menu
  - Show Desktop

    > 4 items first in the items of Xfce panel is a technique to adjust center position
    > of clock

## Terminal
- use [Solarized](http://ethanschoonover.com/solarized) color scheme
- Combine many programs in terminal:
  - [Zsh](http://www.zsh.org/) and [Oh my Zsh](https://github.com/robbyrussell/oh-my-zsh)
  - [Tmux](https://tmux.github.io/)
  - [Vim](http://www.vim.org/) and
  [Janus](https://github.com/carlhuda/janus)
- All configuration of this section is stored at
<https://github.com/mildronize/dotfiles>
- More details of this section can see in [my
post](http://dev.mildronize.com/th/notes/vim-janus-tmux/) (Thai
version)
