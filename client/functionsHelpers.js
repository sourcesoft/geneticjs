helperFunctions = {
  popArray: [],
  colorArray: [],
  dimensions: 8,
  chroms: 56,
  matrixMain: [],
  chromNum: 56,
  popArray3: [],

  // Creating the first population
  firstPop: function () {
    var dimen = this.dimensions;
    // Number of colors default is number of nodes
    var colorNum = $('#colorNum').val() || dimen;
    // Number of chromosomes default is number of nodes*7
    var chromNum = $('#chromNum').val() || dimen * 7;
    // Assign each color number to a real color and save it to sessions
    var colorArray = this.colorProcess(colorNum);

    // Generate random normal array of chromosomes
    colorNum--;
    var matrix = this.matrixMain;
    var allChromes = [];
    var i, j;
    for (i = 0; i < chromNum; i++) {
      allChromes[i] = [];
      for (j = 0; j < dimen; j++) {
        allChromes[i][j] = _.random(0, colorNum);
      }
    }

    // Process only fitness column first
    var fitnessCol = this.fitnessStack(allChromes, dimen, chromNum);
    console.log(fitnessCol);

    // Reorder fitness column and chromosomes column both
    var fitnessSorted = this.fitnessSort(allChromes, fitnessCol, dimen);

    this.popArray = fitnessSorted;
    console.log(fitnessSorted);

    return this.tableOutput(fitnessSorted.a, fitnessSorted.f, colorArray,
      dimen, chromNum);
  },

  // Process two-dimensional array of chromosomes
  // Sending row by row to actual fitness function
  fitnessStack: function (thisArray, dimen, chrom) {
    var smallArray = [];
    var i, j;
    var d;
    var resultArray = [];
    for (i = 0; i < chrom; i++) {
      // Empty one-dimen array everytime
      smallArray = [];
      for (j = 0; j < dimen; j++) {
        smallArray[j] = thisArray[i][j];
      }
      d = this.fitness(smallArray);
      resultArray[i] = d;
    }
    return resultArray;
  },

  // Fitness one-dimensional array only, actual fitness rating
  fitness: function (smallArray) {
    //console.log(smallArray);
    var bad = 0;
    var matrix = this.matrixMain;
    var n = smallArray.length;
    var i, j;

    for (i = 0; i < n; i++) {
      for (j = 0; j < n; j++) {
        if (smallArray[i] == smallArray[j] && matrix[i][j] == 1) {
          bad++; // Less bad is better in our pointing system
          // Using bad so it works with our genetic system
        }
      }
    }
    return bad;
  },

  // Fitness reorder based on result. smaller numbers on top
  // all: allchromes 2-dim
  // f: fitness column 1-dim
  fitnessSort: function (all, f, dimen) {
    var fPop = f.slice(); // Not Sorted, another copy we're going to ruin

    var fClone = f.slice(); // Sorted! now let's link it to chromes!
    fClone.sort(function (a, b) {
      return a - b;
    });

    var length = f.length; // Also same as chromNum
    var newAll = []; // New allchromes 2-dem sorted
    var temp = []; // Stores f array sorted index numbers
    var sortedIndex;
    var i, j, k, l;

    for (i = 0; i < length; i++) {
      for (j = 0; j < length; j++) {
        if (fClone[i] == fPop[j]) {
          temp.push(j);
          fPop[j] = -1;
          break;
        }
      }
    }
    for (k = 0; k < length; k++) {
      sortedIndex = temp[k];
      newAll[k] = [];
      for (l = 0; l < dimen; l++) {
        newAll[k][l] = all[sortedIndex][l];
      }
    }

    var result = {
      f: fClone,
      a: newAll
    };
    return result;
  },

  // m2: all chromes 2-dimension array
  // fitnessCol: fitness col
  // c: color array
  // h: dimen
  // chrom: number of chroms
  // dontColor: don't color these last indexes(or rows)
  tableOutput: function (m2, fitnessColf, c, h, chrom, dontColor) {
    var dontColor = dontColor || 0;
    var headers = '';
    var matrixOut = '';
    var thisObject = {};
    var thisCounter;

    // Which indexes won't get color styles
    var u;
    var indexOfDontColor = 0;
    for (u = 0; u < dontColor; u++) {
      // Value will start from last indexes
      indexOfDontColor = m2.length - u - 1;
    }

    if (m2 != '') {
      // Printing headers
      for (var i = 0; i < h; i++) {
        var headers = headers +
          '<th class="tooltipped" data-position="top" ' +
          'data-tooltip="شماره نود">'
          + i + '</th>';
      }
      headers = headers + '<th class="fitness-col">شایستگی<th>';
      // Printing rows
      for (var j = 0; j < chrom; j++) {
        var matrixOut = matrixOut + '<tr class="tooltipped"' +
          ' data-position="bottom" data-tooltip="شماره ردیف یا کروموزوم: '
          + j + '" >';

        // Printing rows
        for (var k = 0; k < h; k++) {
          var thisCounter = m2[j][k];
          var thisObject = c[thisCounter];
          if (thisObject != undefined) { // If this chrom exist in colors
            var matrixOut = matrixOut + '<td ' +
              'style="background-color: ' +
              thisObject.color + ' ">' + thisCounter + '</td>';
          } else { // If it doesn't it's a new row after tarkib
            var matrixOut = matrixOut + '<td ' +
              '>' + thisCounter + '</td>';
          }
        }

        // Adding fitness answer to last column of each row
        matrixOut = matrixOut + '<td class="fitness-col">'
          + fitnessColf[j] + '</td>';
        var matrixOut = matrixOut + '</tr>';
      }
    }

    var tableArray = {
      headers: headers,
      matrixOutput: matrixOut
    };

    Meteor.setTimeout(function () {
      // Initialize tooltips.
      $('.tooltipped').tooltip({delay: 50});
    }, 1000);

    return tableArray;
  },

  // Prepare inputs.
  // First create a matrix array from inputs, then converts it to D3 list
  // and then calls drawGraph method using the list object.
  prepGraph: function () {
    // Get matrix
    var matrix_row = [];

    var ind = 0;

    //create matrix
    $("#frm").contents().each(function (i, e) {
      if (this.nodeName == "INPUT") {
        if (!matrix_row[ind]) {
          matrix_row.push([]);
        }
        matrix_row[ind].push($(this).val());
      } else {
        ind++;
      }
    });
    // Other functions use this array, we'll make it accessible
    //Session.set('matrixMain', matrix_row);
    this.matrixMain = matrix_row;

    // convert to list
    var names = [];
    var links = [],
      n = matrix_row.length;

    var i = -1;
    while (++i < n) {
      names.push({"name": i});
      var j = -1;
      while (++j < n) {
        links.push({
          source: i,
          target: j,
          value: matrix_row[i][j]
        });
      }
    }
    var newGraphList = {
      "nodes": names,
      "links": links
    };

    // Now Actually draw Graph using D3 library
    this.drawGraph(newGraphList);
  },

  // D3 codes
  drawGraph: function (graph) {
    var width = 350,
      height = 350;

    // First remove previous drawings
    d3.select("svg").remove();

    color = d3.scale.category20();

    force = d3.layout.force()
      .charge(-120)
      .linkDistance(120)
      .size([width, height]);

    svg = d3.select(".graph").append("svg")
      .attr("width", width)
      .attr("height", height);

    force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    var link = svg.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function (d) {
        return Math.sqrt(d.value);
      });

    var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function (d) {
        return color(d.group);
      })
      .call(force.drag);

    node.append("title")
      .text(function (d) {
        return d.name;
      });

    force.on("tick", function () {
      link.attr("x1", function (d) {
        return d.source.x;
      })
        .attr("y1", function (d) {
          return d.source.y;
        })
        .attr("x2", function (d) {
          return d.target.x;
        })
        .attr("y2", function (d) {
          return d.target.y;
        });

      node.attr("cx", function (d) {
        return d.x;
      })
        .attr("cy", function (d) {
          return d.y;
        });
    });
  },

  drawInput: function (rows) {
    var columns = rows;
    var form = document.getElementById("frm");
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        var input = $('<input type="number" size="1">')
          .attr({
            class: 'matrix_cell input-field',
            value: 0
          });
        form.appendChild(input[0]);
      }
      var br = $('<br>')[0];
      form.appendChild(br);
    }
  },

  // Assign each color number to a real color
  // store it in object in a good structire
  // and save it to sessions
  colorProcess: function (colorNum) {
    var cCounter = 0;
    var colorArray = [];
    while (cCounter < colorNum) {
      colorArray[cCounter] = {
        id: cCounter,
        color: randomColor()
      };
      cCounter++;
    }
    //Session.set('colorArray', colorArray);
    this.colorArray = colorArray;
    return colorArray;
  },

  tarkib: function () {
    var dimen = $('#row').val() || 8;
    // Number of colors default is number of nodes
    var colorNum = $('#colorNum').val() || dimen;
    // Number of chromosomes default is number of nodes*7
    var chromNum = $('#chromNum').val() || dimen * 7;
    // Number of chromosomes default is number of nodes*7
    //var popArray = Session.get('popArray');
    var popArray = this.popArray;
    //console.log(popArray);

    // Generate 2 random indexes
    var chromZero = chromNum - 1;
    var one = _.random(0, chromZero);
    var sw = 0;
    // Making sure they're not same index
    while (sw == 0) {
      var two = _.random(0, chromZero);
      if (two != one)
        sw = 1;
    }

    return this.tableOutput3(popArray, dimen, chromNum, one, two);
  },

  tableOutput3: function (popArray, dimen, chromNum, one, two) {
    var dimenZero = dimen - 1;

    var all = popArray.a;
    var fitnessCol = popArray.f;

    var i, r, r2;
    var firstTable = '';
    var secondTable = '';
    var firstSelected = [];
    var secondSelected = [];
    var firstSelectedC = [];
    var secondSelectedC = [];
    var firstF, secondF;
    //var secondFixed[];

    // Print 2 random chromosomes
    firstTable = firstTable + '<tr>';
    for (i = 0; i < dimen; i++) {
      // Also create new one-dim array
      firstSelected[i] = all[one][i];
      // Print
      firstTable = firstTable + '<td>' + all[one][i] + '</td>';
    }
    firstTable = firstTable + '</tr>';
    firstTable = firstTable + '<tr>';
    for (i = 0; i < dimen; i++) {
      // Also create new one-dim array
      secondSelected[i] = all[two][i];
      // Print
      firstTable = firstTable + '<td>' + all[two][i] + '</td>';
    }
    firstTable = firstTable + '</tr>';

    // Change structure for tarkib
    firstSelectedC = firstSelected.slice();
    secondSelectedC = secondSelected.slice();
    var tarkibNum = parseInt(dimen / 2);
    for (i = 0; i < tarkibNum; i++) {
      r = _.random(0, dimenZero);
      r2 = _.random(0, dimenZero);
      firstSelectedC[r] = secondSelected[r2];
      secondSelectedC[r] = firstSelected[r2];
    }
    // We changed tarkib

    // Print second
    // Print 2 random chromosomes
    secondTable = secondTable + '<tr>';
    for (i = 0; i < dimen; i++) {
      secondTable = secondTable + '<td>' + firstSelectedC[i] + '</td>';
    }
    secondTable = secondTable + '</tr>';
    secondTable = secondTable + '<tr>';
    for (i = 0; i < dimen; i++) {
      secondTable = secondTable + '<td>' + secondSelectedC[i] + '</td>';
    }
    secondTable = secondTable + '</tr>';

    // Adding 2 news tarkib rows to end of all chromes table
    // Also add selected to end of old popArray to print all the table later
    for (i = 0; i < dimen; i++) {
      all[chromNum] = [];
      all[chromNum][i] = firstSelectedC[i];
      all[chromNum + 1] = [];
      all[chromNum + 1][i] = secondSelectedC[i];
    }

    // Fitness for new columns
    firstF = this.fitness(firstSelectedC);
    fitnessCol.push(firstF);
    secondF = this.fitness(secondSelectedC);
    fitnessCol.push(secondF);


    this.chromNum = chromNum;

    // Printing first two columns
    var tableOutput = {
      one: one,
      two: two,
      first: firstTable,
      second: secondTable
    };

    // To print new chromosomes again
    var result = {
      f: fitnessCol,
      a: all
    };
    this.popArray3 = result;

    return tableOutput;
  }

};


