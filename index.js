var MyNameSpace = MyNameSpace || {};
MyNameSpace.helpers = {
	// functions written here

    getStatusName : function(statusCode){
        var statusMsg = "";
      switch(statusCode){
        case 100 : 
            statusMsg = "Not Yet Assigned Tutor";
            break;
        case 200 : 
            statusMsg = "Tutor Assigned but not yet Confirmed";
            break;
        case 300 : 
            statusMsg = "Tutor Confirmed , Deal Ongoing ";
            break;
        case 400 : 
            statusMsg = "Tutor does not solve";
            break;
        case 500 : 
            statusMsg = "Client Side error ";
            break; 
        case 600 : 
            statusMsg = "Got Answer , Not payment not Done ";
            break; 
        case 700 : 
            statusMsg = "Payment Done Finally ";
            break; 
        default:
            statusMsg = "Not Sure About this";                        

      }
      return statusMsg;
    }
}

var app = angular.module('BlankApp', ['ngRoute','ngAnimate', 'ngAria', 'ngMaterial', 'ngMessages','moment-picker','md.data.table']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/adddeals', {
            templateUrl: 'snapqaTemplate/adddeals.html',
            controller: 'addDealsController'
        }).
        when('/viewdeals', {
            templateUrl: 'snapqaTemplate/viewdeals.html',
            controller: 'viewdealsController'   
        }).
        otherwise({
            redirectTo: '/adddeals'
        });
    }
]);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('red')
      .primaryPalette('red');

    $mdThemingProvider.theme('blue')
      .primaryPalette('blue');

  });

app.service("ViewDealsService", function($http, $q) {
    var deferred = $q.defer();
    $http.get("deals.json").then(function(data) {
        deferred.resolve(data);
    })

    this.getService = function() {
        return deferred.promise;
    }
});

app.service("GetOverallDataService", function($http, $q) {
    var deferred = $q.defer();
    $http.get("http://ec2-52-54-173-224.compute-1.amazonaws.com:7200/api/snapQA/admin/overAll").then(function(data) {
        deferred.resolve(data);
    })

    this.getService = function() {
        return deferred.promise;
    }
});


app.service("ViewAllDealsService", function($http, $q) {
    var deferred = $q.defer();
    $http.get("http://ec2-52-54-173-224.compute-1.amazonaws.com:7200/api/snapQA/admin/viewDeals").then(function(data) {
        deferred.resolve(data);
    })

    this.getService = function() {
        return deferred.promise;
    }
});




