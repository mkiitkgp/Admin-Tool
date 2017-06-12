var MyNameSpace = MyNameSpace || {};
MyNameSpace.helpers = {
    // functions written here

    getStatusName: function(statusCode) {
        var statusMsg;
        var statusColor;

        switch (statusCode) {
            case 100:
                statusMsg = "Not Yet Assigned Tutor";
                statusColor = "yellow";
                break;
            case 200:
                statusMsg = "Tutor Assigned but not yet Confirmed";
                statusColor = "yellow";
                break;
            case 300:
                statusMsg = "Tutor Confirmed , Deal Ongoing";
                statusColor = "green";
                break;
            case 400:
                statusMsg = "Tutor does not solve";
                statusColor = "red";
                break;
            case 500:
                statusMsg = "Client Side error";
                statusColor = "red";
                break;
            case 600:
                statusMsg = "Got Answer , Not payment not Done";
                statusColor = "green";
                break;
            case 700:
                statusMsg = "Payment Done Finally";
                statusColor = "blue";
                break;
            default:
                statusMsg = "Not Sure About this";
                statusColor = "red";

        }
        var statusObj = { 'statusMsg': statusMsg, 'statusColor': statusColor };
        return statusObj;
    }
}

var app = angular.module('BlankApp', ['ngRoute', 'ngAnimate', 'ngAria', 'ngMaterial', 'ngMessages', 'moment-picker', 'md.data.table','bsLoadingOverlay','bsLoadingOverlaySpinJs']);




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

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('red')
        .primaryPalette('red');

    $mdThemingProvider.theme('blue')
        .primaryPalette('blue');

    $mdThemingProvider.theme('yellow')
        .primaryPalette('yellow');

    $mdThemingProvider.theme('green')
        .primaryPalette('green');

    $mdThemingProvider.alwaysWatchTheme(true);

});

app.run(function(bsLoadingOverlayService) {
    bsLoadingOverlayService.setGlobalConfig({
        templateUrl: 'bsLoadingOverlaySpinJs'
    });
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

 app.service("viewDealOnDateService", function ($http, $q) {
       
        this.viewDealonDay = function (inputdate) {
            var parameter = JSON.stringify({"date":inputdate});
            var deferred = $q.defer();
            
            $http.post('http://ec2-52-54-173-224.compute-1.amazonaws.com:7200/api/snapQA/admin/viewDateSpecificDeals', parameter).then(
                function success(data) {
                    deferred.resolve(data);
                },
                function error(err) {
                    console.log(err);
                    deferred.reject(err);
                });
            return deferred.promise;
        };
    })




app.controller('addDealsController', function($scope, $mdDialog, $mdToast, $http, $rootScope, GetOverallDataService, $route) {


    var overallData;

    var lookup = GetOverallDataService.getService();
    lookup.then(function(data) {
        $rootScope.raw_data = data.data;
        overallData = $rootScope.raw_data;
    
        $scope.adminsName = overallData.adminList;
        $rootScope.examType = overallData.examType["ReportingLive"];
        $scope.subjectNameArray = overallData.subjectList;

        $scope.$watch('radioGroup', function(newVal, oldVal) {

            console.log(newVal);
            if (newVal == true) {
                $rootScope.examType = [];
                $rootScope.examType = overallData.examType["ReportingLive"];
            } else {
                $rootScope.examType = [];
                $rootScope.examType = overallData.examType["Deaddline"];
            }
        }, true);
    });

    $scope.reloadRoute = function() {
        $route.reload();
    }

    $rootScope.reportingLiveCheckBox = true;
    $rootScope.HomeworkCheckBox = false;
    $rootScope.numberOfReviewsTextBox = 0;
    $scope.reviewRequired = [];
    $scope.radioGroup = true;


   

    $scope.$watch('numberOfTutors', function(newVal, oldVal) {
        if (newVal != undefined) {
            console.log("change in value " + newVal);
            $rootScope.numberOfReviewsTextBox = newVal;
            $scope.numberRev = newVal;
        } else {
            console.log("change in value " + newVal);
            $scope.numberRev = null;
        }
    }, true);

    $scope.range = function(n) {
        return new Array(n);
    };

    $scope.loadProgressBarAddButton = false;
    $scope.showSimpleToast = function(msg) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(msg)
            .position('top right')
            .hideDelay(2000)
        );
    };
    $scope.showConfirm = function(ev) {

        var confirm = $mdDialog.confirm()
            .title('Would you like to add this into database ?')
            .targetEvent(ev)
            .ok('Agree')
            .cancel('Sorry I am High');

        $mdDialog.show(confirm).then(function() {
            $scope.loadProgressBarAddButton = true;
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
                    $scope.loadProgressBarAddButton = false;
                    if (data.error != undefined) {

                        $scope.showSimpleToast("Something Went Wrong! Try Again");

                    } else {
                        $scope.showSimpleToast("Success ! Your Deal Added to Database. ");
                        $scope.myForm.$setUntouched();
                        $scope.obj = {};
                    }

                })
                .error(function(data, status, headers, config) {
                    $scope.loadProgressBarAddButton = false;
                    $scope.showSimpleToast("Something Went Wrong! Try Again");

                })
        }, function() {
            // No codition
        });


    };

    $scope.submit = function() {

        $scope.showConfirm();
        $scope.obj.numberOfTutors = $scope.numberOfTutors;
        $scope.obj.ratingArray = [];
        $scope.obj.ratingArray = $scope.reviewRequired;
        $scope.obj.typeOfDeal;

        if ($scope.radioGroup) {
            $scope.obj.dealType = "Live Session";
        } else {
            $scope.obj.dealType = "Deadline Session";
        }

        $scope.obj.timeFrom = moment($scope.startTime).toISOString();
        $scope.obj.timeTo = moment($scope.endTime).toISOString();
     
        if ($scope.obj.numberOfTutors == undefined) {
            $scope.obj.numberOfTutors = 0;
        }

        $scope.obj.duration = $scope.duration.toString();
        $scope.obj.statusCode = 100;
        console.log($scope.obj);
      


    };

    $scope.reset = function() {
        $scope.obj = {};
        $scope.obj.$setPristine();
        $scope.obj.$setUntouched();
    }


});

