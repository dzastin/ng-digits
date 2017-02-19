module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-bump');

  // Project configuration.
  grunt.initConfig({
    distDir: 'dist',
    sourceDir: 'src',
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= distDir %>/<%= pkg.name %>.js',
        dest: '<%= distDir %>/<%= pkg.name %>.min.js'
      }
    },
    clean: [
      '<%= distDir %>'
    ],
    eslint: {
      build: {
        src: [ '<%= sourceDir %>/**/*.js'],
        options: {
          config: '.eslintrc' 
        }
      },
      all: {
        options: {
          config: '.eslintrc' 
        }
      }
    },

    concat: {
      js: {
        options: {},
        src: [
          '<%= sourceDir %>/**/*Cfg.js ',
          '<%= sourceDir %>/**/*.js'
        ],
        dest: '<%= distDir %>/<%= pkg.name %>.js'
      }
    },

    delta: {
      jssrc: {
        files: [ '<%= sourceDir %>/**/*.js' ],
        tasks: [ 'eslint:all', 'concat', 'uglify'], // @todo
        options: {
          spawn: false,
          nospawn: true
        }
      }

    }
  });

  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [ 'build', 'delta' ] );

  grunt.registerTask( 'default', [ 'build' ] );

  grunt.registerTask( 'build', [
    'clean', 'eslint:build', 'concat', 'uglify'
  ]);

  // On watch events configure eslint:all to only run on changed file
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('eslint.all.src', [filepath]);
  });

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};