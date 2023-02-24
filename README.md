# Sigen
Sigen is a static site generator that puts together common sections, etc., and uses templates to quickly, easily, and instantly output static HTML.

### How to use
1. Install Sigen  
  ```shell
  npm install -g sigen
  ```
2. Run Sigen  
  If you want to include the contents of template.html between the `<div></div>` in index.html, write this in index.html.
  ```index.html
  <div>
    <!-- sigen: include ./template.html -->
  </div>
  ```

  Next, run Sigen.  
  It outputs out/index.html from the index.html written earlier.
  ```shell
  sigen index.html out/index.html
  ```

  Also, if you want to run .html in a directory recursively, do the following. For example, to output the contents of the page directory to the out directory, do the following.
  ```shell
  sigen -r ./page/ ./out/
  ```

  You may want to include more than just html files in the output. (e.g. `.js`, `.css`, etc.)
  In such cases, specify `-a` as an argument.
  ```shell
  sigen -r -a ./page/ ./out/
  ```

  Add elements only during development.

  Adding an element for during development allows you to remove that element after the Sigen run.
  ```index.html
  <!-- sigen: remove from -->
  <div>Development in progress only</div>
  <!-- sigen: remove to -->
  ```

# License
The source code is licensed MIT.
