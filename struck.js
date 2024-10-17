const struckOps = { 
    "brane": {
        name: "brane", 
        type: "struck", 
        weight: 2.5,
        data: "brane", 
        content: "&compfn;",
        formula: () => { 
            return "brane"; 
        }, 
        range: 25, 
        decay: 400,
        dformula: []
    },
    "blip": {
        name: "blip", 
        type: "struck", 
        weight: 2,
        data: "blip", 
        content: "&compfn;",
        formula: () => { 
            return "blip"; 
        }, 
        range: 20, 
        decay: 300,
        dformula: []
    }
};

function updateStruck(struck) {

    if (struck.life != null)
        struck.life--;
    
    if (struck.life != null && struck.life <= 0 && struck.active) {
        struckDecay(struck);
        struck.deactivate();
    }

    if (struck.active) {
        struck.pos.move(struck.ops.weight);
        struck.obj.style.left = struck.pos.x + "px";
        struck.obj.style.top = struck.pos.y + "px";
        struck.obj.style.rotate = "z " + struck.pos.dir + "deg";

        if (struck.ops.name == "blip") {
            if (struck.life < 40) struck.obj.style.opacity = struck.life / 100;
        }

        lf.encode(struck,'u');
    }
    else {
        struck.obj.style.display = "none";
    }
}

function struckDecay(struckName, pos) {
    let nDir = Math.floor(Math.random() * 360);
    switch (struckName) {
        case "brane":
            let degradeCount = 2;
            let snipCount = lf.branecount - degradeCount;
            let oA = Math.floor(Math.random() * 360);
            for (let b = 0; b < lf.branecount - degradeCount; b++) {
                let nDir = oA;
                let dX = 15 * Math.cos(nDir * Math.PI / 180);
                let dY = 15 * Math.sin(nDir * Math.PI / 180);
                let nVel = Math.floor(Math.random() * 10) + 5;
                let nDobj = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), snipOps["snp-blk"], {gen: lf.step,code:"ppp",len: 3});
                lf.queueItem(nDobj);
                oA += 360 / snipCount;
                oA = oA % 360;
            }
            oA = Math.floor(Math.random() * 360);
            let oCount = degradeCount * 3;
            for (let pp = 0; pp < oCount; pp++) {
                let dForm = ortOps["ort-p"].ops.dformula;
                dForm.array.forEach((spOps) => {
                    let nDir = oA;
                    let dX = 8 * Math.cos(nDir * Math.PI / 180);
                    let dY = 8 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 9) + 4;
                    let nSobj = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), spekOps[spOps.name], {gen: lf.step});
                    lf.queueItem(nSobj);
                    oA += 360 / oCount;
                    oA = oA % 360;
                });
            }
            break;
        case "blip":
            // dissolves into nothing since it came from nothing
            break;
    }
}