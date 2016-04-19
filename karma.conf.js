module.exports = function(config) {
  config.set({
    browsers: ['Firefox'],
    frameworks: ['jasmine'],
    files: [
	  'vendors.js',
      'src/**/*.js',
      'test/**/*.spec.js'
    ]
  });
};