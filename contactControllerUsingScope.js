trpApp.controller('ContactCtrl',['$scope','$http','$q',function($scope,$http,$q) {
    $scope.contact = {};
    $scope.contact.country = 'USA';
    $scope.submittingForm = false;
    $scope.formSubmitted = false;

    $scope.postFormData = function(data) {
        var dfd = $q.defer();
        $http({
            url: "scripts/contact-us.php",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param(data)
        }).success(function(res) {
            dfd.resolve(res);
        }).error(function(err) {
            dfd.reject(err);
        });
        return dfd.promise;
    };

    $scope.submitContactForm = function(event) {
        $scope.submittingForm = true;
        if(event.target.hasAttribute('disabled') && event.target.getAttribute('disabled') === 'disabled') {
            return false;
        }
        var data = $scope.contact;
        $scope.postFormData(data).then(function(res) {
            $scope.formSubmitted = true;
            document.body.style.cursor = 'auto';
            document.querySelector('#submittingButton').style.cursor = 'auto';
            if(res.toLowerCase().indexOf('error') !== -1) {
                $scope.submissionResponseTitle = "There was a problem sending your request.";
                $scope.submissionResponseBody = res;
                $('.form-submitted-additional-details').html('Please <a href="" data-ng-click="formSubmitted = false">try again</a> or email us directly at <a href="mailto:contact@textilerentalpartners.com">contact@textilerentalpartners.com</a>.');
            } else {
                $scope.submissionResponseTitle = "Thank you for contacting us.";
                $scope.submissionResponseBody = "We'll get back to you as soon as we can.";
            }
        });

    };

    $scope.clearContactForm = function() {
        $scope.contact = {};
        $scope.contactForm.$setPristine();
    };
}]);