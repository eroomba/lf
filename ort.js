const ortOps = {
    "ort-a": { 
        name: "ort-a", 
        type: "ort", 
        weight: 1.8,
        data: "a",
        content: "&forall;", 
        formula: () => { 
            return parseInt('00000011', 2); 
        }, 
        range: 8, 
        decay: 150,
        dformula: [
            {name: "spk-b1", type: "spek"},
            {name: "spk-c2", type: "spek"}
        ] 
    },
    "ort-b": { 
        name: "ort-b", 
        type: "ort",
        weight: 1.8,
        data: "b", 
        content: "&bowtie;",
        formula: () => { 
            return parseInt('00001100', 2); 
        }, 
        range: 8,
        decay: 150,
        dformula: [
            {name: "spk-c1", type: "spek"},
            {name: "spk-d2", type: "spek"},
        ]  
    },
    "ort-c": { 
        name: "ort-c", 
        type: "ort",
        weight: 1.8,
        data: "c", 
        content: "&comp;",
        formula: () => { 
            return parseInt('00110000', 2); 
        }, 
        range: 8,
        decay: 150,
        dformula: [
            {name: "spk-d1", type: "spek"},
            {name: "spk-a2", type: "spek"},
        ] 
    },
    "ort-d": { 
        name: "ort-d", 
        type: "ort",
        weight: 1.8,
        data: "d", 
        content: "&part;",
        formula: () => { 
            return parseInt('11000000', 2); 
        }, 
        range: 10,
        decay: 160,
        dformula: [
            {name: "spk-a1", type: "spek"},
            {name: "spk-b2", type: "spek"}
        ] 
    },
    "ort-p": { 
        name: "ort-p", 
        type: "ort",
        weight: 1.9,
        data: "p", 
        content: "&fork;",
        formula: () => { 
            return parseInt('00111100', 2); 
        }, 
        range: 10,
        decay: 170,
        dformula: [
            {name: "spk-x1", type: "spek"},
            {name: "spk-g1", type: "spek"}
        ] 
    },
    "ort-e": { 
        name: "ort-e", 
        type: "ort",
        weight: 1.7,
        data: "e", 
        content: "&sum;",
        formula: () => { 
            return parseInt('11000011', 2); 
        }, 
        range: 10,
        decay: 170,
        dformula: [
            {name: "spk-x2", type: "spek"},
            {name: "spk-g2", type: "spek"}
        ] 
    }
};

let ortOpsSel = Object.keys(ortOps);
let ortDataSel = new Array();

function updateOrt(ort) {

    if (ort.life != null)
        ort.life--;
    
    if (ort.life != null && ort.life <= 0 && ort.active) {
        let sA = Math.floor(Math.random() * 360);
        ort.ops.dformula.forEach((di) => {
            let nops = {};
            switch (di.type) {
                case "spek":
                    nops = spekOps[di.name];
                    break;
                case "ort":
                    nops = ortOps[di.name];
                    break;
                case "snip":
                    nops = snipOps[di.name];
                    break;
            }
            let nDir = sA;
            sA += 120;
            sA = sA % 360;
            let aX = 5 * Math.cos(nDir * Math.PI / 180);
            let aY = 5 * Math.sin(nDir * Math.PI / 180);
            let nVel = Math.floor(Math.random() * 9) + 4;
            let ndobj = new LItem(new LVector(ort.pos.x + aX, ort.pos.y + aY, nDir, nVel), nops, {gen:lf.step});
            lf.queueItem(ndobj);
        });
        ort.deactivate();
    }
    else {
        let closeOrts = lf.query(ort, "ort");
        let chVal = "";
        let nv = ort.pos.vel;
        let ndr = ort.pos.dir;
        let tv = 1;

        let snipC = [];
        let snipVal = ort.ops.data;
        for (let sc = 0; sc < closeOrts.length; sc++) {
            snipC.push(closeOrts[sc]);
            snipVal += closeOrts[sc].ops.data;
            nv += closeOrts[sc].pos.vel;
            ndr += closeOrts[sc].pos.dir;
            if (snipC.length == 2) break;
        }

        let validSnip = false;
        let snipType = null;
        Object.keys(snipOps).forEach((sn) => {
            if (!validSnip) {
                snipType = snipOps[sn].formula(snipVal); 
                if (snipType != null && snipType.length > 0) {
                    validSnip = true;
                }
                else {
                    snipType = null;
                }
            }
        });

        if (validSnip) {
            for (let sc = snipC.length - 1; sc >= 0; sc--) snipC[sc].deactivate();

            let nDir = ndr / 3;
            let nVel = nv / 3;
            let nsnip = new LItem(new LVector(ort.pos.x, ort.pos.y, nDir, nVel), snipOps[snipType], { gen: lf.step, code: snipVal, len: snipVal.length });
            lf.queueItem(nsnip);
            
            ort.deactivate();
        }
    }

    if (ort.active) {
        ort.pos.move(ort.ops.weight);
        ort.obj.style.left = ort.pos.x + "px";
        ort.obj.style.top = ort.pos.y + "px";
        ort.obj.style.rotate = "z " + ort.pos.dir + "deg";

        lf.encode(ort,'u');
    }
    else {
        ort.obj.style.display = "none";
    }
}