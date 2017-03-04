// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


angular.module('starter', ['ionic', 'starter.controllers','starter.filters','chart.js','ngCordova','ngCordova.plugins.instagram', 'credit-cards'])

.run(function($ionicPlatform, $ionicPopup, $cordovaGoogleAnalytics) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(false);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    
    if (window.cordova && window.cordova.InAppBrowser) {
        window.open = cordova.InAppBrowser.open;
    }
    
    if(typeof analytics !== undefined) {
        //console.log(analytics);
        //analytics.startTrackerWithId("UA-91977093-1"); // you must insert your UA code.(UA-91977093-1)
        //analytics.tracView("whatever");

        console.log("starting analytics");
    } else {
        console.log("Google Analytics Unavailable");
    }
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.start', {
      url: '/start',
      views: {
        'menuContent': {
          templateUrl: 'templates/start.html',
          controller: 'StartCtrl'
        }
      }
    })


    .state('app.loginscreen', {
      url: '/loginscreen',
      views: {
        'menuContent': {
          templateUrl: 'templates/loginscreen.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.forgotscreen', {
      url: '/forgotscreen',
      views: {
        'menuContent': {
          templateUrl: 'templates/forgotscreen.html',
          controller: 'LoginCtrl'
        }
      }
    })


    .state('app.signupscreen', {
      url: '/signupscreen',
      views: {
        'menuContent': {
          templateUrl: 'templates/signupscreen.html',
          controller: 'SignUpCtrl'
        }
      }
    })

  .state('app.main', {
      url: '/main',
      views: {
        'menuContent': {
          templateUrl: 'templates/main.html',
          controller: 'MainCtrl'
        }
      }
    })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'BrowseCtrl'
        }
      }
    })

  .state('app.history', {
    url: '/history',
    views: {
      'menuContent': {
        templateUrl: 'templates/history.html',
        controller: 'HistoryCtrl'
      }
    }
  })


  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingsCtrl'

      }
    }
  })


  .state('app.premiumpage', {
      url: '/premiumpage',
      views: {
        'menuContent': {
          templateUrl: 'templates/premiumpage.html',
          controller: 'PremiumCtrl'
        }
      }
    })


  .state('app.pricepage', {
      url: '/pricepage',
      views: {
        'menuContent': {
          templateUrl: 'templates/pricepage.html',
          controller: 'PremiumCtrl'
        }
      }
    })

    .state('app.promo', {
      url: '/promo',
      views: {
        'menuContent': {
          templateUrl: 'templates/promo.html',
          controller: 'PremiumCtrl'
        }
      }
    })

  .state('app.mworkouts', {
      url: '/mworkouts',
      views: {
        'menuContent': {
          templateUrl: 'templates/mworkouts.html',
          controller: 'MaleCtrl'
        }
      }
    })

  .state('app.fworkouts', {
      url: '/fworkouts',
      views: {
        'menuContent': {
          templateUrl: 'templates/fworkouts.html',
          controller: 'WomenCtrl'
        }
      }
    })

  .state('app.details', {
      url: '/details',
      views: {
        'menuContent': {
          templateUrl: 'templates/details.html',
          controller: 'DetailsCtrl'
        }
      }
    })

  .state('app.count', {
    url: '/count',
    views: {
      'menuContent': {
        templateUrl: 'templates/count.html',
        controller: 'countCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.workout', {
    url: '/workout',
    views: {
      'menuContent': {
        templateUrl: 'templates/workout.html',
        controller: 'WorkoutCtrl'
      }
    }
  })

  .state('app.quote', {
    url: '/quote',
    views: {
      'menuContent': {
        templateUrl: 'templates/quote.html',
        controller: 'QuoteCtrl'
      }
    }
  })


    .state('app.results', {
    url: '/results',
    views: {
      'menuContent': {
        templateUrl: 'templates/results.html',
        controller: 'ResultsCtrl'
      }
    }
  })


  .state('app.privacy', {
    url: '/privacy',
    views: {
      'menuContent': {
        templateUrl: 'templates/privacy.html'
      }
    }
  })


  .state('app.toc', {
    url: '/toc',
    views: {
      'menuContent': {
        templateUrl: 'templates/toc.html'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/start');
});
