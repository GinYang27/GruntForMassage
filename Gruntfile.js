/*global module:false*/
module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			scriptA: {
				src: ['static/js/**/*.js', '!static/js/undefined/*.js','!static/js/app.js', '!static/js/app.routes.js', '!static/js/app.auth.js'],
				dest: 'temp/js/temp.js'
			},
			scriptB: {
				src: ['static/js/app.js', 'static/js/app.routes.js', 'static/js/app.auth.js', '<%= uglify.scriptA.dest %>'],
				dest: 'temp/js/scripts.js'
			},
			final: {
				src: ['dist/**/*.js'],
				dest: 'static/js/scripts.min.js'
			}
		},
		uglify: {
			scriptA: {
				src: '<%= concat.scriptA.dest %>',
				dest: 'temp/js/temp.min.js'
			}, 
			scriptB: {
				options: {
					mangle: false
				},
				src: '<%= concat.scriptB.dest %>',
				dest: 'dist/scripts.min.js'
			}
		},
		// Keep the files inside static/js folder but delete all subfolders
		clean: {
			after: ['temp/', 'static/js/', 'static/css/*.css', '!static/css/style.min.css'],
			final: ['dist/'],
		},
		processhtml: {
			dist: {
				files: {
					'WEB-INF/view/index.jsp': ['WEB-INF/view/index.jsp']
				}
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			  },
			styleA: {
				files: [{
					expand: true,
					cwd: 'static/css',
					src: ['*.css', '!*.min.css'],
					dest: 'static/css',
					ext: '.min.css'
				}]
			},
			styleB: {
				files: {
					'static/css/style.min.css': ['static/css/*.min.css']
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	// Build for deploy
	grunt.registerTask('build', ['processhtml', 'concat:scriptA', 'uglify:scriptA', 'concat:scriptB', 'uglify:scriptB', 'cssmin:styleA', 'cssmin:styleB', 'clean:after', 'concat:final', 'clean:final']);
};
