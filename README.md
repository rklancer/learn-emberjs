# Learn.Ember.js

### Description:

A live editor and tutorial system inspired by [learn.knockoutjs.com](http://learn.knockoutjs.com). In progress.

For fancy fonts, obtain a no-cost license for the web fonts [MuseoSlab 500](http://www.myfonts.com/fonts/exljbris/museo-slab/500/) and [MuseoSlab 500 Italic](http://www.myfonts.com/fonts/exljbris/museo-slab/500-italic/) and put the `.woff`, `.eot`, and `ttf` files into the `webfonts` directory under the names `MuseoSlab-500.*` and `MuseoSlab-500Italic.*`.

### Getting started:

  * Make sure you have Ruby 1.9.2 installed. It's recommended to use [rvm](http://rvm.beginrescueend.com/) to manage your Rubies and Gems.
  * Clone the repo and cd to the `learn-emberjs` directory:

    ```
    $ git clone http://github.com/rklancer/learn-emberjs.git
    $ cd learn-emberjs
    ```
  * Install submodules for Ace and Ember.js:

    ```
    $ git submodule update --init
    ```

  * If you're using RVM to manage gemsets, you probably want to create and use a fresh gemset:

    ```
    $ echo 'rvm use 1.9.2@learn-emberjs --create' > .rvmrc
    $ cd ..; cd learn-emberjs
    ```
  
  * Run 'bundle install' to get the BPM gem: 

    ```
    $ bundle install
    ```
   
  * Repeat the rvm and bundle install steps for in `vendor/ember.js`:

    ```
    $ cd vendor/ember.js
    $ echo 'rvm use 1.9.2@emberjs --create' > .rvmrc
    $ cd ..; cd ember.js
    $ bundle install
    ```
   
  * Run `rake` inside the `vendor/ember.js` folder to build Ember itself:

    ```
    $ rake
    ```
    
  * Finally, to open a local copy of Learn.Ember.js, run `bpm preview` in the root of the repo, and open http://localhost:4020/index.html in your favorite browser.

    ```
    $ cd ../..    
    $ bpm preview
    ```
   
### Building a static version:

  * The rake task `build` will build a static copy of Learn.Ember.js into the directory `dist/`, with the main tutorial page at `dist/index.html`. The cross-iframe access required by Learn.Ember.js will be blocked by Chrome if you open `index.html` using the `file` protocol, so run a local server to visit the tutorial. Assuming you have Python installed on your system, you can run `python -m SimpleHTTPServer` in the `dist/` folder, and then visit http://localhost:8000/index.html in your browser.

    ```
    $ rake build
    $ cd dist; python -m SimpleHTTPServer
    ```
    
  * The (default) rake task `tarball` will build a tarball, `learn-emberjs.tar.gz` which can be inflated into the base directory of your choice on a static webserver.

    ```
    $ rake 
    $ ls learn.emberjs.tar.gz
    ```
