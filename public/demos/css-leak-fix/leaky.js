// class MyComponent extends HTMLElement {
//   constructor() {
//     super();
//     const template = document.createElement('template');

//     // This style will leak into the global DOM
//     template.innerHTML = `
//       <style>
//         body {
//           background-color: pink;
//         }
//       </style>
//       <div>I am a leaky component!</div>
//     `;

//     this.appendChild(template.content.cloneNode(true));
//   }
// }

// customElements.define('my-component', MyComponent);


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