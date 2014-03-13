// livereload用の設定
var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var folderMount = function folderMount(connect, dir) {
    return connect.static(path.resolve(dir));
  };


module.exports = function(grunt){
  // 読み込むプラグインの設定
  var taskName;
  var pkg = grunt.file.readJSON('package.json');
  for(taskName in pkg.devDependencies) {
    if(taskName.substring(0, 6) == 'grunt-') {
      grunt.loadNpmTasks(taskName);
    }
  }


  // 各タスクの設定
  grunt.initConfig({
    // package.jsonの定義
    pkg: pkg,

    // connect ブラウザ自動更新
    connect: {
      livereload: {
        options: {
          port: 9003,
          middleware: function(connect, options) {
            // http://localhost:9001/ でルートディレクトリを設定
            return [lrSnippet, folderMount(connect, 'develop')];
          }
        }
      }
    },

    // open gruntコマンド実行時にページをブラウザで開く
    open: {
      server: {
        path: 'http://localhost:<%= connect.livereload.options.port %>'
      }
    },

    // watch フォルダ監視
    watch: {
      // options
      options: {
        livereload: true,
        nospawn: true
      },
      // html
      html: {
        develop: 'develop/**/*.html',
        tasks: []
      },
      // scss
      // sass: {
      //   develop: 'develop/_scss/**/*.scss',
      //   tasks: ['compassMultiple']
      // },
      css: {
        develop: 'develop/**/*.css',
        tasks: []
      },
      // Java Script
      scripts: {
        develop: 'develop/js/**/*.js',
        tasks: []
      }
    },

    // compass-multiple Compassのコンパイル(マルチスレッド使用)
    compassMultiple: {
      options: {
        // Compassの設定にconfig.rbを使う
        config: 'config.rb',
        // SCSSを置いているディレクトリを指定(必須) ※サブディレクトリが合ってもちゃんと監視してくれる
        sassDir: 'develop/_scss'
      },
      common: {}
    },

    // htmlmin HTMLの圧縮
    htmlmin: {
      all: {
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeCDATASectionsFromCDATA: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          removeOptionalTags: true
        },
        expand: true,
        cwd: 'develop/',
        src: ['**/*.html'],
        dest: 'release_test/'
      }
    },

    // combine-media-queries メディアクエリをまとめる
    cmq: {
      options: {
        log: false
      },
      dev: {
        develop: {
          'develop/': ['develop/style.css']
        }
      }
    },

    // csscomb CSSプロパティを整理
    csscomb: {
      dev: {
        expand: true,
        cwd: 'develop/',
        src: ['style.css'],
        dest: 'develop/'
      }
    },

    // cssmin CSSの圧縮
    cssmin: {
      all: {
        expand: true,
        cwd: 'develop/',
        src: ['style.css'],
        dest: 'release_test/'
      }
    },

    // uglify JSの圧縮
    uglify: {
      build: {
        src: 'develop/js/<%= pkg.name %>.js',
        dest: 'release_test/js/<%= pkg.name %>.js'
      }
    },

    // copy ファイルのコピー
    copy: {
      html: {
        expand: true,
        cwd: 'develop/',
        src: ['**/*.html'],
        dest: 'release_test/'
      },
      css: {
        expand: true,
        cwd: 'develop/',
        src: ['**/*.css'],
        dest: 'release_test/'
      },
      images: {
        expand: true,
        cwd: 'develop/',
        src: ['img/**'],
        dest: 'release_test/'
      },
      js: {
        expand: true,
        cwd: 'develop/',
        src: ['js/**'],
        dest: 'release_test/'
      },
      develop: {
        expand: true,
        cwd: 'develop/',
        src: ['font/**'],
        dest: 'release_test/',
        filter: 'isFile'
      }
    },

    // clean 不要ファイルを削除
    clean: {
      // 最初にreleaseディレクトリ内を削除
      deleteReleaseDir: {
        src: 'release_test/'
      }
    }
  });


  // gruntコマンドで実行するタスクの設定
  // デフォルトタスク(作業時)
  grunt.registerTask('default', ['connect','open','watch'/*,'compassMultiple'*/]);

  // 公開時に実行するタスク
  grunt.registerTask('release', ['clean:deleteReleaseDir','cmq','csscomb','copy'/*,'htmlmin'*/,'cssmin','uglify']);
};