'use strict';

let fs = require("fs"),
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    //autoprefixer = require("autoprefixer"),
    orderValues = require("postcss-ordered-values"),
    connect = require("gulp-connect"),
    sourcemap = require("gulp-sourcemaps"),
    imagemin= require("gulp-imagemin"),
    sync = require("gulp-directory-sync"),
    cleancss = require("gulp-clean-css"),
    mqpacker = require("css-mqpacker"),
    merge = require("postcss-merge-rules"),
    cssnext = require("postcss-cssnext"),
    ssync = require("gulp-scp");


let plugins = [cssnext({ customProperties:true  , browsers: "last 5 versions" , grid:true }),orderValues(),mqpacker(),merge()]; //,merge_long() autoprefixer({browsers: "last 6 versions", grid:true})

gulp.task('connect',function() {

  connect.server({

    host:'192.168.100.162',
    port:4000,
    livereload:true,
    root:"www/"

  });
  connect.server({

    host:'192.168.100.162',
    port:4001,
    livereload:true,
    root:"dist/"

  });

});
gulp.task('sass',function() {

  return gulp.src("www/sass/*.scss")
               .pipe(sourcemap.init())
               .pipe(sass({}).on('error',sass.logError)) //sourceMaps: true
               .pipe(postcss(plugins,{}))
               .pipe(sourcemap.write('.'))
               .pipe(gulp.dest("www/css/"));
});

gulp.task('reload',function(){

  return gulp.src("*")
              .pipe(connect.reload());
});
gulp.task('production',function() {

  let imagesminify =  gulp.src("www/images/*")
                          .pipe(imagemin({ progressive: true, optimizationLevel:5, removeViewBox: true }))
                          .pipe(gulp.dest("dist/images/"));

  let files_sync =  gulp.src("")
                          .pipe(sync('www/','dist/',{ printSummary:true , ignore:"sass"}))
                          .on('error',function(){
                                console.log("Something went wrong with files sync!");
                          });

  let cssminify = gulp.src('dist/css/*.css')
                          .pipe(cleancss())
                          .pipe(gulp.dest("dist/css/"));




  return [files_sync,imagesminify,cssminify];


});


gulp.task('watch',function(){

  console.log("waiting for changes");
  gulp.watch('www/sass/**/*.scss',['sass']);
  gulp.watch('www/css/*.css',['reload']);
  gulp.watch('www/**/*.html',['reload']);

});
gulp.task('default',['connect','watch']);
