---
layout: default
title: "Colophon"
---

The DITA-OT project website is hosted via [GitHub pages][1] at [dita-ot.github.io][2], which redirects to [dita-ot.org][3]. 

The website is maintained in Git and updated by pushing commits to the repository at [github.com/dita-ot/dita-ot.github.io][4]. 

GitHub pages is powered by [Jekyll][5], a static website publishing engine. Source files for the project website are stored in [Markdown][6] and HTML, enriched with [Liquid][7] templating tags and styled with [Sass][8]. The [Bootstrap][9] framework provides the foundation for the site layout. 

The [Documentation][10] section is maintained in DITA using the source files from the DITA Open Toolkit documentation repository at [github.com/dita-ot/docs][11]. The OT docs are transformed to HTML5 using the [org.dita-ot.html][12] plugin, which extends the default `html5` transformation with additional processing specific to the project website. 

Site output is built with [Gradle][13] using the settings in the [site.gradle][14] build file. The [DITA Open Toolkit Gradle plugin][15] is used with the Gradle dæmon and the `--continuous` build option to automatically regenerate the site output whenever documentation source files change. A staging environment provides a preview of generated site output via the `jekyll serve` command for local testing.  


[1]:	https://pages.github.com
[2]:	http://dita-ot.github.io
[3]:	http://www.dita-ot.org
[4]:	https://github.com/dita-ot/dita-ot.github.io
[5]:	http://jekyllrb.com "Jekyll • Simple, blog-aware, static sites"
[6]:	http://daringfireball.net/projects/markdown/
[7]:	https://github.com/Shopify/liquid/wiki
[8]:	http://sass-lang.com "Sass: Syntactically Awesome Style Sheets"
[9]:	http://getbootstrap.com
[10]:	http://www.dita-ot.org/dev/
[11]:	https://github.com/dita-ot/docs
[12]:	https://github.com/dita-ot/org.dita-ot.html
[13]:	http://gradle.org "Gradle | Modern Open-Source Enterprise Build Automation"
[14]:	https://github.com/dita-ot/docs/blob/develop/site.gradle
[15]:	http://eerohele.github.io/dita-ot-gradle/build/
