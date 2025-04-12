import { Component, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { curveCardinal } from 'd3-shape';



@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})
export class ActivityComponent {
  @HostListener('window:resize', ['$event'])

  usdToEuroRate = 0.90;
  dollarAmount = 23.576;
  euroAmount_ = +(this.dollarAmount * this.usdToEuroRate).toFixed(3);

  chartData: any[] = [];
  colorScheme: Color = {
    name: 'financialColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#6A2CE5', '#F9CB40']
  };
  colorScheme1: Color = {
    name: 'financialColors',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#facc15', '#6A2CE5'],   // yellow-400 for spent, purple-600 for earning
  };
  curve = curveCardinal.tension(0.5);
  view: [number, number] = [window.innerWidth - 64, 400];



  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.generateChartData();
    window.addEventListener('resize', () => {
      this.view = [window.innerWidth - 64, 400];
    });
  }

  swapCurrencies() {
    const temp = this.dollarAmount;
    this.dollarAmount = this.euroAmount;
    this.euroAmount = +(temp / this.usdToEuroRate).toFixed(3);
  }

  generateChartData(): void {
    // Sample data to match the chart in the screenshot
    this.chartData = [
      {
        name: 'Income',
        series: [
          { name: 'Jan', value: 200000 },
          { name: 'Feb', value: 350000 },
          { name: 'Mar', value: 50000 },
          { name: 'Apr', value: 250000 },
          { name: 'May', value: 300000 },
          { name: 'Jun', value: 224000 },
          { name: 'Jul', value: 50000 },
          { name: 'Aug', value: 200000 },
          { name: 'Sep', value: 800000 },
          { name: 'Oct', value: 250000 },
          { name: 'Nov', value: 50000 },
          { name: 'Dec', value: 200000 }
        ]
      },
      {
        name: 'Expenses',
        series: [
          { name: 'Jan', value: 120000 },
          { name: 'Feb', value: 50000 },
          { name: 'Mar', value: 150000 },
          { name: 'Apr', value: 80000 },
          { name: 'May', value: 180000 },
          { name: 'Jun', value: 300000 },
          { name: 'Jul', value: 50000 },
          { name: 'Aug', value: 250000 },
          { name: 'Sep', value: 200000 },
          { name: 'Oct', value: 300000 },
          { name: 'Nov', value: 350000 },
          { name: 'Dec', value: 250000 }
        ]
      }
    ];
  }

  // Other data
  balance = 41210;
  accountNo = '=====';
  expenses = 41210;
  exchangeRate = '1 USD = 0.90 Euro';
  usdAmount = 23.576;
  euroAmount = 1.490;

  xAxisFormat(val: string): string {
    return val;
  }

  yAxisFormat(val: number): string {
    if (val === 0) return '0';
    if (val === 100000) return '100K';
    if (val === 300000) return '300K';
    if (val === 900000) return '900K';
    if (val >= 1000000) return (val / 1000000).toFixed(0) + ' M';
    return val.toString();
  }

  onSelect(event: any): void {
    console.log('Item clicked', event);
  }


  // activity chart

  chartData1 = [
    {
      name: 'Mo',
      series: [
        { name: 'Spent', value: 4000 },
        { name: 'Earning', value: 9000 },
      ],
    },
    {
      name: 'Tu',
      series: [
        { name: 'Spent', value: 5000 },
        { name: 'Earning', value: 12000 },
      ],
    },
    {
      name: 'We',
      series: [
        { name: 'Spent', value: 6000 },
        { name: 'Earning', value: 14000 },
      ],
    },
    {
      name: 'Th',
      series: [
        { name: 'Spent', value: 8000 },
        { name: 'Earning', value: 16000 },
      ],
    },
    {
      name: 'Fr',
      series: [
        { name: 'Spent', value: 7000 },
        { name: 'Earning', value: 17000 },
      ],
    },
    {
      name: 'Sa',
      series: [
        { name: 'Spent', value: 6500 },
        { name: 'Earning', value: 15500 },
      ],
    },
    {
      name: 'Su',
      series: [
        { name: 'Spent', value: 4500 },
        { name: 'Earning', value: 9000 },
      ],
    },
  ];

  // payment card

  items = [
    {
      id: 1,
      name: 'Accounts',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.553467" y="0.187256" width="42.5097" height="41.2083" rx="8.32639" fill="#6A2CE5" fill-opacity="0.2"/>
        <path d="M28.185 9.75195H15.4321C13.668 9.75195 12.2439 11.1654 12.2439 12.9083V24.5028C12.2439 26.2457 13.668 27.6591 15.4321 27.6591H16.2398C17.09 27.6591 17.8977 27.9886 18.4928 28.5837L20.3101 30.3798C21.139 31.1981 22.4887 31.1981 23.3177 30.3798L25.135 28.5837C25.7301 27.9886 26.5484 27.6591 27.388 27.6591H28.185C29.9492 27.6591 31.3732 26.2457 31.3732 24.5028V12.9083C31.3732 11.1654 29.9492 9.75195 28.185 9.75195ZM21.8086 13.7372C23.1795 13.7372 24.2848 14.8425 24.2848 16.2134C24.2848 17.5844 23.1795 18.6896 21.8086 18.6896C20.4376 18.6896 19.3324 17.5737 19.3324 16.2134C19.3324 14.8425 20.4376 13.7372 21.8086 13.7372ZM24.6567 23.6314H18.9604C18.0996 23.6314 17.6001 22.6749 18.0783 21.9629C18.801 20.8895 20.2038 20.1668 21.8086 20.1668C23.4133 20.1668 24.8161 20.8895 25.5388 21.9629C26.017 22.6749 25.5069 23.6314 24.6567 23.6314Z" fill="#6A2CE5"/>
        </svg>
        `),
      current: 300,
      total: 500,
    },
    {
      id: 2,
      name: 'Software',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.553955" y="0.390991" width="42.5097" height="41.2083" rx="8.32639" fill="#6A2CE5" fill-opacity="0.2"/>
<path d="M26.0605 21.3165V27.0446C26.0605 29.5315 24.4026 31.1787 21.9264 31.1787H15.3162C12.84 31.1787 11.1821 29.5315 11.1821 27.0446V18.7871C11.1821 16.3003 12.84 14.6531 15.3162 14.6531H19.3865C20.4811 14.6531 21.5332 15.0888 22.309 15.8646L24.849 18.3939C25.6248 19.1697 26.0605 20.2218 26.0605 21.3165Z" fill="#6A2CE5"/>
<path d="M32.4365 16.5977V22.3259C32.4365 24.8021 30.7786 26.46 28.3024 26.46H27.1228V21.3163C27.1228 19.9454 26.5701 18.6063 25.603 17.6392L23.0631 15.1099C22.096 14.1428 20.7569 13.5902 19.386 13.5902H17.5793C17.7706 11.3797 19.3754 9.92371 21.6922 9.92371H25.7625C26.8571 9.92371 27.9092 10.3594 28.685 11.1352L31.2249 13.6752C32.0007 14.451 32.4365 15.5031 32.4365 16.5977Z" fill="#6A2CE5"/>
</svg>

        `),
      current: 250,
      total: 500,
    },
    {
      id: 3,
      name: 'Rent House',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.553955" y="0.406372" width="42.5097" height="41.2083" rx="8.32639" fill="#6A2CE5" fill-opacity="0.2"/>
<path d="M21.0871 11.0337H14.4662C12.3513 11.0337 11.2886 12.1071 11.2886 14.2432V31.2258H17.0274V27.2405C17.0274 26.8048 17.3887 26.4434 17.8244 26.4434C18.2602 26.4434 18.6215 26.7941 18.6215 27.2405V31.2258H24.254V14.2432C24.254 12.1071 23.2019 11.0337 21.0871 11.0337ZM20.4813 21.3954H15.2207C14.785 21.3954 14.4237 21.0341 14.4237 20.5984C14.4237 20.1626 14.785 19.8013 15.2207 19.8013H20.4813C20.917 19.8013 21.2783 20.1626 21.2783 20.5984C21.2783 21.0341 20.917 21.3954 20.4813 21.3954ZM20.4813 17.4101H15.2207C14.785 17.4101 14.4237 17.0488 14.4237 16.6131C14.4237 16.1774 14.785 15.816 15.2207 15.816H20.4813C20.917 15.816 21.2783 16.1774 21.2783 16.6131C21.2783 17.0488 20.917 17.4101 20.4813 17.4101Z" fill="#6A2CE5"/>
<path d="M33.4999 30.4287H31.0875V27.2404C32.0971 26.911 32.8304 25.9651 32.8304 24.8493V22.7238C32.8304 21.3316 31.6932 20.1945 30.301 20.1945C28.9088 20.1945 27.7717 21.3316 27.7717 22.7238V24.8493C27.7717 25.9545 28.4944 26.8897 29.4827 27.2298V30.4287H10.1196C9.68384 30.4287 9.32251 30.79 9.32251 31.2257C9.32251 31.6614 9.68384 32.0228 10.1196 32.0228H30.2373C30.2585 32.0228 30.2691 32.0334 30.2904 32.0334C30.3117 32.0334 30.3223 32.0228 30.3435 32.0228H33.4999C33.9356 32.0228 34.2969 31.6614 34.2969 31.2257C34.2969 30.79 33.9356 30.4287 33.4999 30.4287Z" fill="#6A2CE5"/>
</svg>

        `),
      current: 150,
      total: 500,
    },
    {
      id: 4,
      name: 'Food',
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="44" height="42" viewBox="0 0 44 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.553955" y="0.421875" width="42.5097" height="41.2083" rx="8.32639" fill="#6A2CE5" fill-opacity="0.2"/>
<path d="M15.433 13.3023C14.9973 13.3023 14.636 12.941 14.636 12.5052V10.6454C14.636 10.2097 14.9973 9.84839 15.433 9.84839C15.8688 9.84839 16.2301 10.2097 16.2301 10.6454V12.5052C16.2301 12.9516 15.8688 13.3023 15.433 13.3023Z" fill="#6A2CE5"/>
<path d="M19.684 13.3023C19.2483 13.3023 18.887 12.941 18.887 12.5052V10.6454C18.887 10.2097 19.2483 9.84839 19.684 9.84839C20.1197 9.84839 20.4811 10.2097 20.4811 10.6454V12.5052C20.4811 12.9516 20.1197 13.3023 19.684 13.3023Z" fill="#6A2CE5"/>
<path d="M23.935 13.3023C23.4993 13.3023 23.1379 12.941 23.1379 12.5052V10.6454C23.1379 10.2097 23.4993 9.84839 23.935 9.84839C24.3707 9.84839 24.7321 10.2097 24.7321 10.6454V12.5052C24.7321 12.9516 24.3707 13.3023 23.935 13.3023Z" fill="#6A2CE5"/>
<path d="M32.7023 21.9424C32.7023 19.158 30.5449 16.905 27.8243 16.6712C27.0379 15.3852 25.635 14.5138 24.0197 14.5138H16.1873C13.7217 14.5138 11.7131 16.5224 11.7131 18.9879V19.5512H28.4938V18.9879C28.4938 18.786 28.4619 18.5841 28.4301 18.3928C29.971 18.8498 31.1082 20.2526 31.1082 21.9424C31.1082 23.6109 30.0029 25.0031 28.4938 25.4707V20.6139H11.7131V26.7672C11.7131 29.2328 13.7217 31.2413 16.1873 31.2413H24.0197C26.3577 31.2413 28.26 29.4347 28.4513 27.1392C30.8744 26.6503 32.7023 24.5036 32.7023 21.9424Z" fill="#6A2CE5"/>
</svg>

        `),
      current: 150,
      total: 500,
    }
  ];


}
