'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var wiredep = require('wiredep');

var mkdirp = require('mkdirp');
var _s = require('underscore.string');

module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    // this.log(yosay(
    //   'Welcome to the remarkable ' + chalk.red('generator-mobile-app-myl') + ' generator!'
    // ));

    var prompts = [
      {
        type: 'confirm',
        name: 'includeJquery',
        message: 'Would you like to use jQuery?',
        default: true
      },
      {
        type: 'input',
        name:'name',
        message :'文件夹名字',
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  default: function(){
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your generator must be inside a folder named ' + this.props.name + '\n' +
        'I\'ll automatically create this folder.'
      );
      mkdirp(this.props.name);
      this.destinationRoot(this.destinationPath(this.props.name));
    }
  },

  writing: function () {
    var packageJson = {

    };
    this.fs.writeJSON('package.json',packageJson);

    var bowerJson = {
      name: this.appname,
      private: true,
      main: 'index.html',
      dependencies: {}
    };
    if(this.props.includeJquery){
      bowerJson.dependencies['jquery'] = '~2.1.1';
    }
    this.fs.writeJSON('bower.json',bowerJson);

    this.fs.copy(
      this.templatePath('main.js'),
      this.destinationPath('scripts/main.js')
    );

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('main.scss'),
      this.destinationPath('styles/main.scss')
    );
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('index.html')
    );
    this.fs.copy(
      this.templatePath('touch/'),
      this.destinationPath('images/touch/')
    );
  },

  install: function(){
    this.installDependencies({ });
  },
  end:function(){
    wiredep({ src: 'index.html' });
  }
});
