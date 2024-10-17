const snipOps = { 
    "snp-pre": {
        name: "snp-pre", 
        type: "snip", 
        data: "snip",
        content: "&percnt;", 
        formula: (check) => { 
            if (check.length == 2) {
                let v1 = "abcd";
                if (v1.indexOf(check[0]) >= 0 && v1.indexOf(check[1]) >= 0) return "snp-pre";
            }
            return null;
        }, 
        range: 12, 
        decay: 110,
        dformula: [] 
    },
    "snp-go": {
        name: "snp-go", 
        type: "snip", 
        data: "snip",
        content: "&int;", 
        formula: (check) => { 
            if (check.length == 3) {
                let v1 = "abcd";
                if (v1.indexOf(check[0]) >= 0 && v1.indexOf(check[1]) >= 0 && v1.indexOf(check[2]) >= 0) return "snp-go";
            }
            return null;
        }, 
        range: 12, 
        decay: 220,
        dformula: [] 
    },
    "snp-blk": {
        name: "snp-blk", 
        type: "snip", 
        data: "snip",
        content: "&origof;", 
        formula: (check) => { 
            if (check.toLowerCase() == ":ppp") return "snp-blk";
            return null;
        }, 
        range: 12, 
        decay: 400,
        dformula: [] 
    },
    "snp-ex": {
        name: "snp-ex", 
        type: "snip", 
        data: "snip",
        content: "&sim;", 
        formula: (check) => { 
            if (check.toLowerCase() == "eee") return "snp-ex";
            return null;
        }, 
        range: 12, 
        decay: 230,
        dformula: [] 
    }
};

function updateSnip(snip) {
    if (snip.life != null)
        snip.life--;
    
    if (snip.life != null && snip.life <= 0 && snip.active) {
        if ("proc" in snip.dynamic && "parts") snip.life = snip.ops.decay;
        else {
            snipDecay(snip.ops.name, snip.dynamic["code"], snip.pos);
            snip.deactivate();
        }
    }
    else {

        let addTo = null;

        if (snip.ops.name == "snp-pre") {
            let closeOrts = lf.query(snip, "ort");

            if (closeOrts.length > 0) {
                let myVal = snip.dynamic["code"];

                let addOrt = closeOrts[Math.floor(Math.random() * closeOrts.length)];
                let newVal = myVal + addOrt.ops.data;

                let validSnip = false;
                let snipType = null;
                Object.keys(snipOps).forEach((sn) => {
                    if (!validSnip) {
                        snipType = snipOps[sn].formula(newVal); 
                        if (snipType != null && snipType.length > 0) {
                            validSnip = true;
                        }
                        else {
                            snipType = null;
                        }
                    }
                });

                if (validSnip) {
                    let nDir = Math.floor(Math.random() * 360);
                    let velAdd = Math.floor(Math.random() * 5) + 3;
                    let nSnip = new LItem(new LVector(snip.pos.x, snip.pos.y, nDir, snip.pos.vel + velAdd), snipOps[snipType], { gen: lf.step, code: newVal, len: newVal.length });
                    lf.queueItem(nSnip);
                    
                    addOrt.deactivate();
                    snip.deactivate();
                }
            }
        }
        else if (snip.ops.name == "snp-blk") {
            let closeSnips = lf.query(snip, "snip");
                
            let branes = [];
            for (let sn = closeSnips.length - 1; sn >= 0; sn--) {
                if (closeSnips[sn].ops.name == "snp-blk" && branes.length <= lf.braneCount - 1) {
                    branes.push(closeSnips[sn]);
                }
            }

            if (branes.length == lf.braneCount) {
                let mxSum = 0;
                let mySum = 0;
                let mCount = 0;
                branes.forEach((b) => { 
                    mxSum += b.pos.x;
                    mySum += b.pos.y;
                    mCount++;
                    b.deactivate(); 
                });

                let nBrane = new LItem(new LVector(Math.floor(mxSum / mCount), Math.floor(mySum / mCount), 0, 0), struckOps["brane"], { gen: lf.step });
                lf.queueItem(nBrane);
            }
        }
        else {
                    
            if (snip.dynamic["code"].indexOf("d") != 0 && snip.dynamic["code"].indexOf("p") < 0 && snip.dynamic["code"].indexOf("e") < 0) {
                let closeSnips = lf.query(snip, "snip");
                
                for (let sn = closeSnips.length - 1; sn >= 0; sn--) {
                    if (closeSnips[sn].ops.name == "snp-go" && 
                        closeSnips[sn].dynamic["code"].indexOf("d") != 0 && 
                        closeSnips[sn].dynamic["code"] != snip.dynamic["code"]) {
                        addTo = closeSnips[sn];
                        break;
                    }
                }
            }

            if (addTo == null) lf.behaviors.run(snip, snip.dynamic["code"]);
            else {
                let mX = Math.random() > 0.5 ? snip.pos.x - Math.floor(Math.random() * 4) : snip.pos.x + Math.floor(Math.random() * 4);
                let mY = Math.random() > 0.5 ? snip.pos.y - Math.floor(Math.random() * 4) : snip.pos.y + Math.floor(Math.random() * 4);
                let nDir = (snip.pos.dir + addTo.pos.dir) / 2;
                let nVel = (snip.pos.vel + addTo.pos.vel) / 2;
                let codes = [ snip.dynamic["code"], addTo.dynamic["code"] ]; 
                let nStrand = new LItem(new LVector(mX, mY, nDir, nVel), strandOps, { gen: lf.step, codes: codes });
                lf.queueItem(nStrand);

                addTo.deactivate();
                snip.deactivate();
            }

        }
    }

    if (snip.active) {
        snip.pos.move(snip.ops.weight);
        snip.obj.style.left = snip.pos.x + "px";
        snip.obj.style.top = snip.pos.y + "px";
        snip.obj.style.rotate = "z " + snip.pos.dir + "deg";

        lf.encode(snip,'u');
    }
    else {
        snip.obj.style.display = "none";
    }
}

