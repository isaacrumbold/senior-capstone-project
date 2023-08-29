//function that creates event listeners for elements
export function listener(id: string, event: string, callback: () => void) {
    return document.getElementById(id)?.addEventListener(event, callback);
}

//gets value from desired dom feild
export function domValue(id: string): any {
    let value = (<HTMLInputElement>document.getElementById(id)).value;
    return value;
}

//validates values from soil test form
export function checkTestValues(): number[] | null {
    let soilResultsString: string[] = [domValue('pH'), domValue('phosphorus'), domValue('potassium'), domValue('OM'), domValue('CEC')];
    let soilResults: number[] = [];


    //converts string array to number array
    for (let i = 0; i < soilResultsString.length; i++) {
        if (soilResultsString[i] == '') {
            alert(`Please enter valid soil test results.\n
      pH: 0-14\n
      Phosphorus: 0-100\n
      Potassium: 0-250\n
      Organic Matter: 0-10\n
      CEC: 0-35\n`)
            return null
        } else {
            soilResults.push(parseFloat(soilResultsString[i]));
        }
    }

    //checks to see if values in soil test form are correct
    if (soilResults[0] >= 0 && soilResults[0] < 14.1 && soilResults[1] >= 0 && soilResults[1] < 100.1
        && soilResults[2] >= 0 && soilResults[2] < 250.1 && soilResults[3] >= 0 && soilResults[3] < 10.1
        && soilResults[4] >= 0 && soilResults[4] < 35.1) {

        return soilResults;
    }
    else {
        alert(`Please enter valid soil test results.\n
      pH: 0-14\n
      Phosphorus: 0-100\n
      Potassium: 0-250\n
      Organic Matter: 0-10\n
      CEC: 0-35\n`)
        return null;
    }
}

//converts soil test results to a number 1-5 for chart use
export function convertData(soilResult: number[]): any[][] {
    let convertedData: any[][] = [];
    const backgroundColor: string[] = ['rgba(255,0,0,0.8)', 'rgba(255,128,0,0.8)', 'rgba(280,280,0,0.8)', 'rgba(64,255,0,0.8)', 'rgba(0,51,13,0.8)'];
    const borderColor: string[] = ['rgba(179,0,0,1)', 'rgba(179,89,0,1)', 'rgba(179,179,0,1)', 'rgba(0,179,0,1)', 'rgba(0,26,6,1)'];
    const comparisonData: number[][] = [[5.2, 6, 6.5, 7.0, 7.1], [16, 25, 35, 50, 51], [61, 90, 130, 175, 176], [1, 1.9, 2.9, 3.9, 4], [6, 10, 14, 20, 21]];
    for (let i = 0; i < comparisonData.length; i++) {
        if (soilResult[i] < comparisonData[i][0]) {
            convertedData.push([1, backgroundColor[0], borderColor[0]])
        }
        else if (soilResult[i] <= comparisonData[i][1]) {
            convertedData.push([2, backgroundColor[1], borderColor[1]])
        }
        else if (soilResult[i] <= comparisonData[i][2]) {
            convertedData.push([3, backgroundColor[2], borderColor[2]])
        }
        else if (soilResult[i] <= comparisonData[i][3]) {
            convertedData.push([4, backgroundColor[3], borderColor[3]])
        }
        else {
            convertedData.push([5, backgroundColor[4], borderColor[4]])
        }
    }
    return convertedData;
}

export function dataTabs(colorArr: any[][], numArr: number[]): void {

    let phColor = document.getElementById('ph-color');
    let ph = document.getElementById('ph-number');

    let pColor = document.getElementById('p-color');
    let p = document.getElementById('p-number');

    let kColor = document.getElementById('k-color');
    let k = document.getElementById('k-number');

    let omColor = document.getElementById('om-color');
    let om = document.getElementById('om-number');

    let cecColor = document.getElementById('cec-color');
    let cec = document.getElementById('cec-number');

    if (phColor === null || ph === null || pColor === null || p === null || kColor === null || k === null || om === null || omColor === null || cecColor === null || cec === null) return
    else {
        phColor.style.backgroundColor = colorArr[0][1];
        ph.innerHTML = `${numArr[0]}`;

        pColor.style.backgroundColor = colorArr[1][1];
        p.innerHTML = `${numArr[1]}ppm`;

        kColor.style.backgroundColor = colorArr[2][1];
        k.innerHTML = `${numArr[2]}ppm`;

        omColor.style.backgroundColor = colorArr[3][1];
        om.innerHTML = `${numArr[3]}%`;

        cecColor.style.backgroundColor = colorArr[4][1];
        cec.innerHTML = `${numArr[4]}`;
    }
}