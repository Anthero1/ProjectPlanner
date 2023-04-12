const calculateRanks = () => {
    let criteria = JSON.parse(sessionStorage.getItem("critList"));
    let comparisons = JSON.parse(sessionStorage.getItem("compList"));
    let numOfCrits = criteria.length;
    let weightMatrix = [];
    let normMatrix = [];
    for(let iter = 0; iter < numOfCrits; iter++){
        weightMatrix.push([0,0,0,0]);
        weightMatrix[iter][iter]=1;
        normMatrix.push([0,0,0,0]);
        normMatrix[iter][iter]=1;
    }
    console.log(weightMatrix);
    console.log(normMatrix);
    let tracker = 0;
    for(let i = 0; i < numOfCrits; i++){
        for(let x = i+1; x < numOfCrits; x++){
            if(comparisons[tracker]>0){
                weightMatrix[x][i]=comparisons[tracker];
                weightMatrix[i][x]=1/comparisons[tracker];
                normMatrix[x][i]=comparisons[tracker];
                normMatrix[i][x]=1/comparisons[tracker];
            }else{
                weightMatrix[x][i]=1/(-comparisons[tracker]);
                weightMatrix[i][x]=-comparisons[tracker];
                normMatrix[x][i]=1/-comparisons[tracker];
                normMatrix[i][x]=-comparisons[tracker];
            }
            tracker++;
        }
    }
    console.log(weightMatrix);
    
    let normCoeffs = [];
    let tot = 0;

    for(let i = 0; i < numOfCrits; i++){
        tot = 0;
        for(x = 0; x < numOfCrits; x++){
            tot+=weightMatrix[x][i]
        }
        normCoeffs.push(tot);
    }
    console.log(normCoeffs);

    let priorityVector = [];
    for(let i = 0; i < numOfCrits; i++){
         tot = 0;
        for(let x = 0; x < numOfCrits; x++){
            normMatrix[i][x]=normMatrix[i][x]/normCoeffs[x];
            tot+=normMatrix[i][x];
        }
        tot=tot/numOfCrits;
        priorityVector.push(tot);
    }
    console.log(priorityVector);
}

const loadRanks = () => {
    if(sessionStorage.getItem("critRanks")==null){calculateRanks()};
}

loadRanks();