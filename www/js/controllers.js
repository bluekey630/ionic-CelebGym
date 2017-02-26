angular.module('starter.controllers', [])

.controller('AppCtrl', function($rootScope, $scope, $ionicModal, $timeout, $ionicPopup, $http, $state, $ionicLoading, $cordovaGoogleAnalytics) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});



  // Form data for the login modal
  $rootScope.loginData = {fname:"",lname:"",weight:"",age:"",gender:"female",color:"#00a6f5", image:"img/1fb-01.png"};
  $rootScope.menucolor="black";//come and change to white later
  $rootScope.loginData.email = "zhengcheng@outlook.com";
  $rootScope.loginData.password = "a";
  //backend server url
  $rootScope.url = "http://ec2-54-144-105-136.compute-1.amazonaws.com:3000/";//"http://192.168.0.125:3000/"
  $rootScope.bLoginStatus = false;
  $rootScope.loginData.enabledPromocode = false;
  $rootScope.loginData.isPremiumUser = false;
  
  // Create the login modal that we will use later

  $scope.lockimage = "img/unlock.png";

  $scope.$on("$ionicView.beforeEnter", function () {
    
    if ($rootScope.loginData.isPremiumUser) {
      $scope.lockimage = "img/unlock.png";
    }
    else {
      $scope.lockimage = "img/lock2-01.svg";
    }

  });

  $scope.goHistory = function() {

    if ($rootScope.loginData.isPremiumUser) {
      $state.go('app.history');
    }
    else {
      $rootScope.confirmAlert("Upgrade Primium User.", "OK");
    }

    
  }


  $rootScope.serverConnectAWS = function(mode, user, callback) {
    var spinner = '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner><br/>';
    switch (mode)
    {
      case 'login': 
          var data = {'email' : user.email, 'password' : user.pwd};
          
          $ionicLoading.show({ template: spinner + 'Loading Products...' });
          $http.post($rootScope.url + 'confirmuser',  user).then(function (res) {     
            var msg = res.data.msg;
      //      console.log(user.msg);
            $ionicLoading.hide();
            if(msg == 'success') {
              $rootScope.bLoginStatus = true;
              console.log(res);
              $rootScope.loginData = JSON.parse(res.data.item);
              $rootScope.loginData.weight = parseInt($rootScope.loginData.weight)||0;
              $rootScope.loginData.age = parseInt($rootScope.loginData.age)||0;
              console.log("root scope:"+$rootScope.loginData);
              
              //   $rootScope.saveDataLocalStorage($rootScope.loginData);
               //console.log("save data:"+JSON.stringify($rootScope.loginData));
               window.localStorage.setItem(data.email, JSON.stringify($rootScope.loginData));
            }
            callback(res);
          })
          .catch(function (err) {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Error',
              template: 'Network can not connect to server.'
            });
          });
          
          break;

      case 'forgot': 
          var data = {'email' : user.email, 'password' : user.password};
          $ionicLoading.show({ template: spinner + 'Loading Products...' });
          $http.post($rootScope.url + 'forgot',  data).then(function (res) {     
            var msg = res.data.msg;
      //      console.log(user.msg);
            $ionicLoading.hide();
            if(msg == 'success') {
              $rootScope.bLoginStatus = true;
              console.log(res);
              $rootScope.loginData = JSON.parse(res.data.item);
              $rootScope.loginData.weight = parseInt($rootScope.loginData.weight)||0;
              $rootScope.loginData.age = parseInt($rootScope.loginData.age)||0;
              console.log("root scope:"+$rootScope.loginData);
              
              //   $rootScope.saveDataLocalStorage($rootScope.loginData);
               //console.log("save data:"+JSON.stringify($rootScope.loginData));
               window.localStorage.setItem(data.email, JSON.stringify($rootScope.loginData));
            }
            callback(res);
          })
          .catch(function (err) {
            $ionicLoading.hide();
            $ionicPopup.alert({
              title: 'Error',
              template: 'Network can not connect to server.'
            });
          });
          break;    
            
      case 'signup':
          var data = {'email' : user.email, 'password' : user.pwd};

          $http.post($rootScope.url + 'confirmuser',  user).then(function (res) {     
            var msg = res.data.msg;
            if(msg == 'success') {
              $scope.confirmAlert("This Email have already registered.", "RETRY");
              return null;              
            } else {
              $ionicLoading.show({ template: spinner + 'Loading Products...' });
              $http.post($rootScope.url + 'users',  user).then(function (res) {
                $ionicLoading.hide();     
                if(res.data.msg == 'success') {
                  console.log(res.data.item);
                  //$rootScope.loginData = JSON.parse(res.data.item);
                  $rootScope.loginData.weight = parseInt($rootScope.loginData.weight)||0;
                  $rootScope.loginData.age = parseInt($rootScope.loginData.age)||0;
                  console.log($rootScope.loginData);
                  window.localStorage.setItem(data.email, JSON.stringify($rootScope.loginData));
                  //console.log($rootScope.loginData);
                  //$rootScope.saveDataLocalStorage($rootScope.loginData);
                }
                callback(res);
              })
              .catch(function (err) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: 'Error',
                  template: 'Network can not connect to server.'
                });
              });
            }
          });          
          break;
            
      case 'update': 

          if ($rootScope.bLoginStatus && 
            $rootScope.loginData.email &&   
            $rootScope.loginData.email.length > 0) {
          
              var data = {};

              for ( var obj in user) {
                if (obj == "_id") {
                  continue;
                }
                data[obj] = user[obj];
              }

              //console.log(data);
              //console.log("I love you!!!!!!!!!!!!!!!!!");  
              $http.put($rootScope.url + 'users/' + $rootScope.loginData._id,  data).then(function (res) {
     
                var msg = res.data.msg;
      
                if(msg == 'success') {
                  //console.log("I love you!!!!!!!!!!!!!!!!!");
                  //$rootScope.saveDataLocalStorage($rootScope.loginData);
                  window.localStorage.setItem(data.email, JSON.stringify($rootScope.loginData));
                } else {
                    $rootScope.confirmAlert(msg, "RETRY");
                }
              });
          }
          
          break;
      case 'promocode':
          if ($rootScope.bLoginStatus && 
            $rootScope.loginData.email &&   
            $rootScope.loginData.email.length > 0) {
              $http.get($rootScope.url + 'incpcode' + user._id).then(function (res) {                  

              });
          }
          break;
            
      case 'delete': 
          
          break;
            
      default: break
    }

  }

 
  $rootScope.confirmAlert = function(msg, okText){
       var alertPopup = $ionicPopup.alert({
        cssClass: 'myPopup',
         template: msg,
         okText: okText, // String (default: 'OK'). The text of the OK button.
         okType: 'button button-balanced', // String (default: 'button-positive'). The type of the OK button.
       });

       alertPopup.then(function(res) {
         console.log('Thank you for not eating my delicious ice cream cone');
       });  
  }


  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
      $scope.modal.hide();  
    
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


// .filter('ordinal', function(){
//   return function(number){
//     if(isNaN(number) || number < 1){
//       return number;
//     } else {
//       var lastDigit = number % 10;
//       if(lastDigit === 1){
//         return number + 'st'
//       } else if(lastDigit === 2){
//         return number + 'nd'
//       } else if (lastDigit === 3){
//         return number + 'rd'
//       } else if (lastDigit > 3){
//         return number + 'th'
//       }
//     }
//   }
// })

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

//Start Controller -Choose Login/Sign Up Screens

.controller('StartCtrl', function($scope, $state, $ionicSideMenuDelegate) {

  $ionicSideMenuDelegate.canDragContent(false)


  $scope.gotologin = function() {
      $state.go('app.loginscreen');
  };

   $scope.gotosignup = function() {
      $state.go('app.signupscreen');
  };


})


//Login Controller -Input Login Details Screen

.controller('LoginCtrl', function($scope, $state, $rootScope, $ionicHistory, $http, $ionicPopup, $cordovaGoogleAnalytics) {

  $scope.confirm = function(){
     
    var bLoginStatus = false,
        email = $rootScope.loginData.email,
        pwd = $rootScope.loginData.password;
    
  //      console.log("user:"+ email);//+JSON.stringify($rootScope.loginData));
    if (email != "" && pwd != "") {
      
      // var savedUser = window.localStorage.getItem(email);
      // //console.log("login:"+savedUser);
      // if (savedUser != undefined) {
      //   $rootScope.saveDataLocalStorage = true;
      //   //confirm user information on localstorage.
      //     savedUser = JSON.parse(savedUser);
      //     //console.log(savedUser);
      //     var sEmail = savedUser.email,
      //         sPwd = savedUser.password;
      //     if(sEmail == email && pwd == sPwd){
      //        //$rootScope.bLoginStatus = true;

      //        $rootScope.loginData = savedUser;//window.localStorage.getItem(email);
      //        $rootScope.loginData.weight = parseInt($rootScope.loginData.weight)||0;
      //        $rootScope.loginData.age = parseInt($rootScope.loginData.age)||0;
      //        console.log($rootScope.loginData);
      //     }  
      //     //console.log(window.localStorage.getItem(email));
                   
      //     //($rootScope.bLoginStatus) ? $scope.gotobrowse() : $scope.signinonserver($rootScope.loginData);
      // } else {
      //   $rootScope.saveDataLocalStorage = false;
      // }

      // if ($rootScope.bLoginStatus) {
      //     //if(typeof analytics !== undefined) {analytics.setUserId($rootScope.loginData.email);console.log("setUserId : OK!");}
      //     $scope.gotobrowse();
      // } else {
        // confirm user information on server
        //$scope.signinonserver($rootScope.loginData);

        $rootScope.serverConnectAWS('login', $rootScope.loginData,function(res){
          if (res) {

              var msg = res.data.msg;

              if (msg == 'success') {
                if(typeof analytics !== undefined) {analytics.setUserId($rootScope.loginData.email);console.log("setUserId : OK!");}
                $scope.gotobrowse();
              } else {
                $rootScope.confirmAlert(msg, "RETRY");
              }
          }
          //alert(res);
        });
        
      //}
    }
   
  };

  $scope.goForgetPassword = function() {
      $rootScope.loginData.password = "";
      $rootScope.loginData.repassword = "";
      $state.go('app.forgotscreen');
  }

  $scope.forgetpassword = function() {
      
      if ($rootScope.loginData.email == "") {
          $rootScope.confirmAlert("Please input eMail!", "RETRY");
      } 
      else if ($rootScope.loginData.password == ""){
          $rootScope.confirmAlert("Please input password!", "RETRY");
      }
      else if ($rootScope.loginData.repassword == "" || $rootScope.loginData.repassword == undefined){
          $rootScope.confirmAlert("Please input confirm password!", "RETRY");
      }
      else if ($rootScope.loginData.password !== $rootScope.loginData.repassword) {
          $rootScope.confirmAlert("Password is not matched with confirm password!", "RETRY");
      }
      else {
          $rootScope.serverConnectAWS("forgot", $rootScope.loginData, function(res){
            if (res) {

                var msg = res.data.msg;

                if (msg == 'success') {
                  if(typeof analytics !== undefined) {analytics.setUserId($rootScope.loginData.email);console.log("setUserId : OK!");}
                  $scope.gotobrowse();
                } else {
                  $rootScope.confirmAlert(msg, "RETRY");
                }
            }
            //alert(res);
          });
      }
  }

  $scope.gotobrowse = function() {


      $ionicHistory.nextViewOptions({
          historyRoot: true
        });//how to eliminate back button

        $state.go('app.browse');
  };



  $scope.gotosignup = function() {
      $state.go('app.signupscreen');
  };  

})


//Sign Up Controller -Sign Up Screen

.controller('SignUpCtrl', function($scope, $ionicPlatform, $state, $rootScope, $ionicPopup, $http) {

  $scope.registeuser = function() {
      var email = $rootScope.loginData.email,
          pwd = $rootScope.loginData.password, 
          repwd = $rootScope.loginData.repassword;

      if (email != undefined && pwd != undefined && pwd == repwd){
          var tmpUser = window.localStorage.getItem(email);
          if(tmpUser != null){
            
            //confirm user on backend server
            // register on server
             //method post , url : users, data:obj

            if(tmpUser.email === email) {
                $rootScope.confirmAlert("This Email have already registered.", "RETRY");
            } else {

                
                $rootScope.serverConnectAWS('signup', $rootScope.loginData,function(res){
                  if (res) {
                    var msg = res.data.msg;
                    if (msg == 'success') {
                      if(typeof analytics !== undefined) {analytics.setUserId($rootScope.loginData.email);console.log("setUserId : OK!");}
                      $scope.gotomain();
                    } else {
                      $rootScope.confirmAlert(msg, "RETRY");
                    }
                  }
                });
            }

          } else {

              // $scope.signuponserver(obj);
              $rootScope.serverConnectAWS('signup', $rootScope.loginData,function(res){
                if (res) {
                  var msg = res.data.msg;
                  if (msg == 'success') {
                    if(typeof analytics !== undefined) {analytics.setUserId($rootScope.loginData.email);console.log("setUserId : OK!");}
                    $scope.gotomain();
                  } else {
                    $rootScope.confirmAlert(msg, "RETRY");
                  }
                }
              });              
          }

          //$scope.gotomain();
      }else{
        if(email == undefined) 
          $rootScope.confirmAlert("Empty Email Address.", "RETRY");
        else if(pwd == undefined)
          $rootScope.confirmAlert("Empty Password.", "RETRY");
        else if(repwd == undefined)
          $rootScope.confirmAlert("Empty Confirm Password.", "RETRY");
        else if(pwd != repwd)
          $rootScope.confirmAlert("Password is wrong.", "RETRY");

      }
  };

  $scope.gotomain = function() {
      $state.go('app.main');
  };

   $scope.gotosignup = function() {
      $state.go('app.signupscreen');
  };  

})


.controller('MainCtrl', function($scope, $ionicPlatform, $rootScope, $stateParams, $ionicPopup, $ionicModal, $timeout, $state, $ionicHistory, $http) {
// $scope.ctrlCheck="This is the Main Ctrl";


  // $ionicPlatform.ready(function() {
  //             // Vibrate 2000ms
  //      $cordovaScreenOrientation.lockOrientation('landscape');  
  // });

  $rootScope.loginData.image="img/1fb2-01.png";
  $rootScope.firsttime=0;
  $rootScope.loginData.backgroundimage="img/pfb.jpg";

  $scope.testconsolelog=function(){
    console.log("testtoseeifitworks!");
      $ionicPlatform.ready(function() {
              // Vibrate 2000ms
        $cordovaVibration.vibrate(2000);  
  });
  };//THIS ; COULD BE UNECESSARY ERROR ERROR ERROR


  $scope.clearbackbutton = function() {

            $ionicHistory.nextViewOptions({
                historyRoot: true
              });//how to eliminate back button
    };

    // $scope.$on("$ionicView.beforeEnter", function () {
    //  if($rootScope.what==1){
    //   $state.go('app.browse');
    //  }
    //  else{
    //  alert("this happens everytime I enter"); 
    //  }
     
    // });

  $scope.people = [
    { name: 'Ben Brown', desc:"Actress",id: 1, pic: "img/bbrown.png"},
    { name: 'Amanda Cerny', desc:"Instagramer",id: 1, pic: "img/acerny.png"},
    { name: 'Lele Pons', desc:"I searched for it",id: 1, pic: "img/lpons.png"},
    { name: 'Hannah Stocking', desc:"Vine Star",id: 1, pic: "img/hstock.png"},
    { name: 'Jimmy Tatro', desc:"YouTuber",id: 1, pic: "img/jtatro.png"},
    { name: 'King Bach', desc:"I searched for it",id: 1, pic: "img/kbach.png"}
  ];

  $scope.$on("$ionicView.enter", function () {
     // alert("this happens everytime I enter");

    $ionicModal.fromTemplateUrl('templates/loginwelcome.html', {
    scope: $scope,
    id:1
  }).then(function(modal) {
    $scope.modalwelcome = modal;
  });

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    id:2
  }).then(function(modal) {
    $scope.modal = modal;
  });

    $ionicModal.fromTemplateUrl('templates/loginend.html', {
    scope: $scope,
    id:3
  }).then(function(modal) {
    $scope.modal2 = modal;
  });



       // Open the login modal
  $timeout(function() {
      $scope.modalwelcome.show();
    }, 1000);

    $timeout(function() {
      loginwelcome.play();
    }, 1250);


    $timeout(function() {
      $scope.modalwelcome.hide();
    }, 17000);//17000

    $timeout(function() {
      $scope.modal.show();
    }, 17500);//17500


        $timeout(function() {
      logininfo.play();
    }, 19500);//18250

    

  });

var loginwelcome = new Audio ("img/intro.mp3");
var logininfo = new Audio ("img/Introduction.mp3");
// var loginwho = new Audio("img/missingsomething.mp3");
var logindone = new Audio("img/start.mp3");
// var loginmissing = new Audio("img/missing.mp3");

var missingaudio = ['img/blank.mp3', 'img/missing.mp3', 'img/missingsomething.mp3'];
    




$rootScope.genderchanger=function(){
  if($rootScope.loginData.gender=="female")
  {
    $rootScope.loginData.gender="male";
    $rootScope.loginData.color="#fff651";
    $rootScope.loginData.image="img/1my-01.png";
    $rootScope.loginData.backgroundimage="img/pmb.jpg";
    return;
  }

  else{
    $rootScope.loginData.gender="female";
    $rootScope.loginData.color="#00a6f5";
    $rootScope.loginData.image="img/1fb2-01.png";
    $rootScope.loginData.backgroundimage="img/pfb.jpg";
    return;
  }

}



  // Triggered in the login modal to close it
  $rootScope.closedLogin = function() {
    $scope.modal.hide();
    $scope.modal2.show();


    $timeout(function() {
      logindone.play();$scope.clearbackbutton();
    }, 500);

    $timeout(function() {
      $scope.modal2.hide();$state.go('app.browse');
    }, 1500);//8500



    
  };

   $rootScope.subLogin = function() {
    if($rootScope.loginData.fname!="" && $rootScope.loginData.lname!="" && $rootScope.loginData.weight!="" && $rootScope.loginData.age!=""){
        // if($scope.loginData.age[0]) {
      $rootScope.serverConnectAWS("update", $rootScope.loginData);     
    }
    else{
      var missingaudiochoice = new Audio(missingaudio[Math.floor(Math.random() * missingaudio.length)]);
        missingaudiochoice.play();
      $scope.showAlert();
      return;
    }
  };

  $rootScope.saveLogin = function() {
    
    if($rootScope.loginData.fname!=="" && $rootScope.loginData.lname!=="" && $rootScope.loginData.weight!=="" && $rootScope.loginData.age!==""){
        // if($scope.loginData.age[0]) {
          // $scope.modal.hide();

          // $timeout(function() {
          //   $scope.modal2.show();
          // }, 500);


      $scope.saveAlert();
    }
    else{

      $scope.showAlert();

      return;
    }


  };

  
  $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
    cssClass: 'myPopup',
     template: 'Can&#39;t leave anything blank',
     okText: 'Got it', // String (default: 'OK'). The text of the OK button.
     okType: 'button button-balanced', // String (default: 'button-positive'). The type of the OK button.
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
  };


  $scope.saveAlert = function() {
   var alertPopup = $ionicPopup.alert({
    cssClass: 'custompopup',
     okText: 'Updated', // String (default: 'OK'). The text of the OK button.
     okType: 'button button-balanced', // String (default: 'button-positive'). The type of the OK button.
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
  };

  //Pop Up Function to confirm choice
  $scope.popUpChoice = function(who, whopic){

    $rootScope.imageofperson=whopic;
    $rootScope.nameofperson=who;

    var confirmPopup = $ionicPopup.confirm({
     // title: who + "hello yello",
     // template: 'Are you sure you want to eat this ice cream?',
     templateUrl:'templates/popuplogin.html',
     cancelText:"Nope",
     cancelType:'button-light', 
     okText:"Yes Buddy!",
     okType:'button-dark'

   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('TESTER sure');
       $scope.doLogin();
     } else {
       console.log('You are not sure');
     }
   });

  }


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closedLogin();$scope.clearbackbutton();
    }, 1000);


            






  };


})


//Profile Controller 


.controller('ProfileCtrl', function($scope, $state, $stateParams, $ionicHistory, $rootScope, $ionicPopup, $http) {

// $ionicPlatform.ready(function() {
//     screen.lockOrientation('landscape');
// });
// $ionicPlatform.ready(function() {
//     window.screen.lockOrientation('landscape');
//     console.log("it triggered");
// })
var missingaudio = ['img/blank.mp3', 'img/missing.mp3', 'img/missingsomething.mp3'];

$scope.saveLogin = function() {
    
    if($rootScope.loginData.fname!=="" && $rootScope.loginData.lname!=="" && $rootScope.loginData.weight!=="" && $rootScope.loginData.age!==""){
        console.log($rootScope.bLoginStatus);

      $rootScope.serverConnectAWS("update", $rootScope.loginData);      

      //$scope.saveAlert();
    }
    else{

      if ($rootScope.loginData.fname == "")
        $scope.confirmAlert("Empty first name.");
      else if ($rootScope.loginData.lname == "")
        $scope.confirmAlert("Empty last name.");
      else if ($rootScope.loginData.weight == "")
        $scope.confirmAlert("Empty weight.");
      else if ($rootScope.loginData.age == "")
        $scope.confirmAlert("Empty age.");

      return;
    }
  };

  
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
    cssClass: 'myPopup',
     template: 'Can&#39;t leave anything blank',
     okText: 'Got it', // String (default: 'OK'). The text of the OK button.
     okType: 'button button-balanced', // String (default: 'button-positive'). The type of the OK button.
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };

  $scope.$on("$ionicView.beforeLeave", function () {
     if($rootScope.loginData.fname=="" || $rootScope.loginData.lname=="" || $rootScope.loginData.weight=="" || $rootScope.loginData.age==""){
          $state.go('app.profile');
          
          
          $ionicHistory.nextViewOptions({
                    historyRoot: null
                  });

          

          $scope.showAlert();
          var missingaudiochoice = new Audio(missingaudio[Math.floor(Math.random() * missingaudio.length)]);
          missingaudiochoice.play();


          return;

    }

    });



    // $scope.$on("$ionicView.afterLeave", function () {
    //  // alert("this happens everytime I enter");
    //  $rootScope.menucolor="black";
    // });


$scope.genderchange;

$scope.ctrlCheck="ProfileCtrl";

$scope.genderchange="img/femaleback2-01.svg";
$scope.genderplaceholder="Jane";


$scope.male=function(){
  $scope.genderchange="img/maleback-01.svg";
  $scope.genderplaceholder="John";
}

$scope.female=function(){
  $scope.genderchange="img/femaleback.svg";
  $scope.genderplaceholder="Jane";
}

$scope.inputcode={};
$scope.discountcodes=['phillyd','kevin','john'];


$scope.numberis=0;



$scope.mylogin = function() {

    $scope.success="no";

    for (var i=0; i<$scope.discountcodes.length; i++) {
      if($scope.inputcode.username==$scope.discountcodes[i]){
        $scope.genderchange="img/back1-01.svg";
        console.log($scope.discountcodes[i]);
        $scope.success="yes";
      }
    }
      if($scope.success!="yes"){
        console.log('You Have Failed to Crack the Code Young Jedi!'); 
        $scope.genderchange="img/b22-01.svg";
      }

      $scope.numberis++;

      if($scope.numberis==3){
        var alertPopup = $ionicPopup.alert({
          title: 'Try, Try Again',
          template: 'Keep trying...we promise it is worth it'
         });
      }

      if($scope.numberis==6){
                var alertPopup = $ionicPopup.alert({
          title: 'Persistent Pays',
          template: 'Wow you are really persistent...and we like that!'
         });
      }

      if($scope.numberis>=10){
        var alertPopup = $ionicPopup.alert({
          title: 'Reward',
          template: "You're awesome for keep trying...use discount code PHILLYD to get 50% off...that's our biggest discount!"
         });
      }

  }



})










//Settings Controller

