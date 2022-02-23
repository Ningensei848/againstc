---
# @see https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-blog#markdown-front-matter
# Metadata (Recommended) ------------------------------------
title: "ツイート検索には API v2 と postman を使おう"
date: "2022-02-24"
tags:
  - "Twitter"
  - "search"
draft: true  # if true, the article is `WIP` and therefore should not be published yet
# Allows to customize the blog post url (/<routeBasePath>/<slug>)
# slug: ''   # default is current file path
authors: Kiai  # @see authors.yml
# -----------------------------------------------------------
# Additional ------------------------------------------------
# hide_table_of_contents:   # if true, rightside ToC will be invisible
# toc_min_heading_level: 2  # The minimum heading level shown in the ToC
# toc_max_heading_level: 3  # The max heading level shown in the ToC
# for SEO
keywords:
  - "Twitter"
  - "search"
# description: '<Desc>'
# for `og:image` and `twitter:image` (.png or .jpg, NOT .svg)
# image: https://custom-og-image-generator.vercel.app/api/%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E3%81%AE%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E3%81%AB%E5%AF%BE%E5%BF%9C%E3%81%97%E3%81%9F.png?theme=light&timestamp=2022%2F02%2F23&copyright=%23againstc+%2F+Kubokawa+Takara&logo=https%3A%2F%2Fimg.icons8.com%2Fcolor%2F480%2F000000%2Ftwitter-circled--v1.png&avater=https%3A%2F%2Fpbs.twimg.com%2Fprofile_images%2F763543133724352513%2Fr6RlBYDo_400x400.jpg&author=Kiai&aka=%40Ningensei848&site=%23againstc&tags=Twitter&tags=widget&tags=Docusaurus&tags=remark
---

詳細検索であっても，ある程度過去のものだと拾ってこれないようになっている

言葉によるサーチはできないが，ある程度レンジを絞ってツイート群を取得することはできるので，これを活用
