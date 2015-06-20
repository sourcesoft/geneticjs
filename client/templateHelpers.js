Template.section2.helpers({
  colors: function() {
    return Session.get('colorArray');
  },
  dimensions: function() {
    return Session.get('dimensions');
  },
  chroms: function() {
    return Session.get('chroms');
  }
});

Template.section2table.helpers({
  tableOutput: function() {
    // Need this for background-color
    var c = Session.get('colorArray');
    // Number of columns is same as nodes
    var h = Session.get('dimensions');
    // If firstPopArray is undefined yet: first-pop btn haven't happened yet
    var m = Session.get('firstPopArray') || '';
    var headers = '';
    var matrixOut = '';

    // Adding fitness column
    var fitnessCol = helperFunctions.fitnessStack(m);

    if(m != '') {
      for (var i = 0; i < h; i++) {
        var headers = headers +
          '<th class="tooltipped" data-position="top" ' +
          'data-tooltip="شماره نود">'
          + i + '</th>';
      }
      headers = headers + '<th class="fitness-col">شایستگی<th>';
      var dimen = Session.get('dimensions');
      var chrom = Session.get('chroms');
      for (var j = 0; j < chrom; j++) {
        var matrixOut = matrixOut + '<tr class="tooltipped"' +
          ' data-position="bottom" data-tooltip="شماره ردیف یا کروموزوم: '
          + j + '" >';
        for (var k = 0; k < dimen; k++) {
          thisCounter = m[j][k];
          var thisObject = c[thisCounter];
          var matrixOut = matrixOut + '<td ' +
            'style="background-color: ' +
            thisObject.color + ' ">' + thisCounter + '</td>';
        }
        // Adding fittness answer to last column of each row
        matrixOut = matrixOut + '<td class="fitness-col">'
          + fitnessCol[j] + '</td>';
        var matrixOut = matrixOut + '</tr>';
      }
    }

    var tableArray = {
      headers: headers,
      matrixOutput: matrixOut
    };


    Meteor.setTimeout(function(){
      // Initialize tooltips.
      $('.tooltipped').tooltip({delay: 50});
    }, 1000);

    return tableArray;
  }
});


Template.section1.events({
  'click button.gen-graph': function () {
    helperFunctions.prepGraph();
    Materialize.toast('شکل گراف بروز شد!', 3000);
  },

  // Change matrix dimensions
  'change .dimen': function () {
    $('#frm').html('');
    var rows = $('#row').val() || 8;
    // Number of colors default is number of nodes
    Session.set('dimensions', rows);
    // Number of chromosomes default is number of nodes*7
    Session.set('chroms', rows * 7); // dim * 7
    helperFunctions.drawInput(rows);
    Materialize.toast('ابعاد آرایه ماتریکس تغییر یافت', 2000);
  },

  // Draw new matrix input in D3
  'change .matrix_cell': function () {
    helperFunctions.prepGraph();
    Materialize.toast('بروزرسانی اتصالات نودها', 800);
  }
});

Template.section2.events({
  // First Population
  'click #first-pop': function () {
    // Number of colors default is number of nodes
    var colorNum = $('#colorNum').val() || Session.get('dimensions');
    // Number of chromosomes default is number of nodes*7
    var chromNum = $('#chromNum').val() || Session.get('dimensions')*7;
    helperFunctions.firstPop(colorNum, chromNum);
    Materialize.toast('جمعیت اولیه تولید شد', 3000);
  },
  'change #chromNum': function() {
    Session.set('chroms', $('#chromNum').val());
  }
});


