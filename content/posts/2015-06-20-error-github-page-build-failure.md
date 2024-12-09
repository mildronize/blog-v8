+++
title = "GitHub Page Build Failure Solution"
description = "(ClassNotFound: no lexer for alias shell found.) Jekyll build failure problem in GitHub Page. I showed my solution for solving that."
date = "2015-06-20"

[taxonomies]
categories = [ "Jekyll" ]
tags = [ "Jekyll", "GitHub Page", "Case Study", "GitHub Support" ]

[extra]
uuid = "lo3mz9g"
unsplashImgCoverId = "vPGGRXPvltE"
+++
> **Note:** This is a part of solutions for solving belowing problem message from GitHub Page. It may be other solutions for solving the problem.

## Situation
1. My jekyll page can run locally.
2. I got an email "[mildronize.github.io] Page build failure"
3. I asked supportor that the facing problem

    > I don't understand why my file contains syntax errors. Because I can run normally this file in local (using jekyll serve)
    > Can you show me more information about this errors or suggest anything.

4. He responded me

    >  You should be running your site locally exactly as per these instructions:
    >
    >  <https://help.github.com/articles/using-jekyll-with-pages>
    >
    >  I cloned your repository and reproduced the issue locally by using a Gemfile and running:
    >
    >  `bundle exec jekyll build`
    >
    >  Which produced the error details:
    >
    >  `Conversion error: Jekyll::Converters::Markdown encountered an error converting '_posts/2015-06-08-upgrade-debian-to-sid.md'.`
    >  ...

    >  `ClassNotFound('no lexer for alias %r found' % _alias) ClassNotFound: no lexer for alias 'shell' found`

## solution

You can't use `shell` as a lexer name. Try `bash` instead.
<https://github.com/jekyll/jekyll/issues/1183>

> If you have any question or suggestion, don't forget to comment this post. Thank you.
