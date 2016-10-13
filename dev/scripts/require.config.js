window.require = {
  waitSeconds: 30,
  baseUrl: '.',
  paths: {
    'text': 'bower_components/text/text',
    'domReady': 'bower_components/domReady/domReady',
    'css': 'bower_components/require-css/css',

    'jquery': 'bower_components/jquery/dist/jquery',

    'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap',

    'knockout': 'bower_components/knockout/dist/knockout.debug',

    'crossroads': 'bower_components/crossroads/dist/crossroads',

    'hasher': 'bower_components/hasher/dist/js/hasher',

    'signals': 'bower_components/js-signals/dist/signals',

    'knockout-validation': 'bower_components/knockout-validation/dist/knockout.validation',

    'moment': 'bower_components/moment/moment',
    'moment/lang': 'bower_components/moment/locale/ru',

    'bootstrap-select-js': 'bower_components/bootstrap-select/dist/js/bootstrap-select',
    'bootstrap-select-css': 'bower_components/bootstrap-select/dist/css/bootstrap-select',
    'bootstrap-select-lang': 'bower_components/bootstrap-select/dist/js/i18n/defaults-ru_RU',

    'bootstrap-datepicker': 'bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker',
    'bootstrap-datepicker/css': 'bower_components/eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker',

    'toastr': 'bower_components/toastr/toastr',

    'nprogress': 'bower_components/nprogress/nprogress',

    'knockout-switch-case': 'bower_components/knockout-switch-case/knockout-switch-case',

    'es5-shim': 'bower_components/es5-shim/es5-shim',
    'es5-sham': 'bower_components/es5-shim/es5-sham',
    'json3': 'bower_components/json3/lib/json3',
    'es6-shim': 'bower_components/es6-shim/es6-shim',
    'es6-sham': 'bower_components/es6-shim/es6-sham',

    'startup': 'scripts/startup',
    'startup.employer': 'scripts/startup.employer',

    'authorization': 'scripts/authorization',
    'dataAccess': 'scripts/dataAccess',
    'errors': 'scripts/errors',
    'mediator': 'scripts/mediator',
    'router': 'scripts/router',
    'utils': 'scripts/utils',
    'vm/base': 'scripts/viewModel',
    'ko': 'scripts/ko',
    'polyfill': 'scripts/polyfill',
    'progress': 'scripts/progress',

    'da/employers': 'dataAccess/v1/employer/da-v1-employers',
    'da/employers/tariff-plans': 'dataAccess/v1/employer/da-v1-employers-tariff-plans',
    'da/employers/drivers': 'dataAccess/v1/employer/da-v1-employers-drivers',
    'da/employers/cars': 'dataAccess/v1/employer/da-v1-employers-vehicles',
    'da/employers/countries': 'dataAccess/v1/employer/da-v1-employers-countries'
  },
  shim: {
    'bootstrap': { deps: ['jquery'] },
    'knockout-validation': { deps: ['knockout'] },
    'knockout-switch-case': { deps: ['knockout'] },
    'moment/lang': { deps: ['moment'] },
    'bootstrap-select-lang': { deps: ['bootstrap-select-js'] },
    'es6-sham': { deps: ['es6-shim'] },
    'es6-shim': { deps: ['json3'] },
    'json3': { deps: ['es5-sham'] },
    'es5-sham': { deps: ['es5-shim'] }
  }
}
