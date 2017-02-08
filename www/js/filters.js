angular.module('starter.filters', [])

// Setup the filter
.filter('ordinal', function() {

  // Create the return function
  // set the required parameter name to **number**
  return function(number) {

    // Ensure that the passed in data is a number
    if(isNaN(number) || number < 1) {

      // If the data is not a number or is less than one (thus not having a cardinal value) return it unmodified.
      return number;

    } else {

      // If the data we are applying the filter to is a number, perform the actions to check it's ordinal suffix and apply it.

      var lastDigit = number % 10;

      if(lastDigit === 1) {
        return number + 'st'
      } else if(lastDigit === 2) {
        return number + 'nd'
      } else if (lastDigit === 3) {
        return number + 'rd'
      } else if (lastDigit > 3) {
        return number + 'th'
      }

    }
  }
})

.filter('addzero', function() {

  // Create the return function
  // set the required parameter name to **number**
  return function(number) {

    // Ensure that the passed in data is a number
    if(isNaN(number) || number < 1) {

      // If the data is not a number or is less than one (thus not having a cardinal value) return it unmodified.
      return number;

    } else {

      // If the data we are applying the filter to is a number, perform the actions to check it's ordinal suffix and apply it.


      if(number < 10) {
        return '0' + number
      } else if(number >=10 ){
        return number
      } 
    }
  }
})


.filter('timeconvert', function() {

  // Create the return function
  // set the required parameter name to **number**
  return function(number) {

    // Ensure that the passed in data is a number
    if(isNaN(number)) {

      // If the data is not a number
      return number;

    } else {

      // If the data we are applying the filter to is a number, perform the actions to check it's ordinal suffix and apply it.
      var hrs=0;
      var min=0;
      var sec=0;

      if (number/3600>=1){
        var hrs=Math.floor(number/3600);
        var min=Math.floor((number-(hrs*3600))/60);
        var sec=(number-(hrs*3600)-(min*60));
        return hrs+':'+min +':'+ sec;
      }      
      else if (number/60>=1){
        var min=Math.floor(number/60);
        var sec=Math.floor(number-(min*60));
        return min +':'+ sec;
      }
      else if(number/60<1&&number/10>=1){
        var min=0;
        var sec=number;
        return min +':'+ sec;
      }
      else if(number/10<1){
        var min=0;
        var sec=number;
        return min +':'+ '0'+sec;
      }
    }
  }
});