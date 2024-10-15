const spekOps = {
    "spk-a1": { 
        // a1 combines w/a2 to form a
        name: "spk-a1", 
        type: "spek", 
        weight: 1.1,
        data: parseInt('00000011', 2), 
        content: "&ominus;", // circle with -
        formula: (val) => { 
            return val <= 3 ? 1 : 0 
        }, 
        range: 5, 
        decay: null, 
        dformula: [] 
    },
    "spk-a2": { 
        // a1 combines w/a2 to form a
        name: "spk-a2", 
        type: "spek",
        weight: 1.1, 
        data: parseInt('00000010', 2),
        content: "&oast;", // circle with asterisk
        formula: (val) => { 
            return val <= 5 && val > 3 ? val > 3 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: [] 
    },
    "spk-b1": { 
        // b1 combines w/b2 to form b
        name: "spk-b1", 
        type: "spek",
        weight: 1.1, 
        data: parseInt('00001100', 2),
        content: "&minusb;", // square with dash
        formula: (val) => { 
            return val <= 7 && val > 5 ? 1 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: [] 
    },
    "spk-b2": { 
        // b1 combines w/b2 to form b
        name: "spk-b2", 
        type: "spek",
        weight: 1.1, 
        data: parseInt('00001000', 2),
        content: "&sdotb;", // square with dot
        formula: (val) => { 
            return val <= 9 && val > 7 ? 1 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: [] 
    },
    "spk-c1": { 
        // c1 combines w/c2 to form c
        name: "spk-c1", 
        type: "spek",
        weight: 1.1, 
        data: parseInt('00110000', 2),
        content: "&odot;", // circle with dot
        formula: (val) => { 
            return val <= 11 && val > 9 ? 1 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: [] 
    },
    "spk-c2": { 
        // c1 combines w/c2 to form c
        name: "spk-c2", 
        type: "spek",
        weight: 1.1, 
        data: parseInt('00100000', 2),
        content: "&ocir;", // circle with ring
        formula: (val) => { 
            return val <= 13 && val > 11 ? 1 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: [] 
    },
    "spk-d1": { 
        // d1 can combine w/d2 to form d OR w/x1 to form p
        name: "spk-d1", 
        type: "spek",
        weight: 1.1, 
        data: parseInt('11000000', 2),
        content: "&timesb;", // square with x
        formula: (val) => { 
            return val <= 15 && val > 13 ? 1 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: [] 
    },
    "spk-d2": { 
        // d2 can combine w/d1 to form d OR w/x1 to form e
        name: "spk-d2", 
        type: "spek",
        weight: 1.1, 
        data: parseInt('10000100', 2),
        content: "&plusb;", // square with +
        formula: (val) => { 
            return val <= 17 && val > 15 ? 1 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: [] 
    },
    "spk-x1": { 
        // x1 is very ractive: x1 + d1 = p, x1 + g2 = e
        name: "spk-x1", 
        type: "spek",
        weight: 1.2, 
        data: parseInt('11000001', 2),
        content: "&otimes;", // circle with X
        formula: (val) => { 
            return val <= 19 && val > 17 ? 1 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: []
    },
    "spk-g1": { 
        name: "spk-g1", 
        type: "spek",
        weight: 1.3, 
        data: -1,
        content: "&trie;", // equal with triangle
        formula: (val) => { 
            return val <= 21 && val > 19 ? 1 : 0 
        }, 
        range: 5,
        decay: null,
        dformula: []
    },
    "spk-g2": { 
        name: "spk-g2", 
        type: "spek",
        weight: 1.4, 
        data: -1,
        content: "&eDot;", // equal with dots 
        formula: (val) => { 
            return val == 22 ? 1 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: [] 
    },
    "spk-g3": { 
        name: "spk-g3", 
        type: "spek",
        weight: 1.3,  
        data: -1,
        content: "&epar;", // equal with 2 crosses (hash) 
        formula: (val) => { 
            return val == 23 ? 1 : 0 
        }, 
        range: 5, 
        decay: null,
        dformula: [] 
    }
};

let spekOpsSel = Object.keys(spekOps);

function updateSpek(spek) {
    
    let closespeks = lf.query(spek, "spek");

    closespeks.forEach((c1) => {
        if (c1.active && c1.id != spek.id && spek.ops.data != c1.ops.data) {
            let join = spek.ops.data & c1.ops.data; 
            if (join > 0) {
                let comb = spek.ops.data | c1.ops.data;
                let tkID = "d-" + comb;
                if (tkID in ortDataSel) {
                    let tkKey = ortDataSel[tkID];
                    let daX = spek.pos.x - c1.pos.x;
                    let daY = spek.pos.y - c1.pos.y;
                    let dD = Math.hypot(daX, daY);
                    let dA =  (Math.atan2(daY, daX) * 180 / Math.PI) % 360;
                    let nVel = dD;
                    let nDir = Math.random() > 0.5 ? (dA - 180) % 360 : dA;
                    spek.deactivate();
                    c1.deactivate();

                    let nOrt = new LItem(new LVector(spek.pos.x, spek.pos.y, nDir, nVel), ortOps[tkKey],{gen:lf.step});
                    lf.queueItem(nOrt);
                    //console.log("spek COMB: " + daX + "," + daY + ", " + dD + "," + dA);
                }
            }
            else if (lf.spekColl) {
                let daX = c1.pos.x - spek.pos.x;
                let daY = c1.pos.y - spek.pos.y;
                let dD = Math.hypot(daX, daY);
                let dA = (Math.atan2(daY, daX) * 180 / Math.PI) % 360;
                dA += 15 - Math.floor(Math.random() * 31);
                c1.pos.dir = dA;
                spek.pos.dir = (dA + 180) % 360;
                c1.pos.vel += dD / 2;
                spek.pos.vel += dD / 2;
                //console.log("spek HIT: " + daX + "," + daY + ", " + dD + "," + dA);
            }
        }
    });
    
    if (spek.active) {

        if (spek.pos.x < 0 || spek.pos.x > lf.w) spek.pos.x = Math.floor(Math.random() * lf.w);
        if (spek.pos.y < 0 || spek.pos.y > lf.h) spek.pos.y = Math.floor(Math.random() * lf.h);

        spek.pos.move(spek.ops.weight);
        spek.obj.style.left = spek.pos.x + "px";
        spek.obj.style.top = spek.pos.y + "px";
        spek.obj.style.rotate = "z " + spek.pos.dir + "deg";

        lf.encode(spek,'u');
    }
    else {
        spek.obj.style.display = "none";
    }
}