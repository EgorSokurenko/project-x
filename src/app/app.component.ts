import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Data from '../data/zero-one.json';  
import { Chart, registerables} from 'chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('generalChart', { static: false })
  private generalChart
  generalLineChart: any
  data = Data
  FIND_SEQUENCE = [0,0,1,1,0,0,1,0,0,1]
  count: any = []
  dataAfter:any = []
  COUNT_AFTER = 10
  backgroundColor = [
    'rgba(255, 99, 132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    '#2F195F',
    '#FAA6FF',
    '#192110',
    '#192110',
    '#79427F',
    'rgba(255, 99, 132,1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
]


  ngOnInit(){
    this.findSequence()
  }
  ngAfterViewInit() {
    this.renderCharts('generalLineChart', this.generalChart.nativeElement)
  }

  findSequence(){
    this.count = []
    this.dataAfter = []
    for(let i = 0; i < this.data.length; i++){
      let isEqual = false
      for(let s = 0;s < this.FIND_SEQUENCE.length; s++){
        isEqual = this.data[i+s] === +this.FIND_SEQUENCE[s]
        if(!isEqual)break
      }
      if(isEqual)this.count.push({from:i, to: i+this.FIND_SEQUENCE.length-1})
    }
    for(let i=0; i<this.count.length; i++){
      let from = this.count[i].to + 1
      let to =  from + this.COUNT_AFTER 

      this.dataAfter.push(this.data.slice(from, to))
    }

    // ONLY FOR CHARTS
    this.dataAfter = this.dataAfter.map(a=>{
      let initial = 0
      return a.map((current)=>{
        if(current){
          initial += current
          return initial
        }else{
          initial = initial-1
          return initial
        }
      })
    })
  }
  
  renderCharts(prop, el){
    const labels = []
    const data:any = []
    for(let i = 1; i <= this.COUNT_AFTER; i++){labels.push(i)}
    for(let i = 0; i < this.dataAfter.length; i++){
      data.push({
        label: 'Count '+(i+1),
        data: this.dataAfter[i],
        backgroundColor: [
            this.backgroundColor[i]
        ],
        borderColor: [
          this.backgroundColor[i],
        ],
        borderWidth: 1
    })
      
    }
    if (this[prop]) {
      this[prop].data.datasets = data
      // this[prop].data.labels = labels
      return this[prop].update()
    }
    this[prop] = new Chart(el, {
      type: 'line',
      data: {
        labels: labels,
        datasets: data,
      },
      options: {
          responsive: true,
      }
  })
  }

  updateSequence(event){
    // document.querySelector("#divChart").innerHTML = ''
    this.FIND_SEQUENCE = event.target.value.split(',')
    this.findSequence()
    this.renderCharts('generalLineChart', this.generalChart.nativeElement)
  }



}
