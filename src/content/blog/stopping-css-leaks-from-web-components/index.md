---
title: "How to prevent CSS leaks from web components"
description: "Stopping CSS leaking upwards into parent web applications"
date: "Jul 19 2025"
---

If a web component doesn't use the shadow dom, or deliberately injects styles into the global scope, this leaks styles to the parent web app. Let's take a look at two examples to understand what this means in practice.

Here we have a parent web page - a simple HTML file:


```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>CSS Leak Demo</title>
    <style>
      body {
        background-color: white;
        color: black;
        font-family: sans-serif;
      }
    </style>
  </head>
  <body>
    <h1>CSS Leak Test</h1>
    <p>If everything works correctly, the background should stay white.</p>

    <my-component></my-component>

    <script type="module" src="./leaky.js"></script>
  </body>
</html>
```

It imports a javascript file called leaky.js, which is:

```js
class MyComponent extends HTMLElement {
    constructor() {
      super();
      const template = document.createElement('template');
  
      // This style will leak into the global DOM
      template.innerHTML = `
        <style>
          body {
            background-color: pink;
          }
        </style>
        <div>I am a leaky component!</div>
      `;
  
      this.appendChild(template.content.cloneNode(true));
    }
  }
  
  customElements.define('my-component', MyComponent);
```

The result is the following:

<iframe src="/demos/css-leak-bug/" width="100%" height="300" style="border: 1px solid #ccc; border-radius: 4px;"></iframe>

What's happening here? The leaky.js element includes a style tag targeting body. Because [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) is not used, the style is injected into the regular DOM, where it affects the parent body element.

The result is that the entire page gets a pink background.

## The fix

We can resolve leaky.js with the changes below:

```js
class MyComponent extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <style>
          div {
            background-color: yellow;
          }
        </style>
        <div>I am now scoped safely.</div>
      `;
    }
  }
  
  customElements.define('my-component', MyComponent);
  
```

Now, the style is __encapsulated__ and won’t affect the parent app.

<iframe src="/demos/css-leak-fix/" width="100%" height="300" style="border: 1px solid #ccc; border-radius: 4px;"></iframe>