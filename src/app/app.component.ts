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

  constructor() {
    this.statementCoverage = 0;
  }

  ngOnInit() {
    // TODO eventually replace with a placeholder
    this.snippet = `
function code(a, b, c) {
    if(b<a){
        if(c<b){
        }
    }
    if(b<c){
    }
    return;
}
`;
    // TODO eventually replace with a placeholder
    this.testCases = '[{"a": 1,"b": 1,"c": 1},{"a": 1,"b": 0,"c": 1}]';
  }

  onSubmit() {
    const cases = JSON.parse(this.testCases);
    console.log(cases);
    const tester = new tcc.testCoverageComparison(this.snippet, this.testCases);
    this.statementCoverage = tester.statementCoverage();
  }
}
