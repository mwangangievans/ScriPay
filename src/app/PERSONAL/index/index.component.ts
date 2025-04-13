import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { curveBasis } from 'd3-shape';



@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ CommonModule  ,NgxChartsModule ,RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  view: [number, number] = [700, 300]; // default
  resizeObserver!: ResizeObserver;

  // view: [number, number] = [700, 300];
  // view: [number, number] = [window.innerWidth - 64, 300];


    // Chart options
    showXAxis = true;
    showYAxis = true;
    gradient = true;
    showXAxisLabel = false;
    showYAxisLabel = false;
    xAxisLabel = 'Month';
    yAxisLabel = 'Amount';
    curve = curveBasis;


    colorScheme1: Color = {
      name: 'financialColors',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: ['#7c4dff']
    };

// Chart data
moneyFlowData = [
  {
    "name": "Money Flow",
    "series": [
      { "name": "Jan", "value": 30 },
      { "name": "Feb", "value": 62 },
      { "name": "Mar", "value": 42 },
      { "name": "Apr", "value": 55 },
      { "name": "May", "value": 85 },
      { "name": "Jun", "value": 72 }
    ]
  }
];




  // view: any[] = [200, 200]; // More compact for dashboard card
  view1: [number, number] = [200, 200];


  // Pie chart options
  gradient1 = false;
  showLegend = false;
  showLabels = false;
  isDoughnut = true;

  // colorScheme = {
  //   domain: ['#A259FF', '#D9D9D9', '#2D2D2D', '#4CE1F3'],
  // };

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal, // 👈 Required for ordinal color scales
    domain: ['#A259FF', '#D9D9D9', '#2D2D2D', '#4CE1F3'],
  };

  // Chart data
  single = [
    { name: 'Shoping', value: 4000 },
    { name: 'Workspace', value: 2000 },
    { name: 'Platform', value: 1500 },
    { name: 'Entertainments', value: 2631 },
  ];


  ngAfterViewInit(): void {
    this.setChartView();

    this.resizeObserver = new ResizeObserver(() => {
      this.setChartView();
    });

    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  setChartView(): void {
    if (this.chartContainer) {
      const width = this.chartContainer.nativeElement.offsetWidth;
      this.view = [width, 300];
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
