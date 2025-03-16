const idMap = new Map()
idMap.set('baseHealth', 'sumHealth');
idMap.set('rawHealth', 'sumHealth');
idMap.set('baseDamage', 'sumDamage');
idMap.set('rawDamage', 'sumDamage');
idMap.set('baseEarthDamage', 'sumEarthDamage');
idMap.set('rawEarthDamage', 'sumEarthDamage');
idMap.set('baseThunderDamage', 'sumThunderDamage');
idMap.set('rawThunderDamage', 'sumThunderDamage');
idMap.set('baseWaterDamage', 'sumWaterDamage');
idMap.set('rawWaterDamage', 'sumWaterDamage');
idMap.set('baseFireDamage', 'sumFireDamage');
idMap.set('rawFireDamage', 'sumFireDamage');
idMap.set('baseAirDamage', 'sumAirDamage');
idMap.set('rawAirDamage', 'sumAirDamage');

function combineStats(groupedStats) {
    const keys = Object.keys(groupedStats);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        
        if (idMap.get(key) === undefined) continue;

        if (groupedStats[idMap.get(key)] === undefined) groupedStats[idMap.get(key)] = 0;
        groupedStats[idMap.get(key)] += groupedStats[key];
        delete groupedStats[key];
    }
}

// if a value is undefined, substitute in zero
function uZ(value) {
    return value === undefined ? 0 : value;
}

function getMultiplierForSkillPoints(sp) {
    return ((1 - Math.pow(0.9908, sp + 1)) / 0.0092 - 1) / 100;
}
