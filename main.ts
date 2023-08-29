import { plantList, PlantHash, stringOfPlants } from './hash.js';
import { domValue, listener, checkTestValues, convertData, dataTabs } from './functions.js'
import { autocomplete } from "./autocomplete.js"
import Chart from 'chart.js/auto'


let selectedPlants: any[] = [];
let divHeight: number = 700;

listener('plant-submit', 'click', search);
listener('plant-clear', 'click', clear);
listener('soil-test-submit', 'click', nutrientChart);
listener('reset-all', 'click', reset);

function reset() {
  let response = confirm('Are you sure you want to reset everything?')
  if (response == true) {
    window.location.reload();
  } else {
    return null;
  }
}

//instance of plantHash class as ph
const ph = new PlantHash(1061);

//Creates multidimensional array of plants and ph values
let list = plantList(stringOfPlants.plants);

//function that makes a list of jus the plant names.
//this is used for the autocomplete function below
function plantOnlyList(list: string[][]): string[] {
  let plantList = [];
  for (let i = 0; i < list.length / 3; i++) {
    plantList.push(list[i][0])
  }
  return plantList;
}

//using autocomplete function to recommend plants to the user.
autocomplete(document.getElementById("plant-search"), plantOnlyList(list));


//populating hash table with values from list and storing data
for (let i = 0; i < list.length / 3; i++) {
  ph.insert(list[i][0], list[i][1], list[i][2])
}

//function for clearing the selected plant array and html elements
function clear() {
  let response = confirm('Do you want to clear your selected plants?')
  if (response == true) {
    selectedPlants = [];
    document.getElementById('selected-plants')?.remove();
    let newDiv = document.createElement('div');
    newDiv.id = 'selected-plants';
    document.getElementById('plant-search-area')?.appendChild(newDiv);
    const plantSearch = <HTMLInputElement>document.getElementById('plant-search');
    plantSearch.value = ''
    console.log('cleared');
  } else {
    return null;
  }
}

//function that searches for plant in hash table
function search() {
  let searchWord = domValue('plant-search')
  let result: any = ph.search(searchWord);
  //if plant is not in hash table, alert user
  if (result === null) {
    alert('Plant is not in database. Please try again.')
    console.log('unable to find plant...')
    //if plant is in hash table, add to selectedPlants array
  } else {
    //checks to see if plant is already in selectedPlants array
    for (let i = 0; i < selectedPlants.length; i++) {
      if (selectedPlants[i].name == result.name) {
        alert('Plant already selected. Please select another plant.')
        return null;
      }
    }
    //will execute if plant isn't in selectedPlants array
    //push and sort selectedPlants array
    selectedPlants.push(result);
    selectedPlants.sort((a, b) => a.name.localeCompare(b.name));
    //create new div 
    let newDiv = document.createElement('div');
    newDiv.innerHTML = result.name;
    document.getElementById('selected-plants')?.appendChild(newDiv);
    console.log(selectedPlants);
    const plantSearch = <HTMLInputElement>document.getElementById('plant-search')
    plantSearch.value = ''

    //adding space if plant selection is greater than 22 in array
    if (selectedPlants.length > 22) {
      divHeight = divHeight + 30;
      let div = document.getElementById('soil-form');
      div!.style.height = `${divHeight}px`;
    };
  }
}

// optional function to also find the average ph of the plants you selected
// currently not in use
///////////////////////////////////////////////////////////////////////////
function findAverage(): number[] {
  let middle: number = 0;
  let average: number[] = [];
  for (let i = 0; i < selectedPlants.length; i++) {
    let diff = selectedPlants[i].high - selectedPlants[i].low;
    middle = middle + (selectedPlants[i].low + (diff / 2));
  }
  for (let i = 0; i < selectedPlants.length; i++) {
    average.push(middle / selectedPlants.length);
  }

  return average;
}

