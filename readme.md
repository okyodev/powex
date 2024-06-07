# Powex

Powex is a React framework for web extensions, create extensions in minutes in a simple way and with a development experience as if you were building a page with react!

> [!WARNING]  
> the development of this framework is in a very early version, not recommended for use in a production environment.

## Create a Powex Project

A template will be created to facilitate the creation of a project in the future, however for now to create a powex project you should do the following

### Initialize project and install dependencies
```
$ mkdir extension-name
$ cd extension-name
$ npm init
$ npm i react react-dom

// on case you want use typescript
$ npm i --save-dev typescript @types/react @types/react-dom

```

### Create `/powex.config.js` 
```js
// /powex.config.js
const powexConfig = {
  name: "<name of your extension>"
  description: "<description of your extension>"
  version: "<version of your extensionn>"
  
};

module.exports = powexConfig;
```
this is the powex configuration file, here you will be able to edit the name, description and version of your extension.



### create `/src/app/_document.ts | js`
```js
// /src/app/document.ts
const documentTemplate = () => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>%name%</title>

      %scripts%
      
      %stylesheets%
    </head>
    <body>
      <div id="root"></div>  
    </body>
  </html>`;
};

export default documentTemplate;
```
this file is the html template that your extensions will use, your scripts will be injected into `%scripts%`, and your stylesheets will be injected into `stylesheets`.

### Create `/src/app/layout.tsx | jsx` 

```js
// /src/app/layout.tsx
interface Props {
  children: React.ReactElement;
}

const Layout = ({ children }: Props) => {
  return <>{children}</>;
};

export default Layout;
```
this layout will be shared between `side-panel.tsx | jsx` and `popup.tsx | jsx`

### Final Structure
with the above you would have your project ready to use powex, the structure you should have is as follows

```
- / node_modules
- / src 
  - / app
      - _document.ts
      - layout.tsx
- powex.config.js
- package-lock.json
- package.json
- tsconfig.json
```

### Build extension
To build your extension you only have to run npx powex build if you have powex installed globally! currently the package is not released. (Getting Started Development to know how install powex on local environment)

```
  npx powex build
```

### Upload Extension
Looks this tutorial to how upload a extension on [edge](edge://extensions/) or [chrome](chrome://extensions/)
> https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked

--------

## Getting Started Development

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes.

### Prerequisites

Requirements for the software and other tools to build, test and push

- Node.js


### install dependencies
```
$ npm install
```

### Install Powex package on local
```
$ npm run build:dev
```
this command will compile the javascript code and install powex globally so you can use it in any project using `npx powex build`

> [!NOTE]  
> Keep in mind that it is the first framework that I developed! for now I do not recommend its use in production, also it is in a very early stage so it lacks some development tools.