.controller('SettingsCtrl', function($scope,$ionicPlatform, $cordovaEmailComposer, $cordovaSocialSharing, $state, $stateParams, $ionicHistory, $rootScope, $ionicPopup) {

$scope.ctrlCheck="Settings";


$scope.sendFeedback=function(){

  $cordovaEmailComposer.isAvailable().then(function() {
     // is available
     console.log("email is operational");
   }, function () {
     // not available
     console.log("something f&@#*$ up!");
   });

    var email = {
      to: 'mn@celebgym.com',
      subject: 'Feedback for Celebrity Gym',
      body: 'I would like to give you some feedback:',
      isHtml: true
    };

   $cordovaEmailComposer.open(email).then(null, function () {
     // user cancelled email
   });
}



  $scope.shareApp=function(){

  $ionicPlatform.ready(function() {
      // Vibrate 2000ms

    $cordovaSocialSharing.share("You need to check out this new app, Celebrity Gym", "Cool new app", file, link).then(function(result) {
      // Success!
      console.log("Share Success");
    }, function(err) {
      // An error occurred. Show a message to the user
      console.log("Native Share did not work");
    });

 
    })
  }

})


//Premium Page Controller 


.controller('PremiumCtrl', function($scope, $rootScope, $stateParams, $state, $timeout, $ionicModal, $http, $ionicPopup, $ionicLoading) {

  // $scope.bgPremImage="img/prem1-01.jpg";

  // $ionicModal.fromTemplateUrl('templates/pausemodal.html', {
  //   scope: $scope,
  //   id:5
  // }).then(function(modal) {
  //   $scope.modalpremium = modal;
  // });
  $rootScope.promo = {codetry:""};

  $scope.premium=function(){

    $state.go('app.pricepage');

      
  }

  $scope.price=6.99;
  if ($rootScope.loginData.enabledPromocode) {
    $scope.price = 4.99;
  }

  $scope.errormessage="";

  $scope.promos=["gram","facebook"];

  var spinner = '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner><br/>';
  $scope.checkPrimiumUser = function() {

      var productIds = ['com.ionicframework.celebgym890630.enabled.premiumuser', 'com.ionicframework.celebgym890630.disabledpremiumuser']; // <- Add your product Ids here

      
      $ionicLoading.show({ template: spinner + 'Loading Products...' });
      inAppPurchase
          .getProducts(productIds)
          .then(function (products) {
            $ionicLoading.hide();
            $scope.products = products;
            console.log("success=====>"+JSON.stringify($scope.products));
            if ($rootScope.loginData.enabledPromocode)
            {
              console.log("You are enabled promo code.");
              $scope.buy(productIds[0]);

            }  
            else
            {
              console.log("You are not enabled promo code.");
              $scope.buy(productIds[1]);
            }
          })
          .catch(function (err) {
            $ionicLoading.hide();
            console.log("Error======>"+err);
          });


      // inAppPurchase
      // .buy(productId[0])
      // .then(function (data) {
      //   console.log(JSON.stringify(data));
      //   console.log('consuming transactionId: ' + data.transactionId);
      //   return inAppPurchase.consume(data.type, data.receipt, data.signature);
      // })
      // .then(function () {
      //   var alertPopup = $ionicPopup.alert({
      //     title: 'Purchase was successful!',
      //     template: 'Check your console log for the transaction data'
      //   });
      //   console.log('consume done!');
      //   $ionicLoading.hide();
      // })
      // .catch(function (err) {
      //   $ionicLoading.hide();
      //   console.log(err);
      //   $ionicPopup.alert({
      //     title: 'Something went wrong',
      //     template: 'Check your console log for the error details'
      //   });
      // });
      //console.log($scope.products);

      // var confirmPopup = $ionicPopup.confirm({
      //    cssClass: "myPopup",
      //    template: 'Are you sure you want to upgrade?',
      //    cancelText: 'No', // String (default: 'Cancel'). The text of the Cancel button.
      //    cancelType: 'button button-dark', // String (default: 'button-default'). The type of the Cancel button.
      //    okText: 'Yes', // String (default: 'OK'). The text of the OK button.
      //    okType: 'button button-balanced', // String (default: 'button-positive'). The type of the OK button.
      //  });

      //  confirmPopup.then(function(res) {
      //    if(res) {
      //         var productIds = []; // <- Add your product Ids here

      //         var spinner = '<ion-spinner icon="dots" class="spinner-stable"></ion-spinner><br/>';
      //         $ionicLoading.show({ template: spinner + 'Loading Products...' });
      //         inAppPurchase
      //             .getProducts(productIds)
      //             .then(function (products) {
      //               $ionicLoading.hide();
      //               $scope.products = products;
      //             })
      //             .catch(function (err) {
      //               $ionicLoading.hide();
      //               console.log(err);
      //             });
              


      //         // if ($rootScope.loginData.enabledPromocode) {
      //         //     window.inAppPurchase.buy('com.ionicframework.celebgym890630.general.premiumuser').then((res) => {
      //         //       console.log('purchase completed!');
      //         //       console.log('You are Premium User.');
      //         //       $rootScope.loginData.isPremiumUser = true;
      //         //       if ($rootScope.loginData.email.length>0 && $rootScope.bLoginStatus) {
      //         //         $rootScope.serverConnectAWS("update", $rootScope.loginData);                      
      //         //       }
      //         //         // unlock level 1
      //         //     })
      //         //     .catch(err => {
      //         //       console.log(err);
      //         //     });

      //         // } else {
      //         //     window.inAppPurchase.buy('com.ionicframework.celebgym890630.promos.premiumuser').then((res) => {
      //         //       console.log('purchase completed!');
      //         //       console.log('You are Premium User.');
      //         //       $rootScope.loginData.isPremiumUser = true;
      //         //       if ($rootScope.loginData.email.length>0 && $rootScope.bLoginStatus) {
      //         //         $rootScope.serverConnectAWS("update", $rootScope.loginData);                      
      //         //       }
      //         //         // unlock level 1
      //         //     })
      //         //     .catch(err => {
      //         //       console.log(err);
      //         //     });  

      //         // }          
      //    } 
      //    else {
      //      //console.log('You are not PremiumUser.');
      //      //$rootScope.loginData.isPremiumUser = false;
      //      //dontendvoice.play();
      //    }
      //  });

  }

  $scope.buy = function (productId) {

    $ionicLoading.show({ template: spinner + 'Purchasing...' });
    inAppPurchase
      .buy(productId)
      .then(function (data) {
        console.log(JSON.stringify(data));
        console.log('consuming transactionId: ' + data.transactionId);
        return inAppPurchase.consume(data.type, data.receipt, data.signature);
      })
      .then(function () {
        // var alertPopup = $ionicPopup.alert({
        //   title: 'Purchase was successful!',
        //   template: 'Check your console log for the transaction data'
        // });
        console.log('consume done!');
        $rootScope.loginData.isPremiumUser = true;
        if ($rootScope.loginData.email.length>0 && $rootScope.bLoginStatus) {
          $rootScope.serverConnectAWS("update", $rootScope.loginData);                      
        }
        $ionicLoading.hide();
      })
      .catch(function (err) {
        $ionicLoading.hide();
        console.log(err);
        // $ionicPopup.alert({
        //   title: 'Something went wrong',
        //   template: 'Check your console log for the error details'
        // });
      });

  };

  $scope.checkPromo=function(){

    console.log($rootScope.loginData.promocodes);

    if ($rootScope.loginData.promocodes == undefined) {
      $scope.price = 4.99;
      $rootScope.confirmAlert("PromoCode is not defined.");

    } else {

        $scope.promos = $rootScope.loginData.promocodes;

        console.log("promo code array:" + $scope.promos);

        if ($rootScope.loginData.enabledPromocode) {
          //$rootScope.confirmAlert("You successed on Promo Code.", "OK");
          $scope.errormessage="You successed on Promo Code.";

          $timeout(function() {
              $scope.closePromo();$scope.errormessage="";
            }, 2500);
        } else {

          //$rootScope.loginData.savedPromoCode = $scope.promo.codetry;
          var code_id = null;
          for (var i=0; i<$scope.promos.length; i++) {
            if($scope.promo.codetry==$scope.promos[i].code){
              $scope.success="yes";
              code_id = $scope.promos[i].code._id;
              break;
            }
          }

          if($scope.success!="yes"){
            $scope.errormessage="Did not match any promo codes";
            $rootScope.loginData.enabledPromocode = false;////Added by Ai//////
            $timeout(function() {
              $scope.errormessage="";
            }, 2000); 
          }
          else if($scope.success=="yes"){

            $scope.errormessage="Monthly Subscription now only $4.99";
            $scope.promo.codetry="Success";
            $scope.price=4.99;
            $rootScope.loginData.enabledPromocode = true;////Added by Ai//////
            if ($rootScope.loginData.email.length>0 && $rootScope.bLoginStatus) {
              $rootScope.serverConnectAWS("update", $rootScope.loginData);
              $rootScope.serverConnectAWS("promocode", code_id);
            }
            $timeout(function() {
              $scope.closePromo();$scope.errormessage="";
            }, 2500);

          }

        }        
    }
    // $scope.errormessage="does not match any promo codes";
  }


  $ionicModal.fromTemplateUrl('templates/promo.html', {
    scope: $scope,
    id:5
  }).then(function(modal) {
    $scope.modal5 = modal;
  });

  $scope.openPromo=function(){
    $scope.modal5.show();  
  }

  $scope.closePromo=function(){
    $scope.modal5.hide();
    $scope.promo.codetry=""; 
  }
  



  // $scope.$on("$ionicView.enter", function () {


  //   $timeout(function() {
  //     $scope.bgPremImage="img/prem2-01.jpg";
  //   }, 5000);


  //   $timeout(function() {
  //     $scope.bgPremImage="img/prem3-01.jpg";
  //   }, 10000);


  //   $timeout(function() {
  //     $scope.bgPremImage="img/prem4-01.jpg";
  //   }, 15000);

  //   $timeout(function() {
  //     $scope.bgPremImage="img/prem5-01.jpg";
  //   }, 20000);

  //   });





})


//Male workout controller



