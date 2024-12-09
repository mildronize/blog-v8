+++
title = "Guideline for Upgrading Jekyll from 2.x to 3.x"
description = "If you are a Jekyll user. You may be heard some news about announcement Jekyll 3. Then, GitHub announced to use the Jekyll 3. So, there are many changes for Jekyll 3. It describes in the Jekyll Official page."
date = "2016-02-06"

[taxonomies]
tags = [ "Jekyll", "Jekyll 3", "Guideline" ]
categories = [ "Jekyll" ]

[extra]
uuid = "z578nvw"
unsplashImgCoverId = "H7LxvEmVZnE"
+++

> Note: **This guideline is not suitable for default engine of GitHub (Jekyll)**. Because it doesn't allow to install any plugin. On the other hand, we can't use Jekyll 2 plugin. It must uses in Jekyll 3 way.

If you are a Jekyll user. You may be heard some news about announcement Jekyll 3.
Then, [GitHub announced to use the Jekyll 3](https://github.com/blog/2100-github-pages-now-faster-and-simpler-with-jekyll-3-0).
So, there are many changes for Jekyll 3.
It describes in the [Jekyll Official page](http://jekyllrb.com/docs/upgrading/2-to-3/).

## Notices

- This article doesn't directly use to upgrade your Jekyll site, but it has some useful guidelines for upgrading by yourself.
- This article is following my site upgrading. You can see all changes in my commits ([1][commit1], [2][commit2], [3][commit3], [4][commit4]).

## Here is some instructions

- If you uses relative permalinks. It looks like `-relative_permalinks: true` in `config.yml`. *Delete it!*. Because it was removed from Jekyll 3.

- Some default plugins of Jekyll 2 (dependencies) are removed out on Jekyll 3. If you want use them. You just add import some Jekyll 2 plugins manually. I used my Jekyll site as a case study.

    Add `gems` and following a list of plugin name what you want in yaml format.

    ```
    gems: [jekyll-paginate, jekyll-gist, redcarpet]
    ```

    You can find more removed plugin lists of jekyll 2.x below:

    > - jekyll-paginate – Jekyll's pagination solution from days past
    > - jekyll-coffeescript – processing of CoffeeScript
    > - jekyll-gist – the `gist` Liquid tag
    > - pygments.rb – the Pygments highlighter
    > - redcarpet – the Markdown processor
    > - toml – an alternative to YAML for configuration files
    > - classifier-reborn – for `site.related_posts`

    >  From [Jekyll site](http://jekyllrb.com/docs/upgrading/2-to-3/#dropped-dependencies)

- Jekyll 3 has been changed syntax highlighter to [kramdown](http://kramdown.gettalong.org/).
I'm using `redcarpet` in my site because of I don't want to change any markdown files to support `kramdown`.

- In Jekyll 3, It doesn't  automatically add a trailing slash (`/`) of permalink (URL).

    - If you have custom permalink pages or posts, you should fix all of custom permalink posts and pages. By adding a slash (`/`) at the end of your custom permalinks. (You can see [my changes][commit2]) For example:

        `permalink: notes/vim`  change to `permalink: notes/vim/`

    - And, you should fix a custom permalink in `_config.yml` too. You can see in [my changes][commit3].

        `permalink: /:categories/:title` change to `permalink: /:categories/:title/`

## Lastly

Here is a part of `_config.yml` which is changed in Jekyll 3.

```yaml
markdown:        redcarpet
gems:            [jekyll-paginate, jekyll-gist, redcarpet]
permalink:       /:categories/:title/
```

Thanks for reading. If you have some questions or suggestions, please comment below.

Bye.

## Read more
- "[Upgrading from 2.x to 3.x](http://jekyllrb.com/docs/upgrading/2-to-3/)" by Official jekyll site

[commit1]: https://github.com/mildronize/mildronize.github.io/commit/c6adf73f931e265fb0eb715c0edccf93782bbeab
[commit2]: https://github.com/mildronize/mildronize.github.io/commit/820fd27ae001f2280889480c650e086ef5f31f2a
[commit3]: https://github.com/mildronize/mildronize.github.io/commit/61e2bb7446d241de040d3e0d2cdfaef7cfdb9a8d
[commit4]: https://github.com/mildronize/mildronize.github.io/commit/34556c1fd5c4e9f12a86f762dd4d1654ebbcdf63