//using chart.js to create a bar chart and validate values
function nutrientChart() {
  //validate values and convert to number array
  let dataArr: any | null = checkTestValues();
  let theData: any[][];

  if (dataArr == null) {
    return null;
  } else {

    //display chart containers and canvas elements
    let container1 = document.getElementById('chart-container-1');
    let container2 = document.getElementById('chart-container-2');

    container1!.innerHTML = '';
    container2!.innerHTML = '';
    container1!.style.display = 'flex';
    let ctx2 = document.createElement('canvas');


    let height = ((selectedPlants.length - 3) * 35) + 200;

    ctx2.id = 'ph-chart';
    container2?.appendChild(ctx2);
    //if plant list is empty, it will not create chart
    if (selectedPlants.length == 0) {
      container2!.style.display = 'none';
    } else {
      container2!.style.display = 'flex';
      container2!.style.height = `${height}px`;
    }

    let ctx = document.createElement('canvas');
    ctx.id = 'nutrient-chart';
    container1?.appendChild(ctx);
    let displayall = document.getElementById('chart-container-1-l')

    displayall!.style.display = 'flex';




    // checks to see if dataArr is null and if not runs convertData function
    if (dataArr === null) {
      return null;
    }
    else {
      //conveerts data if array is full
      theData = convertData(dataArr);
    }

    //creates tabs for chart from functions.js
    dataTabs(theData, dataArr);

    let plantNames: string[] = [];
    let phLevels: number[][] = [];
    let phLine: number[][] = [];
    //let averagePh: number[] = findAverage();

    for (let i = 0; i < selectedPlants.length; i++) {
      plantNames.push(selectedPlants[i].name);
      phLevels.push([selectedPlants[i].low, selectedPlants[i].high]);
    }

    for (let i = 0; i < selectedPlants.length; i++) {
      phLine.push(dataArr[0]);
    }

    //setting chart.js defaults 
    Chart.defaults.font.size = 16;
    Chart.defaults.borderColor = 'black';

    // using chart.js to create a bar chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['pH', 'P', 'K', 'OM', 'CEC'],
        datasets: [{
          label: 'Nutrient Level',
          data: [theData[0][0], theData[1][0], theData[2][0], theData[3][0], theData[4][0]],
          backgroundColor: [theData[0][1], theData[1][1], theData[2][1], theData[3][1], theData[4][1]],
          borderColor: [theData[0][2], theData[1][2], theData[2][2], theData[3][2], theData[4][2]],
          borderWidth: 2,
          barThickness: 15
        }]
      },
      options: {

        plugins: {
          legend: {
            display: false
          },
          title: {
            text: 'Soil Levels',
            display: true,
            color: 'black'
          },

        },

        scales: {
          x: {
            title: {
              display: true,
              text: 'Nutrients',
              color: 'black'
            },
            ticks: {
              color: 'black',

            },
            grid: {
              display: true,
              drawOnChartArea: true,
              drawTicks: true
            },

          },
          y: {
            max: 6,
            min: 0,
            type: 'linear',
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              autoSkip: false,
              color: 'black',
              maxTicksLimit: 7,
              callback: ((context, index) => {
                let response;
                if (context === 1) {
                  response = 'Very Low'
                } else if (context === 2) {
                  response = 'Low'
                } else if (context === 3) {
                  response = 'Medium'
                } else if (context === 4) {
                  response = 'Optimal'
                } else if (context === 5) {
                  response = 'Excessive'
                } else if (context === 6) {
                  response = ''
                }
                return response;
              })

            },
            grid: {
              color: ['black', 'black', 'black', 'green', 'black', 'black'],
              lineWidth: [1, 1, 1, 2, 1, 1],

            }

          }
        }
      }
    });
    console.log(plantNames, phLevels, phLine)
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: plantNames,
        datasets: [{
          label: 'Plant pH',
          data: phLevels,
          backgroundColor: 'rgba(0,51,13,0.8)',
          borderColor: 'rgba(0,26,6,1)',
          borderWidth: 2,
          barThickness: 15,
          order: 2
        },
        {
          label: 'Test pH Level',
          data: phLine,
          type: 'line',
          backgroundColor: 'orange',
          borderColor: 'orange',
          borderWidth: 3,
          order: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            text: 'Plant pH Ranges',
            display: true,
            color: 'black'
          }
        },
        indexAxis: 'y',
        scales: {
          y: {
            grid: {
              display: true,
              drawOnChartArea: true,
              drawTicks: true,
              color: 'black'
            },
            ticks: {
              color: 'black',

            }
          },

          x: {
            title: {
              display: true,
              text: 'pH Range',
              color: 'black'
            },
            beginAtZero: false,
            grid: {
              display: true,
              drawOnChartArea: true,
              drawTicks: true
            },
            ticks: {
              stepSize: 0.5,
              color: 'black',

            }
          }
        }
      }
    });


  }
}



