Meteor.startup(function () {

  // Setting defaults
  Session.set('colorArray', []);
  Session.set('dimensions', '8');
  Session.set('chroms', '56'); // dim * 7

  var rows = 8;
  helperFunctions.drawInput(rows);
  helperFunctions.prepGraph();

  $('.button-collapse').sideNav({
      menuWidth: 240, // Default is 240
      edge: 'right', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );
});

