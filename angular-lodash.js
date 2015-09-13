(function (ng, _) {
  'use strict';

  var
    lodashModule = ng.module('angular-lodash', []),
    utilsModule = ng.module('angular-lodash/utils', []),
    filtersModule = ng.module('angular-lodash/filters', []);

  // begin custom _

  function propGetterFactory(prop) {
    return function(obj) {return obj[prop];};
  }

  _._ = _;

  // Shiv "min", "max" ,"sortedIndex" to accept property predicate.
  _.each(['min', 'max', 'sortedIndex'], function(fnName) {
    _[fnName] = _.wrap(_[fnName], function(fn) {
      var args = _.toArray(arguments).slice(1);

      if(_.isString(args[2])) {
        // for "sortedIndex", transmuting str to property getter
        args[2] = propGetterFactory(args[2]);
      }
      else if(_.isString(args[1])) {
        // for "min" or "max", transmuting str to property getter
        args[1] = propGetterFactory(args[1]);
      }

      return fn.apply(_, args);
    });
  });

  // Shiv "filter", "reject" to angular's built-in,
  // and reserve lodash's feature(works on obj).
  ng.injector(['ng']).invoke(['$filter', function($filter) {
    _.filter = _.select = _.wrap($filter('filter'), function(filter, obj, exp) {
      if(!(_.isArray(obj))) {
        obj = _.toArray(obj);
      }

      return filter(obj, exp);
    });

    _.reject = function(obj, exp) {
      // use angular built-in negated predicate
      if(_.isString(exp)) {
        return _.filter(obj, '!' + exp);
      }

      var diff = _.bind(_.difference, _, obj);

      return diff(_.filter(obj, exp));
    };
  }]);

  // end custom _


  // begin register angular-lodash/utils

  _.each(_.methods(_), function(methodName) {
    function register($rootScope) {$rootScope[methodName] = _.bind(_[methodName], _);}

    _.each([
      lodashModule,
      utilsModule,
      ng.module('angular-lodash/utils/' + methodName, [])
      ], function(module) {
        module.run(['$rootScope', register]);
    });
  });

  // end register angular-lodash/utils


  // begin register angular-lodash/filters

  var
    adapList = [
      'after',
      'assign',
      'at',
      'bind',
      'bindAll',
      'bindKey',
      'chain',
      'clone',
      'cloneDeep',
      'compact',
      'compose',
      'constant',
      'contains',
      'countBy',
      'create',
      'callback',
      'curry',
      'debounce',
      'defaults',
      'defer',
      'delay',
      'difference',
      'escape',
      'every',
      'filter',
      'find',
      'findIndex',
      'findKey',
      'findLast',
      'findLastIndex',
      'findLastKey',
      'first',
      'flatten',
      'forEach',
      'forEachRight',
      'forIn',
      'forInRight',
      'forOwn',
      'forOwnRight',
      'functions',
      'groupBy',
      'has',
      'identity',
      'indexBy',
      'indexOf',
      'initial',
      'intersection',
      'invert',
      'invoke',
      'isArguments',
      'isArray',
      'isBoolean',
      'isDate',
      'isElement',
      'isEmpty',
      'isEqual',
      'isFinite',
      'isFunction',
      'isNaN',
      'isNull',
      'isNumber',
      'isObject',
      'isPlainObject',
      'isRegExp',
      'isString',
      'isUndefined',
      'keys',
      'last',
      'lastIndexOf',
      'map',
      'mapValues',
      'max',
      'memoize',
      'merge',
      'min',
      'mixin',
      'noConflict',
      'noop',
      'now',
      'omit',
      'once',
      'pairs',
      'parseInt',
      'partial',
      'partialRight',
      'pick',
      'pluck',
      'property',
      'pull',
      'random',
      'range',
      'reduce',
      'reduceRight',
      'reject',
      'remove',
      'rest',
      'result',
      'runInContext',
      'sample',
      'shuffle',
      'size',
      'some',
      'sortBy',
      'sortedIndex',
      'tap',
      'template',
      'throttle',
      'times',
      'toArray',
      'transform',
      'unescape',
      'union',
      'uniq',
      'uniqueId',
      'valueOf',
      'values',
      'where',
      'without',
      'wrap',
      'xor',
      'zip',
      'zipObject',
      ['all', 'every'],
      ['any', 'some'],
      ['collect', 'map'],
      ['detect', 'find'],
      ['drop', 'rest'],
      ['each', 'forEach'],
      ['eachRight', 'forEachRight'],
      ['extend', 'assign'],
      ['findWhere', 'find'],
      ['foldl', 'reduce'],
      ['foldr', 'reduceRight'],
      ['head', 'first'],
      ['include', 'contains'],
      ['inject', 'reduce'],
      ['methods', 'functions'],
      ['object', 'zipObject'],
      ['select', 'filter'],
      ['tail', 'rest'],
      ['take', 'first'],
      ['unique', 'uniq'],
      ['unzip', 'zip']
    ];

  _.each(adapList, function(filterNames) {
    if(!(_.isArray(filterNames))) {
      filterNames = [filterNames];
    }

    var
      filter = _.bind(_[filterNames[0]], _),
      filterFactory = function() {return filter;};

    _.each(filterNames, function(filterName) {
      _.each([
        lodashModule,
        filtersModule,
        ng.module('angular-lodash/filters/' + filterName, [])
        ], function(module) {
          module.filter(filterName, filterFactory);
      });
    });
  });

  // end register angular-lodash/filters

}(angular, _));
