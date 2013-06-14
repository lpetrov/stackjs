======
What is StackJS:
======

StackJS is a combination of libraries to help us:

1. Glue together all kind of jQuery plugins, w/ flexible features as: default settings, per environment settings,
    per instance settings and per DOM Node settings (using data-* attributes)

2. StackJS is lightweight and we can use only the part that you need most (e.g. config)

3. StackJS introduces a highly flexible Configuration management system, which w/ just few lines of code helps you
    manage different environments (local, dev, staging). No more copy/pasting/git(hg)ignoring/commenting or uncommenting
    is needed before deploying to production, staging or local dev.

4. Basic framework for building jQuery plugins! No more vanilla js hacking and black magic,
    leave the complex stuff to StackJS. By hiding the complexity of creating plugins, our code will start look more
    organized, because most of the UI part can be moved from your 'main.js' (or 'app.js', etc) to a simple
    $("#loginForm").loginForm() call (<- example of how you can also use this to create "composite"-like widgets for
    the modern web).

5. Currently in (hard core) developer preview. This means most of the code will not ready for production/development,
    the code is here, to be reviewed by other developers so that together we can prepare a strong foundation for a
    stable API, features and functionality for the first RC/stable version.


======
StackJS is NOT (and never will be)
======

1. JavaScript Framework: StackJS is a library (combination of helper tools).

2. jQuery UI replacement: StackJS offers easy to use method for creating jQuery plugins (similar to jQuery UI's
    widgets), but does NOT include any premade UI components.

3. Package manager: StackJS DOES includes some libraries in itself, but its will never be a package manager or a
    package repository.

======
StackJS includes:
======

 - TOP FEATURES >>

 - jQuery Plugin Framework

 - Flexible JS config system that support different environments, depending on the current domain name

 - Flexible Logging for JavaScript - at last! :)

 - << END OF TOP FEATURES

 - Fork of HTML5 Bootstrap

 - .htaccess tricks
    - ! IE cross-iframe cookie issue fix !

 - Facebook initializer
    - Facebook channel.html
    - Facebook asyncInit
    - Facebook hacks for the autoGrow (can be set to manual width/height using a config var)
    - Facebook 'onload scroll to top' hack (can be disabled)

 - Refactor all Components to have default and namespaced settings (in the config)
 - Configuration system priorities are now: Component.defaults -> Config -> bootstrap({'config_values': 'can be overwritten here'})

 - Google Analytics initializer
     - Track outbound links
     - GA.exec('command', 'value', 'misc args') is now logged in to the console. simple but powerful solution when
     debugging custom trackEvents calls.
 - AddThis integration
 - Less integration
 - Export resources (scripts and styles in the correct order) - helper JS func that outputs the currently used js and
 css files (will be used some day in the resource compiler)


======
TODO:
======

 - Rename StackJS to something else. Ideas?

 - Your feature here!

 - Do some marketing stuff for RC1:
    - website
    - documentation

 - Sass integration?

 - Tastypie API clients generator:
    - JavaScript

 - Automatic Documentation generation, based on the StackJS's jQuery Plugins:
    - cool UI
    - show options
    - show events
    - show API w/ documentation from /* @comments? */ (or something similar)
    - show examples
    - allow the end user to alter the examples and rerun them in the browser (helpful for Stackjs jQuery plugins)

 - Write tests?
    - open question: which testing framework should we use?

 - Some day, we should find a proper package manager to use to distribute StackJS:
    - possible candidate: bower

 - Less integration - impl. watch mode (1.3.1 have issues with #!watch, so we will need to wait for bugfix)

 - Resource compiler that already knows Stack's dir. structure

 - Facebook Mobile Web App
   - Base template
   - Refactor Facebook.js to be aware of the current app type

 - Widgets:
    - Facebook Like Gate (js only? hm...)

 - Facebook PHP Library
