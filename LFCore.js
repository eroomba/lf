function LFDynamic(initParams) {
    let me = this;
    me.codes = [];
    me.mem = {};

    if (initParams != null) {
        Object.keys(initParams).forEach((ky) => {
            if (ky == "code") me.codes.push(initParams[ky]);
            else if (ky == "codes") me.codes = JSON.parse(JSON.stringify(initParams[ky]));
            else {
                me.mem[ky] = initParams[ky];
            }
        });
    }
}

const lfcore = {
    curr: this,
    cache: {},
    default: {
        // default
        default: {
            class: "",
            weight: 1.003,
            data: null, 
            content: "",
            formula: (val) => { 
                return null;
            }, 
            range: 0, 
            decay: null, 
            dformula: [] 
        },
    },

    // speks

    spek: {
        // spekA1
        spekA1: {
            // a1 combines w/a2 to form a
            type: "spek",
            subtype: "spekA1",
            class: "spek-a1",
            weight: 1.003,
            data: 101, 
            content: "&ominus;", // circle with -
            formula: (val) => { 
                return val <= 3 ? 1 : 0 
            }, 
            range: 5, 
            decay: null, 
            dformula: [] 
        },

        // spekA2
        spekA2: { 
            // a1 combines w/a2 to form a
            type: "spek",
            subtype: "spekA2",
            class: "spek-a2",
            weight: 1.003, 
            data: 11,
            content: "&oast;", // circle with asterisk
            formula: (val) => { 
                return val <= 5 && val > 3 ? val > 3 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekB1
        spekB1: { 
            // b1 combines w/b2 to form b
            type: "spek",
            subtype: "spekB1",
            class: "spek-b1",
            weight: 1.003, 
            data: 201,
            content: "&minusb;", // square with dash
            formula: (val) => { 
                return val <= 7 && val > 5 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekB2
        spekB2: { 
            // b1 combines w/b2 to form b
            type: "spek",
            subtype: "spekB2",
            class: "spek-b2",
            weight: 1.003, 
            data: 202,
            content: "&sdotb;", // square with dot
            formula: (val) => { 
                return val <= 9 && val > 7 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekC1
        spekC1: { 
            // c1 combines w/c2 to form c
            type: "spek",
            subtype: "spekC1",
            class: "spek-c1",
            weight: 1.003, 
            data: 301,
            content: "&odot;", // circle with dot
            formula: (val) => { 
                return val <= 11 && val > 9 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekC2
        spekC2: { 
            // c1 combines w/c2 to form c
            type: "spek",
            subtype: "spekC2",
            class: "spek-c2",
            weight: 1.004, 
            data: 302,
            content: "&ocir;", // circle with ring
            formula: (val) => { 
                return val <= 13 && val > 11 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekD1
        spekD1: { 
            // d1 can combine w/d2 to form d OR w/x to form p
            type: "spek",
            subtype: "spekD1",
            class: "spek-d1",
            weight: 1.004, 
            data: 401,
            content: "&timesb;", // square with x
            formula: (val) => { 
                return val <= 15 && val > 13 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekD2
        spekD2: { 
            // d2 can combine w/d1 to form d OR w/x to form e
            type: "spek",
            subtype: "spekD2",
            class: "spek-d2",
            weight: 1.003, 
            data: 402,
            content: "&plusb;", // square with +
            formula: (val) => { 
                return val <= 17 && val > 15 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekU1
        spekU1: { 
            // d1 can combine w/d2 to form d OR w/x to form p
            type: "spek",
            subtype: "spekU1",
            class: "spek-u1",
            weight: 1.004, 
            data: 501,
            content: "&timesb;", // square with x
            formula: (val) => { 
                return val <= 19 && val > 17 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekU2
        spekU2: { 
            // d2 can combine w/d1 to form d OR w/x to form e
            type: "spek",
            subtype: "spekU2",
            class: "spek-u2",
            weight: 1.003, 
            data: 502,
            content: "&plusb;", // square with +
            formula: (val) => { 
                return val <= 21 && val > 19 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekX
        spekX: { 
            // x is very ractive: x + d1 = p, x + d2 = e
            type: "spek",
            subtype: "spekX",
            class: "spek-x",
            weight: 1.006, 
            data: 600,
            content: "&otimes;", // circle with X
            formula: (val) => { 
                return val <= 23 && val > 21 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: []
        },

        // spekG1
        spekG1: { 
            type: "spek",
            subtype: "spekG1",
            class: "spek-g1",
            weight: 1.001, 
            data: 701,
            content: "&trie;", // equal with triangle
            formula: (val) => { 
                return val <= 25 && val > 23 ? 1 : 0 
            }, 
            range: 5,
            decay: null,
            dformula: []
        },

        // spekG2
        spekG2: { 
            type: "spek",
            subtype: "spekG2",
            class: "spek-g2",
            weight: 1.002, 
            data: 702,
            content: "&eDot;", // equal with dots 
            formula: (val) => { 
                return val <= 27 && val > 25 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekG3
        spekG3: { 
            type: "spek",
            subtype: "spekG3",
            class: "spek-g3",
            weight: 1.1,  
            data: 703,
            content: "&epar;", // equal with 2 crosses (hash) 
            formula: (val) => { 
                return val <= 29 && val > 27 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // spekV
        spekV: { 
            type: "spek",
            subtype: "spekV",
            class: "spek-v",
            weight: 1.001,  
            data: 800,
            content: "&veebar;", // k 
            formula: (val) => { 
                return val <= 31 && val > 29 ? 1 : 0  
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // functions

        // update
        update: function(spek) {
            // old version
        },

        // decay
        decay: function(spek) {
            return true;
        }
    },


    // orts
    ort: {
        // ortA
        ortA: { 
            type: "ort",
            subtype: "ortA",
            class: "ort-a",
            weight: 1.1,
            data: "a",
            content: "&forall;", // upside down A
            formula: () => { 
                return ["spekA1","spekA2"];
            }, 
            range: 5, 
            decay: 300,
            dformula: [
                {name: "spk-b1", type: "spek"},
                {name: "spk-c2", type: "spek"}
            ] 
        },

        // ortB
        ortB:  { 
            type: "ort",
            subtype: "ortB",
            class: "ort-b",
            weight: 1.1,
            data: "b", 
            content: "&bowtie;", // bowtie
            formula: () => {
                return ["spekB1","spekB2"];
            }, 
            range: 5,
            decay: 300,
            dformula: [
                {name: "spekC1", type: "spek"},
                {name: "spekD2", type: "spek"},
            ]  
        },

        // ortC
        ortC: { 
            type: "ort",
            subtype: "ortC",
            class: "ort-c",
            weight: 1.1,
            data: "c", 
            content: "&comp;", // long C
            formula: () => {
                return ["spekC1","spekC2"];
            }, 
            range: 5,
            decay: 310,
            dformula: [
                {name: "spekD1", type: "spek"},
                {name: "spekA2", type: "spek"},
            ] 
        },

        // ortD
        ortD: { 
            type: "ort",
            subtype: "ortD",
            class: "ort-d",
            weight: 1.15,
            data: "d", 
            content: "&part;", // loopy d
            formula: () => { 
                return ["spekD1","spekD2"];
            }, 
            range: 5,
            decay: 350,
            dformula: [
                {name: "spekA1", type: "spek"},
                {name: "spekB2", type: "spek"}
            ] 
        },

        // ortP
        ortP: { 
            type: "ort",
            subtype: "ortP",
            class: "ort-p",
            weight: 1.1,
            data: "p", 
            content: "&empty;", // circle with cross line
            formula: () => { 
                return ["spekD1","spekX"];
            }, 
            range: 6,
            decay: 450,
            dformula: [
                {name: "spekU1", type: "spek"},
                {name: "spekG1", type: "spek"}
            ] 
        },

        // ortE
        ortE: { 
            type: "ort",
            subtype: "ortE",
            class: "ort-e",
            weight: 1.2,
            data: "e", 
            content: "&sum;", // summation
            formula: () => { 
                return ["spekD2","spekX"];
            }, 
            range: 7,
            decay: 350,
            dformula: [
                {name: "spekU2", type: "spek"},
                {name: "spekG2", type: "spek"}
            ] 
        },

        // ortU
        ortU: { 
            type: "ort",
            subtype: "ortU",
            class: "ort-u",
            weight: 1.15,
            data: "u", 
            content: "&cup;", // cup
            formula: () => { 
                return ["spekU1","spekU2"];
            }, 
            range: 7,
            decay: 350,
            dformula: [
                {name: "spekX", type: "spek"},
                {name: "spekG3", type: "spek"}
            ] 
        },

        // ortI
        ortI: { 
            type: "ort",
            subtype: "ortI",
            class: "ort-i",
            weight: 1.2,
            data: "i", 
            content: "&ecolon;", // equal colon
            formula: () => { 
                return ["spekV","spekX"];
            }, 
            range: 7,
            decay: 350,
            dformula: [
                {name: "spekX", type: "spek"},
                {name: "spekG3", type: "spek"}
            ] 
        },


        // ort functions

        // ort update
        update: function(ort) {

            if (ort.life != null)
                ort.life--;
            
            if (ort.life != null && ort.life <= 0 && ort.active) {
                lfcore.ort.decay(ort.core.subtype, ort.pos);
                ort.deactivate();
            }
            else {
                if (ort.core.subtype == "ortE") {

                    let spkPull = lf.haze.queryM(ort,["spekG1","spekG2"]);
                    let G1 = null;
                    let G2 = null;
                    shuffleArray(spkPull);
                    for (let gg = 0; gg < spkPull.length; gg++) {
                        if (G1 == null && spkPull[gg]["spekG1"] > 0) G1 = spkPull[gg];
                        if (G2 == null && spkPull[gg]["spekG2"] > 0) G2 = spkPull[gg];
                    }

                    if (G1 != null && G2 != null && Math.random() > 0.999) {
                        lf.haze.transact(G1.tableIndex, "spekG1", -1);
                        lf.haze.transact(G2.tableIndex, "spekG2", -1);

                        let nX = ort.pos.x;
                        let nY = ort.pos.y;
                        let nVel = ort.pos.vel;
                        let nDir = ort.pos.dir;
                        let nSnip = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.snip.snipEx, { code: "e--" });
                        lf.queueItem(nSnip);
        
                        ort.deactivate();
                    }

                }
                else {
                    let closeOrts = lf.query(ort, "ort");
                    let chVal = "";
                    let nVel = ort.pos.vel;
                    let nDir = ort.pos.dir;
                    let nX = ort.pos.x;
                    let nY = ort.pos.y;
                    let dRes = new LFVector(ort.pos.x, ort.pos.y, ort.pos.dir, ort.pos.vel);
                    let tv = 1;
        
                    let snipC = [];
                    let snipPD = null;
                    let kCountQ = lf.haze.query(ort, "spekK");
                    let kIdx = null;
                    if (kCountQ.length > 0) kIdx = kCountQ[0].tableIndex;
                    let snipVal = ort.core.data;
                    for (let sc = 0; sc < closeOrts.length; sc++) {
                        snipC.push(closeOrts[sc]);
                        snipVal += closeOrts[sc].core.data;
                        nX += closeOrts[sc].pos.x;
                        nY += closeOrts[sc].pos.y;
                        dRes = dRes.subtract(closeOrts[sc].pos);
                        nVel -= dRes.vel;
                        nDir = dRes.dir;
                        if (snipC.length == 2) break;
                    }
        
                    let validSnip = false;
                    let snipType = null;
                    if (snipVal.length >= 2) {
                        Object.keys(lfcore.snip).forEach((sn) => {
                            if (sn.indexOf("snip") == 0) {
                                if (!validSnip) {
                                    snipType = lfcore.snip[sn].formula(snipVal); 
                                    if (snipType != null && snipType.length > 0) {
                                        validSnip = true;
                                    }
                                    else {
                                        snipType = null;
                                    }
                                }
                            }
                        });
                    }
        
                    if (validSnip) {
                        nX /= (snipC.length + 1);
                        nY /= (snipC.length + 1);
                        for (let sc = snipC.length - 1; sc >= 0; sc--) snipC[sc].deactivate();
        
                        let nSnip = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.snip[snipType], { code: snipVal });
                        if (snipVal.indexOf("u") == 0 && lf.behaviors.singles.includes(snipVal)) {
                            nSnip.life *= 4;
                            nSnip.dynamic.mem["proc"] = 1;
                        }
                        lf.queueItem(nSnip);
                        
                        ort.deactivate();
                    }
                }
            }
        
            if (ort.active) {
                ort.pos.move(ort.core.weight);
                ort.obj.style.left = ort.pos.x + "px";
                ort.obj.style.top = ort.pos.y + "px";
                ort.obj.style.transform = ort.transformFill.replace("***",ort.pos.dir);
            }
            else {
                ort.obj.style.display = "none";
            }
        },
        
        // ort decay
        decay: function(ortName, pos) {
            let sA = Math.floor(Math.random() * 360);
            lfcore.ort[ortName].dformula.forEach((di) => {
                lf.haze.add(pos.x,pos.y,di.subtype,1);
            });
        }
    },
    

    // snips
    snip: {
        // snipPre
        snipPre: { 
            type: "snip",
            subtype: "snipPre",
            class: "snip-pre",
            weight: 1.18,
            data: "snip",
            content: "&percnt;", 
            formula: (check) => { 
                if (check.length == 2) {
                    let v1 = "abcdu";
                    if (v1.indexOf(check[0]) >= 0 && v1.indexOf(check[1]) >= 0) return "snipPre";
                }
                return null;
            }, 
            range: 12, 
            decay: 110,
            dformula: [] 
        },

        // snipGo
        snipGo: {
            type: "snip",
            subtype: "snipGo",
            class: "snip-go",
            weight: 1.2, 
            data: "snip",
            content: "&int;", 
            formula: (check) => { 
                if (check.length == 3) {
                    let v1 = "abcd";
                    if (check[0] == "u" && ((check[1] == "u" && v1.indexOf(check[2]) >= 0) || (check[2] == "u" && v1.indexOf(check[1]) >= 0))) return "snipGo";
                    if (v1.indexOf(check[0]) >= 0 && v1.indexOf(check[1]) >= 0 && v1.indexOf(check[2]) >= 0) return "snipGo";
                }
                return null;
            }, 
            range: 10, 
            decay: 1000,
            dformula: [] 
        },

        // snipBlk
        snipBlk: {
            type: "snip",
            subtype: "snipBlk",
            class: "snip-blk",
            weight: 1.3, 
            data: "ppp",
            content: "&origof;", 
            formula: (check) => { 
                if (check.toLowerCase() == ":ppp") return "snipBlk";
                return null;
            }, 
            range: 10, 
            decay: 1400,
            dformula: [] 
        },

        // snipEx
        snipEx: {
            type: "snip",
            subtype: "snipEx",
            class: "snip-ex",
            weight: 1.2, 
            data: "e--",
            content: "&sim;", 
            formula: (check) => { 
                if (check.toLowerCase() == "e--") return "snipEx";
                return null;
            }, 
            range: 8, 
            decay: 1200,
            dformula: [] 
        },

        // snip functions

        // snip update
        update: function(snip) {
            if (snip.life != null)
                snip.life--;
            
            if (snip.life != null && snip.life <= 0 && snip.active) {
                if ("parts" in snip.dynamic && "p" in snip.dynamic.mem["buildparts"] && snip.dynamic.mem["buildparts"]["p"] > 0) snip.life = snip.core.decay;
                else {
                    lfcore.snip.decay(snip.core.subtype, snip.dynamic.codes[0], snip.pos);
                    snip.deactivate();
                }
            }
            else {
        
                let addTo = null;
        
                if (snip.core.subtype == "snipPre") {
                    let closeOrts = lf.query(snip, "ort");
        
                    if (closeOrts.length > 0) {
                        let myVal = snip.dynamic.codes[0];
        
                        let addOrt = closeOrts[Math.floor(Math.random() * closeOrts.length)];
                        let newVal = myVal + addOrt.core.data;
        
                        let validSnip = false;
                        let snipType = null;
                        Object.keys(lfcore.snip).forEach((sn) => {
                            if (sn.indexOf("snip") == 0) {
                                if (!validSnip) {
                                    snipType = lfcore.snip[sn].formula(newVal); 
                                    if (snipType != null && snipType.length > 0) {
                                        validSnip = true;
                                    }
                                    else {
                                        snipType = null;
                                    }
                                }
                            }
                        });
        
                        if (validSnip) {
                            let nDir = Math.floor(Math.random() * 360);
                            let velAdd = Math.floor(Math.random() * 5) + 3;
                            let nSnip = new LFItem(new LFVector(snip.pos.x, snip.pos.y, nDir, snip.pos.vel + velAdd), lfcore.snip[snipType], { code: newVal });
                            lf.queueItem(nSnip);
                            
                            addOrt.deactivate();
                            snip.deactivate();
                        }
                    }
                }
                else if (snip.core.subtype == "snipBlk") {
                    let close = lf.query(snip, null, { range: snip.core.range * 2 });
                        
                    let branes = [];
                    let closest = null;
                    let closeDist = null;
                    let iTrig = null;
                    close.forEach((cl) => {
                        if (cl.core.type == "snip" && cl.core.subtype == "snipBlk") {
                            if(branes.length < gVars.braneCount - 1) { 
                                branes.push(cl);
                            }
                            let dist = cl.pos.subtract(snip.pos).magnitude();
                            if (closest == null || dist < closeDist) {
                                closest = cl;
                                closeDist = dist;
                            }
                        }
                        else if (cl.core.type == "ort" && cl.core.subtype == "ortI" && iTrig == null) {
                            iTrig = cl;
                        }
                    });
        
                    if (branes.length == gVars.braneCount - 1 && iTrig != null) {
                        let mxSum = 0;
                        let mySum = 0;
                        let mCount = 0;
                        branes.forEach((b) => { 
                            mxSum += b.pos.x;
                            mySum += b.pos.y;
                            mCount++;
                            b.deactivate(); 
                        });
                        iTrig.deactivate();
                        snip.deactivate();
        
                        let nBrane = new LFItem(new LFVector(Math.floor(mxSum / mCount), Math.floor(mySum / mCount), 0, 0), lfcore.struck.struckBrane, { mtype: "C" });
                        lf.queueItem(nBrane);
                    }
                    else if (closest != undefined && closest != null) {
                        let des = closest.pos.subtract(snip.pos);
                        if (des.magnitude() > snip.core.range) {
                            snip.pos.dir = des.dir - 180;
                            snip.pos.vel = 2;
                        }
                        else snip.pos.vel = snip.pos.vel - 2 >= 0 ? snip.pos.vel - 2 : 0;
                    }
                }
                else if (snip.core.subtype == "snipEx") {
                    let closeSnips = lf.query(snip, "snip");
                        
                    let seeds = [];
                    for (let sn = closeSnips.length - 1; sn >= 0; sn--) {
                        if (closeSnips[sn].core.subtype == "snipEx" && seeds.length <= gVars.seedCount - 1) {
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
        
                        let nSeed = new LFItem(new LFVector(Math.floor(sxSum / sCount), Math.floor(sySum / sCount), 0, 0), lfcore.struck.struckSeed, null);
                        lf.queueItem(nSeed);
                    }
                }
                else {
                            
                    if (snip.dynamic.codes[0].indexOf("p") < 0 && snip.dynamic.codes[0].indexOf("e") < 0) {
                        let closeSnips = lf.query(snip, "snip");
                        
                        for (let sn = closeSnips.length - 1; sn >= 0; sn--) {
                            if (closeSnips[sn].core.subtype == "snipGo" && closeSnips[sn].dynamic.codes[0] != snip.dynamic.codes[0]) {
                                
                                if (snip.dynamic.codes[0].indexOf("u") >=0 && closeSnips[sn].dynamic.codes[0].indexOf("u") >=0) {
                                    if (!(("parts" in snip.dynamic && "p" in snip.dynamic.mem["buildparts"]["p"] && snip.dynamic.mem["buildparts"]["p"] > 0) ||
                                        ("parts" in closeSnips[sn].dynamic && "p" in closeSnips[sn].dynamic.mem["buildparts"] && closeSnips[sn].dynamic.mem["buildparts"]["p"] > 0))) 
                                    {
                                        addTo = closeSnips[sn];
                                        break;
                                    }
                                }
                                else if (snip.dynamic.codes[0].indexOf("u") < 0 && closeSnips[sn].dynamic.codes[0].indexOf("u") < 0 && 
                                        !(lf.behaviors.singles.includes(closeSnips[sn].dynamic.codes[0]))) 
                                {
                                        addTo = closeSnips[sn];
                                        break;
                                }
                            }
                        }
                    }
        
                    if (addTo == null) {
                        lf.behaviors.run(snip, [snip.dynamic.codes[0]]);
                    }
                    else {
                        let mX = (snip.pos.x + addTo.pos.x) / 2;
                        let mY = (snip.pos.y + addTo.pos.y) / 2;
                        let nRes = snip.pos.subtract(addTo.pos);
                        let nDir = nRes.dir;
                        let nVel = snip.pos.vel - nRes.vel;
                        let codes = [ snip.dynamic.codes[0], addTo.dynamic.codes[0] ]; 
                        let strandType = "strandD";
                        if (snip.dynamic.codes[0].indexOf("u") >= 0) strandType = "strandR";
                        let nStrand = new LFItem(new LFVector(mX, mY, nDir, nVel), lfcore.strand[strandType], { codes: codes });
                        lf.queueItem(nStrand);
        
                        addTo.deactivate();
                        snip.deactivate();
                    }
        
                }
            }
        
            if (snip.active) {
                snip.pos.move(snip.core.weight);
                snip.obj.style.left = snip.pos.x + "px";
                snip.obj.style.top = snip.pos.y + "px";
                snip.obj.style.transform = snip.transformFill.replace("***",snip.pos.dir); //"z " + snip.pos.dir + "deg";
            }
            else {
                snip.obj.style.display = "none";
            }
        },
        
        // snip decay
        decay: function(snipName, snipCode, pos) {
            if (lfcore.snip[snipName].subtype == "snipPre" || snipCode.length == 2) {
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 7) + 6;
                let comps = [ snipCode[0], snipCode[1] ];
                comps.forEach((orta) => {
                    let xDir = 12 * Math.cos(nDir * Math.PI / 180);
                    let yDir = 12 * Math.sin(nDir * Math.PI / 180);
                    let nOrt = new LFItem(new LFVector(pos.x + xDir, pos.y + yDir, nDir, nVel), lfcore.ort["ort" + orta], null);
                    lf.queueItem(nOrt);
                    nDir += (360 / comps.length);
                    nDir = nDir % 360;
                });
            }
            else if (lfcore.snip[snipName].subtype == "snipEx" || snipCode == "e--") {
                let nDir = pos.dir + 180;
                nDir = nDir % 360;
                let nVel = Math.floor(Math.random() * 5) + 10;
                let dX = 12 * Math.cos(nDir * Math.PI / 180);
                let dY = 12 * Math.sin(nDir * Math.PI / 180);
                let nOrt = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.ort.ortP, null);
                lf.queueItem(nOrt);
                nDir = pos.dir - 60;
                nDir = nDir % 360;
                lf.haze.add(pos.x, pos.y, "spkX", 2);
            }
            else if (snipCode.length == 3) {
                let comps = [ snipCode[0], snipCode[1] ];
                let dComp = snipCode[2];
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 7) + 6;
                comps.forEach((orta) => {
                    let xDir = 12 * Math.cos(nDir * Math.PI / 180);
                    let yDir = 12 * Math.sin(nDir * Math.PI / 180);
                    let nOrt = new LFItem(new LFVector(pos.x + xDir, pos.y + yDir, nDir, nVel), lfcore.ort["ort" + orta.toUpperCase()], null);
                    lf.queueItem(nOrt);
                    nDir += (360 / comps.length);
                    nDir = nDir % 360;
                });
                let dCmpX = lfcore.ort["ort" + dComp.toUpperCase()].dformula;
                let oA = Math.floor(Math.random() * 360);
                let oCount = dCmpX.length;
                dCmpX.forEach((spk) => {
                    lf.haze.add(pos.x, pos.y, spk.subtype, 1);
                });
            }
        }
    },


    // strands
    strand: {
        strandD: { 
            type: "strand",
            subtype: "strandD",
            class: "strand-d",
            weight: 1.35,
            data: "strandD", 
            content: "<div class=\"st-cn\">&nbsp;</div><div class=\"st-ct\">&infin;</div><div class=\"st-cn\"><!--nm--></div>",
            formula: () => { 
                return "strandD"; 
            }, 
            range: 17, 
            decay: 5000,
            dformula: []
        },

        strandR: { 
            type: "strand",
            subtype: "strandR",
            class: "strand-r",
            weight: 1.3,
            data: "strandR", 
            content: "<div class=\"st-ct\">&Int;</div>", // double int
            formula: () => { 
                return "strandR"; 
            }, 
            range: 17, 
            decay: 3200,
            dformula: []
        },

        // strand functions

        // strand update
        update: function(strand) {

            if (strand.life != null)
                strand.life--;
            
            if (strand.life != null && strand.life <= 0 && strand.active) {
                lfcore.strand.decay(strand.dynamic.codes, strand.pos);
                strand.deactivate();
            }
            else {

                if (strand.core.subtype == "strandR") {
                    if (strand.dynamic.codes.length < Math.floor(gVars.minStrandLen / 2)) {
                        let combined = false;

                        let close = lf.query(strand,"snip");

                        close.forEach((itm) => {
                            if (itm.core.subtype == "snipGo" &&
                                !strand.dynamic.codes.includes(itm.dynamic.codes[0]) &&
                                itm.dynamic.codes[0].indexOf("u") >= 0 &&
                                strand.dynamic.codes.length < Math.floor(gVars.minStrandLen / 2))
                            {
                                let prevLen = strand.dynamic.codes.length;
                                strand.dynamic.codes.push(itm.dynamic.codes[0]);
                                strand.dynamic.codes.sort();
                                let newLen = strand.dynamic.codes.length;

                                let nX = (strand.pos.x + itm.pos.x) / 2;
                                let nY = (strand.pos.y + itm.pos.y) / 2;
                                let nRes = strand.pos.subtract(itm.pos);
                                strand.pos.vel -= nRes.vel;
                                strand.pos.dir = nRes.dir;
                                itm.deactivate();
                                combined = true;
                            }
                        });

                        if (combined) {
                            let cStrP = strand.dynamic.codes.join(":");
                            strand.obj.setAttribute("code",cStrP);
                        }
                    }

                    lf.behaviors.run(strand, strand.dynamic.codes);
                }
                else if (strand.core.subtype == "strandD") {
            
                    let spawned = false;
                    let combined = false;
            
                    let close = lf.query(strand, null, { range: strand.core.range + strand.dynamic.codes.length });
            
                    let membrane = null;
                    close.forEach((itm) => {
                        let sums = groupObj(strand.dynamic.codes,[lfcore.snip.snipEx.data]);
                        if (itm.core.subtype== "struckBrane" && membrane == null) {
                            membrane = itm;
                        }
                        else if (itm.core.type == "snip") {
                            if (itm.core.subtype == "snipGo" &&
                                !strand.dynamic.codes.includes(itm.dynamic.codes[0]) && 
                                !(lf.behaviors.singles.includes(itm.dynamic.codes[0])) &&
                                itm.dynamic.codes[0].indexOf("u") < 0)
                            {
                                let prevLen = strand.dynamic.codes.length;
                                strand.dynamic.codes.push(itm.dynamic.codes[0]);
                                strand.dynamic.codes.sort();
                                let newLen = strand.dynamic.codes.length;
                                if (newLen >= gVars.minStrandLen) {
                                    if (strand.obj.classList.contains("sz-mid")) strand.obj.classList.remove("sz-mid"); 
                                    strand.obj.classList.add("sz-full"); 
                                }
                                else if (newLen >= Math.floor(gVars.minStrandLen / 2)) strand.obj.classList.add("sz-mid"); 

                                let nX = (strand.pos.x + itm.pos.x) / 2;
                                let nY = (strand.pos.y + itm.pos.y) / 2;
                                let nRes = strand.pos.subtract(itm.pos);
                                strand.pos.vel -= nRes.vel;
                                strand.pos.dir = nRes.dir;
                                strand.life += itm.core.decay;
                                itm.deactivate();
                            }
                        }
                        else if (itm.core.type == "strand" && itm.core.subtype == "strandD") {
                            let nCodes = [];
            
                            let codeLen = strand.dynamic.codes.length + itm.dynamic.codes.length;
                            let canComb = false;
                            let sumB = groupObj(itm.dynamic.codes,[lfcore.snip.snipEx.data]);
                            let sumE = sums[lfcore.snip.snipEx.data] + sumB[lfcore.snip.snipEx.data];
                            if (sumE / codeLen <= 0.25 && codeLen <= 48) { 
                                canComb = true;
                                nCodes = JSON.parse(JSON.stringify(itm.dynamic.codes.sort()));
                            }

                            strand.dynamic.codes.forEach((cd) => {
                                if (lf.behaviors.activeCodes.includes(cd) && nCodes.includes(cd)) canComb = false;
                            });
            
                            if (canComb) {
                                let prevLen = strand.dynamic.codes.length;
                                strand.dynamic.codes.push(...nCodes);
                                strand.dynamic.codes.sort();
                                let newLen = strand.dynamic.codes.length;
                                if (newLen >= gVars.minStrandLen) {
                                    if (strand.obj.classList.contains("sz-mid")) strand.obj.classList.remove("sz-mid"); 
                                    strand.obj.classList.add("sz-full"); 
                                }
                                else if (newLen >= Math.floor(gVars.minStrandLen / 2)) strand.obj.classList.add("sz-mid"); 
                                
                                let nX = (strand.pos.x + itm.pos.x) / 2;
                                let nY = (strand.pos.y + itm.pos.y) / 2;
                                let nRes = strand.pos.subtract(itm.pos);
                                strand.pos.vel -= nRes.vel;
                                strand.pos.dir = nRes.dir;
                                strand.life += itm.core.decay;

                                itm.deactivate();
                                combined = true;
                                let dspCode = strand.dynamic.codes.join(":");
                                let cLen = strand.dynamic.codes.length;
                                //console.log("s " + strand.id + " combined : " + dspCode + " [" + cLen + "]");
                            }
                        }
                    });
            
                    let cStrP = strand.dynamic.codes.join(":");
                    strand.obj.setAttribute("code",cStrP);
                    if (strand.dynamic.codes.length >= gVars.minStrandLen && membrane != null) {
                        let ptDyn = {
                            codes: JSON.parse(JSON.stringify(strand.dynamic.codes))
                        };
            
                        let iOps = { init: true, complex: 1 };
                        let protoType = "protoS";
                        if ("mtype" in membrane.dynamic && membrane.dynamic.mtype == "C") {
                            protoType = "protoC";
                            iOps.complex = 2;
                        }
            
                        let nDir = Math.floor(Math.random() * 360);
                        let nVel = Math.floor(Math.random() * 9);
                        let nPro = new LFItem(new LFVector(strand.pos.x, strand.pos.y, nDir, nVel),lfcore.proto[protoType], ptDyn, iOps);
                        lf.queueItem(nPro);
            
                        membrane.deactivate();
                        strand.deactivate();
                        spawned = true;
                        console.log("s " + strand.id + " spawned");
                    }
            
                    if (!spawned) {
                        lf.behaviors.run(strand, strand.dynamic.codes);
                        strand.obj.innerHTML = lfcore.strand.strandD.content.replace("<!--nm-->",strand.dynamic.codes.length);
                    }
                }
            }
        
            if (strand.active) {
                strand.pos.move(strand.core.weight);
                strand.obj.style.left = strand.pos.x + "px";
                strand.obj.style.top = strand.pos.y + "px";
                strand.obj.style.transform = strand.transformFill.replace("***",strand.pos.dir); //"z " + strand.pos.dir + "deg";
            }
            else {
                strand.obj.style.display = "none";
            }
        },
        
        // strand decay
        decay: function(strandCodes, pos) {
            let sCount = strandCodes.length;
            let sCodes = strandCodes.slice();
            let dCode = sCodes[sCodes.length - 1];
            let rCodes = sCodes.slice(0,sCodes.length - 1);
            let rCodes2 = [];
            if (rCodes.length > 2) {
                let sIdx = Math.floor(Math.random() * rCodes.length);
                rCodes2 = rCodes.slice(sIdx);
                rCodes = rCodes.slice(0,sIdx);
            }
        
            let oA = Math.floor(Math.random() * 360);
            let strandType = "strandD";
            if (strandCodes.length > 0 && strandCodes[0].indexOf("u") >= 0) strandType = "strandR";
            if (rCodes.length > 0) {
                if (rCodes.length == 1) {
                    let nDir = oA;
                    let dX = 15 * Math.cos(nDir * Math.PI / 180);
                    let dY = 15 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 5) + 10;
                    let sType = "snipGo";
                    if (rCodes[0] == lfcore.snip.snipEx.data) sType = "snipEx"
                    let nSnp = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.snip[sType], { code: rCodes[0] });
                    lf.queueItem(nSnp);
                    oA += 360 / sCount;
                    oA = oA % 360;
                }
                else {
                    let nDir = oA;
                    let dX = 40 * Math.cos(nDir * Math.PI / 180);
                    let dY = 40 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 5) + 10;             
                    let nStd = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.strand[strandType], { codes: rCodes });
                    lf.queueItem(nStd);
                    oA += 360 / sCount;
                    oA = oA % 360;
                }
            }
            if (rCodes2.length > 0) {
                if (rCodes2.length == 1) {
                    let nDir = oA;
                    let dX = 40 * Math.cos(nDir * Math.PI / 180);
                    let dY = 40 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 5) + 10;
                    let sType = "snipGo";
                    if (rCodes2[0] == lfcore.snip.snipEx.data) sType = "snipEx";
                    let nSnp = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.snip[sType], { code: rCodes2[0] });
                    lf.queueItem(nSnp);
                    oA += 360 / sCount;
                    oA = oA % 360;
                }
                else {
                    let nDir = oA;
                    let dX = 40 * Math.cos(nDir * Math.PI / 180);
                    let dY = 40 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 5) + 10;
                    let nStd = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.strand[strandType], { codes: rCodes2 });
                    lf.queueItem(nStd);
                    oA += 360 / sCount;
                    oA = oA % 360;
                }
            }
            let dType = "snipGo";
            if (dCode == lfcore.snip.snipEx.data) dType = "snipEx";
            if (dCode != undefined && dCode != null) {
                lfcore.snip.decay(dType, dCode, pos);
            }
        }
    },


    // protos
    proto: {
        // protoC
        protoC: {
            type: "proto",
            subtype: "protoC",
            class: "proto-1a",
            weight: 2, 
            data: "proto",
            content: "<html>", 
            formula: () => { 
                return "proto-1a"; 
            }, 
            range: 20, 
            decay: 60,
            dformula: []
        },

        // protoS
        protoS: {
            type: "proto",
            subtype: "protoS",
            class: "proto-1b",
            weight: 1.75,
            data: "proto",
            content: "<html>", 
            formula: () => { 
                return "proto-1b"; 
            }, 
            range: 20, 
            decay: 50,
            dformula: []
        },


        // proto functions

        // proto update
        update: function(proto) {

            if (proto.life != null)
                proto.life--;
            
            if (proto.life != null && proto.life <= 0 && proto.active) {
                lfcore.proto.decay(proto);
                proto.deactivate();
            }
            else {
                if (proto.life <= 9) {
                    proto.obj.style.opacity = proto.life / 10;
                }
                else {
                    proto.obj.style.opacity = 0.9;
                }

                let upgrade = false;
                if (proto.complex == 1 && Math.random() > 0.9) {
                    let branes = lf.query(proto,"struck");
                    let addBrane = null;
                    branes.forEach((mb) => {
                        if (addBrane == null && mb.core.subtype == "struckBrane") {
                            addBrane = mb;
                        }
                    });
                    if (addBrane != null) {
                        let uProto = new LFItem(new LFVector(proto.pos.x, proto.pos.y, proto.pos.dir, proto.pos.vel), lfcore.proto.protoC, { codes: JSON.parse(JSON.stringify(proto.dynamic.codes))}, { init: true, complex: 2});
                        lf.queueItem(uProto);
                        addBrane.deactivate();
                        proto.deactivate();
                        upgrade = true;
                    }
                }
        
                if (!upgrade) {
                    let preX = proto.pos.x;
                    let preY = proto.pos.y;
                    
                    lf.behaviors.run(proto, proto.dynamic.codes);

                    // if healthy enough starting activating division
                    if (!("divCounter" in proto.dynamic.mem)) proto.dynamic.mem["divCounter"] = 0;
                    if (!("actCount" in proto.dynamic.mem)) proto.dynamic.mem["actCount"] = 0;

                    if (proto.life >= 80) proto.dynamic.mem["divCounter"]++;
                    else proto.dynamic.mem["divCounter"] = 0;

                    proto.obj.setAttribute("d-count",proto.dynamic.mem["divCounter"]);

                    // has been healthy long enough to divide
                    if (proto.dynamic.mem["divCounter"] >= 50) {
                        proto.dynamic.mem["divCounter"] = 50;

                        // has enough spekV to trigger division
                        if (proto.dynamic.mem["actCount"] > 5) {
                            // divide
                            let mutateOps = "abcd";
                            let nCodes = JSON.parse(JSON.stringify(proto.dynamic.codes));
                            for (let m = 0; m < nCodes.length; m++) {
                                let mutate = Math.random() > 0.98 ? true : false;
                                if (mutate) {
                                    let rIdx = Math.floor(Math.random() * nCodes[m].length);
                                    let rIdx2 = Math.floor(Math.random() * mutateOps.length);
                                    nCodes[m][rIdx] = mutateOps[rIdx2];
                                }
                            }

                            let nDir = proto.pos.dir;
                            let nVel = proto.pos.vel;

                            let nDirCp = nDir;

                            nOVel = Math.floor(Math.random() * 3) + 1;

                            let cpSubtype = proto.core.subtype;
                            let cpParentID = proto.id;
                            let cpComplex = proto.complex;

                            let copy = new LFItem(new LFVector(proto.pos.x, proto.pos.y, nDirCp, nVel), lfcore.proto[cpSubtype], { codes: nCodes, parent: cpParentID }, { init: true, complex: cpComplex });
                            let nLife = Math.floor(proto.life * 0.6);
                            copy.life = nLife;
                            proto.life = nLife;
                            copy.pos.push(nDir - 90, nOVel);
                            proto.pos.push(nDir + 90, nOVel);
                            lf.queueItem(copy);

                            proto.dynamic.mem["actCount"] = 0;
                            proto.dynamic.mem["divCounter"] = 0;
                        }
                        else {
                            // check for spekV to trigger activation
                            let closeV = lf.haze.query(proto, "spekV");
                            shuffleArray(closeV);
                            if (closeV.length > 0) {
                                proto.dynamic.mem["actCount"]++;
                                lf.haze.transact(closeV[0].table,"spekV",-1);
                            }
                            proto.obj.setAttribute("act-count",proto.dynamic.mem["actCount"]);
                        }
                    }
                    
                    proto.pos.move();
            
                    if(preX == proto.pos.x && preY == proto.pos.y) {
                        proto.pos.x += Math.random() > 0.5 ? -1 : 1;
                        proto.pos.y += Math.random() > 0.5 ? -1 : 1;
                        proto.pos.dir += Math.random() > 0.5 ? -5 : 5;
                    }
            
                    proto.obj.setAttribute("life", proto.life);
            
                    if (proto.active) {
                        proto.obj.style.left = proto.pos.x + "px";
                        proto.obj.style.top = proto.pos.y + "px";
                        proto.obj.style.transform = proto.transformFill.replace("***",proto.pos.dir); //"z " + proto.pos.dir + "deg";
            
                        let tail = proto.obj.querySelector(".mid .back .mv-tail");
                        let tRot = (proto.pos.prevDir - proto.pos.dir) * 2;
                        if (Math.abs(tRot > 45)) tRot = 45 * (Math.abs(tRot)/tRot);
                        if (tail) tail.style.rotate = "z " + tRot + "deg";
            
                    }
                    else {
                        proto.obj.style.display = "none";
                    }
                }
            }
        },
        
        // proto decay
        decay: function(proto) {
            let huskType = "huskC";
            if (proto.core.subtype == "protoS") huskType = "huskS";

            let nVel = proto.pos.vel;
            let nDir = proto.pos.dir;

            if (nVel < 1) nVel = 1;
        
            let nHusk = new LFItem(new LFVector(proto.pos.x, proto.pos.y, nDir, nVel), lfcore.struck.struckHusk, { parent: proto.id, type: huskType });
            lf.queueItem(nHusk);

            console.log("proto " + proto.id + " died.");
        }
    },


    // strucks
    struck: {
        // struckBrane
        struckBrane: {
            type: "struck",
            subtype: "struckBrane",
            class: "brane", 
            weight: 1.6,
            data: "brane", 
            content: "&compfn;",
            formula: () => { 
                return "brane"; 
            }, 
            range: 25, 
            decay: 1000,
            dformula: []
        },

        // struckBlip
        struckBlip: {
            type: "struck",
            subtype: "struckBlip",
            class: "blip", 
            weight: 1.4,
            data: "blip", 
            content: "&compfn;",
            formula: () => { 
                return "blip"; 
            }, 
            range: 20, 
            decay: 300,
            dformula: []
        },

        // struckSeed
        struckSeed: {
            type: "struck",
            subtype: "struckSeed",
            class: "seed", 
            weight: 1.5,
            data: "seed", 
            content: "&sect;",
            formula: () => { 
                return "seed"; 
            }, 
            range: 20, 
            decay: 800,
            dformula: []
        },

        // struckHusk
        struckHusk: {
            type: "struck",
            subtype: "struckHusk",
            class: "husk", 
            weight: 1.1,
            data: "husk", 
            content: "<html>",
            formula: () => { 
                return "husk"; 
            }, 
            range: 0, 
            decay: 3000,
            dformula: []
        },

        // functions

        // update
        update: function(struck) {

            if (struck.life != null)
                struck.life--;
            
            if (struck.life != null && struck.life <= 0 && struck.active) {
                lfcore.struck.decay(struck.core.subtype, struck.pos);
                struck.deactivate();
            }
        
            if (struck.active) {
        
                if (struck.core.subtype == "struckBlip") {

                    let closeOrts = lf.query(struck, "ort");

                    let iTrig = [];

                    closeOrts.forEach((ort) => {
                        if (iTrig.length < 3 && ort.core.subtype == "ortI") iTrig.push(ort);
                    });
                    
                    if (iTrig.length == 3) {
                        let nX = struck.pos.x;
                        let nY = struck.pos.y;
                        let nDir = struck.pos.dir;
                        let nVel = struck.pos.vel;

                        let nBrane = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.struck.struckBrane, {  mtype: "S" });
                        nBrane.life = lfcore.struck.struckBrane.decay * 0.5;
                        nBrane.obj.classList.add("b2");
                        lf.queueItem(nBrane);

                        iTrig.forEach(t => t.deactivate());
                        struck.deactivate();
                    }
                    else if (struck.life < 40) struck.obj.style.opacity = struck.life / 100;
                }
        
            }

            if (struck.active) {
                struck.pos.move(struck.core.weight);
                struck.obj.style.left = struck.pos.x + "px";
                struck.obj.style.top = struck.pos.y + "px";
                struck.obj.style.rotate = struck.transformFill.replace("***",struck.pos.dir); //"z " + struck.pos.dir + "deg";
            }
            else struck.obj.style.display = "none";
        },
        
        // decay
        decay: function(struckSubtype, pos) {
            let nDir = Math.floor(Math.random() * 360);
            switch (struckSubtype) {
                case "struckBrane":
                    let degradeCount = 1;
                    let snipCount = gVars.braneCount - degradeCount;
                    let oA = Math.floor(Math.random() * 360);
                    for (let b = 0; b < gVars.braneCount - degradeCount; b++) {
                        let nDir = oA; 
                        let dX = 0;
                        let dY = 0;
                        let nVel = 1;
                        let nDobj = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.snip.snipBlk, { code:"ppp" });
                        lf.queueItem(nDobj);
                        oA += 360 / snipCount;
                        oA = oA % 360;
                    }
                    oA = Math.floor(Math.random() * 360);
                    let oCount = degradeCount * 3;
                    for (let pp = 0; pp < oCount; pp++) {
                        let dForm = lfcore.ort["ortP"].dformula;
                        dForm.forEach((spOps) => {
                            lf.haze.add(pos.x, pos.y, spOps.subType, 1);
                        });
                    }
                    break;
                case "struckBlip":
                    // dissolves into nothing since it came from nothing
                    break;
                case "struckSeed":
                    let degradeCount2 = 2;
                    let snipCount2 = lf.seedCount - degradeCount2;
                    let oA2 = Math.floor(Math.random() * 360);
                    for (let b = 0; b < lf.seedCount - degradeCount2; b++) {
                        let nDir = oA2;
                        let dX = 15 * Math.cos(nDir * Math.PI / 180);
                        let dY = 15 * Math.sin(nDir * Math.PI / 180);
                        let nVel = Math.floor(Math.random() * 10) + 5;
                        let nDobj = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.snip.snipEx, { code:"e--" });
                        lf.queueItem(nDobj);
                        oA2 += 360 / snipCount2;
                        oA2 = oA2 % 360;
                    }
                    oA2 = Math.floor(Math.random() * 360);
                    let oCount2 = degradeCount2;
                    for (let ss = 0; ss < oCount2; ss++) {
                        lfcore.snip.decay("snipEx","e--", pos);
                    }
                    break;
                case "struckHusk":
                    let orts = ["ortP","ortP","ortE","ortE","ortI"];
                    let oA3 = Math.floor(Math.random() * 360);
                    let oAdd = 360 / orts.length;
                    for (let o = 0; o < orts.length; o++) {
                        let nDir = oA3;
                        let dX = 15 * Math.cos(nDir * Math.PI / 180);
                        let dY = 15 * Math.sin(nDir * Math.PI / 180);
                        let nVel = Math.floor(Math.random() * 10) + 5;
                        let nOrt = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.ort[orts[o]], null);
                        lf.queueItem(nOrt);
                        oA3 += oAdd;
                        oA3 = oA3 % 360;
                    }
                    let speks = ["spekA1", "spekB2", "spekC1", "spekD2"];
                    if (Math.random() > 0.5) speks = ["spekA2", "spekB1", "spekC2", "spekD1"];
                    for (let s = 0; s < speks.length; s++) {
                        lf.haze.add(pos.x,pos.y,speks[s],1);
                    }
                    break;
            }
        }
    },


    // xtras
    xtra: {

        // bomb
        bomb: function(mX=null,mY=null) {

            let validSpeks = [
                "spekA1",
                "spekA2",
                "spekB1",
                "spekB2",
                "spekC1",
                "spekC2",
                "spekD1",
                "spekD2",
                "spekU1",
                "spekU2",
                "spekX",
                "spekX",
                "spekV",
                "spekG1",
                "spekG2",
                "spekG1",
                "spekG2",
                "spekG3"
            ];
    
            let r = Math.floor(Math.random() * 150) + 75;
    
            if (mX==null) {
                mX = Math.floor(Math.random() * (lf.w - (r * 2))) + r;
            }
    
            if (mY==null) {
                mY = Math.floor(Math.random() * (lf.h - (r * 2))) + r;
            }
    
            let count = Math.floor(Math.random() * 60) + 10;
            
            for (let j = 0; j < count; j++) {
                let r1 = Math.floor(Math.random() * r);
                let ix1 = Math.floor(Math.random() * validSpeks.length);
                let k1 = validSpeks[ix1];

                lf.haze.add(mX, mY, k1, 1);
            }

            lf.haze.effect(new LFVector(mX, mY, 0, (Math.random() * 11) + 10 ));
    
            let bID = "bomb-" + lf.step;
    
            if (!("bombs" in lf.extras)) lf.extras["bombs"] = [];
            lf.extras["bombs"].push(
                new LFXtra(new LFVector(mX, mY, 0, 0), {
                    width: r * 2,
                    init: function(bomb) {
                        let nObj = document.createElement("div");
                        nObj.id = bID;
                        nObj.classList.add("xtra");
                        nObj.classList.add("bomb");
                        nObj.style.left = bomb.pos.x + "px";
                        nObj.style.top = bomb.pos.y + "px";
                        nObj.style.opacity = 1;
                        nObj.innerHTML = "&compfn;"; //"&there4;&because;"
                        lf.obj.append(nObj);
                        bomb.obj = nObj;
                    },
                    update: function(bomb) {
                        let cOp = bomb.obj.style.opacity;
                        let cW = bomb.obj.offsetWidth;
                        cOp -= 0.2;
                        if (cOp <= 0) {
                            bomb.active = false;
                            bomb.obj.style.display = "none";
                        }
                        else {
                            bomb.obj.style.opacity = cOp;
                        }
                    }
                }, true)
            );
        },

        // puff
        puff: function(mX=null,mY=null) {
    
            let validSpeks = [
                "spekA1",
                "spekA2",
                "spekB1",
                "spekB2",
                "spekC1",
                "spekC2",
                "spekD1",
                "spekD2",
                "spekU1",
                "spekU2",
                "spekX",
                "spekX",
                "spekV",
                "spekG1",
                "spekG2",
                "spekG1",
                "spekG2",
                "spekG3"
            ];
        
            let r = Math.floor(Math.random() * 25) + 15;
    
            if (mX==null) {
                mX = Math.floor(Math.random() * lf.w);
            }
    
            if (mY==null) {
                mY = Math.floor(Math.random() * lf.h);
            }
    
            let count = Math.floor(Math.random() * 16) + 8;
                
            for (let j = 0; j < count; j++) {
                let r1 = Math.floor(Math.random() * r);
                let ix1 = Math.floor(Math.random() * validSpeks.length);
                let k1 = validSpeks[ix1];

                lf.haze.add(mX, mY, k1, 1);
            }

            lf.haze.effect(new LFVector(mX, mY, 0, (Math.random() * 6) + 5 ));

            //console.log("puff - made");
    
            let pID = "puff-" + lf.step;
    
            if (!("puffs" in lf.extras)) lf.extras["puffs"] = [];
            lf.extras["puffs"].push(
                new LFXtra(new LFVector(mX, mY, 0, 0), {
                    width: r * 2,
                    init: function(puff) {
                        let nObj = document.createElement("div");
                        nObj.id = pID;
                        nObj.classList.add("xtra");
                        nObj.classList.add("puff");
                        nObj.style.left = puff.pos.x + "px";
                        nObj.style.top = puff.pos.y + "px";
                        nObj.style.opacity = 1;
                        nObj.innerHTML = "&compfn;"; //"&there4;&because;"
                        lf.obj.append(nObj);
                        puff.obj = nObj;
                    },
                    update: function(puff) {
                        let cOp = puff.obj.style.opacity;
                        let cW = puff.obj.offsetWidth;
                        cOp -= 0.2;
                        if (cOp <= 0) {
                            puff.active = false;
                            puff.obj.style.display = "none";
                        }
                        else {
                            puff.obj.style.opacity = cOp;
                        }
                    }
                }, true)
            );
            
        },

        // drip
        drip: function(mX=null,mY=null)  {
            let r = Math.floor(Math.random() * 70) + 30;
    
            if (mX==null) {
                mX = Math.floor(Math.random() * (lf.w + 400)) - 200;
            }
    
            if (mY==null) {
                mY = Math.floor(Math.random() * (lf.h + 400)) - 200;
            }
    
            let dID = "drip-" + lf.step;
            let drip = {
                id: dID,
                pos: new LFVector(mX, mY, 0, r),
                core: { range: r, type: "drip" }
            };

            if (mX > 0 && mX < lf.w && mY > 0 && mY < lf.h) {
                lf.haze.add(mX, mY, "spekG1", 1 + Math.floor(Math.random() * 10));
                lf.haze.add(mX, mY, "spekG2", 1 + Math.floor(Math.random() * 10));
            }

            if (lf.items.length < gVars.maxItems) {
                if (Math.random() > 0.75) {
                    let nDir = Math.floor(Math.random() * 360);
                    let nBlip = new LFItem(new LFVector(mX, mY, 0, nDir), lfcore.struck.struckBlip, null);
                    nBlip.obj.style.opacity = 0.4;
                    lf.queueItem(nBlip);
                }
        
            }

            let close = lf.query(drip);
            close.forEach((elem) => {
                if (elem.active) {
                    let dRes = elem.pos.add(drip.pos);
                    let dA = dRes.dir % 360;
                    let dVel = dRes.vel * ((r - dRes.magnitude()) / r);
                    elem.pos.dir = dA;
                    elem.pos.vel += dVel;
                }
            });

            lf.haze.effect(drip.pos);

            if (!("drips" in lf.extras)) lf.extras["drips"] = [];
            lf.extras["drips"].push(
                new LFXtra(new LFVector(mX, mY, 0, 0), {
                    width: r * 2,
                    init: function(drip) {
                        let nObj = document.createElement("div");
                        nObj.id = dID;
                        nObj.classList.add("xtra");
                        nObj.classList.add("drip");
                        nObj.style.left = drip.pos.x + "px";
                        nObj.style.top = drip.pos.y + "px";
                        nObj.style.width = drip.core.width + "px";
                        nObj.style.height = drip.core.width + "px";
                        nObj.style.opacity = 1;
                        lf.obj.append(nObj);
                        drip.obj = nObj;
                    },
                    update: function(drip) {
                        let cOp = drip.obj.style.opacity;
                        let cW = drip.obj.offsetWidth;
                        cOp -= 0.1;
                        if (cOp <= 0) {
                            drip.active = false;
                            drip.obj.style.display = "none";
                        }
                        else {
                            drip.obj.style.opacity = cOp;
                            cW += (drip.core.width / 20);
                            if (cW <= drip.core.width * 2) {
                                drip.obj.style.width = cW + "px";
                                drip.obj.style.height = cW + "px";
                            }
                        }
                    }
                }, true)
            );
        },

        // splash
        splash: function(mX, mY, strength = 100) {
            let r = strength;

            let sID = "splash-" + lf.step + "-" + Math.floor(Math.random() * 100000);
            let splash = {
                id: sID,
                pos: new LFVector(mX, mY, 0, r),
                core: { range: r, type: "splash" }
            };

            let close = lf.query(splash);
            close.forEach((elem) => {
                if (elem.active) {
                    let dRes = elem.pos.add(splash.pos);
                    let dA = dRes.dir % 360;
                    let dVel = dRes.vel * ((r - dRes.magnitude()) / r);
                    elem.pos.dir = dA;
                    elem.pos.vel += dVel;
                }
            });

            if (!("splashes" in lf.extras)) lf.extras["splashes"] = [];
            lf.extras["splashes"].push(
                new LFXtra(new LFVector(mX, mY, 0, 0), {
                    width: r * 2,
                    init: function(splash) {
                        let nObj = document.createElement("div");
                        nObj.id = sID;
                        nObj.classList.add("xtra");
                        nObj.classList.add("splash");
                        nObj.style.left = splash.pos.x + "px";
                        nObj.style.top = splash.pos.y + "px";
                        nObj.style.width = splash.core.width + "px";
                        nObj.style.height = splash.core.width + "px";
                        nObj.style.opacity = 1;
                        lf.obj.append(nObj);
                        splash.obj = nObj;
                    },
                    update: function(splash) {
                        let cOp = splash.obj.style.opacity;
                        let cW = splash.obj.offsetWidth;
                        cOp -= 0.1;
                        if (cOp <= 0) {
                            splash.active = false;
                            splash.obj.style.display = "none";
                        }
                        else {
                            splash.obj.style.opacity = cOp;
                            cW += (splash.core.width / 20);
                            if (cW <= splash.core.width * 2) {
                                splash.obj.style.width = cW + "px";
                                splash.obj.style.height = cW + "px";
                            }
                        }
                    }
                }, true)
            );
        },
        
        // vent
        vent: function(mX = null, mY = null) {

            let vX = mX != null ? mX : Math.floor(Math.random() * (lf.w - 200)) + 100;
            let vY = mY != null ? mY : Math.floor(Math.random() * (lf.h - 200)) + 100;

            let gPos = lf.haze.getGridPos(vX, vY);
            vX = gPos.x;
            vY = gPos.y;

            if (!("vents" in lf.extras)) lf.extras["vents"] = [];
            lf.extras["vents"].push(
                new LFXtra(new LFVector(vX, vY, 0, 0), {
                    init: function(vent) {
                        let nObj = document.createElement("div");
                        nObj.id = "vent-" + lf.step + "-" + Math.floor(Math.random() * 10000);
                        nObj.classList.add("xtra");
                        nObj.classList.add("vent");
                        nObj.style.left = vent.pos.x + "px";
                        nObj.style.top = vent.pos.y + "px";
                        nObj.style.transform = "translateX(-50%) translateY(-50%) rotate(" + (Math.floor(Math.random() * 360)) + "deg)";
                        nObj.innerHTML = "&#x1F5F2;";
                        vent.obj = nObj;
                        vent.nX = Math.random() / 10;
                        vent.nY = Math.random() / 10;
                        vent.cSum = 0;
                        lf.obj.append(nObj);
                    },
                    update: function(vent) {
                        vent.nX += 0.01;
                        vent.nY += 0.01;
                        if (vent.nX >= 1) vent.nX = 0.01;
                        if (vent.nY >= 1) vent.nY = 0.01;
                        let cVal = (lf.engine.noise.get(vent.nX, vent.nY) * 0.5) + 0.5;
                        vent.cSum += cVal;
                        let cAvg = vent.cSum / lf.step;
                        if (cVal > cAvg) {
                            let add = Math.floor(Math.random() * 7) + 1;
                            lf.haze.add(vent.pos.x, vent.pos.y, "spekG3", add);
                        }
                    }
                }, true)
            );
        }
    }
};

function LFHaze(w, h, sub) {
    let me = this;
    me.h = h;
    me.w = w;
    me.sub = sub;
    me.sW = Math.ceil(me.w / me.sub);
    me.sH = Math.ceil(me.h / me.sub);
    me.table = new Array(me.sW * me.sH);
    me.dispInit = false;
    me.disp = false;
    me.obj = null;
    me.contents = [
        "spekA1", 
        "spekA2",
        "spekB1", 
        "spekB2",
        "spekC1", 
        "spekC2",
        "spekD1", 
        "spekD2",
        "spekU1", 
        "spekU2",
        "spekX", 
        "spekG1",
        "spekG2", 
        "spekG3",
        "spekV"
    ];
    me.checkupdate = ["ortA","ortB","ortC","ortD","ortU","ortP","ortE","ortI"];
    for (let i = 0; i < me.table.length; i++) {
        me.table[i] = {};
        me.contents.forEach((oo) => { me.table[i][oo] = 0; });
    }
    me.spekSize = 5;
    me.saturation = (me.sub * me.sub) /  (me.spekSize);

    me.query = (item, type, options = {}) => {
        let res = [];
        if (type != null) {
            let qRange = item.core.range;

            if ("range" in options) qRange = options["range"];

            if (item != undefined && item != null && item.pos != undefined && item.pos != null) {
                let x = item.pos.x;
                let y = item.pos.y;
                let r = qRange;
                let qX = Math.floor(x / me.sub);
                let qY = Math.floor(y / me.sub);
                let qSpanX = 1;
                let qSpanY = 1;
                while (r > me.sub * (qSpanX + 1)) qSpanX++;
                while (r > me.sub * (qSpanY + 1)) qSpanY++;
                for (let i = qX - qSpanX; i <= qX + qSpanX; i++) {
                    for (let j = qY - qSpanY; j <= qY + qSpanY; j++) {
                        let qIdx = (j * me.sW) + i;
                        if (qIdx >= 0 && qIdx < me.table.length) {
                            if (type in me.table[qIdx] && me.table[qIdx][type] > 0)
                                res.push({tableIndex: qIdx, count: me.table[qIdx][type]});
                        }
                    }
                }
            }
        }
        return res;
    };

    me.getGridPos = (x,y) => {
        let cX = x < 0 ? 0 : x;
        let cY = y < 0 ? 0 : y;
        if (cX > lf.w) cX = lf.w;
        if (cY > lf.h) cY = lf.h;
        let hX = Math.floor(cX / me.sub);
        let hY = Math.floor(cY / me.sub);
        return { x: (hX * me.sub) + Math.floor(me.sub / 2), y: (hY * me.sub) + Math.floor(me.sub / 2) };
    };

    me.getCellPos = (tbIndex) => {
        if (tbIndex > 0 && tbIndex < me.table.length) {
            return { x: ((tbIndex % me.sub) * me.sub) + Math.floor(me.sub / 2), y: (Math.floor(tbIndex / me.sub) * me.sub) + Math.floor(me.sub / 2) };
        }
        else return null;
    };

    me.queryM = (item, types = [], options = {}) => {
        let res = [];
        if (types.length > 0) {
            let qRange = item.core.range;

            if ("range" in options) qRange = options["range"];

            if (item != undefined && item != null && item.pos != undefined && item.pos != null) {
                let x = item.pos.x;
                let y = item.pos.y;
                let r = qRange;
                let qX = Math.floor(x / me.sub);
                let qY = Math.floor(y / me.sub);
                let qSpanX = 1;
                let qSpanY = 1;
                while (r > me.sub * (qSpanX + 1)) qSpanX++;
                while (r > me.sub * (qSpanY + 1)) qSpanY++;
                for (let i = qX - qSpanX; i <= qX + qSpanX; i++) {
                    for (let j = qY - qSpanY; j <= qY + qSpanY; j++) {
                        let qIdx = (j * me.sW) + i;
                        if (qIdx >= 0 && qIdx < me.table.length) {
                            let tCount = 0;
                            let foundTB = { tableIndex: qIdx };
                            types.forEach((ty) => {
                                if (ty in me.table[qIdx] && me.table[qIdx][ty] > 0) {
                                    tCount += me.table[qIdx][ty];
                                }
                                foundTB[ty] = me.table[qIdx][ty];
                            });
                            if (tCount > 0) res.push(foundTB);
                        }
                    }
                }
            }
        }
        return res;
    };

    me.add = (x,y,type,count) => {
        let aX = Math.floor(x / me.sub);
        let aY = Math.floor(y / me.sub);
        let aIdx = (aY * me.sW) + aX;
        if (aIdx >= 0 && aIdx < me.table.length) {
            if (type in me.table[aIdx]) {
                me.table[aIdx][type] += count;
            }
        }
    };

    me.remove = (x,y,type,count) => {
        let rX = Math.floor(x / me.sub);
        let rY = Math.floor(y / me.sub);
        let rIdx = (rY * me.sW) + rX;
        if (type in me.table[rIdx]) me.table[rIdx][type] -= count;
    }

    me.transact = (tableIndex,type,amount) => {
        if (tableIndex >= 0 && tableIndex < me.table.length && me.table[tableIndex][type] != undefined)
            me.table[tableIndex][type] += amount;
    }

    me.effect = (force) => {
        let mIdxX = Math.floor(force.x / me.sub);
        let mIdxY = Math.floor(force.y / me.sub);
        let mIdx = (mIdxY * me.sW) + mIdxX;
        if (mIdxX >= 0 && mIdxX <= me.sW && mIdxY >= 0 && mIdxY <= me.sH && mIdx >= 0 && mIdx < me.table.length) {
            let mLeft = mIdxX * me.sub;
            let mRight = mLeft + me.sub;
            let mTop = mIdxY * me.sub;
            let mBottom = mTop + me.sub;
            let forceVal = force.magnitude();
            let forces = new Array(8);
            forces[0] = { x: 1, y: 0, run: mRight - force.x >= forceVal ? false : true };
            forces[1] = { x: 1, y: 1, run: Math.hypot(mRight - force.x, mTop - force.y) >= forceVal ? false : true };
            forces[2] = { x: 0, y: 1, run: mTop - force.y >= forceVal ? false : true };
            forces[3] = { x: -1, y: 1, run: Math.hypot(force.x - mLeft, mTop - force.y) >= forceVal ? false : true };
            forces[4] = { x: -1, y: 0, run: force.x - mLeft >= forceVal ? false : true};
            forces[5] = { x: -1, y: -1, run: Math.hypot(force.x - mLeft, force.y - mBottom) >= forceVal ? false : true };
            forces[6] = { x: 0, y: -1, run: force.y - mBottom >= forceVal ? false : true };
            forces[7] = { x: 1, y: -1, run: Math.hypot(mRight - force.x, force.y - mBottom) >= forceVal ? false : true };
            let div = 0;
            forces.forEach((f) => { if (f.run) div++; });
            shuffleArray(forces);

            if (sub > 0) {
                forces.forEach((f) => {
                    if (f.run) {
                        let mvIdxX = mIdxX + f.x;
                        let mvIdxY = mIdxY + f.y;
                        if (mvIdxX >= 0 && mvIdxY >= 0 && mvIdxX <= me.sW && mvIdxY <= me.sH) {
                            let mvIdx = (mvIdxY * me.sW) + mvIdxX;
                            if (mvIdx >= 0 && mvIdx < me.table.length) {
                                me.contents.forEach((ky) => {
                                    let delta = Math.floor(me.table[mIdx][ky] / div);
                                    if (delta == 0 && me.table[mIdx][ky] > 0 && Math.random() > 0.5) delta = 1;
                                    if (delta > 0) {
                                        me.table[mIdx][ky] -= delta;
                                        me.table[mvIdx][ky] += delta;
                                    }
                                });
                            }
                        }
                    }
                });
            }
        }
    };

    me.update = () => {
        if (me.disp) {
            for (let ti = 0; ti < lf.haze.table.length; ti++) {
                let tbid = "haze-disp-" + ti;
                let tbObj = document.getElementById(tbid);
                if (tbObj) {
                    me.contents.forEach((ky) => {
                        let kyO = tbObj.querySelector("." + ky);
                        if (lf.haze.table[ti][ky] > 0) {
                            if (kyO == undefined && kyO == null) {
                                tbObj.innerHTML += "<div>" + ky + ": <span class=\"" + ky + "\">" + lf.haze.table[ti][ky] + "</span></div>";
                            }
                            else {
                                kyO.innerHTML = lf.haze.table[ti][ky];
                            }
                        }
                        else if (kyO != undefined && kyO != null) { kyO.innerHTML = lf.haze.table[ti][ky]; }
                    });
                }
            }
        }

        for (let ti = 0; ti < me.table.length; ti++) {
            let tLeft = (ti % me.sW) * me.sub;
            let tTop = Math.floor(ti / me.sW) * me.sub;
            me.checkupdate.forEach((ort) => {
                let formula = lfcore.ort[ort].formula();
                if (formula.length == 2 && me.table[ti][formula[0]] > 0 && me.table[ti][formula[1]] > 0 && Math.random() > 0.95) {
                    me.table[ti][formula[0]]--;
                    me.table[ti][formula[1]]--;

                    let nX = Math.floor(Math.random() * me.sub) + tLeft;
                    let nY = Math.floor(Math.random() * me.sub) + tTop;
                    let nDir = Math.floor(Math.random() * 360);
                    let nVel = Math.floor(Math.random() * 4) + 3;

                    let nOrt = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.ort[ort], null);
                    lf.queueItem(nOrt);
                }
            });
            me.contents.forEach((el) => {
                if (me.table[ti][el] >= me.saturation) {
                    me.disperse(ti,el);
                }
            });
        }
    };

    me.disperse = (idx, elem) => {
        let dCount = 8;
        let xMin = -1;
        let xMax = 1;
        let yMin = -1;
        let yMax = 1;
        if (idx % me.sW == 0) { xMin = 0; dCount--; }
        else if ((idx + 1) / me.sW == 1) { xMax = 0; dCount--; }
        if (idx < me.sW) { yMin = 0; dCount--; }
        else if (idx >= me.table.length - me.sW) { yMax = 0;  dCount--; }
        dCount *= 2;
        if (me.table[idx][elem] >= dCount) {
            let inc = Math.floor(me.table[idx][elem] / dCount);
            let oInc = inc;
            for (let j = yMin; j <= yMax; j++) {
                for (let i = xMin; i <= xMax; i++) {
                    let dIdx = (idx + i) + (j * me.sW);
                    if (dIdx != idx && dIdx >=0 && dIdx < me.table.length) {
                        if (me.table[dIdx][elem] + inc >= lf.saturation) {
                            inc *= 2;
                        }
                        else if (me.table[idx][elem] -= inc >= 0) {
                            me.table[dIdx][elem] += inc;
                            me.table[idx][elem] -= inc;
                            inc = oInc;
                        }
                    }
                }
            }
            if (me.table[idx][elem] >= lf.saturation) {
                // TODO: add new super-ort
            }
        }
    };

    me.init = () => {
        if (!me.dispInit) {
            let grid = document.createElement("div");
            grid.id = "haze-grid";
            grid.classList.add("haze-grid");
            for (let ti = 0; ti < lf.haze.table.length; ti++) {
                let tbObj = document.createElement("div");
                tbObj.id = "haze-disp-" + ti;
                tbObj.classList.add("haze-disp");
                tbObj.style.width = lf.haze.sub + "px";
                tbObj.style.height = lf.haze.sub + "px";
                tbObj.style.left = (lf.haze.sub * (ti % lf.haze.sW)) + "px";
                tbObj.style.top = (lf.haze.sub * (Math.floor(ti / lf.haze.sW))) + "px";
                grid.appendChild(tbObj);
            }
            lf.obj.appendChild(grid);
            me.obj = grid;
            me.dispInit = true;
            me.disp = true;
        }
    }

    me.flip = () => {
        if (me.disp) {
            me.obj.style.display = "none";
            me.disp = false;
        }
        else {
            if (!me.dispInit) me.init();
            me.obj.style.display = "block";
            me.disp = true;
        }
    }

}

function meanAngleDeg(a) {
    return 180 / Math.PI * Math.atan2(
        aSum(a.map(degToRad).map(Math.sin)) / a.length,
        aSum(a.map(degToRad).map(Math.cos)) / a.length
    );
}

function aSum(a) {
    var s = 0;
    for (var i = 0; i < a.length; i++) s += a[i];
    return s;
} 

function degToRad(a) {
    return Math.PI / 180 * a;
}

function groupObj(obj,req = []) {
    let sums = {};
    req.forEach((rq) => { sums[rq] = 0; });
    obj.forEach((it) => {
        if (it in sums) sums[it]++;
        else sums[it] = 1;
    });
    return sums;
}

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
  