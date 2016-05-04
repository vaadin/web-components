(function(global) {

  //map tells the System loader where to look for things
  var map = {
    'angular2':                   'angular2', // 'dist',
    'vaadin-charts':              '../directives'
  };

  //packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'angular2':                   { main: 'main.ts',  defaultExtension: 'ts' },
    'vaadin-charts':              { main: 'vaadin-charts.js', defaultExtension: 'js' }
  };

  var packageNames = [
      '@angular/common',
      '@angular/compiler',
      '@angular/core',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic'
  ];

  // add map entries for angular packages in the form '@angular/common': '../node_modules/@angular/common@0.0.0-3'
  packageNames.forEach(function(pkgName) {
    map[pkgName] = '../node_modules/' + pkgName;
  });

  // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
  packageNames.forEach(function(pkgName) {
    packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  var config = {
    transpiler: 'typescript',
    map: map,
    packages: packages
  };

  System.config(config);

})(this);
