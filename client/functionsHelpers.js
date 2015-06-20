helperFunctions = {

  // Creating the first population
  firstPop: function(colorNum, chromNum) {
    // Assign each color number to a real color and save it to sessions
    var cCounter = 0;
    var colorArray = [];
    while (cCounter < colorNum) {
      colorArray[cCounter] = {
        id: cCounter,
        color: randomColor()
      };
      cCounter++;
    }
    Session.set('colorArray', colorArray);

    // Process the population
    this.firstPopMake(colorNum, chromNum);

  },

  // Make a random chromosomes list, first population
  firstPopMake: function(colorNum, chromNum) {
    colorNum--;
    var matrix = Session.get('matrixMain');
    var dimen = Session.get('dimensions');
    var allChromes = [];
    var i, j;
    for(i=0; i<chromNum; i++ ) {
      allChromes[i] = [];
      for(j=0; j<dimen; j++){
        allChromes[i][j] = _.random(0, colorNum);
      }
    }
    Session.set('firstPopArray', allChromes);
  },

  // Process two-dimensional array of chromosomes
  // Sending row by row to actual fitness function
  fitnessStack: function(thisArray) {
    var chrom = Session.get('chroms');
    var dimen = Session.get('dimensions');
    var smallArray = [];
    var i, j;
    var d;
    var resultArray = [];
    for(i = 0; i < chrom; i++) {
      // Empty one-dimen array everytime
      smallArray = [];
      for(j =0; j < dimen; j++){
        smallArray[j] = thisArray[i][j];
      }
      d = this.fitness(smallArray);
      resultArray[i] = d;
    }
    return resultArray;
  },

  // Fitness one-dimensional array only, actual fitness rating
  fitness: function(smallArray) {
    var bad = 0;
    var matrix = Session.get('matrixMain');
    var n = smallArray.length;
    var i,j;

    for(i = 0; i < n; i++) {
      for(j = 0; j < n; j++) {
        if(smallArray[i] == smallArray[j] && matrix[i][j] == 1) {
          bad++; // Less bad is better in our pointing system
          // Using bad so it works with our genetic system
        }
      }
    }
    return bad;
  },

  // Prepare inputs.
  // First create a matrix array from inputs, then converts it to D3 list
  // and then calls drawGraph method using the list object.
  prepGraph: function() {
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
    Session.set('matrixMain', matrix_row);

    // convert to list
    var names =[];
    var links = [],
      n = matrix_row.length;

    var i = -1; while (++i < n) {
      names.push({"name": i});
      var j = -1; while (++j < n) {
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
  drawGraph: function (graph) {
    var width = 450,
      height = 450;

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
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var node = svg.selectAll(".node")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

    node.append("title")
      .text(function(d) { return d.name; });

    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
    });
  },

  matrixToList : function(matrix) {
    var links = [],
      n = matrix.length;

    var i = -1; while (++i < n) {
      var j = -1; while (++j < n) {
        links.push({
          source: i,
          target: j,
          value: matrix[i][j]
        });
      }
    }
    console.log(matrix);
    console.log(links);
    return links;
  },
  drawInput: function(rows) {
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
  }

};

