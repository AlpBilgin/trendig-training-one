import { Component, OnInit } from '@angular/core';
import * as tcc from 'test-coverage-comparison';
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
    this.testCases = '[{"a": 1,"b": 2,"c": 1},{"a": 1,"b": 0,"c": 1}]';
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
    this.statementCoverage = (counter - 1) / (i - 1);
    this.branchCoverage = (tester.branchCoverage.length - 1) / (tcc.edge.globalEdges.length - 1);
    // Paths don't require a similar exclusion
    this.pathCoverage = tester.threadPaths.length / tcc.builder.parsedPaths.length;
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
