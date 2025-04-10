import { Component } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Color, ScaleType } from '@swimlane/ngx-charts';



@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [ NgxChartsModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.css'
})
export class ActivityComponent {


    // Main chart data
    chartData = [
      {
        name: 'Income',
        series: [
          { name: 'Jan', value: 50000 },
          { name: 'Feb', value: 80000 },
          { name: 'Mar', value: 60000 },
          { name: 'Apr', value: 90000 },
          { name: 'May', value: 70000 },
          { name: 'Jun', value: 120000 },
          { name: 'Jul', value: 100000 },
          { name: 'Aug', value: 150000 },
          { name: 'Sep', value: 130000 },
          { name: 'Oct', value: 180000 },
          { name: 'Nov', value: 160000 },
          { name: 'Dec', value: 226500 }
        ]
      },
      {
        name: 'Expense',
        series: [
          { name: 'Jan', value: 40000 },
          { name: 'Feb', value: 60000 },
          { name: 'Mar', value: 50000 },
          { name: 'Apr', value: 70000 },
          { name: 'May', value: 60000 },
          { name: 'Jun', value: 90000 },
          { name: 'Jul', value: 80000 },
          { name: 'Aug', value: 110000 },
          { name: 'Sep', value: 100000 },
          { name: 'Oct', value: 130000 },
          { name: 'Nov', value: 120000 },
          { name: 'Dec', value: 150000 }
        ]
      }
    ];
  
    // Activity chart data
    activityData = [
      {
        name: 'Spending',
        series: [
          { name: 'Mo', value: 10000 },
          { name: 'Tu', value: 16000 },
          { name: 'We', value: 20000 },
          { name: 'Th', value: 24000 },
          { name: 'Fr', value: 28000 },
          { name: 'Sa', value: 24000 },
          { name: 'Su', value: 14000 }
        ]
      },
      {
        name: 'Income',
        series: [
          { name: 'Mo', value: 5000 },
          { name: 'Tu', value: 6000 },
          { name: 'We', value: 8000 },
          { name: 'Th', value: 7000 },
          { name: 'Fr', value: 9000 },
          { name: 'Sa', value: 6000 },
          { name: 'Su', value: 5000 }
        ]
      }
    ];
  
    // Payment methods data
    paymentMethods = [
      { name: 'Account', amount: 24000, change: '+$1,200.00', icon: 'credit-card' },
      { name: 'Safaricom', amount: 34000, change: '+$1,840.00', icon: 'smartphone' },
      { name: 'Bank Transfer', amount: 42000, change: '+$2,100.00', icon: 'bank' },
      { name: 'Card', amount: 24000, change: '+$1,200.00', icon: 'credit-card' }
    ];
  
  

    colorScheme: Color = {
        name: 'customScheme',
        selectable: true,
        group: ScaleType.Ordinal, // 👈 Required for ordinal color scales
        domain: ['#7e22ce', '#f59e0b']
      };
  
    // activityColorScheme = {
    //   domain: ['#7e22ce', '#f59e0b']
    // };

    activityColorScheme: Color = {
      name: 'activity',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: ['#7e22ce', '#f59e0b']
    };
  
  
    // Other data
    balance = 41210;
    accountNo = '******';
    expenses = 41210;
    exchangeRate = '1 USD = 0.90 Euro';
    usdAmount = 23.576;
    euroAmount = 1.490;
  
    // Chart settings
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = false;
    showXAxisLabel = false;
    showYAxisLabel = false;
    autoScale = true;
    timeline = false;
    showGridLines = true;
    animations = true;


      // Add this method to your component class
  getIconPath(icon: string): string {
    const icons: { [key: string]: string } = {
      'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
      'smartphone': 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
      'bank': 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z'
    };
    return icons[icon] || '';
  }

  // ... rest of your component code ...


}
