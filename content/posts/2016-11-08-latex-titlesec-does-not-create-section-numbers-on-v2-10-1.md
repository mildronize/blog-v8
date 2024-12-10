+++
title = "titlesec (Latex package) doesn't create section numbers on version 2.10.1"
date = "2016-11-08"

[taxonomies]
tags = [ "Titlesec", "LaTex" ]
categories = [ "Titlesec" ]

[extra]
id = "ptkagjo"
unsplashImgCoverId = "LboV5Qpqm1E"
+++

I found this bug on yesterday.

## The problem

When importing `titlesec` in latex document, the latex compiler (I use `xelatex`) doesn't generate all section numbers.

This bug have been reported on <https://bugs.launchpad.net/ubuntu/+source/texlive-extra/+bug/1574052>.

## The solution

The solutions are discussed in <http://tex.stackexchange.com/questions/299969/titlesec-loss-of-section-numbering-with-the-new-update-2016-03-15>.
You only upgrade the package version from `2.10.1` to `2.10.2` manually. The instruction is following below:

1. Download the package for version `2.10.2` from [CTAN](https://www.ctan.org/pkg/titlesec?lang=en) or you can [download directly](http://mirrors.ctan.org/macros/latex/contrib/titlesec.zip).
2. Unzip the downloaded file
3. Copy them into `/usr/share/texlive/texmf-dist/tex/latex/titlesec`

What about you? If this solution can help you, please share.
Thank you

