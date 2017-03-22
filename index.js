var MyNameSpace = MyNameSpace || {};
MyNameSpace.helpers = {
	// functions written here
}

var app = angular.module('BlankApp', ['ngAnimate', 'ngAria', 'ngMaterial', 'ngMessages','moment-picker']);


app.controller('myController', function ($scope,$mdDialog, $http , $rootScope) {

	$scope.adminsName = ["Haardik" , "Lather","Ankit","Vishal"];

	$scope.subjectNameArray = ["Dynamics","Material Science" ,"Manufacturing","MOM","Organic Chemistry","Measurements","Engineering Eco","Control System"];
	$scope.examType = ["Exam","Quiz","Final Exam","Pop Quiz"];

	$rootScope.reportingLiveCheckBox = false;
	$rootScope.HomeworkCheckBox = false;
	$rootScope.numberOfReviewsTextBox = 0;
	$scope.reviewRequired= [];
	$scope.radioGroup = true;

    $scope.$watch('radioGroup', function(newVal, oldVal){
    	
    		console.log(newVal);
    		if(newVal == true){
    			$scope.examType = [];
    			$scope.examType = ["Exam","Quiz","Final Exam","Pop Quiz"];
    		}
    		else{
    			$scope.examType= [];
    			$scope.examType = ["Lab","HomeWork","Project"];
    		}
	}, true);

	//$scope.numberOfTutor

	$scope.$watch('numberOfTutor', function(newVal, oldVal){
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

   

	$scope.obj={
		adminName:"",
		timefrom:"",
		timeto:"",
		duration:"",
		clientName:"",
		subjectName:"",
		bookName:"",
		amount:0
	}

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
                            url: 'test.php',
                            data: {
                                floter : $scope.obj
                            },
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });
                        addDataRequest.success(function(data, status, headers, config) {
                                //                                
                                // console.log(data);
                                if (data) {

                                } else {
                                    
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
    	$scope.obj.numberOfTutor = $scope.numberOfTutor;
    	$scope.obj.ratingArray =[];
    	$scope.obj.ratingArray = $scope.reviewRequired;
    	console.log($scope.obj);
    	//console.log($scope.reviewRequired);


    };

    $scope.reset = function(){
    	$scope.obj={};
    	$scope.obj.$setPristine();
    	$scope.obj.$setUntouched();
    }


  });
