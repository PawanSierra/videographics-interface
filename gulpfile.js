'use strict';

let fs = require("fs"),
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    // autoprefixer = require("autoprefixer"),
    orderValues = require("postcss-ordered-values"),
    connect = require("gulp-connect"),
    sourcemap = require("gulp-sourcemaps"),
    imagemin= require("gulp-imagemin"),
    sync = require("gulp-directory-sync"),
    cleancss = require("gulp-clean-css"),
    mqpacker = require("css-mqpacker"),
    merge = require("postcss-merge-rules"),
    cssnext = require("postcss-cssnext"),
    ssync = require("gulp-scp"),
    htmlbeautify = require("gulp-html-beautify"),
    //customselector = require('postcss-custom-selectors'),
    placehold = require("postcss-placehold");
    // clip_path = require("postcss-clip-path-polyfill");


//let prefixer = autoprefixer({browsers: "last 5 versions" , grid:true }); //clip_path()

let plugins = [cssnext({ features:{ customProperties:{ preserve:true }, grid:true   } , browsers: ['last 2 version']  }),orderValues(),mqpacker(),merge()];

              //,merge_long() , customselector(), placehold()

gulp.task('connect',() => {

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

gulp.task('sass',() => {

  return gulp.src("www/sass/**/*.scss")
               .pipe(sourcemap.init())
               .pipe(sass({}).on('error',sass.logError)) //sourceMaps: true
               .pipe(postcss(plugins,{}))
               .pipe(sourcemap.write('.'))
               .pipe(gulp.dest("www/css/"));
});

gulp.task('reload',() => {

  return gulp.src("*")
              .pipe(connect.reload());
});


gulp.task('production',() => {


  let imagesminify =  gulp.src("www/images/*")
                          .pipe(imagemin({ progressive: true, optimizationLevel:5, removeViewBox: true }))
                          .pipe(gulp.dest("dist/images/"));

  let files_sync   =  gulp.src("")
                          .pipe(sync('www/','dist/',{ printSummary:true , ignore:"sass"}))
                          .on('error',() => {
                                console.log("Something went wrong with files sync!");
                          });

  let cssminify    = gulp.src('dist/css/*.css')
                          .pipe(cleancss())
                          .pipe(gulp.dest("dist/css/"));


  let htmlbeauty   = gulp.src('www/*.html')
                          .pipe(htmlbeautify({indentSize: 2}))
                          .pipe(gulp.dest('dist/'));



  return [files_sync,imagesminify,cssminify,htmlbeauty];


});



gulp.task('watch',() => {

    console.log("waiting for changes");
    gulp.watch('www/sass/**/*.scss',['sass']);
    gulp.watch('www/css/*.css',['reload']);
    gulp.watch('www/**/*.html',['reload']);

});

gulp.task('default',['connect','watch']);
