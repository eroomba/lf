const snipOps = { 
    "snp-pre": {
        name: "snp-pre", 
        type: "snip", 
        weight: 1.5,
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
        weight: 1.8, 
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
        weight: 1.8, 
        data: "ppp",
        content: "&origof;", 
        formula: (check) => { 
            if (check.toLowerCase() == ":ppp") return "snp-blk";
            return null;
        }, 
        range: 15, 
        decay: 400,
        dformula: [] 
    },
    "snp-ex": {
        name: "snp-ex", 
        type: "snip",
        weight: 1.2, 
        data: "e--",
        content: "&sim;", 
        formula: (check) => { 
            if (check.toLowerCase() == "e--") return "snp-ex";
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
        if ("parts" in snip.dynamic && "p" in snip.dynamic["parts"] && snip.dynamic["parts"]["p"] > 0) snip.life = snip.ops.decay;
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
            let closeSnips = lf.query(snip, "snip", { range: snip.ops.range * 2 });
                
            let branes = [];
            let closest = null;
            let closeDist = null;
            closeSnips.forEach((sn) => {
                if (sn.ops.name == "snp-blk") {
                    if(branes.length < gVars.braneCount - 1) { 
                        branes.push(sn);
                    }
                    let dist = sn.pos.subtract(snip.pos).magnitude();
                    if (closest == null || dist < closeDist) {
                        closest = sn;
                        closeDist = dist;
                    }
                }
            });

            if (branes.length == gVars.braneCount - 1) {
                let mxSum = 0;
                let mySum = 0;
                let mCount = 0;
                branes.forEach((b) => { 
                    mxSum += b.pos.x;
                    mySum += b.pos.y;
                    mCount++;
                    b.deactivate(); 
                });
                snip.deactivate();

                let nBrane = new LItem(new LVector(Math.floor(mxSum / mCount), Math.floor(mySum / mCount), 0, 0), struckOps["brane"], { gen: lf.step });
                lf.queueItem(nBrane);
            }
            else if (closest != undefined && closest != null) {
                let des = closest.pos.subtract(snip.pos);
                if (des.magnitude() > snip.ops.range) {
                    snip.pos.dir = des.dir;
                    snip.pos.vel = 2;
                }
                else snip.pos.vel = snip.pos.vel - 2 >= 0 ? snip.pos.vel - 2 : 0;
            }
        }
        else if (snip.ops.name == "snp-ex") {
            let closeSnips = lf.query(snip, "snip");
                
            let seeds = [];
            for (let sn = closeSnips.length - 1; sn >= 0; sn--) {
                if (closeSnips[sn].ops.name == "snp-ex" && seeds.length <= gVars.seedCount - 1) {
                    seeds.push(closeSnips[sn]);
                }
            }

            if (seeds.length == gVars.seedCount) {
                let sxSum = 0;
                let sySum = 0;
                let sCount = 0;
                seeds.forEach((s) => { 
                    sxSum += s.pos.x;
                    sySum += s.pos.y;
                    sCount++;
                    s.deactivate(); 
                });

                let nSeed = new LItem(new LVector(Math.floor(sxSum / sCount), Math.floor(sySum / sCount), 0, 0), struckOps["seed"], { gen: lf.step });
                lf.queueItem(nSeed);
            }
        }
        else {
                    
            if (snip.dynamic["code"].indexOf("d") != 0 && snip.dynamic["code"].indexOf("p") < 0 && snip.dynamic["code"].indexOf("e") < 0) {
                let closeSnips = lf.query(snip, "snip");
                
                for (let sn = closeSnips.length - 1; sn >= 0; sn--) {
                    if (closeSnips[sn].ops.name == "snp-go" && 
                        !(lf.behaviors.singles.includes(closeSnips[sn].dynamic["code"])) &&
                        closeSnips[sn].dynamic["code"] != snip.dynamic["code"]) {
                        addTo = closeSnips[sn];
                        break;
                    }
                }
            }

            if (addTo == null) {
                lf.behaviors.run(snip, "reset");
                lf.behaviors.run(snip, snip.dynamic["code"]);
            }
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
        snip.obj.style.transform = snip.transformFill.replace("***",snip.pos.dir); //"z " + snip.pos.dir + "deg";

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
    else if (snipOps[snipName].name == "snp-ex" || snipCode == "e--") {
        let nDir = pos.dir + 180;
        nDir = nDir % 360;
        let nVel = Math.floor(Math.random() * 5) + 10;
        let dX = 12 * Math.cos(nDir * Math.PI / 180);
        let dY = 12 * Math.sin(nDir * Math.PI / 180);
        let nOrt = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), ortOps["ort-p"], {gen:lf.step});
        lf.queueItem(nOrt);
        nDir = pos.dir - 60;
        nDir = nDir % 360;
        nVel = Math.floor(Math.random() * 5) + 10;
        dX = 12 * Math.cos(nDir * Math.PI / 180);
        dY = 12 * Math.sin(nDir * Math.PI / 180);
        let nSpk1 = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), spekOps["spk-x"], {gen:lf.step});
        lf.queueItem(nSpk1);
        nDir = pos.dir + 60;
        nDir = nDir % 360;
        dX = 12 * Math.cos(nDir * Math.PI / 180);
        dY = 12 * Math.sin(nDir * Math.PI / 180);
        let nSpk2 = new LItem(new LVector(pos.x + dX, pos.y + dY, nDir, nVel), spekOps["spk-x"], {gen:lf.step});
        lf.queueItem(nSpk2);
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