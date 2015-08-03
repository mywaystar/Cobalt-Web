### How to use ?

**Don't** use these scripts if you just want to use the framework.
Use the concatened & minified versions at [github.com/cobaltians/Cobalt](https://github.com/cobaltians/Cobalt) instead.

You can also use git submodules or svn externals to get the scripts from [Cobalt-Web-iOS](https://github.com/cobaltians/Cobalt-Web-iOS) and [Cobalt-Web-Android](https://github.com/cobaltians/Cobalt-Web-Android).

### I want to help on Cobalt, how does it work ?

Javascript files are split into a common file for all OS and an adapter file for each platform.

There is no all-in-one-with-autodection version yet but we think about it :)

#### How to compile new versions from this sources ?

To build cobalt.js and cobalt.min.js files for each platform in one row, run the following command line:

    python compile.py

##### Building requirements

* You will need Python > 2.7
* 'uglifyjs' should be installed first for minified versions to be built. You can find UglifyJS [here](https://github.com/mishoo/UglifyJS) as a node package.
* make sure to have git cloned [Cobalt-Web-Android](https://github.com/cobaltians/Cobalt-Web-Android) and [Cobalt-Web-iOS](https://github.com/cobaltians/Cobalt-Web-iOS) in the same folder as this one because the script will try to write to `../Cobalt-Web-[platform]/`