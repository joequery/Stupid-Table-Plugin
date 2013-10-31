module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		uglify:
			build:
				files:
					'build/stupidtable.min.js' : 'src/stupidtable.js'

	# Load the plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');

	# Tasks
	grunt.registerTask 'default', ['uglify']
