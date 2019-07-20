# pancakesDashboard
A dashboard page for static websites. Allows for easy page navigation and SEO/SERP/mobile preview of the entire site.

## Component overview
This is a theme component for Hugo, so it can work with your existing theme setup. It's optimized for websites built with pancakesStarter. This component is isolated and all JS/CSS/Layouts will not leak out into your existing theme.


## Installation

1. This is a theme component, so add it like you would any other theme. Clone the repo in your themes directory.
```
// themes/

git clone https://github.com/pancakes-builder/pancakesDashboard.git
```

Or add it as a submodule (recommended for easy updates):

```
// root
git submodule add https://github.com/pancakes-builder/pancakesDashboard.git themes/pancakesDashboard
```

2. Update your site config file to include the theme component.

```
theme = ["pancakesDashboard", "YOURTHEME"]
```
Hugo's [lookup order](https://gohugo.io/templates/lookup-order/#readout) applies.

3. In your content directory, add a new folder called "dashboard" with an _index.md file.

```
// content/

dashboard
    |----_index.md
```

```
// _index.md

---
title: "Dashboard"
---
```

4. If you have a seperate config for production and development, update your production config to ignore the dashboard files so that it's not accessible on the live site.

```
// production/config.toml

ignoreFiles = [ "dashboard*" ]
```

## Defining some keys
By default, the dashboard tries to identify the meta titles, meta descriptions, and meta images based on default params and commonly used keys. **However, you should confirm that this matches your theming logic.** Themes built with pancakesStarter templates are supported and don't require any customization. The lookup order is like this:

**Meta Image**
1. User defined key
2. .Params.meta.og_image
3. .Params.meta.image
4. .Params.og_image
5. .Params.image or .Params.featured_image
6. .Site.Parms.og_image
7. .Site.Params.meta_image 
8. .Site.Params.image

**Meta Title**

**Meta Description**