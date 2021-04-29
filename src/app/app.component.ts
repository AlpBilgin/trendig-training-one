import { Component, OnInit } from '@angular/core';
import * as tcc from 'test-coverage-comparison';
import * as SVG from 'svg.js';
import * as vis from 'vis';
import * as flowchart from 'flowchart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Trendig Teaching Tool 1';
  // read values
  snippet: string;
  testCases: string;

  // write values
  statementCoverage: number;
  branchCoverage: number;
  pathCoverage: number;

  constructor() {
    this.statementCoverage = 0;
    this.branchCoverage = 0;
    this.pathCoverage = 0;
  }

  ngOnInit() {
    // TODO eventually replace with a placeholder
    this.snippet = `
function code(a, b, c) {
  holder=a;
  a=b;
  b=holder;
    if(b<a){
      holder=a;
      a=b;
      b=holder;
        if(c<b){
          holder=a;
          a=b;
          b=holder;
        }
    }
    if(b<c){
      holder=a;
      a=b;
      b=holder;
    }
    return;
}
`;
    // TODO eventually replace with a placeholder
    this.testCases = '[{"a": 1,"b": 2,"c": 1}]';
  }

  onSubmit() {
    const cases = JSON.parse(this.testCases);
    const tester = new tcc.testCoverageComparison(this.snippet, cases);
    // Count the number of executed statements
    let counter = 0;
    let i;
    for (i = 0; i < tester.visitedNodesGUID.length; i++) {
      // Array scheme is [ nGUID : bVisited? ]
      if (tester.visitedNodesGUID[i]) {
        // if bVisited defined count up
        counter++;
      }
    }
    // The engine includes start node in the coverage metrics, this particular calculation removes one node from both values
    this.statementCoverage = (counter) / (i);
    this.branchCoverage = (tester.branchCoverage.length) / (tcc.edge.globalEdges.length);
    // Paths don't require a similar exclusion
    this.pathCoverage = tester.threadPaths.length / tcc.builder.parsedPaths.length;
    /*
        const diagram = flowchart.parse('st=>start: Start\n' +
          'e=>end:>http://www.google.com\n' +
          'op1=>operation: My Operation\n' +
          'op2=>operation: Stuff|current\n' +
          'sub1=>subroutine: My Subroutine\n' +
          'cond=>condition: Yes or No?\n:>http://www.google.com\n' + // use cond(align-next=no) to disable vertical align of symbols below
          'c2=>condition: Good idea|rejected\n' +
          'io=>inputoutput|request: catch something...\n' +
          '' +
          'st->op1(right)->cond\n' +
          'cond(yes, right)->c2\n' + // conditions can also be redirected like cond(yes, bottom) or cond(yes, right)
          'cond(no)->sub1(left)->op1\n' + // the other symbols too...
          'c2(true)->io->e\n' +
          'c2(false)->op2->e'  // allow for true and false in conditionals
        );
        diagram.drawSVG('chart');
    */

    // create an array with vertices
    const vertexArray = [];
    for (let j = 0; j < tester.visitedNodesGUID.length; j++) {
      const vertex = { id: j, label: j.toString() };
      if (tester.visitedNodesGUID[j]) {
        // if bVisited defined add group
        vertex['group'] = 'thread';
      }
      if (j === tester.visitedNodesGUID.length - 1) {
        vertex.label = 'end';
      } else if (j === 0) {
        vertex.label = 'start';
      }
      vertexArray.push(vertex);
    }
    // Convert array to vertex dataset
    const nodes = new vis.DataSet(vertexArray);

    // create an array with edges
    const edgeArray = [];
    for (let j = 0; j < tcc.edge.globalEdges.length; j++) {
      const current = tcc.edge.globalEdges[j];
      edgeArray.push({ from: current.parentGUID, to: current.childGUID });
    }
    // Convert array to edge dataset
    const edges = new vis.DataSet(edgeArray);

    // create a network
    const container = document.getElementById('chart');

    // provide the data in the vis format
    const data = {
      nodes: nodes,
      edges: edges
    };
    const options = {
      autoResize: true,
      height: '300px',
      width: '30%',
      edges: {
        arrows: 'to'
      },
      groups: {
        useDefaultGroups: true,
        thread: {
          color: { background: 'red' },
        }
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springConstant: 0.08,
          springLength: 100,
          damping: 0.4,
          avoidOverlap: 0
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        solver: 'forceAtlas2Based',
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          onlyDynamicEdges: false,
          fit: true
        },
        timestep: 0.5,
        adaptiveTimestep: true
      }
    };

    // initialize your network!
    const network = new vis.Network(container, data, options);



    /*

        // Make a deep copy of the global edge list for further processing
        const edgeList = JSON.parse(JSON.stringify(tcc.edge.globalEdges));
        let indent = 0;
        for (let j = 0; j < edgeList.length; j++) {


        }


        // Drawing the graphs
        // Do a preliminary pass to detemine the decision nodes
        const fanningPoints = [];
        for (let j = 0; j < tcc.edge.globalEdges.length; j++) {
          if (tcc.edge.globalEdges[j].logic === false) {
            fanningPoints.push(tcc.edge.globalEdges[j].parentGUID);
          }
        }
        // Sort decision nodes ascending
        fanningPoints.sort((a, b) => a > b ? 1 : 0);
        const canvasW = 300;
        const canvasH = 300;
        // Init SVG element in HTML node with id 'chart'
        const draw = SVG('chart').size(canvasW, canvasH);
        // Handles to nodes and edges will be kept in two arrays
        const graphNodes = [];
        const graphEdges = [];
        for (let j = 0; j < tcc.edge.globalEdges.length; j++) {
          console.log(j.toString(), tcc.edge.globalEdges[j]);
          let xPoint = 10;
          let yPoint = 10 + (11 * j);

          graphNodes.push(draw.circle(10).attr({ cx: xPoint, cy: yPoint, fill: '#555' }));
        }

    */


    /*
    console.log(tester.GUID);
    console.log(tester.visitedNodesGUID);
    console.log(tester.statementCoverage());
    console.log(tester.threadPaths);
    console.log(tester.branchCoverage);
    console.log(tcc.edge.globalEdges);
    */
  }
}
