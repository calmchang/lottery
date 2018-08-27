var gulp = require('gulp'),
gulpSequence = require('gulp-sequence'),//GULP执行顺序
notify = require("gulp-notify"),//用于输出日志
gutil = require("gulp-util"),
minimist = require('minimist'),//获取管道符
uglify = require('gulp-uglify'),//压缩JS
mergeStream = require("merge-stream");//多个任务全部执行完再返回
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var $ = require('gulp-load-plugins')();


var clean = require('gulp-clean');

/**
 * 打包相关的参数
 */
var packageOptions = {
	isRelease: false,//是否生产版本
};


/**
 * 用来检查是否带--env参数，--env参数用来标识打包的版本类型
 * @type {Object}
 */
var knownOptions = {
	string:'env',
	default:{env:process.env.NODE_ENV || 'dev'}
};


var options = minimist(process.argv.slice(2),knownOptions);


if( options.env == 'production' ){
	packageOptions.isRelease = true;
}


function log(msg,color){
	gutil.log(gutil.colors[color](msg));
}


var errorReport = function(error){
	var args = Array.prototype.slice.call(arguments);
	log(error,'red');
	//notify.onError("error: " + error.relativePath).apply(this, args);//替换为当前对象
	this.emit();
};




gulp.task('clean', function() {		
	var task1 = gulp.src(['tmp','dist','tmp_rjs']).pipe(clean());
	return mergeStream(task1);
});



var sass = require('gulp-sass'),//编译SCSS
autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function() {
	var mode = 'compressed';
	if( packageOptions.isRelease === false ){
		mode = 'nested';
	}
  return gulp.src('css/*.scss')
		.pipe( sass({outputStyle:mode}) ).on('error', errorReport)
		.pipe( autoprefixer({
						browsers:['last 9 versions',"> 5%"],
						cascade:true,
						remove:true,
					})).on('error', errorReport)
    .pipe(gulp.dest('dist/css'));
});


gulp.task('resource', function() {
	var task2= gulp.src(['image/**/*'], {base:'.'})
	.pipe( gulp.dest("dist/") );

	return mergeStream(task2);

});

gulp.task('html', function() {
	var task2= gulp.src(['*.html'], {base:'.'})
	.pipe($.htmlmin({
			removeComments: true,
      removeEmptyAttributes: true,
      removeAttributeQuotes: true,
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      customAttrSurround: [
        [/@/, /(?:)/]
      ]
   }))
	.pipe( gulp.dest("dist/") );

	return mergeStream(task2);

});

gulp.task('plugin', function() {

	var compress = { compress:false,mangle:false,output:{beautify:true} };
	compress={};

  return gulp.src('plugin/*.js')
		.pipe( uglify(compress) )
    .pipe(gulp.dest('dist/plugin/'));
});


gulp.task('js', function() {

	var compress ={};
	
	if( packageOptions.isRelease === false ){
		compress = { compress:false,mangle:false,output:{beautify:true} };
	}

  return gulp.src('js/*.js')
		.pipe( uglify(compress) )
    .pipe(gulp.dest('dist/js'));
});


var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


var connect = require('gulp-connect');//WEB服务器
//var reload = 	function(){connect.reload();};

gulp.task('web', ['resource','html','js','plugin','sass'],function(){
	var ret = browserSync.init({
  			browser: "google chrome",
        server: {
            baseDir: "./dist",
            directory: true
        }
    });

	gulp.watch([ 'css/*.scss'],function(event){
		gulpSequence('sass')(function(err){
			if(err)console.log(err);
		});
	});

	gulp.watch([ '*.html'],function(event){
		gulpSequence('html')(function(err){
			if(err)console.log(err);
		});
	});

	gulp.watch([ 'image/*.*'],function(event){
		gulpSequence('resource')(function(err){
			if(err)console.log(err);
		});
	});

	gulp.watch([ 'js/*.js'],function(event){
		gulpSequence('js')(function(err){
			if(err)console.log(err);
		});
	});

	gulp.watch([ 'plugin/*.js'],function(event){
		gulpSequence('plugin')(function(err){
			if(err)console.log(err);
		});
	});
	return ret;
});


gulp.task('dev', ['web'], function(){

	
});






