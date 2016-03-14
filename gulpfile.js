var gulp = require('gulp'),
	less = require('gulp-less'),
	//当发生异常时提示错误 确保本地安装gulp-notify和gulp-plumber
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');
var srcPath = "public/src/",
	bulidPath  = "public/bulid/";
gulp.task('taskless',function(){
	return gulp.src(srcPath+'css/*.less',{base:srcPath})
	.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
	.pipe(less())
	.pipe(gulp.dest(bulidPath));
});
gulp.task('default',function(){
   return	gulp.watch(srcPath+'css/*.less',['taskless']);
});