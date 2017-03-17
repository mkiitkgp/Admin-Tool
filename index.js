var MyNameSpace = MyNameSpace || {};
MyNameSpace.helpers = {
	// functions written here
}

var app = angular.module('BlankApp', ['ngAnimate', 'ngAria', 'ngMaterial', 'ngMessages','moment-picker']);


app.controller('myController', function ($scope,$mdDialog, $http) {

	$scope.adminsName = ["Haardik" , "Lather","Ankit","Vishal"];

	$scope.subjectNameArray = ["Dynamics","Material Science" ,"Manufacturing","MOM","Organic Chemistry","Measurements","Engineering Eco","Control System"];

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


    };

    $scope.reset = function(){
    	$scope.obj={};
    	$scope.obj.$setPristine();
    	$scope.obj.$setUntouched();
    }


  });
