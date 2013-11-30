module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		coffee:
			compile:
				files:
					'src/stupidtable.js' : 'src/stupidtable.coffee'

		uglify:
			build:
				files:
					'build/stupidtable.min.js' : 'src/stupidtable.js'

	# Load the plugins
	grunt.loadNpmTasks	'grunt-contrib-uglify'
	grunt.loadNpmTasks	'grunt-contrib-coffee'

	# Tasks
	grunt.registerTask 'build',		[ 'coffee', 'uglify' ]
	grunt.registerTask 'default', 'build'
