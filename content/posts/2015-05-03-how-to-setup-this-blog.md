+++
title = "How to setup this blog?"
description = "This blog created by Jekyll that is ruby scripts to transforms plain text into static html website and blogs and hosted on Github Page that free hosting support Jekyll."
date = "2015-05-03"

[taxonomies]
tags = [ "How to", "GitHub Page", "Jekyll" ]
categories = [ "How to" ]

[extra]
id = "we3xr8r"
unsplashImgCoverId = "z0uPpx6DDcA"
+++

I'm following [botbotbot 's blog](http://dev.im-bot.com/2014/06/16/how-to-set-up-this-blog/) to setup this blog. Some contents of this post is original from him.

> "This blog created by Jekyll that is ruby scripts to transforms plain text into static html website and blogs and hosted on Github Page that free hosting support Jekyll.This blog use Lanyon theme that based on Poole a minimal style of Jekyll." botbotbot said.

All of below steps are same as [botbotbot 's blog](http://dev.im-bot.com/2014/06/16/how-to-set-up-this-blog/), but I have used [Hyde](http://hyde.getpoole.com/) theme intead.

## Set up github page:
1. Follow setup guilde of Github page for more information about jekyll on github look at

    ```
    http://help.github.com/articles/using-jekyll-with-pages
    ```
2. Clone project from [Hyde](http://hyde.getpoole.com/).

    ```
    git clone https://github.com/poole/hyde.git
    ```
3. Configs jekyll in ```_config.yml```.

    ```yaml
    # Setup
    title:            Mildronize's blog
    tagline:          'mildronize-blog'
    description:      'My dev blog'
    url:              http://mildronize.github.io
    baseurl:          /
    paginate:         5
    ```
4. Make tags.md in root directory copy code from

    ```
     https://github.com/LanyonM/lanyonm.github.io/blob/master/tags.html
    ```
5. Let blog it.

### Next Step
- [Add hover anchor links to header on GitHub Pages using Jekyll](http://milanaryal.com/2015/adding-hover-anchor-links-to-header-on-github-pages-using-jekyll)

### Note:
If you got the message from jekyll build(or serve) ```Liquid Exception: Failed to get header.```, try to check your python version that is python 2.7.

See full instruction from [http://akenn.org/blog/Liquid-Exception-Jekyll/](http://akenn.org/blog/Liquid-Exception-Jekyll/)

### Recommended Resources
- [Creating and Hosting a Personal Site on GitHub from scratch (step by step)](http://jmcglone.com/guides/github-pages/)

### Related Resources
#### Git, GitHub, and GitHub Pages
- [Git Documentation](http://git-scm.com/doc)
- [Learn Git and GitHub in 15 minutes](https://try.github.io/levels/1/challenges/1)
- [GitHub Glossary](https://help.github.com/articles/github-glossary)
- [GitHub Help](https://help.github.com/)
- [GitHub Cheat Sheet](https://github.com/tiimgreen/github-cheat-sheet)
- [GitHub For Academics](http://blogs.lse.ac.uk/impactofsocialsciences/2013/06/04/github-for-academics/)
- [GitHub Pages Help](https://help.github.com/categories/20/articles)

#### Jekyll
- [Sites Using Jekyll](https://github.com/jekyll/jekyll/wiki/Sites)
- [Blog Migrations to Jekyll](http://import.jekyllrb.com/docs/home/)

#### Markdown
- [Official Markdown Spec](http://daringfireball.net/projects/markdown/)
- [Printable Markdown Cheatsheet](http://packetlife.net/media/library/16/Markdown.pdf)
- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown)
