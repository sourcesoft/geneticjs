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
    helperFunctions.dimensions = rows;
    // Number of chromosomes default is number of nodes*7
    helperFunctions.chroms = rows * 7; // dim * 7
    helperFunctions.drawInput(rows);
    Materialize.toast('ابعاد آرایه ماتریکس تغییر یافت', 2000);
  },

  // Draw new matrix input in D3
  'change .matrix_cell': function () {
    helperFunctions.prepGraph();
    Materialize.toast('بروزرسانی اتصالات نودها', 800);
  }
});

Template.section2.helpers({
  colors: function () {
    return helperFunctions.colorArray;
  },
  dimensions: function () {
    return helperFunctions.dimensions;
  },
  chroms: function () {
    return helperFunctions.chroms;
  }
});

Template.section2table.helpers({
  tableOutput: function () {
    Session.get('section2Update');
    var output = helperFunctions.firstPop();
    return output;
  }
});

Template.section2.events({
  // First Population
  'click #first-pop': function () {
    Session.set('section2Update', new Date());
    Materialize.toast('جمعیت اولیه تولید شد', 3000);
  },
  'change #chromNum': function () {
    helperFunctions.chroms = $('#chromNum').val();
  }
});

Template.section3.events({
  // Tarkib
  'click #tarkib': function () {
    // Triggers section3table helper which trigers tarkib()
    Session.set('section3Update', new Date());
    Materialize.toast('ترکیب انجام شد', 3000);
  }
});

Template.section3table.helpers({
  tableOutput: function () {
    Session.get('section3Update');
    var output = helperFunctions.tarkib();
    return output;
  },
  tableOutputAll: function () {
    //var newTable = Session.get('popArray3');
    var newTable = helperFunctions.popArray3;
    //console.log(newTable);
    //var colorArray = Session.get('colorArray');
    var colorArray = helperFunctions.colorArray;
    //var dimen = Session.get('dimensions');
    var dimen = helperFunctions.dimensions;
    //var chromNum = Session.get('chromNum');
    var chromNum = helperFunctions.chromNum;
    return helperFunctions.tableOutput(newTable.a, newTable.f, colorArray,
      dimen, chromNum);
  }
});