app.controller('viewdealsController', function($scope, $http, $timeout, $rootScope, $mdDialog, ViewDealsService, ViewAllDealsService, GetOverallDataService,viewDealOnDateService,bsLoadingOverlayService) {


   
    $scope.show = false;

   // $scope.overallData = true;
    $scope.textAdd = " ";
    
    $scope.changeView = function() {
        $scope.show = true;
    }
    $scope.closeSearchView = function() {
        $scope.show = false;
        $scope.liveSessionSearchText = '';
    }

    //$scope.myDate = new Date();
    $scope.getDate = function(){
        if($scope.myDate != undefined){
            bsLoadingOverlayService.start();
            console.log($scope.myDate);
            $scope.newDateForApi = moment($scope.myDate).format('YYYY-MM-DD');
            $scope.textAdd = "FOR " + moment($scope.myDate).format('DD-MM-YYYY');
            console.log($scope.newDateForApi);
             var lookup = viewDealOnDateService.viewDealonDay($scope.newDateForApi);
                lookup.then(
                        function success(data) {
                            console.log(data.data);
                            //plotProducts(data);
                             $scope.dataSeperator(data.data);

                             bsLoadingOverlayService.stop();
                        },
                        function error(response) {
                            console.log(response);
                            bsLoadingOverlayService.stop();
                        });

        }
    }



    $scope.dataSeperator = function(data) {
        $rootScope.deadlineData = [];
        $rootScope.liveSession = [];

        var statusCodeArray = [100, 200, 300, 400, 500, 600, 700];
        angular.forEach(data, function(value, key) {
            if (value.dealType == "Deadline Session") {
                if (value.timeTo != undefined) {
                    value["timeToFormat"] = moment(value.timeTo).format('DD-MM-YYYY HH:mm');
                }
                $rootScope.deadlineData.push(value);

                //var dateMonthAsWord = moment("2014-02-27T10:00:00").format('DD-MMM-YYYY');

            } else {
                if (value.timeTo != undefined) {
                    value["timeToFormat"] = moment(value.timeTo).format('DD-MM-YYYY HH:mm');
                }
                if (value.createdAt != undefined) {
                    value["timeFromFormat"] = moment(value.createdAt).format('DD-MM-YYYY HH:mm');
                }
                $rootScope.liveSession.push(value);
            }

            value["numberOfTutors"] = value.ratingArray.length;

            value["statusCode"] = statusCodeArray[Math.floor(Math.random() * statusCodeArray.length)];
            $scope.statusObj = MyNameSpace.helpers.getStatusName(value.statusCode);
            value['statusObj'] = $scope.statusObj;
        });

        console.log($rootScope.deadlineData);
        $rootScope.deadlineDataCopy = angular.copy($rootScope.deadlineData);
        $rootScope.liveSessionCopy = angular.copy($rootScope.liveSession);
    }


    var lookup = ViewAllDealsService.getService();
    lookup.then(function(data) {
        $rootScope.raw_data = data.data;
        $scope.dataSeperator(data.data);
        $scope.copyOriginalData = angular.copy(data.data);
        var overAlldata = GetOverallDataService.getService();
        overAlldata.then(function(data) {
            $rootScope.raw_overall_data = data.data;
            console.log($rootScope.raw_overall_data);

        })

    });
    //YY-MM-DD
   
                
            

    $scope.query = {
        order: 'createdTime',
        limit: 3,
        page: 1
    };
    $scope.query1 = {
        order: 'timeTo',
        limit: 3,
        page: 1
    };

    $scope.refreshLiveData = function() {

        $scope.dataSeperator($scope.copyOriginalData);


    }


    $scope.newFilteroption = function(argument) {
        if (argument != undefined) {

        }
    }

    $scope.filterOptions = ["Reporting Live", "Homework"];

    console.log($scope.filterByOption);

    $scope.$watch('filterByOption', function(newVal, oldVal) {
        if (newVal == "Reporting Live") {

        } else {
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
                    overalldata: $rootScope.raw_overall_data
                },
                clickOutsideToClose: false
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };


    $scope.showAdvancedLive = function(ev, data) {
        console.log("coming inside Live ");
        $mdDialog.show({
                controller: DialogControllerLive,
                templateUrl: 'snapqaTemplate/dealdialogLive.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    items: data,
                    overalldata: $rootScope.raw_overall_data
                },
                clickOutsideToClose: false
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    function DialogController($scope, $mdDialog, $rootScope, items, overalldata, $mdToast) {


        $scope.adminsName = overalldata.adminList;
        $scope.subjectNameArray = overalldata.subjectList;
        // console.log( overalldata);
        // $scope.subjectNameArray = ["Dynamics","Material Science" ,"Manufacturing","MOM","Organic Chemistry","Measurements","Engineering Eco","Control System"];

        $scope.statusMessage = ["Not Yet Assigned Tutor", "Tutor Assigned but not yet Confirmed", "Tutor Confirmed , Deal Ongoing", "Tutor does not solve", "Client Side error", "Got Answer , Not payment not Done", "Payment Done Finally"];
        $scope.data_deadline = items;
        $scope.data_deadline_copy = angular.copy($scope.data_deadline);
        console.log($scope.data_deadline);

        $scope.users = [{ name: "Mohit Kushwaha", phone: "7338496008" }, { name: "abhishek kumar", phone: "7501384719" }];
        // to input the status statusMsg
        $scope.statusObj = MyNameSpace.helpers.getStatusName($scope.data_deadline.statusCode);
        console.log($scope.statusObj);
        //$scope.theme = $scope.statusObj.statusColor;
        // $scope.statusMessageText = $scope.statusObj.statusMsg;


        //  $scope.radioGroupModel = $scope.data.typeOfDeal[0].value;
        if ($scope.data_deadline.dealType == "Deadline Session") {
            $scope.radioGroupModel = false;
        } else {
            $scope.radioGroupModel = true;
        }

        if ($scope.radioGroupModel) {
            // reporting live 
            $scope.examTypePreFilled = overalldata.examType["ReportingLive"];

        } else {
            $scope.examTypePreFilled = overalldata.examType["Deadline"];
        }

        $scope.$watch('radioGroupModel', function(newVal, oldVal) {

            console.log(newVal);
            if (newVal == true) {
                $scope.examTypePreFilled = [];
                $scope.examTypePreFilled = overalldata.examType["ReportingLive"];
            } else {
                $scope.examTypePreFilled = [];
                $scope.examTypePreFilled = overalldata.examType["Deadline"];
            }
        }, true);


        // console.log( $scope.radioGroupModel);
        $scope.loadProgressBar = false;
        $scope.editFormApiCallDeadline = function(obj) {
            var editObj = {
                "_id": obj._id,
                "data": obj
            };
            var editDataRequest = $http({
                method: 'POST',
                url: 'http://ec2-52-54-173-224.compute-1.amazonaws.com:7200/api/snapQA/admin/editDeal',
                data: editObj,
                headers: {
                    'Content-Type': "application/json"
                }
            });
            editDataRequest.success(function(data, status, headers, config) {

                    console.log(data);
                    $scope.loadProgressBar = false;
                    if (!data.error) {
                        $mdDialog.cancel();
                        $scope.showSimpleToast("Your Deal is Edited Successfully");
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                    $scope.loadProgressBar = false;
                    $mdDialog.cancel();
                    $scope.showSimpleToast("Something Failed! Try Again");
                })
        }

        console.log($scope.data_deadline);
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.showSimpleToast = function(msg) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(msg)
                .position('top right')
                .hideDelay(2000)
            );
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            if (!answer) {
                $mdDialog.cancel();
                $scope.data_deadline = angular.copy(items);
                $rootScope.deadlineData = angular.copy($rootScope.deadlineDataCopy);
                $rootScope.liveSession = angular.copy($rootScope.liveSessionCopy);
            } else {
                $scope.loadProgressBar = true;
                $scope.editFormApiCallDeadline($scope.data_deadline);
                //$mdDialog.cancel();
            }
        };
    }

    function DialogControllerLive($scope, $mdDialog, $rootScope, items, overalldata, $mdToast) {


        $scope.adminsName = overalldata.adminList;
        $scope.subjectNameArray = overalldata.subjectList;

        // console.log( overalldata);
        // $scope.subjectNameArray = ["Dynamics","Material Science" ,"Manufacturing","MOM","Organic Chemistry","Measurements","Engineering Eco","Control System"];

        $scope.statusMessage = ["Not Yet Assigned Tutor", "Tutor Assigned but not yet Confirmed", "Tutor Confirmed , Deal Ongoing", "Tutor does not solve", "Client Side error", "Got Answer , Not payment not Done", "Payment Done Finally"];
        $scope.data = items;
        // $scope.copy = angular.copy(items);
        console.log($scope.data);

        $scope.users = [{ name: "Mohit Kushwaha", phone: "7338496008" }, { name: "abhishek kumar", phone: "7501384719" }];
        // to input the status statusMsg
        $scope.statusObj = MyNameSpace.helpers.getStatusName($scope.data.statusCode);
        console.log($scope.statusObj);
        //$scope.theme = $scope.statusObj.statusColor;
        // $scope.statusMessageText = $scope.statusObj.statusMsg;


        //  $scope.radioGroupModel = $scope.data.typeOfDeal[0].value;
        if ($scope.data.dealType == "Deadline Session") {
            $scope.radioGroupModel = false;
        } else {
            $scope.radioGroupModel = true;
        }

        if ($scope.radioGroupModel) {
            // reporting live 
            $scope.examTypePreFilled = overalldata.examType["ReportingLive"];

        } else {
            $scope.examTypePreFilled = overalldata.examType["Deadline"];
        }

        $scope.$watch('radioGroupModel', function(newVal, oldVal) {

            console.log(newVal);
            if (newVal == true) {
                $scope.examTypePreFilled = [];
                $scope.examTypePreFilled = overalldata.examType["ReportingLive"];
            } else {
                $scope.examTypePreFilled = [];
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
        $scope.loadProgressBar = false;
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.showSimpleToast = function(msg) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(msg)
                .position('top right')
                .hideDelay(2000)
            );
        };


        $scope.editFormApiCall = function(obj) {
            var editObj = {
                "_id": obj._id,
                "data": obj
            };
            var editDataRequest = $http({
                method: 'POST',
                url: 'http://ec2-52-54-173-224.compute-1.amazonaws.com:7200/api/snapQA/admin/editDeal',
                data: editObj,
                headers: {
                    'Content-Type': "application/json"
                }
            });
            editDataRequest.success(function(data, status, headers, config) {

                    console.log(data);
                    $scope.loadProgressBar = false;
                    if (!data.error) {
                        $mdDialog.cancel();
                        $scope.showSimpleToast("Your Deal is Edited Successfully");
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                    $scope.loadProgressBar = false;
                    $mdDialog.cancel();
                    $scope.showSimpleToast("Something Failed! Try Again");
                })
        }

        $scope.answer = function(answer) {
            if (!answer) {
                $mdDialog.cancel();
                $scope.data = angular.copy(items);
                $rootScope.deadlineData = angular.copy($rootScope.deadlineDataCopy);
                $rootScope.liveSession = angular.copy($rootScope.liveSessionCopy);
            } else {
                $scope.loadProgressBar = true;
                $scope.editFormApiCall($scope.data);
            }
        };
    }

    // body...
})