.controller('MaleCtrl', function($scope, $state, $ionicModal, $rootScope, $ionicLoading, $ionicPlatform, $ionicScrollDelegate, $ionicSideMenuDelegate) {

$scope.testfilter=444;
$scope.dater = new Date();
$scope.monthly = $scope.dater.getUTCMonth()+1;
$scope.day = $scope.dater.getUTCDate();
$scope.sdater = $scope.day+"/"+$scope.monthly;

$scope.stringer = $scope.sdater.toString();

  $scope.$on('$ionicView.enter', function(){
      $ionicSideMenuDelegate.canDragContent(false);
      $rootScope.menucolor="black";
      $scope.lockProcess();
      screen.lockOrientation('portrait');
  });
  
  $scope.$on('$ionicView.leave', function(){
      $ionicSideMenuDelegate.canDragContent(true);
  });


  $ionicModal.fromTemplateUrl('templates/detailmove.html', {
    scope: $scope,
    id:4
  }).then(function(modal) {
    $scope.modal4 = modal;
  });


  $scope.showMoreDetail=function(index){

     $scope.modal4.show();
     $scope.trackIndex=index;
  }

  $scope.showLessDetail=function(){
    $scope.modal4.hide();
  }

$scope.roundthis=1234.23;

$scope.additup=function(index){

  $scope.tmet=0;
  $scope.ttime=0;
  // $scope.tn=index.length;

  for (var i = 0; i < index.length; i++) {
    $scope.tmet+=index[i].cal;  
    $scope.ttime+=index[i].time;  
    //Do something
  }

  $scope.tcal=0.0175*$10*($rootScope.loginData.weight*0.45);
  $scope.tcal=Math.round($scope.tcal);

}

$scope.lockProcess = function() {

    if (!$rootScope.loginData.isPremiumUser) {
        $scope.maleworkouts = [
          { title: 'Rock City',             url:"#/app/details",  id: 1, num:"01",  image: "img/men1.png",        info: "mwd.w1",     caloriesmain:Math.round(0.0175*274*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png",   time:"5:00",   color:"img/11111.png", type:"Full Body"},
          { title: 'Knockout Club',         url:"#/app/details",  id: 2, num:"02",  image: "img/men2.png",        info: "mwd.w2",     caloriesmain:Math.round(0.0175*293*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png",   time:"5:30",   color:"img/rb.png", type:"Full Body"},
          { title: 'Comic Crusader',        url:"#/app/details",  id: 3, num:"03",  image: "img/men3.png",        info: "mwd.w3",     caloriesmain:Math.round(0.0175*237*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Arms and Shoulders"},
          { title: 'The 300',               url:"#/app/search",   id: 4, num:"04",  image: "img/men4.png",        info: "mwd.w4",     caloriesmain:Math.round(0.0175*346*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Abs" },
          { title: 'Red Magic',             url:"#/app/mworkouts",id: 5, num:"05",  image: "img/men5.png",        info: "mwd.w5",     caloriesmain:Math.round(0.0175*191*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:45",   color:"img/rb.png", type:"Full Body" },
          { title: 'Hollywood Heartthrob',  url:"#/app/details",  id: 6, num:"06",  image: "img/men6.png",        info: "mwd.w6",     caloriesmain:Math.round(0.0175*267*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Full Body" },
          { title: 'King Of The Jungle',    url:"#/app/details",  id: 1, num:"07",  image: "img/men7.png",        info: "mwd.w7",     caloriesmain:Math.round(0.0175*270*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png",  type:"Full Body"},
          { title: 'The Red Shield',        url:"#/app/details",  id: 2, num:"08",  image: "img/men8.png",        info: "mwd.w8",     caloriesmain:Math.round(0.0175*266*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"6:00",   color:"img/rb.png", type:"Upper Body"},
          { title: 'The Wolverine',         url:"#/app/details",  id: 3, num:"09",  image: "img/men9.png",        info: "mwd.w9",     caloriesmain:Math.round(0.0175*269*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Arms and Shoulders"},
          { title: 'Achilles',              url:"#/app/search",   id: 4, num:"10",  image: "img/men10.png",       info: "mwd.w10",    caloriesmain:Math.round(0.0175*242*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Full Body" },
          { title: 'Fist Of Fury',          url:"#/app/mworkouts",id: 5, num:"11",  image: "img/men11.png",       info: "mwd.w11",    caloriesmain:Math.round(0.0175*230*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:45",   color:"img/rb.png", type:"Full Body" }
        ];
    } else {
         $scope.maleworkouts = [
          { title: 'Rock City',             url:"#/app/details",  id: 1, num:"01",  image: "img/men1.png",        info: "mwd.w1",     caloriesmain:Math.round(0.0175*274*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png",   time:"5:00",   color:"img/11111.png", type:"Full Body"},
          { title: 'Knockout Club',         url:"#/app/details",  id: 2, num:"02",  image: "img/men2.png",        info: "mwd.w2",     caloriesmain:Math.round(0.0175*293*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png",   time:"5:30",   color:"img/rb.png", type:"Full Body"},
          { title: 'Comic Crusader',        url:"#/app/details",  id: 3, num:"03",  image: "img/men3.png",        info: "mwd.w3",     caloriesmain:Math.round(0.0175*237*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:00",   color:"img/rb.png", type:"Arms and Shoulders"},
          { title: 'The 300',               url:"#/app/search",   id: 4, num:"04",  image: "img/men4.png",        info: "mwd.w4",     caloriesmain:Math.round(0.0175*346*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:00",   color:"img/rb.png", type:"Abs" },
          { title: 'Red Magic',             url:"#/app/mworkouts",id: 5, num:"05",  image: "img/men5.png",        info: "mwd.w5",     caloriesmain:Math.round(0.0175*191*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:45",   color:"img/rb.png", type:"Full Body" },
          { title: 'Hollywood Heartthrob',  url:"#/app/details",  id: 6, num:"06",  image: "img/men6.png",        info: "mwd.w6",     caloriesmain:Math.round(0.0175*267*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:00",   color:"img/rb.png", type:"Full Body" },
          { title: 'King Of The Jungle',    url:"#/app/details",  id: 1, num:"07",  image: "img/men7.png",        info: "mwd.w7",     caloriesmain:Math.round(0.0175*270*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:00",   color:"img/rb.png",  type:"Full Body"},
          { title: 'The Red Shield',        url:"#/app/details",  id: 2, num:"08",  image: "img/men8.png",        info: "mwd.w8",     caloriesmain:Math.round(0.0175*266*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"6:00",   color:"img/rb.png", type:"Upper Body"},
          { title: 'The Wolverine',         url:"#/app/details",  id: 3, num:"09",  image: "img/men9.png",        info: "mwd.w9",     caloriesmain:Math.round(0.0175*269*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:00",   color:"img/rb.png", type:"Arms and Shoulders"},
          { title: 'Achilles',              url:"#/app/search",   id: 4, num:"10",  image: "img/men10.png",       info: "mwd.w10",    caloriesmain:Math.round(0.0175*242*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:00",   color:"img/rb.png", type:"Full Body" },
          { title: 'Fist Of Fury',          url:"#/app/mworkouts",id: 5, num:"11",  image: "img/men11.png",       info: "mwd.w11",    caloriesmain:Math.round(0.0175*230*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:45",   color:"img/rb.png", type:"Full Body" }
        ];
    }

}


$scope.goDetails = function() {  

  if ($rootScope.choice.title === $scope.mwd.w1.title || $rootScope.choice.title === $scope.mwd.w2.title)
  {
    $state.go('app.details');
  }
  else {
    if ($rootScope.loginData.isPremiumUser)
    {
      $state.go('app.details');
    } else {
      $rootScope.confirmAlert("You are not PremiumUser.","OK");
    }
  }
}
  
  $scope.yessir=12;


//Names and details of workouts to be displayed in list form on the main display page 
   $scope.maleworkouts = [
    { title: 'Rock City',             url:"#/app/details",  id: 1, num:"01",  image: "img/men1.png",        info: "mwd.w1",     caloriesmain:Math.round(0.0175*274*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png",   time:"5:00",   color:"img/11111.png", type:"Full Body"},
    { title: 'Knockout Club',         url:"#/app/details",  id: 2, num:"02",  image: "img/men2.png",        info: "mwd.w2",     caloriesmain:Math.round(0.0175*293*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png",   time:"5:30",   color:"img/rb.png", type:"Full Body"},
    { title: 'Comic Crusader',        url:"#/app/details",  id: 3, num:"03",  image: "img/men3.png",        info: "mwd.w3",     caloriesmain:Math.round(0.0175*237*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Arms and Shoulders"},
    { title: 'The 300',               url:"#/app/search",   id: 4, num:"04",  image: "img/men4.png",        info: "mwd.w4",     caloriesmain:Math.round(0.0175*346*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Abs" },
    { title: 'Red Magic',             url:"#/app/mworkouts",id: 5, num:"05",  image: "img/men5.png",        info: "mwd.w5",     caloriesmain:Math.round(0.0175*191*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:45",   color:"img/rb.png", type:"Full Body" },
    { title: 'Hollywood Heartthrob',  url:"#/app/details",  id: 6, num:"06",  image: "img/men6.png",        info: "mwd.w6",     caloriesmain:Math.round(0.0175*267*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Full Body" },
    { title: 'King Of The Jungle',    url:"#/app/details",  id: 1, num:"07",  image: "img/men7.png",        info: "mwd.w7",     caloriesmain:Math.round(0.0175*270*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png",  type:"Full Body"},
    { title: 'The Red Shield',        url:"#/app/details",  id: 2, num:"08",  image: "img/men8.png",        info: "mwd.w8",     caloriesmain:Math.round(0.0175*266*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"6:00",   color:"img/rb.png", type:"Upper Body"},
    { title: 'The Wolverine',         url:"#/app/details",  id: 3, num:"09",  image: "img/men9.png",        info: "mwd.w9",     caloriesmain:Math.round(0.0175*269*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Arms and Shoulders"},
    { title: 'Achilles',              url:"#/app/search",   id: 4, num:"10",  image: "img/men10.png",       info: "mwd.w10",    caloriesmain:Math.round(0.0175*242*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:00",   color:"img/rb.png", type:"Full Body" },
    { title: 'Fist Of Fury',          url:"#/app/mworkouts",id: 5, num:"11",  image: "img/men11.png",       info: "mwd.w11",    caloriesmain:Math.round(0.0175*230*($rootScope.loginData.weight*0.45)), lockimage : "img/lock2-01.svg", time:"5:45",   color:"img/rb.png", type:"Full Body" }
  ];

  //Audio clips that Rachel says

  $scope.breakaudio=[
    "img/break.mp3",
    "img/Dont Sit.mp3",
    "img/Keep Moving.mp3",
    "img/TowelWater.mp3",
    "img/PhewBreakTime.mp3",
    "img/BreakOnly.mp3",
    "img/Break Time.mp3",
    "img/Dont Sit.mp3",
    "img/break.mp3",
    "img/break.mp3",
    "img/BreakOnly.mp3",
    "img/Dont Sit.mp3",
    "img/Keep Moving.mp3"]



  // All The Moves that can be done in the app such as Push Up Easy, Clap Plyo Push Up Hard, and so on

$scope.malemoves2=[
    {
      title: "Extra", vid:"img/49mml.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/54.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Lifts Left", vid:"img/49mml.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/54.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Lifts Left", vid:"img/49mml.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/54.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Lifts Left", vid:"img/49mml.mp4", time: 60, cal: 11, reps:20,audiomove:"img/54.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Right", vid:"img/56mmr.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/61.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Right", vid:"img/56mmr.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/61.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Right", vid:"img/56mmr.mp4", time: 60, cal: 11, reps:20,audiomove:"img/61.mp3",audiorep:"img/20reps.mp3"
    }
];



  $scope.malemoves=[
   {
       title: "Break", vid:"img/break m.mp4", time:30, cal:35*0.5, reps:1,audiomove:$scope.breakaudio[Math.floor(Math.random() * $scope.breakaudio.length)],audiorep:""
    },
    {
      title: "Alternating Push-up Plank", vid:"img/1mm.mp4", time: 2, cal:35*0.5, reps:10,audiomove:"img/1.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Alternating Push-up Plank", vid:"img/1mm.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/1.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Alternating Push-up Plank", vid:"img/1mm.mp4", time: 60, cal:4, reps:20,audiomove:"img/1.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Chest Expander", vid:"img/2mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/2.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Chest Expander", vid:"img/2mm.mp4", time: 45, cal:  9*0.75, reps:15,audiomove:"img/2.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Chest Expander", vid:"img/2mm.mp4", time: 60, cal: 10, reps:20,audiomove:"img/2.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Diamond Push Up", vid:"img/3mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/3.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Diamond Push Up", vid:"img/3mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/3.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Diamond Push Up", vid:"img/3mm.mp4", time: 60, cal: 6, reps:20,audiomove:"img/3.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Dive Bomber Push Up", vid:"img/4mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/4.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Dive Bomber Push Up", vid:"img/4mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/4.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Dive Bomber Push Up", vid:"img/4mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/4.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Jumping Jacks", vid:"img/5mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/5.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Jumping Jacks", vid:"img/5mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/5.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Jumping Jacks", vid:"img/5mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/5.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Jumping Jack Squat", vid:"img/6mm.mp4", time: 30,cal:  5*0.5, reps:10,audiomove:"img/6.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Jumping Jack Squat", vid:"img/6mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/6.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Jumping Jack Squat", vid:"img/6mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/6.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Lying Triceps Lifts", vid:"img/7mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/7.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Lying Triceps Lifts", vid:"img/7mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/7.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Lying Triceps Lifts", vid:"img/7mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/7.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "One Arm Side Push Up Left", vid:"img/8mml.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/8.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "One Arm Side Push Up Left", vid:"img/8mml.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/8.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "One Arm Side Push Up Left", vid:"img/8mml.mp4", time: 60, cal: 11, reps:20,audiomove:"img/8.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "One Arm Side Push Up Right", vid:"img/8mmr.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/9.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "One Arm Side Push Up Right", vid:"img/8mmr.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/9.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "One Arm Side Push Up Right", vid:"img/8mmr.mp4", time: 60, cal: 11, reps:20,audiomove:"img/9.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Overhead Arm Clap", vid:"img/9mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/10.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Overhead Arm Clap", vid:"img/9mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/10.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Overhead Arm Clap", vid:"img/9mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/10.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Overhead Press", vid:"img/10mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/11.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Overhead Press", vid:"img/10mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/11.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Overhead Press", vid:"img/10mm.mp4", time: 60,cal:  5, reps:20,audiomove:"img/11.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Power Circles", vid:"img/11mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/12.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Power Circles", vid:"img/11mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/12.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Power Circles", vid:"img/11mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/12.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Push up and Rotation", vid:"img/12mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/13.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Push up and Rotation", vid:"img/12mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/13.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Push up and Rotation", vid:"img/12mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/13.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Military Push Up", vid:"img/13mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/14.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Military Push Up", vid:"img/13mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/14.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Military Push Up", vid:"img/13mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/14.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "One Hand Push Up Left", vid:"img/14mml.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/15.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "One Hand Push Up Left", vid:"img/14mml.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/15.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "One Hand Push Up Left", vid:"img/14mml.mp4", time: 60, cal: 8, reps:20,audiomove:"img/15.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "One Hand Push Up Right", vid:"img/14mmr.mp4", time: 30,cal:  6*0.5, reps:10,audiomove:"img/16.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "One Hand Push Up Right", vid:"img/14mmr.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/16.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "One Hand Push Up Right", vid:"img/14mmr.mp4", time: 60, cal: 8, reps:20,audiomove:"img/16.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Planche Push Up", vid:"img/15mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/17.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Planche Push Up", vid:"img/15mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/17.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Planche Push Up", vid:"img/15mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/17.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Reverse Plank", vid:"img/16mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/18.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Reverse Plank", vid:"img/16mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/18.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Reverse Plank", vid:"img/16mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/18.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "T Raise", vid:"img/17mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"",audiorep:"img/10reps.mp3"
    },
    {
      title: "T Raise", vid:"img/17mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"",audiorep:"img/15reps.mp3"
    },
    {
      title: "T Raise", vid:"img/17mm.mp4", time: 60, cal: 8, reps:20,audiomove:"",audiorep:"img/20reps.mp3"
    },
    {
      title: "Triceps Dips", vid:"img/18mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/19.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Triceps Dips", vid:"img/18mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/19.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Triceps Dips", vid:"img/18mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/19.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Wide Grip Push Up", vid:"img/19mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/20.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Wide Grip Push Up", vid:"img/19mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/20.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Wide Grip Push Up", vid:"img/19mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/20.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Narrow Grip Push Up", vid:"img/21mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/21.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Narrow Grip Push Up", vid:"img/21mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/21.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Narrow Grip Push Up", vid:"img/21mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/21.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Pike Push Up", vid:"img/22mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/22.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Pike Push Up", vid:"img/22mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/22.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Pike Push Up", vid:"img/22mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/22.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Ab Crunch", vid:"img/23mm.mp4", time: 30,cal:  6*0.5, reps:10,audiomove:"img/23.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Ab Crunch", vid:"img/23mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/23.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Ab Crunch", vid:"img/23mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/23.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Burpees", vid:"img/24mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/24.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Burpees", vid:"img/24mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/24.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Burpees", vid:"img/24mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/24.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Elevated Crunches", vid:"img/25mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/25.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Elevated Crunches", vid:"img/25mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/25.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Elevated Crunches", vid:"img/25mm.mp4", time: 60,cal:  11, reps:20,audiomove:"img/25.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Genie Sit", vid:"img/26mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/26.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Genie Sit", vid:"img/26mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/26.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Genie Sit", vid:"img/26mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/26.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "In and Out Abs", vid:"img/27mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/27.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "In and Out Abs", vid:"img/27mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/27.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "In and Out Abs", vid:"img/27mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/27.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Leg Lifts", vid:"img/28mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/28.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Leg Lifts", vid:"img/28mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/28.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Leg Lifts", vid:"img/28mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/28.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Mason Twist", vid:"img/29mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"",audiorep:"img/10reps.mp3"
    },
    {
      title: "Mason Twist", vid:"img/29mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"",audiorep:"img/15reps.mp3"
    },
    {
      title: "Mason Twist", vid:"img/29mm.mp4", time: 60, cal: 11, reps:20,audiomove:"",audiorep:"img/20reps.mp3"
    },
    {
      title: "Scissor Kicks", vid:"img/30mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/29.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Scissor Kicks", vid:"img/30mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/29.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Scissor Kicks", vid:"img/30mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/29.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Bridge Left", vid:"img/31mml.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/30.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Bridge Left", vid:"img/31mml.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/30.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Bridge Left", vid:"img/31mml.mp4", time: 60, cal: 11, reps:20,audiomove:"img/30.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Bridge Right", vid:"img/31mmr.mp4", time: 30,cal:  5*0.5, reps:10,audiomove:"img/31.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Bridge Right", vid:"img/31mmr.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/31.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Bridge Right", vid:"img/31mmr.mp4", time: 60, cal: 11, reps:20,audiomove:"img/31.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Spiderman Push Up", vid:"img/32mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/32.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Spiderman Push Up", vid:"img/32mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/32.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Spiderman Push Up", vid:"img/32mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/32.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Steam Engine", vid:"img/33mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/33.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Steam Engine", vid:"img/33mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/33.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Steam Engine", vid:"img/33mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/33.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Supermans", vid:"img/34mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/34.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Supermans", vid:"img/34mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/34.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Supermans", vid:"img/34mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/34.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Swimmer", vid:"img/35mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/35.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Swimmer", vid:"img/35mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/35.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Swimmer", vid:"img/35mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/35.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Supine Bicycle", vid:"img/36mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/36.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Supine Bicycle", vid:"img/36mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/36.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Supine Bicycle", vid:"img/36mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/36.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Twisting Crunches", vid:"img/37mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/37.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Twisting Crunches", vid:"img/37mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/37.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Twisting Crunches", vid:"img/37mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/37.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "V Sit Up", vid:"img/38mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/38.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "V Sit Up", vid:"img/38mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/38.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "V Sit Up", vid:"img/38mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/38.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Windmill", vid:"img/39mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/39.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Windmill", vid:"img/39mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/39.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Windmill", vid:"img/39mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/39.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Calf Raises", vid:"img/40mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/40.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Calf Raises", vid:"img/40mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/40.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Calf Raises", vid:"img/40mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/40.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Forward Lunges", vid:"img/41mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/41.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Forward Lunges", vid:"img/41mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/41.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Forward Lunges", vid:"img/41mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/41.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Frog Jumps", vid:"img/42mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/43.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Frog Jumps", vid:"img/42mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/43.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Frog Jumps", vid:"img/42mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/43.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Front Kicks", vid:"img/43mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/44.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Front Kicks", vid:"img/43mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/44.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Front Kicks", vid:"img/43mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/44.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Jump Sqauts", vid:"img/44mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/46.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Jump Sqauts", vid:"img/44mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/46.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Jump Sqauts", vid:"img/44mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/46.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/45mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/47.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/45mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/47.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/45mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/47.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Rear Lunges", vid:"img/46mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/48.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Rear Lunges", vid:"img/46mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/48.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Rear Lunges", vid:"img/46mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/48.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Reverse V Lunges", vid:"img/47mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/49.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Reverse V Lunges", vid:"img/47mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/49.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Reverse V Lunges", vid:"img/47mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/49.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Running in Place", vid:"img/48mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/50.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Running in Place", vid:"img/48mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/50.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Running in Place", vid:"img/48mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/50.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Lifts Right", vid:"img/49mmr.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/53.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Lifts Right", vid:"img/49mmr.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/53.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Lifts Right", vid:"img/49mmr.mp4", time: 60, cal: 11, reps:20,audiomove:"img/53.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Squats", vid:"img/52mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/57.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Squats", vid:"img/52mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/57.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Squats", vid:"img/52mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/57.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Step Ups", vid:"img/53mm.mp4", time: 30,cal:  4*0.5, reps:10,audiomove:"img/58.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Step Ups", vid:"img/53mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/58.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Step Ups", vid:"img/53mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/58.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Wall Sits", vid:"img/54mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/89.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Wall Sits", vid:"img/54mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/89.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Wall Sits", vid:"img/54mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/89.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Hip Raise", vid:"img/55mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/66.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Hip Raise", vid:"img/55mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/66.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Hip Raise", vid:"img/55mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/66.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Left", vid:"img/56mml.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/60.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Left", vid:"img/56mml.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/60.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Left", vid:"img/56mml.mp4", time: 60, cal: 11, reps:20,audiomove:"img/60.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Quadraplex", vid:"img/57mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/62.mp3",audiorep:"img/10reps.mp3"//NEED TO DO FOR ONE MOVE AUDIO
    },
    {
      title: "Quadraplex", vid:"img/57mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/62.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Quadraplex", vid:"img/57mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/62.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Plank Left", vid:"img/58mml.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/64.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Plank Left", vid:"img/58mml.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/64.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Plank Left", vid:"img/58mml.mp4", time: 60, cal: 8, reps:20,audiomove:"img/64.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Plank Right", vid:"img/58mmr.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/65.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Plank Right", vid:"img/58mmr.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/65.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Plank Right", vid:"img/58mmr.mp4", time: 60, cal: 8, reps:20,audiomove:"img/65.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "High Knees", vid:"img/59mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/75.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "High Knees", vid:"img/59mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/75.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "High Knees", vid:"img/59mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/75.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Power Jumps", vid:"img/60mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/76.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Power Jumps", vid:"img/60mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/76.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Power Jumps", vid:"img/60mm.mp4", time: 60,cal:  4, reps:20,audiomove:"img/76.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Star Jumps", vid:"img/61mm.mp4", time: 30,cal:  4*0.5, reps:10,audiomove:"img/77.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Star Jumps", vid:"img/61mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/77.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Star Jumps", vid:"img/61mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/77.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Marching Hip Raise", vid:"img/62mm.mp4", time: 30, cal: 4*0.5, reps:10,audiomove:"img/78.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Marching Hip Raise", vid:"img/62mm.mp4", time: 45, cal: 8*0.75, reps:15,audiomove:"img/78.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Marching Hip Raise", vid:"img/62mm.mp4", time: 60, cal: 8, reps:20,audiomove:"img/78.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Left", vid:"img/63mml.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/79.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Left", vid:"img/63mml.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/79.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Left", vid:"img/63mml.mp4", time: 60, cal: 11, reps:20,audiomove:"img/79.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Right", vid:"img/63mmr.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/80.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Right", vid:"img/63mmr.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/80.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Right", vid:"img/63mmr.mp4", time: 60, cal: 11, reps:20,audiomove:"img/80.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Squat with Kick Back", vid:"img/64mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/81.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Squat with Kick Back", vid:"img/64mm.mp4", time: 45,cal:  6*0.75, reps:15,audiomove:"img/81.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Squat with Kick Back", vid:"img/64mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/81.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Crunchy Frog", vid:"img/65mm.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/88.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Crunchy Frog", vid:"img/65mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/88.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Crunchy Frog", vid:"img/65mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/88.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/66mm.mp4", time: 30,cal:  6*0.5, reps:10,audiomove:"img/82.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/66mm.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/82.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/66mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/82.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Lunge Left", vid:"img/67mml.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/83.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Lunge Left", vid:"img/67mml.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/83.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Lunge Left", vid:"img/67mml.mp4", time: 60, cal: 11, reps:20,audiomove:"img/83.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Lunge Right", vid:"img/67mmr.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/84.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Lunge Right", vid:"img/67mmr.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/84.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Lunge Right", vid:"img/67mmr.mp4", time: 60, cal: 11, reps:20,audiomove:"img/84.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Left", vid:"img/68mml.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/85.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Left", vid:"img/68mml.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/85.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Left", vid:"img/68mml.mp4", time: 60, cal: 11, reps:20,audiomove:"img/85.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Right", vid:"img/68mmr.mp4", time: 30, cal: 6*0.5, reps:10,audiomove:"img/86.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Right", vid:"img/68mmr.mp4", time: 45, cal: 6*0.75, reps:15,audiomove:"img/86.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Right", vid:"img/68mmr.mp4", time: 60, cal: 11, reps:20,audiomove:"img/86.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Decline Push Up", vid:"img/69mm.mp4", time: 30, cal: 5*0.5, reps:10,audiomove:"img/87.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Decline Push Up", vid:"img/69mm.mp4", time: 45, cal: 9*0.75, reps:15,audiomove:"img/87.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Decline Push Up", vid:"img/69mm.mp4", time: 60, cal: 11, reps:20,audiomove:"img/87.mp3",audiorep:"img/20reps.mp3"
    },
    {
       title: "Break", vid:"img/break m.mp4", time: 30, cal:0, reps:1,audiomove:"img/break.mp3",audiorep:""
    },
    {
       title: "Break", vid:"img/break m.mp4", time: 45, cal:0, reps:1,audiomove:"img/break.mp3",audiorep:""
    },
    {
       title: "Break", vid:"img/break m.mp4", time: 60, cal:0, reps:1,audiomove:"img/break.mp3",audiorep:""
    }
  ];


  // All the different workouts that reference the Moves Above

  var mw1e = [
    $scope.malemoves[1],
    $scope.malemoves[1],
    $scope.malemoves[1],
    $scope.malemoves[1],
    $scope.malemoves[7],
    $scope.malemoves[181],
    $scope.malemoves[184],
    $scope.malemoves[187],
    $scope.malemoves[211],
    $scope.malemoves[214],
    $scope.malemoves[58],
    $scope.malemoves[61],
    $scope.malemoves[205],
    $scope.malemoves[208],
    $scope.malemoves[202]
  ];

  var mw1m = [
    $scope.malemoves[9],
    $scope.malemoves[182],
    $scope.malemoves[185],
    $scope.malemoves[188],
    $scope.malemoves[212],
    $scope.malemoves[215],
    $scope.malemoves[60],
    $scope.malemoves[63],
    $scope.malemoves[206],
    $scope.malemoves[209],
    $scope.malemoves[203],
    $scope.malemoves[36],
    $scope.malemoves[69],
    $scope.malemoves[15],
    $scope.malemoves[42],
    $scope.malemoves[59],
    $scope.malemoves[24],
    $scope.malemoves[27]
  ];

  var mw1h = [
    $scope.malemoves[9],
    $scope.malemoves[183],
    $scope.malemoves[186],
    $scope.malemoves[189],
    $scope.malemoves[213],
    $scope.malemoves[216],
    $scope.malemoves[60],
    $scope.malemoves[63],
    $scope.malemoves[207],
    $scope.malemoves[210],
    $scope.malemoves[204],
    $scope.malemoves[36],
    $scope.malemoves[69],
    $scope.malemoves[15],
    $scope.malemoves[42],
    $scope.malemoves[59],
    $scope.malemoves[0],
    $scope.malemoves[9],
    $scope.malemoves[183],
    $scope.malemoves[186],
    $scope.malemoves[189],
    $scope.malemoves[213],
    $scope.malemoves[216],
    $scope.malemoves[60],
    $scope.malemoves[63],
    $scope.malemoves[207],
    $scope.malemoves[210],
    $scope.malemoves[204],
    $scope.malemoves[36],
    $scope.malemoves[69],
    $scope.malemoves[15],
    $scope.malemoves[42],
    $scope.malemoves[59]
  ];

  var mw2e = [
    $scope.malemoves[40],
    $scope.malemoves[205],
    $scope.malemoves[208],
    $scope.malemoves[7],
    $scope.malemoves[145],
    $scope.malemoves[184],
    $scope.malemoves[220],
    $scope.malemoves[112],
    $scope.malemoves[109],
    $scope.malemoves[106],
    $scope.malemoves[103],
    $scope.malemoves[202]
  ];

  var mw2m = [
    $scope.malemoves[42],
    $scope.malemoves[206],
    $scope.malemoves[209],
    $scope.malemoves[8],
    $scope.malemoves[221],
    $scope.malemoves[146],
    $scope.malemoves[162],
    $scope.malemoves[185],
    $scope.malemoves[182],
    $scope.malemoves[221],
    $scope.malemoves[107],
    $scope.malemoves[105],
    $scope.malemoves[96],
    $scope.malemoves[99],
    $scope.malemoves[102],
    $scope.malemoves[222],
    $scope.malemoves[86],
    $scope.malemoves[90],
    $scope.malemoves[93]
  ];

  var mw2h = [
    $scope.malemoves[42],
    $scope.malemoves[207],
    $scope.malemoves[210],
    $scope.malemoves[9],
    $scope.malemoves[147],
    $scope.malemoves[163],
    $scope.malemoves[185],
    $scope.malemoves[182],
    $scope.malemoves[108],
    $scope.malemoves[105],
    $scope.malemoves[96],
    $scope.malemoves[99],
    $scope.malemoves[102],
    $scope.malemoves[222],
    $scope.malemoves[87],
    $scope.malemoves[90],
    $scope.malemoves[93],
    $scope.malemoves[42],
    $scope.malemoves[207],
    $scope.malemoves[210],
    $scope.malemoves[9],
    $scope.malemoves[147],
    $scope.malemoves[163],
    $scope.malemoves[185],
    $scope.malemoves[182],
    $scope.malemoves[222],
    $scope.malemoves[108],
    $scope.malemoves[105],
    $scope.malemoves[96],
    $scope.malemoves[99],
    $scope.malemoves[102],
    $scope.malemoves[86],
    $scope.malemoves[90],
    $scope.malemoves[93]
  ];

  var mw3e = [
    $scope.malemoves[19],
    $scope.malemoves[37],
    $scope.malemoves[64],
    $scope.malemoves[55],
    $scope.malemoves[58],
    $scope.malemoves[220],
    $scope.malemoves[181],
    $scope.malemoves[205],
    $scope.malemoves[208],
    $scope.malemoves[112],
    $scope.malemoves[34]
  ];

  var mw3m = [
    $scope.malemoves[21],
    $scope.malemoves[38],
    $scope.malemoves[65],
    $scope.malemoves[221],
    $scope.malemoves[56],
    $scope.malemoves[59],
    $scope.malemoves[183],
    $scope.malemoves[207],
    $scope.malemoves[210],
    $scope.malemoves[221],
    $scope.malemoves[114],
    $scope.malemoves[36],
    $scope.malemoves[39],
    $scope.malemoves[3],
    $scope.malemoves[222],
    $scope.malemoves[20],
    $scope.malemoves[45],
    $scope.malemoves[48]
  ];

  var mw3h = [
    $scope.malemoves[21],
    $scope.malemoves[39],
    $scope.malemoves[66],
    $scope.malemoves[57],
    $scope.malemoves[60],
    $scope.malemoves[183],
    $scope.malemoves[207],
    $scope.malemoves[210],
    $scope.malemoves[115],
    $scope.malemoves[36],
    $scope.malemoves[39],
    $scope.malemoves[3],
    $scope.malemoves[222],
    $scope.malemoves[21],
    $scope.malemoves[45],
    $scope.malemoves[48],
    $scope.malemoves[21],
    $scope.malemoves[39],
    $scope.malemoves[66],
    $scope.malemoves[57],
    $scope.malemoves[60],
    $scope.malemoves[183],
    $scope.malemoves[207],
    $scope.malemoves[210],
    $scope.malemoves[222],
    $scope.malemoves[115],
    $scope.malemoves[36],
    $scope.malemoves[39],
    $scope.malemoves[3],
    $scope.malemoves[21],
    $scope.malemoves[45],
    $scope.malemoves[48]
  ];


    var mw4e = [
    $scope.malemoves[84],
    $scope.malemoves[57],
    $scope.malemoves[108],
    $scope.malemoves[186],
    $scope.malemoves[183],
    $scope.malemoves[123],
    $scope.malemoves[117],
    $scope.malemoves[129]
  ];

  var mw4m = [
    $scope.malemoves[84],
    $scope.malemoves[57],
    $scope.malemoves[108],
    $scope.malemoves[186],
    $scope.malemoves[183],
    $scope.malemoves[123],
    $scope.malemoves[117],
    $scope.malemoves[129],
    $scope.malemoves[220],
    $scope.malemoves[84],
    $scope.malemoves[57],
    $scope.malemoves[108],
    $scope.malemoves[186],
    $scope.malemoves[183],
    $scope.malemoves[123],
    $scope.malemoves[117],
    $scope.malemoves[129]
  ];

  var mw4h = [
    $scope.malemoves[84],
    $scope.malemoves[57],
    $scope.malemoves[108],
    $scope.malemoves[186],
    $scope.malemoves[183],
    $scope.malemoves[123],
    $scope.malemoves[117],
    $scope.malemoves[129],
    $scope.malemoves[220],
    $scope.malemoves[84],
    $scope.malemoves[57],
    $scope.malemoves[108],
    $scope.malemoves[186],
    $scope.malemoves[183],
    $scope.malemoves[123],
    $scope.malemoves[117],
    $scope.malemoves[129],
    $scope.malemoves[220],
    $scope.malemoves[84],
    $scope.malemoves[57],
    $scope.malemoves[108],
    $scope.malemoves[186],
    $scope.malemoves[183],
    $scope.malemoves[123],
    $scope.malemoves[117],
    $scope.malemoves[129],
    $scope.malemoves[220],
    $scope.malemoves[84],
    $scope.malemoves[57],
    $scope.malemoves[108],
    $scope.malemoves[186],
    $scope.malemoves[183],
    $scope.malemoves[123],
    $scope.malemoves[117],
    $scope.malemoves[129]
  ];



  var mw5e = [
    $scope.malemoves[40],
    $scope.malemoves[37],
    $scope.malemoves[100],
    $scope.malemoves[106],
    $scope.malemoves[220],
    $scope.malemoves[111],
    $scope.malemoves[108],
    $scope.malemoves[7]
  ];

  var mw5m = [
    $scope.malemoves[42],
    $scope.malemoves[38],
    $scope.malemoves[101],
    $scope.malemoves[221],
    $scope.malemoves[107],
    $scope.malemoves[113],
    $scope.malemoves[110],
    $scope.malemoves[221],
    $scope.malemoves[209],
    $scope.malemoves[9],
    $scope.malemoves[60],
    $scope.malemoves[199],
    $scope.malemoves[222],
    $scope.malemoves[62],
    $scope.malemoves[66],
    $scope.malemoves[30]
  ];

  var mw5h = [
    $scope.malemoves[42],
    $scope.malemoves[39],
    $scope.malemoves[102],
    $scope.malemoves[108],
    $scope.malemoves[113],
    $scope.malemoves[110],
    $scope.malemoves[9],
    $scope.malemoves[60],
    $scope.malemoves[199],
    $scope.malemoves[222],
    $scope.malemoves[63],
    $scope.malemoves[66],
    $scope.malemoves[30],
    $scope.malemoves[42],
    $scope.malemoves[39],
    $scope.malemoves[102],
    $scope.malemoves[108],
    $scope.malemoves[113],
    $scope.malemoves[110],
    $scope.malemoves[222],
    $scope.malemoves[9],
    $scope.malemoves[60],
    $scope.malemoves[199],
    $scope.malemoves[63],
    $scope.malemoves[66],
    $scope.malemoves[30]
  ];


    var mw6e = [
    $scope.malemoves[16],
    $scope.malemoves[146],
    $scope.malemoves[199],
    $scope.malemoves[193],
    $scope.malemoves[196],
    $scope.malemoves[181],
    $scope.malemoves[220],
    $scope.malemoves[178],
    $scope.malemoves[10],
    $scope.malemoves[4],
    $scope.malemoves[7]
  ];

  var mw6m = [
    $scope.malemoves[18],
    $scope.malemoves[147],
    $scope.malemoves[200],
    $scope.malemoves[221],
    $scope.malemoves[194],
    $scope.malemoves[182],
    $scope.malemoves[180],
    $scope.malemoves[12],
    $scope.malemoves[221],
    $scope.malemoves[5],
    $scope.malemoves[9],
    $scope.malemoves[210],
    $scope.malemoves[198],
    $scope.malemoves[222],
    $scope.malemoves[86],
    $scope.malemoves[99],
    $scope.malemoves[102]
  ];

  var mw6h = [
    $scope.malemoves[18],
    $scope.malemoves[148],
    $scope.malemoves[201],
    $scope.malemoves[195],
    $scope.malemoves[183],
    $scope.malemoves[180],
    $scope.malemoves[12],
    $scope.malemoves[6],
    $scope.malemoves[9],
    $scope.malemoves[210],
    $scope.malemoves[198],
    $scope.malemoves[222],
    $scope.malemoves[87],
    $scope.malemoves[99],
    $scope.malemoves[102],
    $scope.malemoves[18],
    $scope.malemoves[147],
    $scope.malemoves[201],
    $scope.malemoves[195],
    $scope.malemoves[183],
    $scope.malemoves[180],
    $scope.malemoves[12],
    $scope.malemoves[222],
    $scope.malemoves[6],
    $scope.malemoves[9],
    $scope.malemoves[210],
    $scope.malemoves[198],
    $scope.malemoves[87],
    $scope.malemoves[99],
    $scope.malemoves[102]
  ];


  var mw7e = [
    $scope.malemoves[58],
    $scope.malemoves[196],
    $scope.malemoves[7],
    $scope.malemoves[205],
    $scope.malemoves[208],
    $scope.malemoves[91],
    $scope.malemoves[220],
    $scope.malemoves[100],
    $scope.malemoves[64],
    $scope.malemoves[55]
  ];

  var mw7m = [
    $scope.malemoves[60],
    $scope.malemoves[197],
    $scope.malemoves[8],
    $scope.malemoves[221],
    $scope.malemoves[206],
    $scope.malemoves[209],
    $scope.malemoves[92],
    $scope.malemoves[96],
    $scope.malemoves[99],
    $scope.malemoves[102],
    $scope.malemoves[221],
    $scope.malemoves[65],
    $scope.malemoves[57],
    $scope.malemoves[183],
    $scope.malemoves[186],
    $scope.malemoves[222],
    $scope.malemoves[188],
    $scope.malemoves[171],
    $scope.malemoves[162]
  ];

  var mw7h = [
    $scope.malemoves[60],
    $scope.malemoves[198],
    $scope.malemoves[9],
    $scope.malemoves[210],
    $scope.malemoves[93],
    $scope.malemoves[96],    
    $scope.malemoves[99],
    $scope.malemoves[102],
    $scope.malemoves[66],
    $scope.malemoves[57],
    $scope.malemoves[183],
    $scope.malemoves[186],
    $scope.malemoves[222],
    $scope.malemoves[189],
    $scope.malemoves[171],
    $scope.malemoves[162],
    $scope.malemoves[60],
    $scope.malemoves[198],
    $scope.malemoves[9],
    $scope.malemoves[210],
    $scope.malemoves[93],
    $scope.malemoves[96],
    $scope.malemoves[99],
    $scope.malemoves[102],
    $scope.malemoves[222],
    $scope.malemoves[66],
    $scope.malemoves[57],
    $scope.malemoves[183],
    $scope.malemoves[186],
    $scope.malemoves[189],
    $scope.malemoves[171],
    $scope.malemoves[162]
  ];


  var mw8e = [
    $scope.malemoves[145],
    $scope.malemoves[127],
    $scope.malemoves[16],
    $scope.malemoves[37],
    $scope.malemoves[31],
    $scope.malemoves[220],
    $scope.malemoves[22],
    $scope.malemoves[25],
    $scope.malemoves[31],
    $scope.malemoves[10]
  ];

  var mw8m = [
    $scope.malemoves[147],
    $scope.malemoves[128],
    $scope.malemoves[17],
    $scope.malemoves[221],
    $scope.malemoves[38],
    $scope.malemoves[32],
    $scope.malemoves[24],
    $scope.malemoves[27],
    $scope.malemoves[221],
    $scope.malemoves[32],
    $scope.malemoves[12],
    $scope.malemoves[45],
    $scope.malemoves[48],
    $scope.malemoves[222],
    $scope.malemoves[14],
    $scope.malemoves[108],
    $scope.malemoves[111]
  ];

  var mw8h = [
    $scope.malemoves[147],
    $scope.malemoves[129],
    $scope.malemoves[18],
    $scope.malemoves[39],
    $scope.malemoves[33],
    $scope.malemoves[24],
    $scope.malemoves[27],
    $scope.malemoves[33],
    $scope.malemoves[12],
    $scope.malemoves[45],
    $scope.malemoves[48],
    $scope.malemoves[222],
    $scope.malemoves[15],
    $scope.malemoves[108],
    $scope.malemoves[111],
    $scope.malemoves[147],
    $scope.malemoves[129],
    $scope.malemoves[18],
    $scope.malemoves[39],
    $scope.malemoves[33],
    $scope.malemoves[24],
    $scope.malemoves[27],
    $scope.malemoves[222],
    $scope.malemoves[33],
    $scope.malemoves[12],
    $scope.malemoves[45],
    $scope.malemoves[48],
    $scope.malemoves[15],
    $scope.malemoves[108],
    $scope.malemoves[111]
  ];


  var mw9e = [
    $scope.malemoves[205],
    $scope.malemoves[208],
    $scope.malemoves[181],
    $scope.malemoves[184],
    $scope.malemoves[97],
    $scope.malemoves[100],
    $scope.malemoves[220],
    $scope.malemoves[94],
    $scope.malemoves[57],
    $scope.malemoves[88],
    $scope.malemoves[67]
  ];

  var mw9m = [
    $scope.malemoves[210],
    $scope.malemoves[182],
    $scope.malemoves[185],
    $scope.malemoves[221],
    $scope.malemoves[98],
    $scope.malemoves[101],
    $scope.malemoves[96],
    $scope.malemoves[59],
    $scope.malemoves[221],
    $scope.malemoves[90],
    $scope.malemoves[87],
    $scope.malemoves[69],
    $scope.malemoves[81],
    $scope.malemoves[222],
    $scope.malemoves[77],
    $scope.malemoves[75],
    $scope.malemoves[72]
  ];

  var mw9h = [
    $scope.malemoves[210],
    $scope.malemoves[207],
    $scope.malemoves[183],
    $scope.malemoves[186],
    $scope.malemoves[99],
    $scope.malemoves[96],
    $scope.malemoves[102],
    $scope.malemoves[59],
    $scope.malemoves[90],
    $scope.malemoves[69],
    $scope.malemoves[87],
    $scope.malemoves[81],
    $scope.malemoves[222],
    $scope.malemoves[78],
    $scope.malemoves[75],
    $scope.malemoves[72],
    $scope.malemoves[210],
    $scope.malemoves[207],
    $scope.malemoves[183],
    $scope.malemoves[186],
    $scope.malemoves[99],
    $scope.malemoves[96],
    $scope.malemoves[102],
    $scope.malemoves[59],
    $scope.malemoves[90],
    $scope.malemoves[69],
    $scope.malemoves[87],
    $scope.malemoves[81],
    $scope.malemoves[222],
    $scope.malemoves[78],
    $scope.malemoves[75],
    $scope.malemoves[72]
  ];


  var mw10e = [
    $scope.malemoves[34],
    $scope.malemoves[37],
    $scope.malemoves[7],
    $scope.malemoves[22],
    $scope.malemoves[25],
    $scope.malemoves[220],
    $scope.malemoves[28],
    $scope.malemoves[1],
    $scope.malemoves[10],
    $scope.malemoves[13]
  ];

  var mw10m = [
    $scope.malemoves[36],
    $scope.malemoves[38],
    $scope.malemoves[8],
    $scope.malemoves[221],
    $scope.malemoves[23],
    $scope.malemoves[26],
    $scope.malemoves[30],
    $scope.malemoves[3],
    $scope.malemoves[221],
    $scope.malemoves[11],
    $scope.malemoves[15],
    $scope.malemoves[6],
    $scope.malemoves[78],
    $scope.malemoves[222],
    $scope.malemoves[62],
    $scope.malemoves[75],
    $scope.malemoves[66]
  ];

  var mw10h = [
    $scope.malemoves[36],
    $scope.malemoves[39],
    $scope.malemoves[9],
    $scope.malemoves[24],
    $scope.malemoves[27],
    $scope.malemoves[30],
    $scope.malemoves[3],
    $scope.malemoves[12],
    $scope.malemoves[15],
    $scope.malemoves[6],
    $scope.malemoves[78],
    $scope.malemoves[222],
    $scope.malemoves[63],
    $scope.malemoves[75],
    $scope.malemoves[66],
    $scope.malemoves[36],
    $scope.malemoves[39],
    $scope.malemoves[9],
    $scope.malemoves[24],
    $scope.malemoves[27],
    $scope.malemoves[30],
    $scope.malemoves[3],
    $scope.malemoves[222],
    $scope.malemoves[12],
    $scope.malemoves[15],
    $scope.malemoves[6],
    $scope.malemoves[78],
    $scope.malemoves[63],
    $scope.malemoves[75],
    $scope.malemoves[66]
  ];


    var mw11e = [
    $scope.malemoves[16],
    $scope.malemoves[145],
    $scope.malemoves[94],
    $scope.malemoves[97],
    $scope.malemoves[184],
    $scope.malemoves[187],
    $scope.malemoves[220],
    $scope.malemoves[67],
    $scope.malemoves[208],
    $scope.malemoves[206],
    $scope.malemoves[58]
  ];

  var mw11m = [
    $scope.malemoves[18],
    $scope.malemoves[146],
    $scope.malemoves[98],
    $scope.malemoves[221],
    $scope.malemoves[185],
    $scope.malemoves[188],
    $scope.malemoves[69],
    $scope.malemoves[210],
    $scope.malemoves[221],
    $scope.malemoves[59],
    $scope.malemoves[208],
    $scope.malemoves[9],
    $scope.malemoves[192],
    $scope.malemoves[222],
    $scope.malemoves[170],
    $scope.malemoves[219],
    $scope.malemoves[222]
  ];

  var mw11h = [
    $scope.malemoves[18],
    $scope.malemoves[147],
    $scope.malemoves[99],
    $scope.malemoves[186],
    $scope.malemoves[189],
    $scope.malemoves[69],
    $scope.malemoves[210],
    $scope.malemoves[60],
    $scope.malemoves[208],
    $scope.malemoves[9],
    $scope.malemoves[192],
    $scope.malemoves[222],
    $scope.malemoves[171],
    $scope.malemoves[219],
    $scope.malemoves[222],
    $scope.malemoves[18],
    $scope.malemoves[147],
    $scope.malemoves[99],
    $scope.malemoves[186],
    $scope.malemoves[189],
    $scope.malemoves[69],
    $scope.malemoves[210],
    $scope.malemoves[222],
    $scope.malemoves[60],
    $scope.malemoves[208],
    $scope.malemoves[9],
    $scope.malemoves[192],
    $scope.malemoves[171],
    $scope.malemoves[219],
    $scope.malemoves[222]
  ];



// All the Workouts Details Information such as image, background color, and so on
//FUJION
     $scope.mwd = {
      w1: {
        title:"Rock City ",
        num: "01",
        price: "3.00",
        finishmessage:"Wow, you destroyed that workout!",
        sharemessage:"Bet you can't beat that! #FitnessChallenge",
        shareimglink:"img/men1.png",
        celeb: "Jared Leto, Someone Else",
        type: "Full Body",
        desc: "Designed to transform you into a beast. Prepare to sweat using a combination of high weight high intense work out routines, and multiple reps, the Rock City is for the giant laying inside you.  This Workout is full body muscle generating workout.",
        length:"2",
        colorline:"#eb452f",
        back:"img/mback1-01.svg",
        mainimg:"img/men1.jpg",
        resultback:"img/men1back.jpg",
        easyinfo:[Math.round(0.0175*29.5*($rootScope.loginData.weight*0.45)),"5:30",mw1e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*124*($rootScope.loginData.weight*0.45)),"15:45",mw1m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*274*($rootScope.loginData.weight*0.45)),"31:30",mw1h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw1e,
        medium: mw1m,
        hard: mw1h

      },
      w2: {
        title:"Knockout Club ",
        num:"02",
        price: "4.00",
        finishmessage:"Keep it up!",
        sharemessage:"Fitness motivation #fitnessgoals",
        shareimglink:"http://gogatherapp.com/images/men2.png",
        celeb: "Brad Pitt",
        type: "Arms",
        desc: "Inspired by the great fighting films in Hollywood, Knockout Club hits you with all the move that celebrities train to achieve a fighter’s body: strong hard muscles, a well defined chest, and a strong core of abs.  A Focus on stamina through cardio is also emphasized. Now, do you dare enter the ring",
        length:"2",
        colorline:"#6fd379 ",
        back:"img/mback2-01.svg",
        mainimg:"img/men2.png",
        resultback:"img/mr2.jpg",
        easyinfo:[Math.round(0.0175*28.5*($rootScope.loginData.weight*0.45)),"6:00",mw2e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*132*($rootScope.loginData.weight*0.45)),"16:30",mw2m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*293*($rootScope.loginData.weight*0.45)),"31:45",mw2h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw2e,
        medium: mw2m,
        hard: mw2h
      },
      w3: {
        title:"Comic Crusader ",
        num:"02",
        price: "4.00",
        finishmessage:"Keep getting it and keep sweating it",
        sharemessage:"Body Goals anyone? #bodygoals",
        shareimglink:"http://gogatherapp.com/images/men3.png",
        celeb: "Chris Pratt, Chris Evans",
        type: "Chest/Back",
        desc: "Powerful, strong, quick, agile, the Black Panther embodies all these characteristics. Created to bring out the Superhero in you. Inspired by the Dead Pool movie and what it took for its actor to achieve the body of a superhero. Focusing on increasing your agility, core, size and lean muscles. This is a full body workout.",
        length:"2",
        colorline:"#3d3c3c",
        back:"img/mback3-01.svg",
        mainimg:"img/men3.png",
        resultback:"img/mr3.jpg",
        easyinfo:[Math.round(0.0175*27.5*($rootScope.loginData.weight*0.45)),"5:30",mw3e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*108*($rootScope.loginData.weight*0.45)),"16:15",mw3m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*237*($rootScope.loginData.weight*0.45)),"31:00",mw3h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw3e,
        medium: mw3m,
        hard: mw3h
      },
      w4: {
        title:"The 300 ",
        num:"02",
        price: "4.00",
        finishmessage:"Keep getting it and keep sweating it",
        sharemessage:"Body Goals anyone? #bodygoals",
        shareimglink:"http://gogatherapp.com/images/men4.png",
        celeb: "Chris Pratt, Chris Evans",
        type: "Legs",
        desc: "The Ancient Spartans of Greece are known throughout history for their unforgiving might and strength. Train like a Spartan with Battle Axe, it combines Olympic lifts, functional training, and metabolic body movements to unleash the warrior in you. This is a full body workout that strengths your core and increases muscle mass.",
        length:"2",
        colorline:"#2cffc9",
        back:"img/mback4-01.svg",
        mainimg:"img/men4.png",
        resultback:"img/mr4.jpg",
        easyinfo:[Math.round(0.0175*25.5*($rootScope.loginData.weight*0.45)),"5:30",mw4e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*141*($rootScope.loginData.weight*0.45)),"17:00",mw4m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*346*($rootScope.loginData.weight*0.45)),"34:00",mw4h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw4e,
        medium: mw4m,
        hard: mw4h
      },
      w5: {
        title:"Red Magic ",
        num:"02",
        price: "4.00",
        finishmessage:"Keep getting it and keep sweating it",
        sharemessage:"Body Goals anyone? #bodygoals",
        shareimglink:"http://gogatherapp.com/images/men5.png",
        celeb: "Chris Pratt, Chris Evans",
        type: "Full Body",
        desc: "You’ll be able to perform all the magic moves after enduring this workout.  The bright lights of stage will call your name. Inspired by the movie Magic Mike, this workout routine will chisel your muscles and transform your body. This is full body high intense workout, it emphasizes attaining an amazing set of abs.",
        length:"2",
        colorline:"#211b66",
        back:"img/mback5-01.svg",
        mainimg:"img/men5.png",
        resultback:"img/mr5.jpg",
        easyinfo:[Math.round(0.0175*35.5*($rootScope.loginData.weight*0.45)),"5:00",mw5e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*84*($rootScope.loginData.weight*0.45)),"13:15",mw5m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*191*($rootScope.loginData.weight*0.45)),"24:00",mw5h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw5e,
        medium: mw5m,
        hard: mw5h
      },
      w6: {
        title:"Hollywood Heartthrob ",
        num:"02",
        price: "4.00",
        finishmessage:"Keep getting it and keep sweating it",
        sharemessage:"Body Goals anyone? #bodygoals",
        shareimglink:"http://gogatherapp.com/images/men6.png",
        celeb: "Zac Efron",
        type: "Full Body",
        desc: "A workout suited to keep you lean and toned.  Sculpt your muscles in a moderate defined way.  Inspired by the physique of actors such Zac Efron and Ryan Gosling, Shades of cool promises the Hollywood leading man look.  This workout is a full body routine, an overall toned, cut, physique.",
        length:"2",
        colorline:"#fbe242",
        back:"img/mback6-01.svg",
        mainimg:"img/men6.png",
        resultback:"img/mr6.jpg",
        easyinfo:[Math.round(0.0175*28.5*($rootScope.loginData.weight*0.45)),"5:45",mw6e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*119*($rootScope.loginData.weight*0.45)),"15:15",mw6m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*267*($rootScope.loginData.weight*0.45)),"29:30",mw6h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw6e,
        medium: mw6m,
        hard: mw6h
      },
      w7: {
        title:"King Of The Jungle ",
        num:"02",
        price: "4.00",
        finishmessage:"Show off those results and let everyone see your hard work",
        sharemessage:"Body Goals anyone? #bodygoals",
        shareimglink:"http://gogatherapp.com/images/men7.png",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "Take the challenge and survive nature’s worst voracity. You need strength, agility, and flexibility to stand a chance. Chris Pratt had to take on the jungle in the movie that made him a celebrity. This workout is inspired by Chris’ physique in Jurassic World. It targets your core, shoulders and legs, emphasizing agility, strength and flexibility, while reducing fat.  Pass this workout, and someday you may become the King of the Jungle. This is a full body, fat reducing workout.",
        length:"2",
        colorline:"#67dd9b",
        back:"img/mback7-01.svg",
        mainimg:"img/men7.png",
        resultback:"img/mr7.jpg",
        easyinfo:[Math.round(0.0175*25.25*($rootScope.loginData.weight*0.45)),"5:00",mw7e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*117.5*($rootScope.loginData.weight*0.45)),"16:45",mw7m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*270*($rootScope.loginData.weight*0.45)),"32:00",mw7h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw7e,
        medium: mw7m,
        hard: mw7h
      },
      w8: {
        title:"The Red Shield ",
        num:"02",
        price: "4.00",
        finishmessage:"Those results deserve sharing",
        sharemessage:"Body Goals anyone? #bodygoals",
        shareimglink:"http://gogatherapp.com/images/men8.png",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "This high intense workout will transform your muscles into steel. It concentrates on Olympic lifts functional training and metabolic movements. Created to increase muscle mass through high weights and high number of reps. . Actors taking on the roles of iconic superheros are the inspiration behind the Red Shield. It is a full body muscle enlarging workout.",
        length:"2",
        colorline:"#c93b37",
        back:"img/mback8-01.svg",
        mainimg:"img/men8.png",
        resultback:"img/mr8.jpg",
        easyinfo:[Math.round(0.0175*20.5*($rootScope.loginData.weight*0.45)),"5:00",mw8e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*118*($rootScope.loginData.weight*0.45)),"15:00",mw8m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*266*($rootScope.loginData.weight*0.45)),"30:00",mw8h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw8e,
        medium: mw8m,
        hard: mw8h
      },
      w9: {
        title:"The Wolverine ",
        num:"02",
        price: "4.00",
        finishmessage:"Those are post worthy numbers",
        sharemessage:"Beach body ready! #fitlife",
        shareimglink:"http://gogatherapp.com/images/men9.png",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "Let the beast loose, let animal inside you run free; Inspired by the physique portrayed in the Wolverine movies, the Howling Wolf combines high intensity strength training for rapid muscle increase. This workout focuses on strength training by targeting a specific body part. This is a full body workout for muscles enlargement and strength training.",
        length:"2",
        colorline:"#1931AA",
        back:"img/mback9-01.svg",
        mainimg:"img/men9.png",
        resultback:"img/mr9.jpg",
        easyinfo:[Math.round(0.0175*31*($rootScope.loginData.weight*0.45)),"6:00",mw9e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*115*($rootScope.loginData.weight*0.45)),"15:00",mw9m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*269*($rootScope.loginData.weight*0.45)),"31:30",mw9h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw9e,
        medium: mw9m,
        hard: mw9h
      },
      w10: {
        title:"Achilles ",
        num:"02",
        price: "4.00",
        finishmessage:"Keep it up!",
        sharemessage:"Beach body ready! #fitlife",
        shareimglink:"http://gogatherapp.com/images/men10.png",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "Transform your body from a mere mortal to Achilles, the great Greek warrior. This was the inspiration behind The Trojan War, inspired by the movie Troy staring Brad Pitt. If you seek a similar physique than this is the workout for you. It is a full body high intensity workout focusing on both muscle strengthening and defining.",
        length:"2",
        colorline:"#f09348",
        back:"img/mback10-01.svg",
        mainimg:"img/men10.png",
        resultback:"img/mr10.jpg",
        easyinfo:[Math.round(0.0175*23.5*($rootScope.loginData.weight*0.45)),"5:00",mw10e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*102*($rootScope.loginData.weight*0.45)),"15:00",mw10m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*242*($rootScope.loginData.weight*0.45)),"30:00",mw10h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw10e,
        medium: mw10m,
        hard: mw10h
      },
      w11: {
        title:"Fist Of Fury ",
        num:"02",
        price: "4.00",
        finishmessage:"Those results deserve sharing",
        sharemessage:"Challenge Initiated #beatthat",
        shareimglink:"http://gogatherapp.com/images/men11.png",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "Crafting strength, quick fists and feet are at the heart of fist of fury. With a focus on core strengthening, flexibility and agility. Famous martial artists, and great kung fu masters of the past were the inspiration behind this workout. This workout targets chest, back, strong core, legs and stamina.",
        length:"2",
        colorline:"#70de6d",
        back:"img/mback11-01.svg",
        mainimg:"img/men11.png",
        resultback:"img/mr11.jpg",
        easyinfo:[Math.round(0.0175*27*($rootScope.loginData.weight*0.45)),"5:45",mw11e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*96*($rootScope.loginData.weight*0.45)),"14:30",mw11m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*230*($rootScope.loginData.weight*0.45)),"29:00",mw11h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: mw11e,
        medium: mw11m,
        hard: mw11h
      }
    };


    $scope.zeroOut=function(){
       $rootScope.totalcalc=0;
       $rootScope.totalTime=0; 
    }

    $scope.pick = function(selectedBook) {
      $rootScope.choice = selectedBook;

      console.log(selectedBook);

    }


    $scope.bubble = function(selectedCal) {
      $rootScope.bub = selectedCal;
      console.log($rootScope.bub);
    }

    $scope.choosen = function(selectedChoose) {
      $rootScope.diff = selectedChoose;
      console.log("selectedChoose");
      $ionicScrollDelegate.resize();
    }

    $scope.go = function ( path ) {
    $location.path( path );
  };



   $scope.ctrlCheck="Male";


})






//Women or Female Ctrl for all Female Workouts
.controller('WomenCtrl', function($scope, $state, $rootScope, $ionicScrollDelegate, $ionicSideMenuDelegate) {

  $scope.$on('$ionicView.enter', function(){
      $ionicSideMenuDelegate.canDragContent(false);
      $scope.lockProcess();
  });
  
  $scope.$on('$ionicView.leave', function(){
      $ionicSideMenuDelegate.canDragContent(true);
  });
  
  $scope.yessir=12;

  $scope.additup=function(index){

    $scope.tmet=0;
    $scope.ttime=0;
    // $scope.tn=index.length;

    for (var i = 0; i < index.length; i++) {
      $scope.tmet+=index[i].cal;  
      $scope.ttime+=index[i].time;  
      //Do something
    }

    $scope.tcal=0.0175*$10*($rootScope.loginData.weight*0.45);
    $scope.tcal=Math.round($scope.tcal);

  }

//Names and details of workouts to be displayed in list form on the main display page 
   $scope.femaleworkouts = [
    { title: 'Scorn',                       url:"#/app/details",  id: 1, num:"01",  image: "img/womens1.png",        info: "fwd.f1",     caloriesmain:Math.round(0.0175*190*($rootScope.loginData.weight*0.45)),  time:"5:00",    color:"img/11111.png",  type:"Full Body"},
    { title: 'Video Vixen',                 url:"#/app/details",  id: 2, num:"02",  image: "img/womens2.png",        info: "fwd.f2",     caloriesmain:Math.round(0.0175*184*($rootScope.loginData.weight*0.45)),  time:"5:00",    color:"img/rb.png",     type:"Upper Body"},
    { title: 'Python',                      url:"#/app/details",  id: 3, num:"03",  image: "img/womens3.png",        info: "fwd.f3",     caloriesmain:Math.round(0.0175*157*($rootScope.loginData.weight*0.45)),  time:"5:45",    color:"img/rb.png",     type:"Butt"},
    { title: 'Malibu Athletics',            url:"#/app/search",   id: 4, num:"04",  image: "img/womens4.png",        info: "fwd.f4",     caloriesmain:Math.round(0.0175*179*($rootScope.loginData.weight*0.45)),  time:"5:45",    color:"img/rb.png",     type:"Full Body" },
    { title: 'The Country Heart Breaker',   url:"#/app/mworkouts",id: 5, num:"05",  image: "img/womens5.png",        info: "fwd.f5",     caloriesmain:Math.round(0.0175*196*($rootScope.loginData.weight*0.45)),  time:"5:30",    color:"img/rb.png",     type:"Full Body" },
    { title: 'Brazilian Bombshell',         url:"#/app/details",  id: 6, num:"06",  image: "img/womens6.png",        info: "fwd.f6",     caloriesmain:Math.round(0.0175*192*($rootScope.loginData.weight*0.45)),  time:"5:30",    color:"img/rb.png",     type:"Full Body" },
    { title: 'Lipliscious',                 url:"#/app/details",  id: 1, num:"07",  image: "img/womens7.png",        info: "fwd.f7",     caloriesmain:Math.round(0.0175*182.5*($rootScope.loginData.weight*0.45)),  time:"5:30",      color:"img/rb.png",     type:"Full Body"},
    { title: 'Viva Glam',                   url:"#/app/details",  id: 2, num:"08",  image: "img/womens8.png",        info: "fwd.f8",     caloriesmain:Math.round(0.0175*184.5*($rootScope.loginData.weight*0.45)),  time:"5:30",    color:"img/rb.png",     type:"Butt"},
    { title: 'XOXO',                        url:"#/app/details",  id: 3, num:"09",  image: "img/womens9.png",        info: "fwd.f9",     caloriesmain:Math.round(0.0175*184.5*($rootScope.loginData.weight*0.45)),  time:"6:00",    color:"img/rb.png",     type:"Arms and Shoulders"},
    { title: 'Keeping Up With The Curves',  url:"#/app/search",   id: 4, num:"10",  image: "img/womens10.png",       info: "fwd.f10",    caloriesmain:Math.round(0.0175*173*($rootScope.loginData.weight*0.45)),  time:"5:45",    color:"img/rb.png",     type:"Butt" },
    { title: 'Her Majesty, The Queen',      url:"#/app/mworkouts",id: 5, num:"11",  image: "img/womens11.png",       info: "fwd.f11",    caloriesmain:Math.round(0.0175*170*($rootScope.loginData.weight*0.45)),  time:"5:30",    color:"img/rb.png",     type:"Full Body" }
  ];

  $scope.lockProcess = function() {

    if (!$rootScope.loginData.isPremiumUser) {
        $scope.femaleworkouts = [
          { title: 'Scorn',                       url:"#/app/details",  id: 1, num:"01",  image: "img/womens1.png",        info: "fwd.f1",     caloriesmain:Math.round(0.0175*190*($rootScope.loginData.weight*0.45)),  lockimage : "img/unlock.png",  time:"5:00",    color:"img/11111.png",  type:"Full Body"},
          { title: 'Video Vixen',                 url:"#/app/details",  id: 2, num:"02",  image: "img/womens2.png",        info: "fwd.f2",     caloriesmain:Math.round(0.0175*184*($rootScope.loginData.weight*0.45)),  lockimage : "img/unlock.png",  time:"5:00",    color:"img/rb.png",     type:"Upper Body"},
          { title: 'Python',                      url:"#/app/details",  id: 3, num:"03",  image: "img/womens3.png",        info: "fwd.f3",     caloriesmain:Math.round(0.0175*157*($rootScope.loginData.weight*0.45)),  lockimage : "img/lock2-01.svg",  time:"5:45",    color:"img/rb.png",     type:"Butt"},
          { title: 'Malibu Athletics',            url:"#/app/search",   id: 4, num:"04",  image: "img/womens4.png",        info: "fwd.f4",     caloriesmain:Math.round(0.0175*179*($rootScope.loginData.weight*0.45)),  lockimage : "img/lock2-01.svg",  time:"5:45",    color:"img/rb.png",     type:"Full Body" },
          { title: 'The Country Heart Breaker',   url:"#/app/mworkouts",id: 5, num:"05",  image: "img/womens5.png",        info: "fwd.f5",     caloriesmain:Math.round(0.0175*196*($rootScope.loginData.weight*0.45)),  lockimage : "img/lock2-01.svg",  time:"5:30",    color:"img/rb.png",     type:"Full Body" },
          { title: 'Brazilian Bombshell',         url:"#/app/details",  id: 6, num:"06",  image: "img/womens6.png",        info: "fwd.f6",     caloriesmain:Math.round(0.0175*192*($rootScope.loginData.weight*0.45)),  lockimage : "img/lock2-01.svg",  time:"5:30",    color:"img/rb.png",     type:"Full Body" },
          { title: 'Lipliscious',                 url:"#/app/details",  id: 1, num:"07",  image: "img/womens7.png",        info: "fwd.f7",     caloriesmain:Math.round(0.0175*182.5*($rootScope.loginData.weight*0.45)),lockimage : "img/lock2-01.svg",  time:"5:30",      color:"img/rb.png",     type:"Full Body"},
          { title: 'Viva Glam',                   url:"#/app/details",  id: 2, num:"08",  image: "img/womens8.png",        info: "fwd.f8",     caloriesmain:Math.round(0.0175*184.5*($rootScope.loginData.weight*0.45)),lockimage : "img/lock2-01.svg",  time:"5:30",    color:"img/rb.png",     type:"Butt"},
          { title: 'XOXO',                        url:"#/app/details",  id: 3, num:"09",  image: "img/womens9.png",        info: "fwd.f9",     caloriesmain:Math.round(0.0175*184.5*($rootScope.loginData.weight*0.45)),lockimage : "img/lock2-01.svg",  time:"6:00",    color:"img/rb.png",     type:"Arms and Shoulders"},
          { title: 'Keeping Up With The Curves',  url:"#/app/search",   id: 4, num:"10",  image: "img/womens10.png",       info: "fwd.f10",    caloriesmain:Math.round(0.0175*173*($rootScope.loginData.weight*0.45)),  lockimage : "img/lock2-01.svg",  time:"5:45",    color:"img/rb.png",     type:"Butt" },
          { title: 'Her Majesty, The Queen',      url:"#/app/mworkouts",id: 5, num:"11",  image: "img/womens11.png",       info: "fwd.f11",    caloriesmain:Math.round(0.0175*170*($rootScope.loginData.weight*0.45)),  lockimage : "img/lock2-01.svg",  time:"5:30",    color:"img/rb.png",     type:"Full Body" }
        ];
    } else {
         $scope.femaleworkouts = [
          { title: 'Scorn',                       url:"#/app/details",  id: 1, num:"01",  image: "img/womens1.png",        info: "fwd.f1",     caloriesmain:Math.round(0.0175*190*($rootScope.loginData.weight*0.45)),   lockimage : "img/unlock.png", time:"5:00",    color:"img/11111.png",  type:"Full Body"},
          { title: 'Video Vixen',                 url:"#/app/details",  id: 2, num:"02",  image: "img/womens2.png",        info: "fwd.f2",     caloriesmain:Math.round(0.0175*184*($rootScope.loginData.weight*0.45)),   lockimage : "img/unlock.png", time:"5:00",    color:"img/rb.png",     type:"Upper Body"},
          { title: 'Python',                      url:"#/app/details",  id: 3, num:"03",  image: "img/womens3.png",        info: "fwd.f3",     caloriesmain:Math.round(0.0175*157*($rootScope.loginData.weight*0.45)),   lockimage : "img/unlock.png", time:"5:45",    color:"img/rb.png",     type:"Butt"},
          { title: 'Malibu Athletics',            url:"#/app/search",   id: 4, num:"04",  image: "img/womens4.png",        info: "fwd.f4",     caloriesmain:Math.round(0.0175*179*($rootScope.loginData.weight*0.45)),   lockimage : "img/unlock.png", time:"5:45",    color:"img/rb.png",     type:"Full Body" },
          { title: 'The Country Heart Breaker',   url:"#/app/mworkouts",id: 5, num:"05",  image: "img/womens5.png",        info: "fwd.f5",     caloriesmain:Math.round(0.0175*196*($rootScope.loginData.weight*0.45)),   lockimage : "img/unlock.png", time:"5:30",    color:"img/rb.png",     type:"Full Body" },
          { title: 'Brazilian Bombshell',         url:"#/app/details",  id: 6, num:"06",  image: "img/womens6.png",        info: "fwd.f6",     caloriesmain:Math.round(0.0175*192*($rootScope.loginData.weight*0.45)),   lockimage : "img/unlock.png", time:"5:30",    color:"img/rb.png",     type:"Full Body" },
          { title: 'Lipliscious',                 url:"#/app/details",  id: 1, num:"07",  image: "img/womens7.png",        info: "fwd.f7",     caloriesmain:Math.round(0.0175*182.5*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:30",      color:"img/rb.png",     type:"Full Body"},
          { title: 'Viva Glam',                   url:"#/app/details",  id: 2, num:"08",  image: "img/womens8.png",        info: "fwd.f8",     caloriesmain:Math.round(0.0175*184.5*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"5:30",    color:"img/rb.png",     type:"Butt"},
          { title: 'XOXO',                        url:"#/app/details",  id: 3, num:"09",  image: "img/womens9.png",        info: "fwd.f9",     caloriesmain:Math.round(0.0175*184.5*($rootScope.loginData.weight*0.45)), lockimage : "img/unlock.png", time:"6:00",    color:"img/rb.png",     type:"Arms and Shoulders"},
          { title: 'Keeping Up With The Curves',  url:"#/app/search",   id: 4, num:"10",  image: "img/womens10.png",       info: "fwd.f10",    caloriesmain:Math.round(0.0175*173*($rootScope.loginData.weight*0.45)),   lockimage : "img/unlock.png", time:"5:45",    color:"img/rb.png",     type:"Butt" },
          { title: 'Her Majesty, The Queen',      url:"#/app/mworkouts",id: 5, num:"11",  image: "img/womens11.png",       info: "fwd.f11",    caloriesmain:Math.round(0.0175*170*($rootScope.loginData.weight*0.45)),   lockimage : "img/unlock.png", time:"5:30",    color:"img/rb.png",     type:"Full Body" }
        ];
    }

  }

  $scope.goDetails = function() {  

    if ($rootScope.choice.title === $scope.fwd.f1.title || $rootScope.choice.title === $scope.fwd.f2.title)
    {
      $state.go('app.details');
    }
    else {
      if ($rootScope.loginData.isPremiumUser)
      {
        $state.go('app.details');
      } else {
        $rootScope.confirmAlert("You are not PremiumUser.","OK");
      }
    }
  }

  // All The Moves that can be done in the app such as Push Up Easy, Clap Plyo Push Up Hard, and so on

  $scope.femalemoves=[
   {
       title: "Extra", vid:"img/1.mp4", time: 2, cal:4, reps:1,audiomove:"",audiorep:""
    },
    {
      title: "Alternating Push-up Plank", vid:"img/1.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/1.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Alternating Push-up Plank", vid:"img/1.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/1.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Alternating Push-up Plank", vid:"img/1.mp4", time: 60, cal:4, reps:20,audiomove:"img/1.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Chest Expander", vid:"img/2.mp4", time: 30, cal:3*0.5, reps:10,audiomove:"img/2.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Chest Expander", vid:"img/2.mp4", time: 45, cal:3*0.75, reps:15,audiomove:"img/2.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Chest Expander", vid:"img/2.mp4", time: 60, cal:9, reps:20,audiomove:"img/2.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Diamond Push Up", vid:"img/3.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/3.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Diamond Push Up", vid:"img/3.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/3.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Diamond Push Up", vid:"img/3.mp4", time: 60, cal:7, reps:20,audiomove:"img/3.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Dive Bomber Push Up", vid:"img/4.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/4.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Dive Bomber Push Up", vid:"img/4.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/4.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Dive Bomber Push Up", vid:"img/4.mp4", time: 60, cal:7, reps:20,audiomove:"img/4.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Jumping Jacks", vid:"img/5.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/5.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Jumping Jacks", vid:"img/5.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/5.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Jumping Jacks", vid:"img/5.mp4", time: 60, cal:9, reps:20,audiomove:"img/5.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Jumping Jack Squat", vid:"img/6.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/6.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Jumping Jack Squat", vid:"img/6.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/6.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Jumping Jack Squat", vid:"img/6.mp4", time: 60, cal:9, reps:20,audiomove:"img/6.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Lying Triceps Lifts", vid:"img/7.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/7.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Lying Triceps Lifts", vid:"img/7.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/7.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Lying Triceps Lifts", vid:"img/7.mp4", time: 60, cal:9, reps:20,audiomove:"img/7.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "One Arm Side Push Up Left", vid:"img/8l.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/8.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "One Arm Side Push Up Left", vid:"img/8l.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/8.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "One Arm Side Push Up Left", vid:"img/8l.mp4", time: 60, cal:6, reps:20,audiomove:"img/8.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "One Arm Side Push Up Right", vid:"img/8r.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/9.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "One Arm Side Push Up Right", vid:"img/8r.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/9.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "One Arm Side Push Up Right", vid:"img/8r.mp4", time: 60, cal:6, reps:20,audiomove:"img/9.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Overhead Arm Clap", vid:"img/9.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/10.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Overhead Arm Clap", vid:"img/9.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/10.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Overhead Arm Clap", vid:"img/9.mp4", time: 60, cal:6, reps:20,audiomove:"img/10.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Overhead Press", vid:"img/10.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/11.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Overhead Press", vid:"img/10.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/11.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Overhead Press", vid:"img/10.mp4", time: 60, cal:6, reps:20,audiomove:"img/11.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Power Circles", vid:"img/11.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/12.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Power Circles", vid:"img/11.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/12.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Power Circles", vid:"img/11.mp4", time: 60, cal:7, reps:20,audiomove:"img/12.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Push up and Rotation", vid:"img/12.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/13.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Push up and Rotation", vid:"img/12.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/13.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Push up and Rotation", vid:"img/12.mp4", time: 60, cal:9, reps:20,audiomove:"img/13.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Military Push Up", vid:"img/13.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/14.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Military Push Up", vid:"img/13.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/14.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Military Push Up", vid:"img/13.mp4", time: 60, cal:7, reps:20,audiomove:"img/14.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "One Hand Push Up Left", vid:"img/14l.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/15.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "One Hand Push Up Left", vid:"img/14l.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/15.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "One Hand Push Up Left", vid:"img/14l.mp4", time: 60, cal:7, reps:20,audiomove:"img/15.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "One Hand Push Up Right", vid:"img/14r.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/16.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "One Hand Push Up Right", vid:"img/14r.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/16.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "One Hand Push Up Right", vid:"img/14r.mp4", time: 60, cal:7, reps:20,audiomove:"img/16.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Planche Push Up", vid:"img/15.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/17.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Planche Push Up", vid:"img/15.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/17.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Planche Push Up", vid:"img/15.mp4", time: 60, cal:7, reps:20,audiomove:"img/17.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Reverse Plank", vid:"img/16.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/18.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Reverse Plank", vid:"img/16.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/18.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Reverse Plank", vid:"img/16.mp4", time: 60, cal:6, reps:20,audiomove:"img/18.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Triceps Dips", vid:"img/17.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/19.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Triceps Dips", vid:"img/17.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/19.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Triceps Dips", vid:"img/17.mp4", time: 60, cal:6, reps:20,audiomove:"img/19.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Wide Grip Push Up", vid:"img/18.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/20.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Wide Grip Push Up", vid:"img/18.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/20.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Wide Grip Push Up", vid:"img/18.mp4", time: 60, cal:7, reps:20,audiomove:"img/20.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Narrow Grip Push Up", vid:"img/19.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/21.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Narrow Grip Push Up", vid:"img/19.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/21.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Narrow Grip Push Up", vid:"img/19.mp4", time: 60, cal:7, reps:20,audiomove:"img/21.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Pike Push Up", vid:"img/20.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/22.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Pike Push Up", vid:"img/20.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/22.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Pike Push Up", vid:"img/20.mp4", time: 60, cal:7, reps:20,audiomove:"img/22.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Ab Crunch", vid:"img/21.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/23.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Ab Crunch", vid:"img/21.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/23.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Ab Crunch", vid:"img/21.mp4", time: 60, cal:7, reps:20,audiomove:"img/23.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Burpees", vid:"img/22.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/24.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Burpees", vid:"img/22.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/24.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Burpees", vid:"img/22.mp4", time: 60, cal:6, reps:20,audiomove:"img/24.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Elevated Crunches", vid:"img/23.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/25.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Elevated Crunches", vid:"img/23.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/25.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Elevated Crunches", vid:"img/23.mp4", time: 60, cal:6, reps:20,audiomove:"img/25.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Genie Sit", vid:"img/24.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/26.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Genie Sit", vid:"img/24.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/26.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Genie Sit", vid:"img/24.mp4", time: 60, cal:6, reps:20,audiomove:"img/26.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "In and Out Abs", vid:"img/25.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/27.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "In and Out Abs", vid:"img/25.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/27.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "In and Out Abs", vid:"img/25.mp4", time: 60, cal:6, reps:20,audiomove:"img/27.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Leg Lifts", vid:"img/26.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/28.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Leg Lifts", vid:"img/26.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/28.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Leg Lifts", vid:"img/26.mp4", time: 60, cal:6, reps:20,audiomove:"img/28.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Scissor Kicks", vid:"img/28.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/29.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Scissor Kicks", vid:"img/28.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/29.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Scissor Kicks", vid:"img/28.mp4", time: 60, cal:7, reps:20,audiomove:"img/29.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Bridge Left", vid:"img/29l.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/30.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Bridge Left", vid:"img/29l.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/30.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Bridge Left", vid:"img/29l.mp4", time: 60, cal:7, reps:20,audiomove:"img/30.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Bridge Right", vid:"img/29r.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/31.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Bridge Right", vid:"img/29r.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/31.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Bridge Right", vid:"img/29r.mp4", time: 60, cal:7, reps:20,audiomove:"img/31.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Spiderman Push Up", vid:"img/31.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/32.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Spiderman Push Up", vid:"img/31.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/32.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Spiderman Push Up", vid:"img/31.mp4", time: 60, cal:7, reps:20,audiomove:"img/32.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Steam Engine", vid:"img/32.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/33.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Steam Engine", vid:"img/32.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/33.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Steam Engine", vid:"img/32.mp4", time: 60, cal:7, reps:20,audiomove:"img/33.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Supermans", vid:"img/33.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/34.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Supermans", vid:"img/33.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/34.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Supermans", vid:"img/33.mp4", time: 60, cal:7, reps:20,audiomove:"img/34.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Swimmer", vid:"img/34.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/35.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Swimmer", vid:"img/34.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/35.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Swimmer", vid:"img/34.mp4", time: 60, cal:6, reps:20,audiomove:"img/35.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Supine Bicycle", vid:"img/36.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/36.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Supine Bicycle", vid:"img/36.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/36.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Supine Bicycle", vid:"img/36.mp4", time: 60, cal:6, reps:20,audiomove:"img/36.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Twisting Crunches", vid:"img/37.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/37.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Twisting Crunches", vid:"img/37.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/37.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Twisting Crunches", vid:"img/37.mp4", time: 60, cal:6, reps:20,audiomove:"img/37.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "V Sit Up", vid:"img/38.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/38.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "V Sit Up", vid:"img/38.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/38.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "V Sit Up", vid:"img/38.mp4", time: 60, cal:9, reps:20,audiomove:"img/38.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Windmill", vid:"img/39.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/39.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Windmill", vid:"img/39.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/39.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Windmill", vid:"img/39.mp4", time: 60, cal:9, reps:20,audiomove:"img/39.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Calf Raises", vid:"img/40.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/40.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Calf Raises", vid:"img/40.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/40.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Calf Raises", vid:"img/40.mp4", time: 60, cal:9, reps:20,audiomove:"img/40.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Forward Lunges Left", vid:"img/41l.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/41.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Forward Lunges Left", vid:"img/41l.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/41.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Forward Lunges Left", vid:"img/41l.mp4", time: 60, cal:9, reps:20,audiomove:"img/41.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Forward Lunges Right", vid:"img/41r.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/42.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Forward Lunges Right", vid:"img/41r.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/42.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Forward Lunges Right", vid:"img/41r.mp4", time: 60, cal:9, reps:20,audiomove:"img/42.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Frog Jumps", vid:"img/43.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/43.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Frog Jumps", vid:"img/43.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/43.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Frog Jumps", vid:"img/43.mp4", time: 60, cal:7, reps:20,audiomove:"img/43.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Front Kicks Left", vid:"img/44l.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/44.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Front Kicks Left", vid:"img/44l.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/44.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Front Kicks Left", vid:"img/44l.mp4", time: 60, cal:9, reps:20,audiomove:"img/44.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Front Kicks Right", vid:"img/44r.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/45.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Front Kicks Right", vid:"img/44r.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/45.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Front Kicks Right", vid:"img/44r.mp4", time: 60, cal:9, reps:20,audiomove:"img/45.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Jump Sqauts", vid:"img/45.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/46.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Jump Sqauts", vid:"img/45.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/46.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Jump Sqauts", vid:"img/45.mp4", time: 60, cal:7, reps:20,audiomove:"img/46.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/46.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/47.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/46.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/47.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/46.mp4", time: 60, cal:7, reps:20,audiomove:"img/47.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Rear Lunges", vid:"img/47.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/48.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Rear Lunges", vid:"img/47.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/48.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Rear Lunges", vid:"img/47.mp4", time: 60, cal:7, reps:20,audiomove:"img/48.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Reverse V Lunges", vid:"img/48.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/49.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Reverse V Lunges", vid:"img/48.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/49.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Reverse V Lunges", vid:"img/48.mp4", time: 60, cal:7, reps:20,audiomove:"img/49.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Running in Place", vid:"img/49.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/50.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Running in Place", vid:"img/49.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/50.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Running in Place", vid:"img/49.mp4", time: 60, cal:7, reps:20,audiomove:"img/50.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side to Side Leg Lifts", vid:"img/50.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/51.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side to Side Leg Lifts", vid:"img/50.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/51.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side to Side Leg Lifts", vid:"img/50.mp4", time: 60, cal:6, reps:20,audiomove:"img/51.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side to Side Knee Lifts", vid:"img/51.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/52.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side to Side Knee Lifts", vid:"img/51.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/52.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side to Side Knee Lifts", vid:"img/51.mp4", time: 60, cal:6, reps:20,audiomove:"img/52.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Lifts Left", vid:"img/52l.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/53.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Lifts Left", vid:"img/52l.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/53.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Lifts Left", vid:"img/52l.mp4", time: 60, cal:6, reps:20,audiomove:"img/53.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Lifts Right", vid:"img/52r.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/54.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Lifts Right", vid:"img/52r.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/54.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Lifts Right", vid:"img/52r.mp4", time: 60, cal:6, reps:20,audiomove:"img/54.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Squats Left", vid:"img/54l.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/55.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Squats Left", vid:"img/54l.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/55.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Squats Left", vid:"img/54l.mp4", time: 60, cal:6, reps:20,audiomove:"img/55.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Squats Right", vid:"img/54r.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/56.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Squats Right", vid:"img/54r.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/56.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Squats Right", vid:"img/54r.mp4", time: 60, cal:6, reps:20,audiomove:"img/56.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Squats", vid:"img/56.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/57.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Squats", vid:"img/56.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/57.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Squats", vid:"img/56.mp4", time: 60, cal:6, reps:20,audiomove:"img/57.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Step Ups", vid:"img/57.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/58.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Step Ups", vid:"img/57.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/58.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Step Ups", vid:"img/57.mp4", time: 60, cal:6, reps:20,audiomove:"img/58.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Hip Raise", vid:"img/58.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/66.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Hip Raise", vid:"img/58.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/66.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Hip Raise", vid:"img/58.mp4", time: 60, cal:6, reps:20,audiomove:"img/66.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Left", vid:"img/59l.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/60.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Left", vid:"img/59l.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/60.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Left", vid:"img/59l.mp4", time: 60, cal:6, reps:20,audiomove:"img/60.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Right", vid:"img/59r.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/61.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Right", vid:"img/59r.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/61.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Kneeling Hip Flexor Right", vid:"img/59r.mp4", time: 60, cal:6, reps:20,audiomove:"img/61.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Quadraplex Left", vid:"img/61l.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/62.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Quadraplex Left", vid:"img/61l.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/62.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Quadraplex Left", vid:"img/61l.mp4", time: 60, cal:6, reps:20,audiomove:"img/62.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Quadraplex Right", vid:"img/61r.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/63.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Quadraplex Right", vid:"img/61r.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/63.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Quadraplex Right", vid:"img/61r.mp4", time: 60, cal:6, reps:20,audiomove:"img/63.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Plank Left", vid:"img/63l.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/64.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Plank Left", vid:"img/63l.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/64.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Plank Left", vid:"img/63l.mp4", time: 60, cal:6, reps:20,audiomove:"img/64.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Plank Right", vid:"img/63r.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/65.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Plank Right", vid:"img/63r.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/65.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Plank Right", vid:"img/63r.mp4", time: 60, cal:6, reps:20,audiomove:"img/65.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "High Knees", vid:"img/65.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/75.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "High Knees", vid:"img/65.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/75.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "High Knees", vid:"img/65.mp4", time: 60, cal:6, reps:20,audiomove:"img/75.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Power Jumps", vid:"img/66.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/76.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Power Jumps", vid:"img/66.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/76.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Power Jumps", vid:"img/66.mp4", time: 60, cal:6, reps:20,audiomove:"img/76.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Star Jumps", vid:"img/67.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/77.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Star Jumps", vid:"img/67.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/77.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Star Jumps", vid:"img/67.mp4", time: 60, cal:9, reps:20,audiomove:"img/77.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Marching Hip Raise", vid:"img/68.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/78.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Marching Hip Raise", vid:"img/68.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/78.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Marching Hip Raise", vid:"img/68.mp4", time: 60, cal:6, reps:20,audiomove:"img/78.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Left", vid:"img/69l.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/79.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Left", vid:"img/69l.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/79.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Left", vid:"img/69l.mp4", time: 60, cal:6, reps:20,audiomove:"img/79.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Right", vid:"img/69r.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/80.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Right", vid:"img/69r.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/80.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Hip Raise Right", vid:"img/69r.mp4", time: 60, cal:6, reps:20,audiomove:"img/80.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Squat with Kick Back", vid:"img/71.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/81.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Squat with Kick Back", vid:"img/71.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/81.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Squat with Kick Back", vid:"img/71.mp4", time: 60, cal:6, reps:20,audiomove:"img/81.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/72.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/82.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/72.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/82.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Mountain Climbers", vid:"img/72.mp4", time: 60, cal:6, reps:20,audiomove:"img/82.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Lunge Left", vid:"img/73l.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/83.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Lunge Left", vid:"img/73l.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/83.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Lunge Left", vid:"img/73l.mp4", time: 60, cal:6, reps:20,audiomove:"img/83.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Side Lunge Right", vid:"img/73r.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/84.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Side Lunge Right", vid:"img/73r.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/84.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Side Lunge Right", vid:"img/73r.mp4", time: 60, cal:6, reps:20,audiomove:"img/84.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Left", vid:"img/74l.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/85.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Left", vid:"img/74l.mp4", time: 45, cal:8*0.75, reps:15,audiomove:"img/85.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Left", vid:"img/74l.mp4", time: 60, cal:6, reps:20,audiomove:"img/85.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Right", vid:"img/74r.mp4", time: 30, cal:8*0.5, reps:10,audiomove:"img/86.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Right", vid:"img/74r.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/86.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Single Leg Deadlifts Right", vid:"img/74r.mp4", time: 60, cal:6, reps:20,audiomove:"img/86.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Decline Push Up", vid:"img/76.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/87.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Decline Push Up", vid:"img/76.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/87.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Decline Push Up", vid:"img/76.mp4", time: 60, cal:7, reps:20,audiomove:"img/87.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Crunch Frog", vid:"img/79.mp4", time: 30, cal:7*0.5, reps:10,audiomove:"img/88.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Crunch Frog", vid:"img/79.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/88.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Crunch Frog", vid:"img/79.mp4", time: 60, cal:9, reps:20,audiomove:"img/88.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Wall Sit", vid:"img/80.mp4", time: 30, cal:9*0.5, reps:10,audiomove:"img/89.mp3",audiorep:"img/10reps.mp3"
    },
    {
      title: "Wall Sit", vid:"img/80.mp4", time: 45, cal:9*0.75, reps:15,audiomove:"img/89.mp3",audiorep:"img/15reps.mp3"
    },
    {
      title: "Wall Sit", vid:"img/80.mp4", time: 60, cal:9, reps:20,audiomove:"img/89.mp3",audiorep:"img/20reps.mp3"
    },
    {
      title: "Break", vid:"img/break.mp4", time: 30, cal: 1, reps:1,audiomove:"img/break.mp3",audiorep:""
    },
    {
      title: "Break", vid:"img/break.mp4", time: 45, cal:1, reps:1,audiomove:"img/break.mp3",audiorep:""
    },
    {
      title: "Break", vid:"img/break.mp4", time: 60, cal:1, reps:1,audiomove:"img/break.mp3",audiorep:""
    }

  ];


  // All the different workouts that reference the Moves Above
  var fw1e = [
    $scope.femalemoves[67],
    $scope.femalemoves[37],
    $scope.femalemoves[49],
    $scope.femalemoves[64],
    $scope.femalemoves[79],
    $scope.femalemoves[241],
    $scope.femalemoves[94],
    $scope.femalemoves[97],
    $scope.femalemoves[43],
    $scope.femalemoves[46]
  ];

  var fw1m = [
    $scope.femalemoves[69],
    $scope.femalemoves[38],
    $scope.femalemoves[50],
    $scope.femalemoves[65],
    $scope.femalemoves[80],
    $scope.femalemoves[242],
    $scope.femalemoves[96],
    $scope.femalemoves[99],
    $scope.femalemoves[44],
    $scope.femalemoves[47],
    $scope.femalemoves[36],
    $scope.femalemoves[69],
    $scope.femalemoves[15],
    $scope.femalemoves[242],
    $scope.femalemoves[59],
    $scope.femalemoves[24],
    $scope.femalemoves[27]
  ];

  var fw1h = [
    $scope.femalemoves[69],
    $scope.femalemoves[39],
    $scope.femalemoves[51],
    $scope.femalemoves[66],
    $scope.femalemoves[81],
    $scope.femalemoves[243],
    $scope.femalemoves[96],
    $scope.femalemoves[99],
    $scope.femalemoves[45],
    $scope.femalemoves[48],
    $scope.femalemoves[36],
    $scope.femalemoves[69],
    $scope.femalemoves[15],
    $scope.femalemoves[242],
    $scope.femalemoves[59],
    $scope.femalemoves[69],
    $scope.femalemoves[39],
    $scope.femalemoves[51],
    $scope.femalemoves[66],
    $scope.femalemoves[81],
    $scope.femalemoves[243],
    $scope.femalemoves[96],
    $scope.femalemoves[99],
    $scope.femalemoves[45],
    $scope.femalemoves[48],
    $scope.femalemoves[36],
    $scope.femalemoves[69],
    $scope.femalemoves[15],
    $scope.femalemoves[59]
  ];

  var fw2e = [
    $scope.femalemoves[109],
    $scope.femalemoves[13],
    $scope.femalemoves[22],
    $scope.femalemoves[25],
    $scope.femalemoves[16],
    $scope.femalemoves[241],
    $scope.femalemoves[76],
    $scope.femalemoves[70],
    $scope.femalemoves[88],
    $scope.femalemoves[91]
  ];

  var fw2m = [
    $scope.femalemoves[111],
    $scope.femalemoves[14],
    $scope.femalemoves[23],
    $scope.femalemoves[26],
    $scope.femalemoves[17],
    $scope.femalemoves[242],
    $scope.femalemoves[78],
    $scope.femalemoves[72],
    $scope.femalemoves[89],
    $scope.femalemoves[92],
    $scope.femalemoves[105],
    $scope.femalemoves[99],
    $scope.femalemoves[102],
    $scope.femalemoves[242],
    $scope.femalemoves[86],
    $scope.femalemoves[90],
    $scope.femalemoves[93]
  ];

  var fw2h = [
    $scope.femalemoves[111],
    $scope.femalemoves[15],
    $scope.femalemoves[24],
    $scope.femalemoves[18],
    $scope.femalemoves[243],
    $scope.femalemoves[78],
    $scope.femalemoves[72],
    $scope.femalemoves[93],
    $scope.femalemoves[105],
    $scope.femalemoves[99],
    $scope.femalemoves[102],
    $scope.femalemoves[243],
    $scope.femalemoves[87],
    $scope.femalemoves[90],
    $scope.femalemoves[93],
    $scope.femalemoves[111],
    $scope.femalemoves[15],
    $scope.femalemoves[24],
    $scope.femalemoves[18],
    $scope.femalemoves[243],
    $scope.femalemoves[78],
    $scope.femalemoves[72],
    $scope.femalemoves[93],
    $scope.femalemoves[105],
    $scope.femalemoves[99],
    $scope.femalemoves[243],
    $scope.femalemoves[102],
    $scope.femalemoves[87],
    $scope.femalemoves[90],
    $scope.femalemoves[93]
  ];

  var fw3e = [
    $scope.femalemoves[118],
    $scope.femalemoves[70],
    $scope.femalemoves[121],
    $scope.femalemoves[124],
    $scope.femalemoves[196],
    $scope.femalemoves[241],
    $scope.femalemoves[145],
    $scope.femalemoves[148],
    $scope.femalemoves[226],
    $scope.femalemoves[229],
    $scope.femalemoves[209]
  ];

  var fw3m = [
    $scope.femalemoves[120],
    $scope.femalemoves[71],
    $scope.femalemoves[122],
    $scope.femalemoves[125],
    $scope.femalemoves[197],
    $scope.femalemoves[242],
    $scope.femalemoves[147],
    $scope.femalemoves[150],
    $scope.femalemoves[227],
    $scope.femalemoves[230],
    $scope.femalemoves[205],
    $scope.femalemoves[84],
    $scope.femalemoves[144],
    $scope.femalemoves[242],
    $scope.femalemoves[240],
    $scope.femalemoves[220],
    $scope.femalemoves[223]
  ];

  var fw3h = [
    $scope.femalemoves[120],
    $scope.femalemoves[72],
    $scope.femalemoves[123],
    $scope.femalemoves[198],
    $scope.femalemoves[243],
    $scope.femalemoves[147],
    $scope.femalemoves[150],
    $scope.femalemoves[231],
    $scope.femalemoves[205],
    $scope.femalemoves[84],
    $scope.femalemoves[144],
    $scope.femalemoves[243],
    $scope.femalemoves[241],
    $scope.femalemoves[220],
    $scope.femalemoves[223],
    $scope.femalemoves[120],
    $scope.femalemoves[72],
    $scope.femalemoves[123],
    $scope.femalemoves[198],
    $scope.femalemoves[243],
    $scope.femalemoves[147],
    $scope.femalemoves[150],
    $scope.femalemoves[231],
    $scope.femalemoves[205],
    $scope.femalemoves[84],
    $scope.femalemoves[144],
    $scope.femalemoves[243],
    $scope.femalemoves[241],
    $scope.femalemoves[220],
    $scope.femalemoves[223]
  ];


  var fw4e = [
    $scope.femalemoves[94],
    $scope.femalemoves[4],
    $scope.femalemoves[10],
    $scope.femalemoves[31],
    $scope.femalemoves[55],
    $scope.femalemoves[241],
    $scope.femalemoves[70],
    $scope.femalemoves[82],
    $scope.femalemoves[85],
    $scope.femalemoves[98],
    $scope.femalemoves[115]
  ];

  var fw4m = [
    $scope.femalemoves[96],
    $scope.femalemoves[5],
    $scope.femalemoves[11],
    $scope.femalemoves[32],
    $scope.femalemoves[242],
    $scope.femalemoves[72],
    $scope.femalemoves[84],
    $scope.femalemoves[86],
    $scope.femalemoves[99],
    $scope.femalemoves[117],
    $scope.femalemoves[102],
    $scope.femalemoves[242],
    $scope.femalemoves[83],
    $scope.femalemoves[90],
    $scope.femalemoves[93]
  ];

  var fw4h = [
    $scope.femalemoves[96],
    $scope.femalemoves[6],
    $scope.femalemoves[12],
    $scope.femalemoves[57],
    $scope.femalemoves[243],
    $scope.femalemoves[72],
    $scope.femalemoves[84],
    $scope.femalemoves[100],
    $scope.femalemoves[117],
    $scope.femalemoves[99],
    $scope.femalemoves[102],
    $scope.femalemoves[243],
    $scope.femalemoves[84],
    $scope.femalemoves[90],
    $scope.femalemoves[93],
    $scope.femalemoves[96],
    $scope.femalemoves[6],
    $scope.femalemoves[12],
    $scope.femalemoves[57],
    $scope.femalemoves[243],
    $scope.femalemoves[72],
    $scope.femalemoves[84],
    $scope.femalemoves[100],
    $scope.femalemoves[117],
    $scope.femalemoves[99],
    $scope.femalemoves[243],
    $scope.femalemoves[102],
    $scope.femalemoves[84],
    $scope.femalemoves[90],
    $scope.femalemoves[93]
  ];



  var fw5e = [
    $scope.femalemoves[82],
    $scope.femalemoves[85],
    $scope.femalemoves[70],
    $scope.femalemoves[130],
    $scope.femalemoves[133],
    $scope.femalemoves[241],
    $scope.femalemoves[106],
    $scope.femalemoves[118],
    $scope.femalemoves[172],
    $scope.femalemoves[196],
    $scope.femalemoves[199]
  ];

  var fw5m = [
    $scope.femalemoves[84],
    $scope.femalemoves[86],
    $scope.femalemoves[71],
    $scope.femalemoves[131],
    $scope.femalemoves[134],
    $scope.femalemoves[242],
    $scope.femalemoves[108],
    $scope.femalemoves[120],
    $scope.femalemoves[173],
    $scope.femalemoves[197],
    $scope.femalemoves[9],
    $scope.femalemoves[60],
    $scope.femalemoves[199],
    $scope.femalemoves[242],
    $scope.femalemoves[62],
    $scope.femalemoves[66],
    $scope.femalemoves[30]
  ];

  var fw5h = [
    $scope.femalemoves[84],
    $scope.femalemoves[87],
    $scope.femalemoves[72],
    $scope.femalemoves[132],
    $scope.femalemoves[135],
    $scope.femalemoves[243],
    $scope.femalemoves[108],
    $scope.femalemoves[120],
    $scope.femalemoves[198],
    $scope.femalemoves[9],
    $scope.femalemoves[60],
    $scope.femalemoves[199],
    $scope.femalemoves[243],
    $scope.femalemoves[63],
    $scope.femalemoves[66],
    $scope.femalemoves[30],
    $scope.femalemoves[84],
    $scope.femalemoves[87],
    $scope.femalemoves[72],
    $scope.femalemoves[132],
    $scope.femalemoves[135],
    $scope.femalemoves[243],
    $scope.femalemoves[108],
    $scope.femalemoves[120],
    $scope.femalemoves[198],
    $scope.femalemoves[9],
    $scope.femalemoves[60],
    $scope.femalemoves[199],
    $scope.femalemoves[243],
    $scope.femalemoves[63],
    $scope.femalemoves[66],
    $scope.femalemoves[30]
  ];


  var fw6e = [
    $scope.femalemoves[97],
    $scope.femalemoves[121],
    $scope.femalemoves[124],
    $scope.femalemoves[118],
    $scope.femalemoves[127],
    $scope.femalemoves[241],
    $scope.femalemoves[130],
    $scope.femalemoves[133],
    $scope.femalemoves[142],
    $scope.femalemoves[145],
    $scope.femalemoves[148]
  ];

  var fw6m = [
    $scope.femalemoves[99],
    $scope.femalemoves[122],
    $scope.femalemoves[125],
    $scope.femalemoves[119],
    $scope.femalemoves[128],
    $scope.femalemoves[242],
    $scope.femalemoves[132],
    $scope.femalemoves[135],
    $scope.femalemoves[143],
    $scope.femalemoves[146],
    $scope.femalemoves[90],
    $scope.femalemoves[93],
    $scope.femalemoves[99],
    $scope.femalemoves[242],
    $scope.femalemoves[180],
    $scope.femalemoves[183],
    $scope.femalemoves[84]
  ];

  var fw6h = [
    $scope.femalemoves[99],
    $scope.femalemoves[123],
    $scope.femalemoves[126],
    $scope.femalemoves[129],
    $scope.femalemoves[243],
    $scope.femalemoves[132],
    $scope.femalemoves[135],
    $scope.femalemoves[147],
    $scope.femalemoves[90],
    $scope.femalemoves[93],
    $scope.femalemoves[99],
    $scope.femalemoves[243],
    $scope.femalemoves[181],
    $scope.femalemoves[183],
    $scope.femalemoves[84],
    $scope.femalemoves[99],
    $scope.femalemoves[123],
    $scope.femalemoves[126],
    $scope.femalemoves[129],
    $scope.femalemoves[243],
    $scope.femalemoves[132],
    $scope.femalemoves[135],
    $scope.femalemoves[147],
    $scope.femalemoves[90],
    $scope.femalemoves[93],
    $scope.femalemoves[99],
    $scope.femalemoves[243],
    $scope.femalemoves[181],
    $scope.femalemoves[183],
    $scope.femalemoves[84]
  ];


  var fw7e = [
    $scope.femalemoves[34],
    $scope.femalemoves[70],
    $scope.femalemoves[76],
    $scope.femalemoves[85],
    $scope.femalemoves[97],
    $scope.femalemoves[241],
    $scope.femalemoves[127],
    $scope.femalemoves[100],
    $scope.femalemoves[136],
    $scope.femalemoves[103],
    $scope.femalemoves[148]
  ];

  var fw7m = [
    $scope.femalemoves[36],
    $scope.femalemoves[71],
    $scope.femalemoves[77],
    $scope.femalemoves[86],
    $scope.femalemoves[98],
    $scope.femalemoves[242],
    $scope.femalemoves[129],
    $scope.femalemoves[102],
    $scope.femalemoves[137],
    $scope.femalemoves[104],
    $scope.femalemoves[139],
    $scope.femalemoves[172],
    $scope.femalemoves[196],
    $scope.femalemoves[242],
    $scope.femalemoves[204],
    $scope.femalemoves[238],
    $scope.femalemoves[207]
  ];

  var fw7h = [
    $scope.femalemoves[36],
    $scope.femalemoves[72],
    $scope.femalemoves[78],
    $scope.femalemoves[86],
    $scope.femalemoves[99],
    $scope.femalemoves[243],
    $scope.femalemoves[129],
    $scope.femalemoves[102],
    $scope.femalemoves[139],
    $scope.femalemoves[105],
    $scope.femalemoves[141],
    $scope.femalemoves[172],
    $scope.femalemoves[196],
    $scope.femalemoves[243],
    $scope.femalemoves[205],
    $scope.femalemoves[238],
    $scope.femalemoves[204],
    $scope.femalemoves[36],
    $scope.femalemoves[72],
    $scope.femalemoves[78],
    $scope.femalemoves[86],
    $scope.femalemoves[99],
    $scope.femalemoves[243],
    $scope.femalemoves[129],
    $scope.femalemoves[102],
    $scope.femalemoves[139],
    $scope.femalemoves[105],
    $scope.femalemoves[141],
    $scope.femalemoves[172],
    $scope.femalemoves[196],
    $scope.femalemoves[243],
    $scope.femalemoves[205],
    $scope.femalemoves[238],
    $scope.femalemoves[204]
  ];


  var fw8e = [
    $scope.femalemoves[4],
    $scope.femalemoves[7],
    $scope.femalemoves[10],
    $scope.femalemoves[22],
    $scope.femalemoves[25],
    $scope.femalemoves[241],
    $scope.femalemoves[64],
    $scope.femalemoves[55],
    $scope.femalemoves[49],
    $scope.femalemoves[58],
    $scope.femalemoves[61]
  ];

  var fw8m = [
    $scope.femalemoves[6],
    $scope.femalemoves[8],
    $scope.femalemoves[11],
    $scope.femalemoves[23],
    $scope.femalemoves[26],
    $scope.femalemoves[242],
    $scope.femalemoves[66],
    $scope.femalemoves[57],
    $scope.femalemoves[50],
    $scope.femalemoves[59],
    $scope.femalemoves[100],
    $scope.femalemoves[103],
    $scope.femalemoves[242],
    $scope.femalemoves[242],
    $scope.femalemoves[94],
    $scope.femalemoves[90],
    $scope.femalemoves[93]
  ];

  var fw8h = [
    $scope.femalemoves[6],
    $scope.femalemoves[9],
    $scope.femalemoves[12],
    $scope.femalemoves[24],
    $scope.femalemoves[27],
    $scope.femalemoves[243],
    $scope.femalemoves[66],
    $scope.femalemoves[57],
    $scope.femalemoves[51],
    $scope.femalemoves[60],
    $scope.femalemoves[100],
    $scope.femalemoves[103],
    $scope.femalemoves[243],
    $scope.femalemoves[95],
    $scope.femalemoves[90],
    $scope.femalemoves[93],
    $scope.femalemoves[6],
    $scope.femalemoves[9],
    $scope.femalemoves[12],
    $scope.femalemoves[24],
    $scope.femalemoves[27],
    $scope.femalemoves[243],
    $scope.femalemoves[66],
    $scope.femalemoves[57],
    $scope.femalemoves[51],
    $scope.femalemoves[60],
    $scope.femalemoves[100],
    $scope.femalemoves[103],
    $scope.femalemoves[243],
    $scope.femalemoves[95],
    $scope.femalemoves[90],
    $scope.femalemoves[93]
  ];


  var fw9e = [
    $scope.femalemoves[84],
    $scope.femalemoves[13],
    $scope.femalemoves[130],
    $scope.femalemoves[133],
    $scope.femalemoves[52],
    $scope.femalemoves[241],
    $scope.femalemoves[163],
    $scope.femalemoves[166],
    $scope.femalemoves[70],
    $scope.femalemoves[175],
    $scope.femalemoves[142]
  ];

  var fw9m = [
    $scope.femalemoves[86],
    $scope.femalemoves[14],
    $scope.femalemoves[131],
    $scope.femalemoves[134],
    $scope.femalemoves[53],
    $scope.femalemoves[242],
    $scope.femalemoves[86],
    $scope.femalemoves[14],
    $scope.femalemoves[131],
    $scope.femalemoves[134],
    $scope.femalemoves[53],
    $scope.femalemoves[242],
    $scope.femalemoves[165],
    $scope.femalemoves[168],
    $scope.femalemoves[71],
    $scope.femalemoves[176],
    $scope.femalemoves[144],
    $scope.femalemoves[90],
    $scope.femalemoves[93],
    $scope.femalemoves[242],
    $scope.femalemoves[132],
    $scope.femalemoves[135],
    $scope.femalemoves[138],
    $scope.femalemoves[207]
  ];

  var fw9h = [
    $scope.femalemoves[86],
    $scope.femalemoves[15],
    $scope.femalemoves[132],
    $scope.femalemoves[54],
    $scope.femalemoves[243],
    $scope.femalemoves[165],
    $scope.femalemoves[168],
    $scope.femalemoves[177],
    $scope.femalemoves[144],
    $scope.femalemoves[90],
    $scope.femalemoves[93],
    $scope.femalemoves[243],
    $scope.femalemoves[133],
    $scope.femalemoves[135],
    $scope.femalemoves[138],
    $scope.femalemoves[86],
    $scope.femalemoves[15],
    $scope.femalemoves[132],
    $scope.femalemoves[54],
    $scope.femalemoves[243],
    $scope.femalemoves[165],
    $scope.femalemoves[168],
    $scope.femalemoves[177],
    $scope.femalemoves[144],
    $scope.femalemoves[90],
    $scope.femalemoves[243],
    $scope.femalemoves[93],
    $scope.femalemoves[133],
    $scope.femalemoves[135],
    $scope.femalemoves[138]
  ];


  var fw10e = [
$scope.femalemoves[70],
$scope.femalemoves[52],
$scope.femalemoves[16],
$scope.femalemoves[13],
$scope.femalemoves[1],
$scope.femalemoves[241],
$scope.femalemoves[121],
$scope.femalemoves[124],
$scope.femalemoves[169],
$scope.femalemoves[217],
$scope.femalemoves[80]
  ];

  var fw10m = [
$scope.femalemoves[72],
$scope.femalemoves[53],
$scope.femalemoves[17],
$scope.femalemoves[14],
$scope.femalemoves[2],
$scope.femalemoves[242],
$scope.femalemoves[123],
$scope.femalemoves[126],
$scope.femalemoves[170],
$scope.femalemoves[218],
$scope.femalemoves[105],
$scope.femalemoves[108],
$scope.femalemoves[78],
$scope.femalemoves[242],
$scope.femalemoves[87],
$scope.femalemoves[90],
$scope.femalemoves[93]
  ];

  var fw10h = [
$scope.femalemoves[72],
$scope.femalemoves[54],
$scope.femalemoves[18],
$scope.femalemoves[3],
$scope.femalemoves[243],
$scope.femalemoves[123],
$scope.femalemoves[126],
$scope.femalemoves[219],
$scope.femalemoves[105],
$scope.femalemoves[108],
$scope.femalemoves[78],
$scope.femalemoves[243],
$scope.femalemoves[88],
$scope.femalemoves[90],
$scope.femalemoves[93],
$scope.femalemoves[72],
$scope.femalemoves[54],
$scope.femalemoves[18],
$scope.femalemoves[3],
$scope.femalemoves[243],
$scope.femalemoves[123],
$scope.femalemoves[126],
$scope.femalemoves[219],
$scope.femalemoves[105],
$scope.femalemoves[108],
$scope.femalemoves[243],
$scope.femalemoves[78],
$scope.femalemoves[88],
$scope.femalemoves[90],
$scope.femalemoves[93]
  ];


  var fw11e = [
$scope.femalemoves[37],
$scope.femalemoves[31],
$scope.femalemoves[16],
$scope.femalemoves[4],
$scope.femalemoves[67],
$scope.femalemoves[241],
$scope.femalemoves[82],
$scope.femalemoves[106],
$scope.femalemoves[220],
$scope.femalemoves[223],
$scope.femalemoves[238]
  ];

  var fw11m = [
$scope.femalemoves[39],
$scope.femalemoves[32],
$scope.femalemoves[17],
$scope.femalemoves[5],
$scope.femalemoves[68],
$scope.femalemoves[242],
$scope.femalemoves[84],
$scope.femalemoves[108],
$scope.femalemoves[221],
$scope.femalemoves[224],
$scope.femalemoves[201],
$scope.femalemoves[204],
$scope.femalemoves[102],
$scope.femalemoves[242],
$scope.femalemoves[177],
$scope.femalemoves[226],
$scope.femalemoves[229]
  ];

  var fw11h = [
$scope.femalemoves[39],
$scope.femalemoves[33],
$scope.femalemoves[18],
$scope.femalemoves[69],
$scope.femalemoves[243],
$scope.femalemoves[84],
$scope.femalemoves[108],
$scope.femalemoves[225],
$scope.femalemoves[201],
$scope.femalemoves[204],
$scope.femalemoves[102],
$scope.femalemoves[243],
$scope.femalemoves[178],
$scope.femalemoves[226],
$scope.femalemoves[229],
$scope.femalemoves[39],
$scope.femalemoves[33],
$scope.femalemoves[18],
$scope.femalemoves[69],
$scope.femalemoves[243],
$scope.femalemoves[84],
$scope.femalemoves[108],
$scope.femalemoves[225],
$scope.femalemoves[201],
$scope.femalemoves[204],
$scope.femalemoves[243],
$scope.femalemoves[102],
$scope.femalemoves[178],
$scope.femalemoves[226],
$scope.femalemoves[229]
  ];

  


// All the Workouts Details Information such as image, background color, and so on
     $scope.fwd = {
      f1: {
        title:"Scorn ",
        num: "01",
        price: "3.00",
        celeb: "Angelina Jolie, Jennifer Aniston",
        type: "Hey",
        desc: "Prepare yourself to be scorned. Inspired by the fitness and physique of Angelina Jolie. Scorn is a great weight loss workout; idle to getting into Hollywood shape.  This workout is a full body shape contouring workout.",
        length:"2",
        colorline:"#cd3c35",
        back:"img/fback1-01.svg",
        mainimg:"img/womens1.png",
        resultback:"img/wr1.jpg",
        easyinfo:[Math.round(0.0175*34*($rootScope.loginData.weight*0.45)),"5:00",fw1e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*104.5*($rootScope.loginData.weight*0.45)),"14:45",fw1m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*190.5*($rootScope.loginData.weight*0.45)),"28:15",fw1h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw1e,
        medium: fw1m,
        hard: fw1h

      },
      f2: {
        title:"Video Vixen ",
        num:"02",
        price: "4.00",
        celeb: "Brad Pitt",
        type: "fiction",
        desc: "Curve your body into some of your favorite music artist’s. Video vixen is for those who crave the look of a music video vixen—slim, toned but shapely in all the right places. Inspired by celebrities such as Britney Spears and Jennifer Lopez. Video Vixen creates a body you would want to shake. It is a full body shape-curving workout.",
        length:"2",
        colorline:"#ab3c87 ",
        back:"img/fback2-01.svg",
        mainimg:"img/womens2.png",
        resultback:"img/wr2.jpg",
        easyinfo:[Math.round(0.0175*37.5*($rootScope.loginData.weight*0.45)),"5:00",fw2e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*99.75*($rootScope.loginData.weight*0.45)),"14:45",fw2m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*184*($rootScope.loginData.weight*0.45)),"30:00",fw2h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw2e,
        medium: fw2m,
        hard: fw2h
      },
      f3: {
        title:"Python ",
        num:"02",
        price: "4.00",
        celeb: "Nicki Minaj, Blac Chyna",
        type: "fiction",
        desc: "Get ready to curve your body. Inspired by Nikki Minaj’s figure and overall voluptuous lower physique, Python focuses on exercises idle for a broad butt and large thighs yet shapes a thin waist.  This is a lower body and butt workout.",
        length:"2",
        colorline:"#58ae6b",
        back:"img/fback3-01.svg",
        mainimg:"img/womens3.png",
        resultback:"img/wr3.jpg",
        easyinfo:[Math.round(0.0175*44*($rootScope.loginData.weight*0.45)),"5:45",fw3e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*98.5*($rootScope.loginData.weight*0.45)),"13:30",fw3m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*157*($rootScope.loginData.weight*0.45)),"26:00",fw3h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw3e,
        medium: fw3m,
        hard: fw3h
      },
      f4: {
        title:"Malibu Athletics ",
        num:"02",
        price: "4.00",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "The skies of Malibu beach see the hottest bodies in the world. Get a body worthy of the place. Inspired by the physique of Kate Hudson, thin, toned, active, and athletic figure is what you can expect when you train with the Malibu Sky workout. This is a full body high intensity workout.",
        length:"2",
        colorline:"#86f5d5",
        back:"img/fback4-01.svg",
        mainimg:"img/womens4.png",
        resultback:"img/wr4.jpg",
        easyinfo:[Math.round(0.0175*40.75*($rootScope.loginData.weight*0.45)),"5:45",fw4e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*85.75*($rootScope.loginData.weight*0.45)),"13:15",fw4m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*179*($rootScope.loginData.weight*0.45)),"29:00",fw4h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw4e,
        medium: fw4m,
        hard: fw4h
      },
      f5: {
        title:"The Country Heart Breaker ",
        num:"02",
        price: "4.00",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "You are sure to break a lot of hearts after completing the Country Heartbreaker Workout. Inspired by the sporty and spritely figure of Taylor Swift, this workout focuses on burning of the pounds with exercises that are sure to make break a sweat. This is a full body workout ideal for the active, world touring artist that you are.",
        length:"2",
        colorline:"#f9c032",
        back:"img/fback5-01.svg",
        mainimg:"img/womens5.png",
        resultback:"img/wr5.jpg",
        easyinfo:[Math.round(0.0175*43*($rootScope.loginData.weight*0.45)),"5:30",fw5e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*99.75*($rootScope.loginData.weight*0.45)),"14:15",fw5m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*196*($rootScope.loginData.weight*0.45)),"31:00",fw5h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw5e,
        medium: fw5m,
        hard: fw5h
      },
      f6: {
        title:"Brazilian Bombshell ",
        num:"02",
        price: "4.00",
        celeb: "Zac Efron",
        type: "fiction",
        desc: "With some of the most coveted and admired bodies in the world, Brazil is home of the Bombshell. Inspired by so many Brazilian supermodels like Giselle, Lima, and Ambriouso, this workout is ideal to transform you into a bombshell. Brazilian Bombshell is full body workout designed to tone a thin waist and accentuate the posterior, perfectly suited for the beaches of Rio de Janerio",
        length:"2",
        colorline:"#f49c44",
        back:"img/fback6-01.svg",
        mainimg:"img/womens6.png",
        resultback:"img/wr6.jpg",
        easyinfo:[Math.round(0.0175*43*($rootScope.loginData.weight*0.45)),"5:30",fw6e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*99.75*($rootScope.loginData.weight*0.45)),"14:15",fw6m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*192*($rootScope.loginData.weight*0.45)),"29:00",fw6h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw6e,
        medium: fw6m,
        hard: fw6h
      },
      f7: {
        title:"Lipliscious ",
        num:"02",
        price: "4.00",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "You’ll soon be the envy of all your friends after you complete Liplicious. . Inspired by Kylie Jenner and her curvaceous physique, the Liplicious is for the hidden seductress in you. This is a full body workout, focusing on size, shape, and curves. It will soon shape you into curvaceous, liplicious body of your dreams.",
        length:"2",
        colorline:"#fef439",
        back:"img/fback7-01.svg",
        mainimg:"img/womens7.png",
        resultback:"img/wr7.jpg",
        easyinfo:[Math.round(0.0175*38*($rootScope.loginData.weight*0.45)),"5:30",fw7e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*93*($rootScope.loginData.weight*0.45)),"13:00",fw7m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*182.5*($rootScope.loginData.weight*0.45)),"28:30",fw7h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw7e,
        medium: fw7m,
        hard: fw7h
      },
      f8: {
        title:"Viva Glam ",
        num:"02",
        price: "4.00",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "Inspired by Kelly Ripa’s physqie, Viva Glam wants you too to be able handle the challenges of being a modern women: work, fun, and motherhood. Her body has to be able to handle the demands of a full, taxing and demanding life",
        length:"2",
        colorline:"#7fdacf",
        back:"img/fback8-01.svg",
        mainimg:"img/womens8.png",
        resultback:"img/wr8.jpg",
        easyinfo:[Math.round(0.0175*35.5*($rootScope.loginData.weight*0.45)),"5:30",fw8e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*89*($rootScope.loginData.weight*0.45)),"13:15",fw8m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*184.5*($rootScope.loginData.weight*0.45)),"29:30",fw8h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw8e,
        medium: fw8m,
        hard: fw8h
      },
      f9: {
        title:"XOXO ",
        num:"02",
        price: "4.00",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "You’ll be sure to love all the attention and affection you will receive after a few sessions of XOXO. It is intended curve your body into volumptious figure. Inspired by the physique of Kloe Kardashian. This workout is full body shaping workout. After this your wont be able to resist themselves. Luck you!! ",
        length:"2",
        colorline:"#f4c87f",
        back:"img/fback9-01.svg",
        mainimg:"img/womens9.png",
        resultback:"img/wr9.jpg",
        easyinfo:[Math.round(0.0175*44.5*($rootScope.loginData.weight*0.45)),"6:00",fw9e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*147.5*($rootScope.loginData.weight*0.45)),"20:15",fw9m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*184.5*($rootScope.loginData.weight*0.45)),"28:30",fw9h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw9e,
        medium: fw9m,
        hard: fw9h
      },
      f10: {
        title:"Keeping Up With The Curves ",
        num:"02",
        price: "4.00",
        celeb: "Chris Pratt, Chris Evans",
        type: "fiction",
        desc: "NEW So please continue to use {{choice.title}} this workout to get to your fitness goals. Thanks :)",
        length:"2",
        colorline:"#3d3c3c",
        back:"img/fback10-01.svg",
        mainimg:"img/womens10.png",
        resultback:"img/wr10.jpg",
        easyinfo:[Math.round(0.0175*45.5*($rootScope.loginData.weight*0.45)),"5:45",fw10e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*102.5*($rootScope.loginData.weight*0.45)),"15:00",fw10m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*173*($rootScope.loginData.weight*0.45)),"29:00",fw10h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw10e,
        medium: fw10m,
        hard: fw10h
      },
      f11: {
        title:"Her Majesty, The Queen ",
        num:"02",
        price: "4.00",
        celeb: "Beyonce, Madonna",
        type: "fiction",
        desc: "Bow your head! Lower your gaze. You are about to be in the presence of supreme royalty. Inspired by the physique and figure of Beyoncé, the Queen of Music. Focusing on high-energy exercises ideal for burning excess weight and reshaping your body into a performing superstar. This is a full body high intensity workout intended to make you sweat",
        length:"2",
        colorline:"#A05281",
        back:"img/fback11-01.svg",
        mainimg:"img/womens11.png",
        resultback:"img/wr11.jpg",
        easyinfo:[Math.round(0.0175*40*($rootScope.loginData.weight*0.45)),"5:30",fw11e.length,"img/easya-01.png","img/med-01.png","img/hard-01.png"],
        medinfo:[Math.round(0.0175*92.75*($rootScope.loginData.weight*0.45)),"14:00",fw11m.length,"img/easy-01.png","img/meda-01.png","img/hard-01.png"],
        hardinfo:[Math.round(0.0175*170*($rootScope.loginData.weight*0.45)),"27:00",fw11h.length,"img/easy-01.png","img/med-01.png","img/harda-01.png"],
        easy: fw11e,
        medium: fw11m,
        hard: fw11h
      }
    };


    $scope.zeroOut=function(){
       $rootScope.totalcalc=0;
       $rootScope.totalTime=0; 
    }

    $scope.pick = function(selectedBook) {
      $rootScope.choice = selectedBook;
      console.log("Hello Yellow");
      console.log(selectedBook);
    }


    $scope.bubble = function(selectedCal) {
      $rootScope.bub = selectedCal;
      console.log("Bubble");
    }

    $scope.choosen = function(selectedChoose) {
      $ionicScrollDelegate.resize();
      $rootScope.diff = selectedChoose;
      console.log("selectedChoose");
      
    }

    $scope.go = function ( path ) {
    $location.path( path );
  };



   $scope.ctrlCheck="Women Controller Checker";



})



.controller('DetailsCtrl', function($scope, $ionicModal, $rootScope, $ionicLoading, $ionicScrollDelegate, $ionicSideMenuDelegate) {

    $scope.zeroOut=function(){
       $rootScope.totalcalc=0;
       $rootScope.totalTime=0; 
    }

    $scope.bubble = function(selectedCal) {
      $rootScope.bub = selectedCal;
      console.log("Bubble");
    }

    $scope.choosen = function(selectedChoose) {
      $ionicScrollDelegate.resize();
      $rootScope.diff = selectedChoose;
      console.log("selectedChoose");
      
    }

  $ionicModal.fromTemplateUrl('templates/detailmove.html', {
    scope: $scope,
    id:4
  }).then(function(modal) {
    $scope.modal4 = modal;
  });


  $scope.showMoreDetail=function(index){

     $scope.modal4.show();
     $scope.trackIndex=index;
  }

  $scope.showLessDetail=function(){
    $scope.modal4.hide();
  }


})





.controller('countCtrl', function($scope, $rootScope, $timeout, $state) {
  
  $scope.count=3;

  $scope.$on("$ionicView.enter", function () {
     // alert("this happens everytime I enter");



    $timeout(function() {
      $scope.startTimeout();
  
  }, 450);
    });


    $scope.$on("$ionicView.afterLeave", function () {
     // alert("this happens everytime I enter");

      $scope.count=3;
    });  

  $scope.startTimeout = function () {  
    $scope.count = $scope.count - 1;  
        counttimeout = $timeout($scope.startTimeout, 1000); 

        if($scope.count<1){
          $timeout.cancel(counttimeout);
          $scope.count="";
          $state.go('app.workout');
        }

  }

})

// WORK CONTROLLER DOES HANDLES ALL OF THE MOVES AND TIMING

.controller('WorkoutCtrl', function($scope, $ionicPopup, $state, $stateParams, $ionicHistory, $ionicModal, $rootScope, $timeout) {


  var endvoice = new Audio("img/End Early.mp3");
  var dontendvoice = new Audio("img/AwesomeKeepGoing.mp3");
    

    $scope.$on("$ionicView.enter", function () {
     // alert("this happens everytime I enter");
      
      $scope.startTimeout();
      $scope.changeit();
      $scope.sounder();
      $timeout(function() {
            $scope.sbmes="none";
          }, 2500);
      screen.unlockOrientation();


    });

$ionicModal.fromTemplateUrl('templates/pausemodal.html', {
    scope: $scope,
    id:1
  }).then(function(modal) {
    $scope.modal = modal;
  });


$scope.hidepause=function(){

    $scope.modal.hide();

}

$scope.colorblur="red";

  $scope.changer = function () {  
        if($scope.colorblur=="red"){
          $scope.colorblur="yellow";
        }
        else{
          $scope.colorblur="red";
        }
    } 

  $ionicHistory.nextViewOptions({
    disableBack: false
  });

 $scope.startCount;
 $scope.caloriessofar; 
 $rootScope.totalcalc=0;
 $rootScope.totalTime=0; 
 $scope.animationplayer="animatedquick bounceInUp";
 $scope.workout_index=0;

    $scope.vs = function (number) {  
        $scope.startCount = number; 
    } 

      $scope.tracker = function (number) {  
        $scope.caloriessofar = number; 
    } 

    $scope.keepimage= function(whatthe,size){
        $scope.keeper=whatthe;
        $scope.sizer=size;
    }

    $scope.keepprogress=function(athing){
        $scope.progress=athing;
    }

    $scope.keeptitle=function(thing,audio,audio2){
        $scope.titleshow=thing;
        $scope.audiormove=audio;
        $scope.audiorrep=audio2;
    }

    $scope.keeptotalmoves=function(number1,number2,number3){
        $scope.currentmove=number1+1;
        $scope.totalmoves=number2;
        $scope.moverep=number3;
    }

    $scope.startTimeout = function () {  
        $scope.startCount = $scope.startCount - 1;  
        mytimeout = $timeout($scope.startTimeout, 1000);  
           if($scope.startCount==0){
           // alert("What the hell");
           $scope.next();
           $scope.progessmove(0);
           $rootScope.totalcalc += $scope.caloriessofar;
          }

          $rootScope.totalTime = $rootScope.totalTime + 1; 


    }  

$scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Don\'t eat that!',
     template: 'It might taste good'
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };


  $scope.endEarly = function() {
    endvoice.play();
    var confirmPopup = $ionicPopup.confirm({
         cssClass: "myPopup",
         template: 'end workout early?',
         cancelText: 'Never', // String (default: 'Cancel'). The text of the Cancel button.
         cancelType: 'button button-dark', // String (default: 'button-default'). The type of the Cancel button.
         okText: 'Yeah', // String (default: 'OK'). The text of the OK button.
         okType: 'button button-balanced', // String (default: 'button-positive'). The type of the OK button.
       });

       confirmPopup.then(function(res) {
         if(res) {
           console.log('Ended workout early');
           $scope.end();
         } 
         else {
           console.log('Did not end workout early');
           dontendvoice.play();
         }
       });
 };

$scope.hidesimple=function(){
    if($scope.animationplayer=="animatedquick bounceInUp"){
      $scope.animationplayer="animatedquick bounceOutDown";
    }
    else if($scope.animationplayer=="animatedquick bounceOutDown"){
      $scope.animationplayer="animatedquick bounceInUp";
    }
}

$scope.progressbar="100%";

$scope.progessmove=function(num){
  $scope.tc=$scope.diff.length-$scope.meal_index-num;//11-1-1=11
  $scope.tp=100/$scope.diff.length;//9.09% per move
  $scope.progressbar=$scope.tc*$scope.tp+'%';

}

$scope.muter=0;
$scope.mutetext="Mute";
$scope.muteimg="img/mute2-01.png";
// $scope.rs=$scope.diff[$scope.workout_index].audiomove;
// $scope.ms=$scope.diff[$scope.workout_index].audiorep;


// $scope.dirtytester=$scope.diff;
// var numtester=$scope.meal_index;
// $scope.justright=$scope.dirtytester[$scope.meal_index];

$scope.sounder=function(){

  $scope.rs=$scope.diff[$scope.workout_index].audiorep;
  $scope.ms=$scope.diff[$scope.workout_index].audiomove;

    var movesound = new Audio ($scope.ms);
    var repsound = new Audio ($scope.rs);

    if($scope.muter==0){
        
        movesound.play();

        $timeout(function() {
          repsound.play();
        }, 2000);

    }

    if($scope.muter==1){
      console.log("Rachel has been muted");
      return;
    }
    
    // movesound.play();

    // $timeout(function() {
    //   repsound.play();
    // }, 2500);

}

$scope.muteMe=function(){
  if($scope.muter==0){
    $scope.mutetext="Unmute";
    $scope.muter=1;  
    $scope.muteimg="img/unmuted2-01.png";
  }
  else if($scope.muter==1){
    $scope.mutetext="Mute";
    $scope.muter=0;  
    $scope.muteimg="img/mute2-01.png"
  }
  
}



     $scope.changeit=function(){
      if($scope.player="default"){
        $scope.player="none";
        $scope.pauser="default";
      }
    }

    $scope.changeitagain=function(){
      if($scope.player="none"){
        $scope.player="default";
        $scope.pauser="none";
      }
    }



    $scope.pauser="none";
    $scope.player="default";

    $scope.alwayshide="none";//hiding the screen that gives them the get ready message
    $scope.tog="visible";
 
  
    $scope.stopTimeout = function () {  
        $timeout.cancel(mytimeout);  
    } 

 

    $scope.pick = function(selectedBook) {
    $rootScope.choice = selectedBook;
    }


  $scope.meal_index = 0;
  $scope.isDisabled=true;
  $rootScope.totalcalories=0;

  $scope.changeStatus=function(){
    $scope.checkStatus = false;
  }

  $scope.changeStatusAgain=function(){
    $scope.checkStatus = true;
  }



   $scope.starter = function(){
      if($scope.meal_index==0){
        $scope.startTimeout();
      }
    }

  $scope.next = function() {
        if ($scope.meal_index >= $scope.diff.length-1 ) {
            //$scope.meal_index = 0;
            // alert("You've Completed Your Workout");

            $scope.stopTimeout();

            $scope.meal_index=0;

            $scope.pauser="none";
            $scope.player="default";

            $ionicHistory.nextViewOptions({
                historyRoot: true
              });//how to eliminate back button

            $state.go('app.quote');//changed from results
        }
        else {
            $scope.meal_index ++;
            $scope.workout_index++;
            $scope.sounder();
            $scope.isDisabled=false;
        }
    };

    $scope.end=function(){
            $scope.stopTimeout();

            $scope.meal_index=0;

            $scope.pauser="none";
            $scope.player="default";

            $ionicHistory.nextViewOptions({
                historyRoot: true
              });//how to eliminate back button

            $state.go('app.quote');//changed from results
    }



   

    $scope.prev = function() {
        if ($scope.meal_index <= 1) {
            $scope.meal_index = 0;
            $scope.isDisabled=true;
            $scope.workout_index--;
            $scope.sounder();

             // for disabled or false for enable...
        }
        else {
            $scope.meal_index --;
            $scope.workout_index--;
            $scope.sounder();
            $scope.isDisabled=false;
            
        }
    };

   $scope.ctrlCheck="Workout Ctrl";
    

})







.controller('QuoteCtrl', function($scope, $state, $rootScope, $stateParams,$timeout, $ionicPlatform, $cordovaInstagram, $cordovaSocialSharing, $cordovaGoogleAnalytics) {
    

      $scope.ctrlCheck="This is the QUOTE Ctrl";
      $scope.tmbc="nothing changed again!";

      $scope.quotesbad=[
      "img/quote1.png",
      "img/quote2.png"
      ]

      $scope.quotesgood=[
      "img/womens7.png",
      "img/womens8.png",
      "img/womens9.png"
      ]



  // function getBase64Image(img) {
  //   var insta=new Image();
  //   insta.src=img;
  //   insta.onload=function(){
  //       var canvas = document.createElement("canvas");
  //       canvas.width = this.width;
  //       canvas.height = this.height;
  //       var ctx = canvas.getContext("2d");
  //       ctx.drawImage(this, 0, 0);
  //       var dataURL = canvas.toDataURL("image/png");
  //       return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  //   }
  // }

//   function convertImgToBase64URL(url, callback, outputFormat){
//     var img = new Image();
//     img.crossOrigin = 'Anonymous';
//     img.onload = function(){
//         var canvas = document.createElement('CANVAS'),
//         ctx = canvas.getContext('2d'), dataURL;
//         canvas.height = img.height;
//         canvas.width = img.width;
//         ctx.drawImage(img, 0, 0);
//         dataURL = canvas.toDataURL(outputFormat);
//         callback(dataURL);
//         canvas = null; 
//     };
//     img.src = url;
// }


  function getBase64Image(url) {
    var image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function(e) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext("2d");
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      console.log(canvas.toDataURL());
      return(canvas.toDataURL());
    };
    image.src = url;
  }


  $scope.shareNative=function(text,image,link){

     $ionicPlatform.ready(function() {

        $cordovaSocialSharing.shareVia("com.burbn.instagram.shareextension",text, image, null).then(function(result) {
          // Success!
          console.log("Instagram success");
        }, function(err) {
          // An error occurred. Show a message to the user
          console.log("Instagram share did not work");
        });

      
      //window.plugins.socialsharing.shareViaInstagram('Message via Instagram', 'https://www.google.nl/images/srpr/logo4w.png', function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
       
     })
     

    
  }

  $scope.shareFbBtn=function(text,imagelink){

    $ionicPlatform.ready(function() {
        // Vibrate 2000ms

      $cordovaSocialSharing.shareViaFacebook(text, imagelink,"http://www.gogatherapp.com").then(function(result) {
        // Success!
        console.log("FB success");
      }, function(err) {
        // An error occurred. Show a message to the user
        console.log("Facebook share did not work");
      });

   
    })
  }

  $scope.shareTwitterBtn=function(text,imagelink){

  $ionicPlatform.ready(function() {
      // Vibrate 2000ms

    $cordovaSocialSharing.shareViaTwitter(text, imagelink, "http://www.gogatherapp.com").then(function(result) {
      // Success!
      console.log("Twitter Success");
    }, function(err) {
      // An error occurred. Show a message to the user
      console.log("Twitter share did not work");
    });

 
    })
  }

  $scope.$on("$ionicView.beforeEnter", function () {

      

      if(0.0175*$rootScope.totalcalc*$rootScope.loginData.weight*0.45<20){

        $scope.tmbc="You did badly!";
        $scope.quotechosen= $scope.quotesbad[Math.floor(Math.random() * $scope.quotesbad.length)];
      }
      else if(0.0175*$rootScope.totalcalc*$rootScope.loginData.weight*0.45>20){
        $scope.tmbc="Congratualtions!";
        $scope.quotechosen= $scope.quotesgood[Math.floor(Math.random() * $scope.quotesgood.length)];
      }

      $scope.classeryo="animated fadeIn";
      $scope.hidepls="default";

      $timeout(function() {
      $scope.classeryo="animated fadeOut";$scope.hidepls="none";
       }, 2000);

      screen.lockOrientation('portrait');


      });



      $scope.resultsmove=function(){
        $state.go('app.results'); 
      }




})






//BROWSE CONTROLLER HANDLES ALL OF THE WORKOUTS AND WORKOUT LISTS LIKE EASY, MEDIUM AND HARD



.controller('ResultsCtrl', function($scope, $state, $stateParams, $ionicHistory, $rootScope, $filter, $ionicPlatform, $timeout, $cordovaSocialSharing) {
  
  $scope.sbmes="visible";
  $rootScope.firsttime=1;
  $scope.tmbc="nothing changed";

  var goodaudio = ['img/Pat Yourself.mp3', 'img/Off the Charts.mp3', 'img/Showing Off.mp3'];
  var badaudio = ['img/SmallSetback.mp3', 'img/No Biggie.mp3', 'img/NextTime.mp3'];

  $scope.goodtext=['Great Job!','Amazing Job!'];
  $scope.badtext=['You can do better!','You will get it nex time'];

  $scope.sometestname="Johnny Be Good Time Zebra Horse";

  $scope.$on("$ionicView.enter", function () {
     // alert("this happens everytime I enter");
     $rootScope.menucolor="white";
           $timeout(function() {
            $scope.sbmes="none";
          }, 350);


    if(0.0175*$rootScope.totalcalc*$rootScope.loginData.weight*0.45<20){
        $scope.tmbc="You did badly!";
        var audiob = new Audio(badaudio[Math.floor(Math.random() * badaudio.length)]);
        audiob.play();
        $scope.finishmessage=$scope.badtext[Math.floor(Math.random() * $scope.badtext.length)];

      }
      else if(0.0175*$rootScope.totalcalc*$rootScope.loginData.weight*0.45>20){
        $scope.tmbc="Congratualtions!";
        var audiog = new Audio(goodaudio[Math.floor(Math.random() * goodaudio.length)]);
        audiog.play();
         $scope.finishmessage=$scope.goodtext[Math.floor(Math.random() * $scope.goodtext.length)];
      }
    });


  $scope.shareInstagramBtn=function(text,imagelink){
    $ionicPlatform.ready(function() {

        
      $cordovaSocialSharing.shareVia("com.burbn.instagram.shareextension",text, imagelink, null).then(function(result) {
          // Success!
          console.log("Instagram success");
        }, function(err) {
          // An error occurred. Show a message to the user
          console.log("Instagram share did not work");
        });
     })
  }


  $scope.shareFbBtn=function(text,imagelink){

    $ionicPlatform.ready(function() {
      // Vibrate 2000ms

      $cordovaSocialSharing.shareViaFacebook(text, imagelink,null).then(function(result) {
        // Success!
        console.log("FB success");
      }, function(err) {
        // An error occurred. Show a message to the user
        console.log("Facebook share did not work");
      });
 
    })
  }

  $scope.shareTwitterBtn=function(text,imagelink){

  $ionicPlatform.ready(function() {
      // Vibrate 2000ms

    $cordovaSocialSharing.shareViaTwitter("Twitter works now", imagelink, "http://www.gogatherapp.com").then(function(result) {
      // Success!
      console.log("Twitter Success");
    }, function(err) {
      // An error occurred. Show a message to the user
      console.log("Twitter share did not work");
    });

 
    })
  }



$scope.clearbackhistory = function() {

            $ionicHistory.nextViewOptions({
                historyRoot: true
              });//how to eliminate back button
            if ($rootScope.loginData.isPremiumUser) {
              $state.go('app.history', {reload: true});
              console.log("REFRESHED");
            } else {
              $rootScope.confirmAlert("Upgrade Premium User.", "OK");
            }
            
    };

$scope.clearbackhome = function() {

            $ionicHistory.nextViewOptions({
                historyRoot: true
              });//how to eliminate back button

            $state.go('app.browse');
    };

   $scope.ctrlCheck="Browse";



$scope.savedata=function(cal,time,title,type){
    $rootScope.rescal=cal;
    $rootScope.restime=time;
    $rootScope.restitle=title;
    $rootScope.restype=type;

    $scope.dater = new Date();
    $scope.monthly = $scope.dater.getUTCMonth()+1;
    $scope.day = $scope.dater.getUTCDate();
    $scope.sdater = $scope.monthly+"/"+$scope.day;

    $scope.resdate = $scope.sdater.toString();

}




   $scope.tt = [
    { title: 'Rock Hard', url:"#/app/details",id: 1, num:"01", image: "img/bbtry4-01.png", info: "allbooks.book1", caloriesmain:"150", time:5000, color:"img/rb.png", type:"Full Body",desc: "This workout CONSISTS of crazy ass workout moves that will work your body to the bone and will go much further than any other workout program you have tried before. So please continue to use this workout to get to your fitness goals. Thanks :)"},
    { title: 'Fight Club', url:"#/app/details",id: 2, num:"02", image: "img/bbtry5-01.svg", info: "allbooks.book2", caloriesmain:"250", time:"7:00",color:"img/rb.png", type:"Butt"},
    { title: 'Dead Pool', url:"#/app/details",id: 3, num:"03",image: "img/gp.png", info: "allbooks.book3", caloriesmain:"320", time:"3:30",color:"img/rb.png", type:"Arms and Shoulders"},
    { title: '300', url:"#/app/search",id: 4, num:"04",image: "img/b.png", info: "allbooks.book1", caloriesmain:"50", time:"4:15",color:"img/rb.png", type:"Full Body" },
    { title: 'Joe Manganiello', url:"#/app/mworkouts",id: 5, num:"05",image: "img/300.jpg", info: "allbooks.book2", caloriesmain:"750", time:"5:00",color:"img/rb.png", type:"Full Body" },
    { title: 'Zac Efron', url:"#/app/details",id: 6, num:"06",image: "img/bbtry5-01.svg", info: "allbooks.book2", caloriesmain:"340", time:"5:00",color:"img/rb.png", type:"Full Body" },
    { title: 'Chris Pratt', url:"#/app/details",id: 1, num:"07", image: "img/b1-01.png", info: "allbooks.book1", caloriesmain:"700", time:5000, color:"img/rb.png", type:"Full Body"},
    { title: 'Superman', url:"#/app/details",id: 2, num:"08", image: "img/b22-01.svg", info: "allbooks.book2", caloriesmain:"250", time:"7:00",color:"img/rb.png", type:"Butt"},
    { title: 'Hugh Jackman', url:"#/app/details",id: 3, num:"09",image: "img/gp.png", info: "allbooks.book1", caloriesmain:"320", time:"3:30",color:"img/rb.png", type:"Arms and Shoulders"},
    { title: 'Troy Brad Pitt', url:"#/app/search",id: 4, num:"10",image: "img/b.png", info: "allbooks.book1", caloriesmain:"50", time:"4:15",color:"img/rb.png", type:"Full Body" },
    { title: 'Bruce Lee', url:"#/app/mworkouts",id: 5, num:"11",image: "img/bbtry5-01.svg", info: "allbooks.book2", caloriesmain:"750", time:"5:00",color:"img/rb.png", type:"Full Body" }
  ];

  $scope.tt2 = [
     $scope.tt[4],$scope.tt[5]
  ];















//   $scope.allBooks = { 
//     book1: {
//         hardcover: {
//             price: 25.99,
//             details: 'hard'
//         },
//         e_book: {
//             price: 1.99,
//             details: 'ebook'
//         }
//     }, 
//     book2: {
//         hardcover: {
//             price: 60.00,
//             details: 'hard'
//         },
//         e_book: {
//             price: 2.99,
//             details: 'ebook'
//         }
//     }
// } ;

// $scope.bookchoice = function ( selectedBook ) {
//     $rootScope.choice = selectedBook;
// }

// $scope.booktype = function ( selectedType ) {
//     $rootScope.choice.type = selectedType;
// }


// var ebook={
//   title:"One E Book",
//   title:"Two E Book"
// }

// var hard={
//   title:"One Hard",
//   title:"Two Hard"
// }

 

  
  var book1chapterse = [{
      title: "easy it begins", price: "easy price"
    }, {
      title: "another one", price: "easy price"
    }];

  var book1chaptersm = [{
      title: "medium it begins"
    }, {
      title: "another one"
    }];

  var book1chaptersh = [{
      title: "hard it begins", price: "hard price"
    }, {
      title: "another one", price: "hard price"
    }];

  var book2chapters = [{
      title: "hello", price: "90%",length:"45"
    }, {
      title: "calling from the otherside", price: "100%"
    }];
  
     $scope.allbooks = {
      book1: {
        price: "3.00",
        type: "non-fiction",
        length:"2",
        easy: book1chapterse,
        hard: book1chaptersh

      },
      book2: {
        price: "4.00",
        type: "fiction",
        chapters: book2chapters
      },
    };

    //MIGHT BE NOT BE SO IMPORTANT BELOW !!!!!!!!!!!!!!!!!!!!!!

   //  $scope.pick = function(selectedBook) {
   //    $rootScope.choice = selectedBook;
   //    console.log(selectedBook);
   //  }
   //  diff="easy";

   //  $scope.choosen = function(selectedChoose) {
   //    $rootScope.diff = selectedChoose;
   //    console.log(selectedChoose);
   //  }
   // $scope.ctrlCheck="Browse";



})


//History Controller
.controller('HistoryCtrl', function($scope, $ionicPopup, $timeout, $ionicLoading, $state, $stateParams, $ionicHistory, $rootScope, $ionicScrollDelegate, $http) {



$rootScope.workoutnamehistory="Bob Bushy";


$scope.$on("$ionicView.beforeEnter", function () {
     // alert("this happens everytime I enter");
    // $scope.newtable = [[30, 59, 80, 81, 56, 55, 40]];
    // $scope.testtable = [[70, 59, 80, 81, 56, 55, 40]];
     $rootScope.menucolor="white";
     $scope.daterange=10;  

      

});

$scope.$on("$ionicView.afterEnter", function(event, data) {
  window.dispatchEvent(new Event('resize'));
    //   $ionicLoading.show({
    //   template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    // });
           
});

$scope.octnov="Mar 31";

$scope.aDate= new Date(); // here this is today, but use whatever date you want
$scope.today= new Date();
$scope.twoWeeksForward = new Date();
$scope.daterange=new Date();
$scope.twoWeeksForward.setDate($scope.twoWeeksForward.getDate() + 14); // plus 14 days

if($scope.twoWeeksForward>$scope.today){
  $scope.resultis="correct";
}

else if($scope.twoWeeksForward<$scope.today){
  $scope.resultis="incorrect";
}

$scope.tendays=function(){
    $scope.daterange=10;
    $ionicScrollDelegate.resize();
    $scope.tenbtn="img/10a.svg";
    $scope.thirtybtn="img/30-01.svg";
    $scope.ninetybtn="img/90-01.svg";
    // $scope.testtable=[[]];
    // $scope.testtable = [[1, 59, 80, 81, 56, 55, 40]];

    // $scope.historydata=[];

    // for(var i=0;i<$scope.daterange;i++) {
    //   $scope.historydata.push({'number':i+100, "title":$scope.historyworkouts[i].title});
    //   $scope.labels.shift($scope.historyworkouts[i].date);
    // }    



  // $scope.daterange.setDate($scope.daterange.getDate() - 10);
}

$scope.thirtydays=function(){
  $scope.daterange=30;
  $ionicScrollDelegate.resize();
  $scope.historyworkouts=$scope.holdpls;
  $scope.historyworkouts=[];

  $scope.tenbtn="img/10-01.svg";
  $scope.thirtybtn="img/30a-01.svg";
  $scope.ninetybtn="img/90-01.svg";

  $timeout(function() {
  $scope.historyworkouts=$scope.holdpls;console.log("it triggered");
  },2000);


  // $scope.testtable=[[]];
  // $scope.testtable = [[4, 59, 80, 81, 56, 55, 40]];
  // // $scope.daterange.setDate($scope.daterange.getDate() - 30);
  //   $scope.historydata=[];

  //   for(var i=0;i<$scope.daterange;i++) {
  //     $scope.historydata.push({'number':i+100, "title":$scope.historyworkouts[i].title});
  //     $scope.labels.shift($scope.historyworkouts[i].date);
  //   } 
}

$scope.ninetydays=function(){
  $scope.daterange=90;
  $ionicScrollDelegate.resize();
  $scope.tenbtn="img/10-01.svg";
  $scope.thirtybtn="img/30-01.svg";
  $scope.ninetybtn="img/90a-01.svg";
  // $scope.testtable=[[]];
  // $scope.testtable = [[7, 59, 80, 81, 56, 55, 40]];
  // // $scope.daterange.setDate($scope.daterange.getDate() + 90);

  //   $scope.historydata=[];

  //   for(var i=0;i<$scope.daterange;i++) {
  //     $scope.historydata.push({'number':i+100, "title":$scope.historyworkouts[i].title});
  //     $scope.labels.shift($scope.historyworkouts[i].date);
  //   } 
}

$scope.toPushMore=function(){
  $scope.pushnow(20,'Feb 18','Kim Kardashian','5:30');
}


$scope.shareImage = ['img/clearbtn-01.svg', 'img/harda-01.png'];

$scope.deserts = [
    { title: 'Chocolate', url:"#/app/mworkouts",id: 1 },
    { title: 'Cake', url:"#/app/browse",id: 2 },
    { title: 'Ice Cream', url:"#/app/search",id: 3 },
    { title: 'Sundae', url:"#/app/search",id: 4 },
    { title: 'Cherry Pie', url:"#/app/mworkouts",id: 5 },
    { title: 'Apple Pie', url:"#/app/mworkouts",id: 6 },
    { title: 'Pumpkin Pie', url:"#/app.mworkouts", id: 7}
  ];




$scope.pusher=function(){

  $scope.historyofworkouts.push("3/27");
   
}




$scope.pushitin=function(){
  if($scope.testtable[0]==0){
    console.log("whatever");
    
  }

  $scope.testtable[0].push(100);
  $scope.labels.push("3/27");

}

 $scope.testtable = [[0]];
 $scope.lengthoftable;
 $scope.tenbtn="img/10a.svg";
 $scope.thirtybtn="img/30-01.svg";
 $scope.ninetybtn="img/90-01.svg";

 $scope.checkStatus=true;

$scope.testnumber=Math.random()*100;
$scope.testlabel="3/16";


  
$scope.labels = ["start"];
$scope.series = [];
$scope.data = [
  [65, 59, 80, 81, 56, 55, 40,100]
];

$scope.historyworkouts = [];

  /*[
    // { title: 'Kim Kardashian Workout', time:1500 ,cal: 376, date: 1989, type:'Full Body'},
    // { title: 'Tim Workout', time:1100 ,cal: 20, date: 2016, type:'Legs'},
    // { title: 'John Workout', time:500 ,cal: 190, date: 2016-03-09, type:'Butt' },
    // { title: '4th Workout', time:500 ,cal: 190, date: 2016-03-12 , type:'Chest/Back'},
    // { title: '5th Workout', time:500 ,cal: 190, date: 2016-04-15 },
    // { title: 'Spartant Workout', time:500 ,cal: 190, date: 2016-05-13 },
    // { title: 'Yeah Workout', time:500 ,cal: 190, date: 01232016 },
    // { title: 'Come On Workout', time:500 ,cal: 190, date: 01232016 },
    // { title: 'Index 8 Workout', time:500 ,cal: 190, date: 01232016 },
    // { title: 'Num 10 but Index 9 Workout', time:4500 ,cal: 900, date: 01222016 }
  ];*/

if ($rootScope.loginData.historyofworkouts != undefined) {
   $scope.historyworkouts = $rootScope.loginData.historyofworkouts;
   for (var i = 0; i < $scope.historyworkouts.length; i++) {
       $scope.testtable[0].push($scope.historyworkouts[i].cal);
       $scope.labels.push($scope.historyworkouts[i].date);
   }
}

$rootScope.pushnow = function(cal,title,time,type) {

            var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];
            $scope.lengthoftable=$scope.testtable[0].length;


            $scope.dater = new Date();
            $scope.shortmonth= monthNames[$scope.dater.getMonth()+1];
            $scope.monthly = $scope.dater.getUTCMonth()+1;
            $scope.day = $scope.dater.getUTCDate();
            $scope.sdater = $scope.shortmonth+" "+$scope.day;

            $scope.resdate = $scope.sdater.toString();

            if($scope.testtable[0].length==10){
              $scope.lengthoftable=9;
            }

            if($scope.testtable[0].length>=10){
              $scope.testnumber=Math.random()*100;
              $scope.testtable[0].shift(9,1);
              $scope.testtable[0].push(cal);
              $scope.labels.shift(1,1);
              $scope.labels.push($scope.resdate);
            }

            if($scope.testtable[0].length<10){
              $scope.testnumber=Math.random()*100;
              $scope.testtable[0].push(cal);
              $scope.labels.push($scope.resdate);
            }

            if ($rootScope.loginData.historyofworkouts != undefined)
              $scope.historyworkouts = $rootScope.loginData.historyofworkouts;
            $scope.historyworkouts.push({'title':title,'cal':cal,'time':time,'date':$scope.resdate, 'type':type});
            $scope.data.push(cal);
            $scope.startedontext="Started On";

            $rootScope.loginData.historyofworkouts = $scope.historyworkouts;
            console.log($rootScope.loginData);
            
            if ($rootScope.bLoginStatus && $rootScope.loginData.email.length>0) {
                console.log("I love you!!!!!!!!!!!!!!!!!");
                $rootScope.serverConnectAWS("update", $rootScope.loginData);
            }
            
    };


    $scope.clearnow = function() {

            $scope.testtable = [[65,55,75,80,35,70,65,55,75,80,35,70]];
            $scope.labels=['Jan 19th','Feb 3rd','Feb 28th','Mar 27th','Apr 10th','Aug 20th','Jan 19th','Feb 3rd','Feb 28th','Mar 27th','Apr 10th','Aug 20th'];
            $ionicScrollDelegate.resize();
            $scope.historyworkouts=[
            {"title":"Rock City","cal":"70","time":8,"date":"Feb 9","type":"Full Body"},
            {"title":"Rock City","cal":"50","time":8,"date":"Mar 9","type":"Full Body"},
            {"title":"Rock City","cal":"70","time":8,"date":"Dec 18","type":"Full Body"},
            {"title":"Rock City","cal":"30","time":8,"date":"Feb 9","type":"Full Body"},
            {"title":"Rock City","cal":"70","time":8,"date":"Feb 9","type":"Full Body"},
            {"title":"Rock City","cal":"70","time":8,"date":"Feb 9","type":"Full Body"},
            {"title":"Rock City","cal":"70","time":8,"date":"Feb 9","type":"Full Body"},
            {"title":"Rock City","cal":"70","time":8,"date":"Feb 9","type":"Full Body"}
            ];

            $scope.startedontext="Haven't Started";
/////////////Added by Ai. history update/////////////////////////////////
            $rootScope.loginData.historyofworkouts = $scope.historyworkouts;
            console.log($rootScope.loginData);
            if ($rootScope.bLoginStatus && $rootScope.loginData.email.length>0)
              $rootScope.serverConnectAWS("update", $rootScope.loginData);

///////////////////////////////////
    };

  $scope.changeStatus=function(){
    if($scope.checkStatus=false){
      $scope.checkStatus = true;
    }
    else{
      $scope.checkStatus = false;
    }
    
  }

  // $scope.$on('$ionicView.enter', function() {

  //   if($rootScope.refreshNum==1){
  //     $state.go('app.search', {}, {reload:true});
  //     console.log('Opened by refreshNum!')
  //     $rootScope.refreshNum=2;
  //   }
  //    // Code you want executed every time view is opened
     
  //    console.log('Opened!')
  // })
$scope.showAlert = function() {
var confirmPopup = $ionicPopup.confirm({
     cssClass: "myPopup",
     template: 'Clear all history',
     cancelText: 'Nope', // String (default: 'Cancel'). The text of the Cancel button.
     cancelType: 'button button-balanced', // String (default: 'button-default'). The type of the Cancel button.
     okText: 'Yes', // String (default: 'OK'). The text of the OK button.
     okType: 'button button-dark', // String (default: 'button-positive'). The type of the OK button.
   });

   confirmPopup.then(function(res) {
     if(res) {
       console.log('Ended workout early');
       $scope.clearnow();
     } 
     else {
       console.log('Did not end workout early');
     }
   });
 };



   $scope.ctrlCheck="History";

})


.controller('PlaylistCtrl', function($scope, $stateParams) {
});