app.controller('addDealsController', function ($scope,$mdDialog, $http , $rootScope, GetOverallDataService,$route) {


    var overallData ;

    var lookup = GetOverallDataService.getService();
    lookup.then(function(data) {
        $rootScope.raw_data = data.data;
         // whole data
        overallData = $rootScope.raw_data; 
        console.log($rootScope.raw_data);
        $scope.adminsName = overallData.adminList ;
        $rootScope.examType = overallData.examType["ReportingLive"];
        $scope.subjectNameArray = overallData.subjectList;

         $scope.$watch('radioGroup', function(newVal, oldVal){
        
            console.log(newVal);
            if(newVal == true){
                $rootScope.examType = [];
                $rootScope.examType = overallData.examType["ReportingLive"];
            }
            else{
                $rootScope.examType= [];
                $rootScope.examType = overallData.examType["Deaddline"];
            }
    }, true);

      
        //$scope.subjectNameArray = overallData.subjectList;


    });

    $scope.reloadRoute = function() {
   $route.reload();
        }

    // $scope.loadadminName = function(){
    //      $scope.adminsName = overallData.adminList ;
    // }
	//$scope.adminsName = ["Haardik" , "Lather","Ankit","Vishal"];

  

    

	//$scope.subjectNameArray = ["Dynamics","Material Science" ,"Manufacturing","MOM","Organic Chemistry","Measurements","Engineering Eco","Control System"];
	

	$rootScope.reportingLiveCheckBox = true;
	$rootScope.HomeworkCheckBox = false;
	$rootScope.numberOfReviewsTextBox = 0;
	$scope.reviewRequired= [];
	$scope.radioGroup = true;

   
	//$scope.numberOfTutor

	$scope.$watch('numberOfTutors', function(newVal, oldVal){
		if(newVal != undefined){
    		console.log("change in value " + newVal);  
    		$rootScope.numberOfReviewsTextBox = newVal;
    		$scope.numberRev = newVal;
    	}
    	else{
    		console.log("change in value " + newVal); 
    		$scope.numberRev = null;
    	}
	}, true);

	$scope.range = function(n) {
        return new Array(n);
    };

    //$scope.reportingLiveCheckBox = $scope.optionsType[0].checked;
    //$scope.HomeworkCheckBox = $scope.optionsType[1].checked;

   

	// $scope.obj={
	// 	adminName:"",
	// 	timefrom:"",
	// 	timeto:"",
	// 	duration:"",
	// 	clientName:"",
	// 	subjectName:"",
	// 	bookName:"",
	// 	amount:0
	// }

		$scope.showConfirm = function(ev) {	
   			
    var confirm = $mdDialog.confirm()
          .title('Would you like to add this into database ?')
          .targetEvent(ev)
          .ok('Agree')
          .cancel('Sorry I am High');

    $mdDialog.show(confirm).then(function() {
    	// yes Condition
    	    var addDataRequest = $http({
                            method: 'POST',
                            url: 'http://ec2-52-54-173-224.compute-1.amazonaws.com:7200/api/snapQA/admin/addNewDeal',
                            data: $scope.obj,
                            headers: {
                                'Content-Type': "application/json"
                            }
                        });
                        addDataRequest.success(function(data, status, headers, config) {
                                //                                
                                // console.log(data);
                                if (data.error != undefined) {
                                $mdDialog.show(
                                  $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title('SomeThing Went Wrong !! Try Again ')
                                    .ok('Got it!')
                                    .targetEvent(ev)
                                );

                                } else {

                                $mdDialog.show(
                                  $mdDialog.alert()
                                    .parent(angular.element(document.querySelector('#popupContainer')))
                                    .clickOutsideToClose(true)
                                    .title('Your Deal is added to the database')
                                    .ok('Got it!')
                                    .targetEvent(ev)
                                );
                                }

                            })
                            .error(function(data, status, headers, config) {
                            	$mdDialog.show(
							      $mdDialog.alert()
							        .parent(angular.element(document.querySelector('#popupContainer')))
							        .clickOutsideToClose(true)
							        .title('SomeThing Went Wrong !! Try Again ')
							        .ok('Got it!')
							        .targetEvent(ev)
							    );

                            })
    }, function() {
    	// No codition
    });


  };
   
    $scope.submit = function() {

    	$scope.showConfirm();
    	$scope.obj.numberOfTutors = $scope.numberOfTutors;
    	$scope.obj.ratingArray =[];
    	$scope.obj.ratingArray = $scope.reviewRequired;
        $scope.obj.typeOfDeal;

        if($scope.radioGroup){
             $scope.obj.dealType = "Live Session";
        }
        else{
            $scope.obj.dealType="Deadline Session";
        }
      
        $scope.obj.timeFrom = moment($scope.startTime).toISOString();
        $scope.obj.timeTo = moment($scope.endTime).toISOString();
        //$scope.obj.timeFrom = $scope.startTime;
        //$scope.obj.timeTo = $scope.endTime;
        if($scope.obj.numberOfTutors == undefined){
            $scope.obj.numberOfTutors = 0;
        }

        $scope.obj.duration = $scope.duration.toString();
    	console.log($scope.obj);
    	//console.log($scope.reviewRequired);


    };

    $scope.reset = function(){
    	$scope.obj={};
    	$scope.obj.$setPristine();
    	$scope.obj.$setUntouched();
    }


  });

