+++
title = "How to Compile & Install Gnome Builder on Debian"
description = "Instruction of Gnome Builder installation on Debian"
date = "2015-07-02"

[taxonomies]
categories = [ "Debian" ]
tags = [ "Debian", "Gnome builder", "How to" ]

[extra]
uuid = "1jxvb3m"
unsplashImgCoverId = "Tjbk79TARiE"
+++

> Note: This post is early access for using Gnome Builder. It may be including some bug or any error, please calm when you found some bug. So I think this is becoming the best editor for gnome user, Cheer!

I have heard about `gnome builder` announcement on [Indiegogo](https://www.indiegogo.com/projects/builder-an-ide-of-our-gnome#/story) in some blog (I can't remember that). It is very interesting for me. Because it is made for Gnome user, and me too. It do not tell it anymore, let's watch belowing video to introduce `Gnome Builder`. Read more about the feature of Gnome Builder via <https://wiki.gnome.org/Apps/Builder/Features>

<iframe width="560" height="315" src="https://www.youtube.com/embed/jXEjYu0SJ3A" frameborder="0" allowfullscreen></iframe>


Okay, I can't wait to try it. Let's go to compile & install it!

## Installation
1. Install some prerequisite packages for Gnome Builder.

    ```bash
    $ sudo aptitude install intltool gtk-doc-tools libgtksourceview-3.0-dev libdevhelp-dev libgit2-glib-1.0-dev libgjs-dev python-gobject-dev llvm-dev libclang-dev python3-dev
    ```

2. Go to [Gnome git repository home](https://git.gnome.org/browse/gnome-builder/), and select the lastest version of Gnome Builder or any version what you want. In my case, I choose [GNOME_BUILDER_3_16_3](https://git.gnome.org/browse/gnome-builder/snapshot/GNOME_BUILDER_3_16_3.tar.xz) to download it.

3. Extract the compression file (GNOME_BUILDER_3_16_3.tar.xz), using this command below (It can use only .tar.xz only)

    ```bash
    $ tar -Jxvf GNOME_BUILDER_3_16_3.tar.xz
    ```

4. go to the directory which you extracted

    ```bash
    $ cd GNOME_BUILDER_3_16_3
    ```

5. Execute `autogen.sh` and run `make`

    ```bash
    $ ./autogen.sh
    $ make
    ```

All done!, Let's enjoy the editor on our Gnome

Next post, I will post how I know the prerequisite packages for compiling C source.

Bye.

Special Thank Thanathip Limna for his suggestion

## Resources
- [Gnome Builder Home page](https://wiki.gnome.org/Apps/Builder)
- [Indiegogo Funding](https://www.indiegogo.com/projects/builder-an-ide-of-our-gnome#/story)
