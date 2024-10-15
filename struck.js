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
    }
};

function updateStruck(struck) {

    if (struck.life != null)
        struck.life--;
    
    if (struck.life != null && struck.life <= 0 && struck.active) {
        let nDir = Math.floor(Math.random() * 360);
        switch (struck.name) {
            case "brane":
                let degradeCount = 2;
                let snipCount = lf.branecount - degradeCount;
                let oA = Math.floor(Math.random() * 360);
                for (let b = 0; b < lf.branecount - degradeCount; b++) {
                    let nDir = oA;
                    let dX = 15 * Math.cos(nDir * Math.PI / 180);
                    let dY = 15 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 10) + 5;
                    let nDobj = new LItem(new LVector(struck.pos.x + dX, struck.pos.y + dY, nDir, nVel), snipOps["snp-blk"], {gen: lf.step,code:"ppp",len: 3});
                    lf.queueItem(nDobj);
                    oA += 360 / snipCount;
                    oA = oA % 360;
                }


                break;
        }
        struck.deactivate();
    }

    if (struck.active) {
        struck.pos.move(struck.ops.weight);
        struck.obj.style.left = struck.pos.x + "px";
        struck.obj.style.top = struck.pos.y + "px";
        struck.obj.style.rotate = "z " + struck.pos.dir + "deg";

        lf.encode(struck,'u');
    }
    else {
        struck.obj.style.display = "none";
    }
}