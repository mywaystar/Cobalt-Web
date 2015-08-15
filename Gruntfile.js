module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      cobalt: {
        src: [
          'src/base.js',

          'src/default.js',
          'src/plugins.js',
          'src/storage.js',
          'src/utils.js',

          'src/ui/alert.js',
          'src/ui/datepicker.js',
          'src/ui/nativebars.js',
          'src/ui/navigate.js',
          'src/ui/openexternalurl.js',
          'src/ui/pulltorefresh.js',
          'src/ui/toast.js',
          'src/ui/weblayer.js',

          'src/adapters/android.js',
          'src/adapters/ios.js',
          'src/adapters/debug.js',

          'src/loader.js',
       ],
        dest: 'dist/cobalt.js',      // 'build/abcde.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', function() {
    grunt.task.run('build');
  });

  grunt.registerTask('build', function() {
    grunt.task.run('concat');
  });
};
