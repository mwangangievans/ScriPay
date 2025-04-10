import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-index',
  standalone: true,
  imports: [ CommonModule  ,NgxChartsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  // view: any[] = [200, 200]; // More compact for dashboard card
  view: [number, number] = [200, 200];


  // Pie chart options
  gradient = false;
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

}