app.controller('viewdealsController', function ($scope,$http,$rootScope,$mdDialog,ViewDealsService,ViewAllDealsService,GetOverallDataService) {

    
    // var lookup = ViewDealsService.getService();
    // lookup.then(function(data) {
    //     $rootScope.raw_data = data.data; // whole data
    //     console.log($rootScope.raw_data);

    // });
    
    var lookup = ViewAllDealsService.getService();
    lookup.then(function(data) {
        $rootScope.raw_data = data.data; // whole data
       
          var overAlldata = GetOverallDataService.getService();
                overAlldata.then(function(data){
                    $rootScope.raw_overall_data = data.data;
                     console.log($rootScope.raw_overall_data);
                })

    });

  



    $scope.newFilteroption = function (argument) {
        if(argument != undefined){
            
        }
    }

    $scope.filterOptions = ["Reporting Live" , "Homework"];

    console.log($scope.filterByOption);

    $scope.$watch('filterByOption', function(newVal, oldVal){
        if(newVal == "Reporting Live"){
          
        }
        else{
            console.log("change in value " + newVal); 
            $scope.numberRev = null;
        }
    }, true);



    $scope.showAdvanced = function(ev, data) {
        console.log("coming inside ");
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'snapqaTemplate/dealdialog.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals: {
        items: data,
        overalldata : $rootScope.raw_overall_data
     },
      clickOutsideToClose:true
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

   function DialogController($scope, $mdDialog ,$rootScope, items ,overalldata) {
    $scope.theme='red';

    $scope.adminsName = overalldata.adminList;
   // console.log( overalldata);
   // $scope.subjectNameArray = ["Dynamics","Material Science" ,"Manufacturing","MOM","Organic Chemistry","Measurements","Engineering Eco","Control System"];
   
  //  $scope.statusMessage = ["Not Yet Assigned Tutor" , "Tutor Assigned but not yet Confirmed" , "Tutor Confirmed , Deal Ongoing " , "Tutor does not solve ","Client Side error ","Got Answer , Not payment not Done ","Payment Done Finally"];
    $scope.data = items;

    $scope.users = [{name:"Mohit Kushwaha" , phone:"7338496008"} , {name:"abhishek kumar" , phone:"7501384719"}];
  
  //  $scope.radioGroupModel = $scope.data.typeOfDeal[0].value;
    if($scope.data.dealType == "Home Work"){
        $scope.radioGroupModel = false;
    }
    else{
        $scope.radioGroupModel = true;
    }
    console.log( MyNameSpace.helpers.getStatusName($scope.data.status));
    $scope.statusMessageText = MyNameSpace.helpers.getStatusName($scope.data.status);

    if($scope.radioGroupModel){
        // reporting live 
         $scope.examTypePreFilled = overalldata.examType["ReportingLive"];

    }
    else{
        $scope.examTypePreFilled = overalldata.examType["Deadline"];
    }

     $scope.$watch('radioGroupModel', function(newVal, oldVal){
        
            console.log(newVal);
            if(newVal == true){
                $scope.examTypePreFilled = [];
                $scope.examTypePreFilled = overalldata.examType["ReportingLive"];
            }
            else{
                $scope.examTypePreFilled= [];
                $scope.examTypePreFilled = overalldata.examType["Deadline"];
            }
    }, true);

    //  $scope.$watch('data.numberOfTutor', function(newVal, oldVal){
    //     if(newVal != undefined){
    //         console.log("change in value " + newVal);  
    //         $rootScope.numberOfReviewsTextBox = newVal;
    //         $scope.numberRev = newVal;
    //     }
    //     else{
    //         console.log("change in value " + newVal); 
    //         $scope.numberRev = null;
    //     }
    // }, true);


   // console.log( $scope.radioGroupModel);
    console.log($scope.data);
    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  }

    // body...
})