function snipDecay(snipName, snipCode, pos) {
    if (snipOps[snipName].name == "snp-pre" || snipCode.length == 2) {
        let nDir = Math.floor(Math.random() * 360);
        let nVel = Math.floor(Math.random() * 7) + 6;
        let comps = [ snipCode[0], snipCode[1] ];
        comps.forEach((orta) => {
            let xDir = 12 * Math.cos(nDir * Math.PI / 180);
            let yDir = 12 * Math.sin(nDir * Math.PI / 180);
            let nOrt = new LItem(new LVector(pos.x + xDir, pos.y + yDir, nDir, nVel), ortOps["ort-" + orta], {gen:lf.step});
            lf.queueItem(nOrt);
            nDir += (360 / comps.length);
            nDir = nDir % 360;
        });
    }
    else if (snipCode.length == 3) {
        let comps = [ snipCode[0], snipCode[1] ];
        let dComp = snipCode[2];
        let nDir = Math.floor(Math.random() * 360);
        let nVel = Math.floor(Math.random() * 7) + 6;
        comps.forEach((orta) => {
            let xDir = 12 * Math.cos(nDir * Math.PI / 180);
            let yDir = 12 * Math.sin(nDir * Math.PI / 180);
            let nOrt = new LItem(new LVector(pos.x + xDir, pos.y + yDir, nDir, nVel), ortOps["ort-" + orta], {gen:lf.step});
            lf.queueItem(nOrt);
            nDir += (360 / comps.length);
            nDir = nDir % 360;
        });
        let dCmpX = ortOps["ort-" + dComp].dformula;
        let oA = Math.floor(Math.random() * 360);
        let oCount = dCmpX.length;
        dCmpX.forEach((spk) => {
            let nDir = oA;
            let dX = 8 * Math.cos(nDir * Math.PI / 180);
            let dY = 8 * Math.sin(nDir * Math.PI / 180);
            let nVel = Math.floor(Math.random() * 9) + 4;
            let nSpk = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), spekOps[spk.name], {gen:lf.step});
            lf.queueItem(nSpk);
            oA += 360 / oCount;
            oA = oA % 360;
        });
    }
}