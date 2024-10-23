const lfcore = {
    curr: this,
    cache: {},
    default: {
        // default
        default: {
            class: "",
            weight: 1,
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
            weight: 1.05,
            data: parseInt('00000011', 2), 
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
            weight: 1.05, 
            data: parseInt('00000010', 2),
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
            weight: 1.05, 
            data: parseInt('00001100', 2),
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

        // spekC1
        spekC1: { 
            // c1 combines w/c2 to form c
            type: "spek",
            subtype: "spekC1",
            class: "spek-c1",
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

        // spekC2
        spekC2: { 
            // c1 combines w/c2 to form c
            type: "spek",
            subtype: "spekC2",
            class: "spek-c2",
            weight: 1.05, 
            data: parseInt('00100000', 2),
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

        // spekD2
        spekD2: { 
            // d2 can combine w/d1 to form d OR w/x to form e
            type: "spek",
            subtype: "spekD2",
            class: "spek-d2",
            weight: 1.05, 
            data: parseInt('10000100', 2),
            content: "&plusb;", // square with +
            formula: (val) => { 
                return val <= 17 && val > 15 ? 1 : 0 
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
            weight: 1.1, 
            data: parseInt('11000001', 2),
            content: "&otimes;", // circle with X
            formula: (val) => { 
                return val <= 19 && val > 17 ? 1 : 0 
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
            weight: 1.02, 
            data: -1,
            content: "&trie;", // equal with triangle
            formula: (val) => { 
                return val <= 21 && val > 19 ? 1 : 0 
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
            weight: 1.03, 
            data: -1,
            content: "&eDot;", // equal with dots 
            formula: (val) => { 
                return val == 22 ? 1 : 0 
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
            weight: 1.08,  
            data: -1,
            content: "&epar;", // equal with 2 crosses (hash) 
            formula: (val) => { 
                return val == 23 ? 1 : 0 
            }, 
            range: 5, 
            decay: null,
            dformula: [] 
        },

        // functions

        // update
        update: function(spek) {

            if (!("odata" in lfcore.cache)) {
                let oData = {};
                Object.keys(lfcore.ort).forEach((ky) => {
                    if (ky.indexOf("ort") == 0) {
                        oData["d-" + lfcore.ort[ky].formula()] = ky;
                    }
                });
                lfcore.cache["odata"] = oData;
            }
    
            let closespeks = lf.query(spek, "spek");
        
            closespeks.forEach((c1) => {
                if (c1.active && c1.id != spek.id && spek.core.data != c1.core.data) {
                    let join = spek.core.data & c1.core.data; 
                    if (join > 0) {
                        let comb = spek.core.data | c1.core.data;
                        let tkID = "d-" + comb;
                        if (tkID in lfcore.cache["odata"]) {
                            let tkKey = lfcore.cache["odata"][tkID];
                            let dRes = spek.pos.subtract(c1.pos);
                            spek.deactivate();
                            c1.deactivate();
                            let nX = (spek.pos.x + c1.pos.x) / 2;
                            let nY = (spek.pos.y + c1.pos.y) / 2;
                            let nDir = dRes.dir;
                            let nVel = spek.pos.vel - dRes.vel;
                            let nOrt = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.ort[tkKey],{gen:lf.step});
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
        
                spek.pos.move(spek.core.weight);
                spek.obj.style.left = spek.pos.x + "px";
                spek.obj.style.top = spek.pos.y + "px";
                spek.obj.style.transform = spek.transformFill.replace("***",spek.pos.dir);
        
            }
            else {
                spek.obj.style.display = "none";
            }
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
            weight: 1.3,
            data: "a",
            content: "&forall;", // upside down A
            formula: () => { 
                switch (lf.formation) {
                    case "haze":
                        return ["spekA1","spekA2"];
                        break;
                    default:
                        // 00000011
                        // 00000010
                        return parseInt('00000011', 2); // a1 + a2
                        break;
                }
            }, 
            range: 8, 
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
            weight: 1.3,
            data: "b", 
            content: "&bowtie;", // bowtie
            formula: () => {
                switch (lf.formation) {
                    case "haze":
                        return ["spekB1","spekB2"];
                        break;
                    default:
                        // 00001100
                        // 00001000 
                        return parseInt('00001100', 2);  // b1 + b2
                        break;
                }
            }, 
            range: 8,
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
            weight: 1.3,
            data: "c", 
            content: "&comp;", // long C
            formula: () => {
                switch (lf.formation) {
                    case "haze":
                        return ["spekC1","spekC2"];
                        break;
                    default:
                        // 00110000
                        // 00100000 
                        return parseInt('00110000', 2);  // c1 + c2
                        break;
                }
            }, 
            range: 8,
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
            weight: 1.5,
            data: "d", 
            content: "&part;", // loopy d
            formula: () => { 
                switch (lf.formation) {
                    case "haze":
                        return ["spekD1","spekD2"];
                        break;
                    default:
                        // 11000000
                        // 10000100
                        return parseInt('11000100', 2); // d1 + d1
                        break;
                }
            }, 
            range: 10,
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
            content: "&fork;", // U with line
            formula: () => { 
                switch (lf.formation) {
                    case "haze":
                        return ["spekD1","spekX"];
                        break;
                    default:
                        // 11000000
                        // 11000001
                        return parseInt('11000001', 2); // d1 + x
                        break;
                }
            }, 
            range: 10,
            decay: 450,
            dformula: [
                {name: "spekX", type: "spek"},
                {name: "spekG2", type: "spek"}
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
                switch (lf.formation) {
                    case "haze":
                        return ["spekD2","spekX"];
                        break;
                    default:
                        // 10000100
                        // 11000001
                        return parseInt('11000101', 2); // d2 + x
                        break;
                }
            }, 
            range: 10,
            decay: 350,
            dformula: [
                {name: "spekG1", type: "spek"},
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
                    let closeSpeks = lf.query(ort, "spek");
                    let g1 = null;
                    let g2 = null;
        
                    closeSpeks.forEach((spk) => {
                        if (spk.core.subtype == "spekG1" && g1 == null) g1 = spk;
                        if (spk.core.subtype == "spekG2" && g2 == null) g2 = spk;
                    });
                    
                    if (g1 != null && g2 != null) {
                        let nX = (g1.pos.x + g2.pos.x + ort.pos.x) / 3;
                        let nY = (g1.pos.y + g2.pos.y + ort.pos.y) / 3;
                        let nVel = ort.pos.vel;
                        let dRes1 = ort.pos.subtract(g1.pos);
                        nVel -= dRes1.vel;
                        let dRes2 = ort.pos.subtract(g2.pos);
                        nVel -= dRes2.vel;
                        let nDir = dRes2.subtract(dRes1).dir;
                        let nSnip = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.snip.snipEx, { gen: lf.step, code: "e--", len: 3 });
                        lf.queueItem(nSnip);
        
                        g1.deactivate();
                        g2.deactivate();
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
        
                        let nSnip = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.snip[snipType], { gen: lf.step, code: snipVal, len: snipVal.length });
                        if (snipVal[0] == "d") {
                            nSnip.life *= 4;
                            nSnip.dynamic["proc"] = 1;
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
                switch (lf.formation) {
                    case "haze":

                        lf.haze.add(pos.x,pos.y,di.subtype,1);

                        break;
                    default:
                        let nDir = sA;
                        sA += 120;
                        sA = sA % 360;
                        let aX = 8 * Math.cos(nDir * Math.PI / 180);
                        let aY = 8 * Math.sin(nDir * Math.PI / 180);
                        let nVel = Math.floor(Math.random() * 9) + 4;
                        let nDobj = new LFItem(new LFVector(pos.x + aX, pos.y + aY, nDir, nVel), lfcore.spek[di.subtype], {gen:lf.step});
                        lf.queueItem(nDobj);

                        break;
                }
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
            weight: 1.5,
            data: "snip",
            content: "&percnt;", 
            formula: (check) => { 
                if (check.length == 2) {
                    let v1 = "abcd";
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
            weight: 1.8, 
            data: "snip",
            content: "&int;", 
            formula: (check) => { 
                if (check.length == 3) {
                    let v1 = "abcd";
                    if (v1.indexOf(check[0]) >= 0 && v1.indexOf(check[1]) >= 0 && v1.indexOf(check[2]) >= 0) return "snipGo";
                }
                return null;
            }, 
            range: 12, 
            decay: 220,
            dformula: [] 
        },

        // snipBlk
        snipBlk: {
            type: "snip",
            subtype: "snipBlk",
            class: "snip-blk",
            weight: 1.8, 
            data: "ppp",
            content: "&origof;", 
            formula: (check) => { 
                if (check.toLowerCase() == ":ppp") return "snipBlk";
                return null;
            }, 
            range: 15, 
            decay: 400,
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
            range: 12, 
            decay: 230,
            dformula: [] 
        },

        // functions

        // update
        update: function(snip) {
            if (snip.life != null)
                snip.life--;
            
            if (snip.life != null && snip.life <= 0 && snip.active) {
                if ("parts" in snip.dynamic && "p" in snip.dynamic["parts"] && snip.dynamic["parts"]["p"] > 0) snip.life = snip.core.decay;
                else {
                    lfcore.snip.decay(snip.core.subtype, snip.dynamic["code"], snip.pos);
                    snip.deactivate();
                }
            }
            else {
        
                let addTo = null;
        
                if (snip.core.subtype == "snipPre") {
                    let closeOrts = lf.query(snip, "ort");
        
                    if (closeOrts.length > 0) {
                        let myVal = snip.dynamic["code"];
        
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
                            let nSnip = new LFItem(new LFVector(snip.pos.x, snip.pos.y, nDir, snip.pos.vel + velAdd), lfcore.snip[snipType], { gen: lf.step, code: newVal, len: newVal.length });
                            lf.queueItem(nSnip);
                            
                            addOrt.deactivate();
                            snip.deactivate();
                        }
                    }
                }
                else if (snip.core.subtype == "snipBlk") {
                    let closeSnips = lf.query(snip, "snip", { range: snip.core.range * 2 });
                        
                    let branes = [];
                    let closest = null;
                    let closeDist = null;
                    closeSnips.forEach((sn) => {
                        if (sn.core.subtype == "snipBlk") {
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
        
                        let nBrane = new LFItem(new LFVector(Math.floor(mxSum / mCount), Math.floor(mySum / mCount), 0, 0), lfcore.struck.struckBrane, { gen: lf.step });
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
        
                        let nSeed = new LFItem(new LFVector(Math.floor(sxSum / sCount), Math.floor(sySum / sCount), 0, 0), lfcore.struck.struckSeed, { gen: lf.step });
                        lf.queueItem(nSeed);
                    }
                }
                else {
                            
                    if (snip.dynamic["code"].indexOf("d") != 0 && snip.dynamic["code"].indexOf("p") < 0 && snip.dynamic["code"].indexOf("e") < 0) {
                        let closeSnips = lf.query(snip, "snip");
                        
                        for (let sn = closeSnips.length - 1; sn >= 0; sn--) {
                            if (closeSnips[sn].core.subtype == "snipGo" && 
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
                        let mX = (snip.pos.x + addTo.pos.x) / 2;
                        let mY = (snip.pos.y + addTo.pos.y) / 2;
                        let nRes = snip.pos.subtract(addTo.pos);
                        let nDir = nRes.dir;
                        let nVel = snip.pos.vel - nRes.vel;
                        let codes = [ snip.dynamic["code"], addTo.dynamic["code"] ]; 
                        let nStrand = new LFItem(new LFVector(mX, mY, nDir, nVel), lfcore.strand.strand, { gen: lf.step, codes: codes });
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
        
        // decay
        decay: function(snipName, snipCode, pos) {
            if (lfcore.snip[snipName].subtype == "snipPre" || snipCode.length == 2) {
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 7) + 6;
                let comps = [ snipCode[0], snipCode[1] ];
                comps.forEach((orta) => {
                    let xDir = 12 * Math.cos(nDir * Math.PI / 180);
                    let yDir = 12 * Math.sin(nDir * Math.PI / 180);
                    let nOrt = new LFItem(new LFVector(pos.x + xDir, pos.y + yDir, nDir, nVel), lfcore.ort["ort" + orta], {gen:lf.step});
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
                let nOrt = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.ort.ortP, {gen:lf.step});
                lf.queueItem(nOrt);
                nDir = pos.dir - 60;
                nDir = nDir % 360;
                switch (lf.formation) {
                    case "haze":

                        lf.haze.add(pos.x, pos.y, "spkX", 2);

                        break;
                    default:
                        nVel = Math.floor(Math.random() * 5) + 10;
                        dX = 12 * Math.cos(nDir * Math.PI / 180);
                        dY = 12 * Math.sin(nDir * Math.PI / 180);
                        let nSpk1 = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.spek.spkX, {gen:lf.step});
                        lf.queueItem(nSpk1);
                        nDir = pos.dir + 60;
                        nDir = nDir % 360;
                        dX = 12 * Math.cos(nDir * Math.PI / 180);
                        dY = 12 * Math.sin(nDir * Math.PI / 180);
                        let nSpk2 = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.spek.spkX, {gen:lf.step});
                        lf.queueItem(nSpk2);

                        break;
                }
            }
            else if (snipCode.length == 3) {
                let comps = [ snipCode[0], snipCode[1] ];
                let dComp = snipCode[2];
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 7) + 6;
                comps.forEach((orta) => {
                    let xDir = 12 * Math.cos(nDir * Math.PI / 180);
                    let yDir = 12 * Math.sin(nDir * Math.PI / 180);
                    let nOrt = new LFItem(new LFVector(pos.x + xDir, pos.y + yDir, nDir, nVel), lfcore.ort["ort" + orta.toUpperCase()], {gen:lf.step});
                    lf.queueItem(nOrt);
                    nDir += (360 / comps.length);
                    nDir = nDir % 360;
                });
                let dCmpX = lfcore.ort["ort" + dComp.toUpperCase()].dformula;
                let oA = Math.floor(Math.random() * 360);
                let oCount = dCmpX.length;
                dCmpX.forEach((spk) => {
                    switch (lf.formation) {
                        case "haze":

                            lf.haze.add(pos.x, pos.y, spk.subtype, 1);

                            break;
                        default:
                            
                                let nDir = oA;
                                let dX = 8 * Math.cos(nDir * Math.PI / 180);
                                let dY = 8 * Math.sin(nDir * Math.PI / 180);
                                let nVel = Math.floor(Math.random() * 9) + 4;
                                let nSpk = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.spek[spk.subtype], {gen:lf.step});
                                lf.queueItem(nSpk);
                                oA += 360 / oCount;
                                oA = oA % 360;
                            

                            break;
                    }
                });
            }
        }
    },


    // strands
    strand: {
        strand: { 
            type: "strand",
            subtype: "strand",
            class: "strand",
            weight: 2,
            data: "strand", 
            content: "<div class=\"st-cn\">&nbsp;</div><div class=\"st-ct\">&infin;</div><div class=\"st-cn\"><!--nm--></div>",
            formula: () => { 
                return "strand"; 
            }, 
            range: 25, 
            decay: 1000,
            dformula: []
        },

        // functions

        // update
        update: function(strand) {

            if (strand.life != null)
                strand.life--;
            
            if (strand.life != null && strand.life <= 0 && strand.active) {
                lfcore.strand.decay(strand.dynamic["codes"], strand.pos);
                strand.deactivate();
            }
            else {
        
                let spawned = false;
                let combined = false
        
                let close = lf.query(strand);
        
                let membrane = null;
                close.forEach((itm) => {
                    let sums = groupObj(strand.dynamic["codes"],[lfcore.snip.snipEx.data]);
                    if ((itm.core.subtype== "struckBrane" || itm.core.subtype == "struckBlip") && membrane == null) {
                        membrane = itm;
                    }
                    if (itm.core.type == "snip") {
                        if (itm.core.subtype == "snipGo" &&
                            !strand.dynamic["codes"].includes(itm.dynamic["code"]) && 
                            !(lf.behaviors.singles.includes(itm.dynamic["code"])))
                        {
                            let prevLen = strand.dynamic["codes"].length;
                            strand.dynamic["codes"].push(itm.dynamic["code"]);
                            strand.obj.classList.remove("sz-" + prevLen);
                            let newLen = strand.dynamic["codes"].length;
                            if (newLen >= gVars.minStrandLen) strand.obj.classList.add("sz-full"); 
                            else strand.obj.classList.add("sz-" + newLen);

                            let nX = (strand.pos.x + itm.pos.x) / 2;
                            let nY = (strand.pos.y + itm.pos.y) / 2;
                            let nRes = strand.pos.subtract(itm.pos);
                            strand.pos.vel -= nRes.vel;
                            strand.pos.dir = nRes.dir;
                            itm.deactivate();
                        }
                    }
                    else if (itm.core.type == "strand") {
                        let nCodes = [];
        
                        let codeLen = strand.dynamic["codes"].length + itm.dynamic["codes"].length;
                        let canComb = false;
                        let sumB = groupObj(itm.dynamic["codes"],[lfcore.snip.snipEx.data]);
                        let sumE = sums[lfcore.snip.snipEx.data] + sumB[lfcore.snip.snipEx.data];
                        if (sumE / codeLen <= 0.25 && codeLen <= 48) { 
                            canComb = true;
                            nCodes = itm.dynamic["codes"];
                        }
        
                        if (canComb) {
                            let prevLen = strand.dynamic["codes"].length;
                            strand.dynamic["codes"].push(...nCodes);
                            strand.obj.classList.remove("sz-" + prevLen);
                            let newLen = strand.dynamic["codes"].length;
                            if (newLen >= gVars.minStrandLen) strand.obj.classList.add("sz-full"); 
                            else strand.obj.classList.add("sz-" + newLen);
                            
                            let nX = (strand.pos.x + itm.pos.x) / 2;
                            let nY = (strand.pos.y + itm.pos.y) / 2;
                            let nRes = strand.pos.subtract(itm.pos);
                            strand.pos.vel -= nRes.vel;
                            strand.pos.dir = nRes.dir;

                            itm.deactivate();
                            combined = true;
                            let dspCode = strand.dynamic["codes"].join(":");
                            let cLen = strand.dynamic["codes"].length;
                            console.log("s " + strand.id + " combined : " + dspCode + " [" + cLen + "]");
                        }
                    }
                });
        
                let cStrP = strand.dynamic["codes"].join(":");
                strand.obj.setAttribute("code",cStrP);
                if (strand.dynamic["codes"].length >= gVars.minStrandLen && membrane != null) {
                    let ptDyn = {
                        gen: lf.step,
                        codes: strand.dynamic["codes"]
                    };
        
                    let iOps = { init: true, complex: 2 };
                    let protoType = "protoC";
                    if (membrane.core.subtype == "struckBlip") {
                        protoType = "protoS";
                        iOps.complex = 1;
                    }
        
                    let nDir = Math.floor(Math.random() * 360);
                    let nVel = Math.floor(Math.random() * 9);
                    let nPro = new LFItem(new LFVector(strand.pos.x, strand.pos.y, nDir, nVel),lfcore.proto[protoType], ptDyn, strand.genetic, iOps);
                    lf.queueItem(nPro);
        
                    membrane.deactivate();
                    strand.deactivate();
                    spawned = true;
                    console.log("s " + strand.id + " spawned");
                }
        
                if (!spawned) {
                    lf.behaviors.run(strand, "reset");
                    strand.dynamic["codes"].forEach((cd) => {
                        lf.behaviors.run(strand, cd);
                    });
                    strand.obj.innerHTML = lfcore.strand.strand.content.replace("<!--nm-->",strand.dynamic["codes"].length);
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
        
        // decay
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
            if (rCodes.length > 0) {
                if (rCodes.length == 1) {
                    let nDir = oA;
                    let dX = 15 * Math.cos(nDir * Math.PI / 180);
                    let dY = 15 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 5) + 10;
                    let sType = "snipGo";
                    if (rCodes[0] == lfcore.snip.snipEx.data) sType = "snipEx"
                    let nSnp = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.snip[sType], {gen:lf.step, code: rCodes[0]});
                    lf.queueItem(nSnp);
                    oA += 360 / sCount;
                    oA = oA % 360;
                }
                else {
                    let nDir = oA;
                    let dX = 40 * Math.cos(nDir * Math.PI / 180);
                    let dY = 40 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 5) + 10;
                    let nStd = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.strand.strand, {gen:lf.step, codes: rCodes, len: rCodes.length});
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
                    let nSnp = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.snip[sType], {gen:lf.step, code: rCodes2[0]});
                    lf.queueItem(nSnp);
                    oA += 360 / sCount;
                    oA = oA % 360;
                }
                else {
                    let nDir = oA;
                    let dX = 40 * Math.cos(nDir * Math.PI / 180);
                    let dY = 40 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 5) + 10;
                    let nStd = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.strand.strand, {gen:lf.step, codes: rCodes2, len: rCodes2.length});
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
            data: "proto",
            content: "<html>", 
            formula: () => { 
                return "proto-1b"; 
            }, 
            range: 20, 
            decay: 50,
            dformula: []
        },


        // functions

        // update
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
        
                if (proto.life >= 80) {
                    let nDir = (proto.pos.dir + 180) % 360;
                    let nVel = proto.pos.vel;
                    let iOps = {
                        init: true,
                        complex: proto.complex
                    }
                    let nProto = new LFItem(new LFVector(proto.pos.x, proto.pos.y, nDir, nVel), lfcore.proto[proto.core.subtype], {gen: lf.step, codes: proto.dynamic["codes"].splice()}, JSON.parse(JSON.stringify(proto.genetic)), iOps);
                    nProto.life = 40;
                    proto.life -= 40;
                    lf.queueItem(nProto);
                    console.log("divided!!!");
                }
        
                let preX = proto.pos.x;
                let preY = proto.pos.y;
                
                lf.behaviors.run(proto, "reset");
                proto.dynamic["codes"].forEach((cd) => {
                    lf.behaviors.run(proto, cd);
                });
        
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
        },
        
        // decay
        decay: function(proto) {
            let blkCount = 3;
            if (proto.core.subtype == "protoS") blkCount = 0;
        
            let itemCount = blkCount;
        
            let oA = Math.floor(Math.random() * 360);
            for (let m = 0; m < blkCount; m++) {
                let dX = 12 * Math.cos(oA);
                let dY = 12 * Math.cos(oA);
                let nVel = Math.floor(Math.random() * 5) + 5;
                let nBlk = new LFItem(new LFVector(proto.pos.x + dX, proto.pos.y + dY, oA, nVel), lfcore.snip.snipBlk, { gen: lf.step, code: "ppp"});
                lf.queueItem(nBlk);
                oA += 360 / blkCount;
                oA = oA % 360;
            }
        
            lfcore.strand.decay(proto.dynamic["codes"], proto.pos);
        }
    },


    // strucks
    struck: {
        // struckBrane
        struckBrane: {
            type: "struck",
            subtype: "struckBrane",
            class: "brane", 
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

        // struckBlip
        struckBlip: {
            type: "struck",
            subtype: "struckBlip",
            class: "blip", 
            weight: 2,
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
            weight: 1.8,
            data: "seed", 
            content: "&sect;",
            formula: () => { 
                return "seed"; 
            }, 
            range: 20, 
            decay: 800,
            dformula: []
        },

        // functions

        // update
        update: function(struck) {

            if (struck.life != null)
                struck.life--;
            
            if (struck.life != null && struck.life <= 0 && struck.active) {
                lfcore.struck.decay(struck);
                struck.deactivate();
            }
        
            if (struck.active) {
                struck.pos.move(struck.core.weight);
                struck.obj.style.left = struck.pos.x + "px";
                struck.obj.style.top = struck.pos.y + "px";
                struck.obj.style.rotate = "z " + struck.pos.dir + "deg";
        
                if (struck.core.subtype == "struckBlip") {
                    if (struck.life < 40) struck.obj.style.opacity = struck.life / 100;
                }
        
            }
            else {
                struck.obj.style.display = "none";
            }
        },
        
        // decay
        decay: function(struckName, pos) {
            let nDir = Math.floor(Math.random() * 360);
            switch (struckName) {
                case "brane":
                    let degradeCount = 2;
                    let snipCount = lf.braneCount - degradeCount;
                    let oA = Math.floor(Math.random() * 360);
                    for (let b = 0; b < lf.braneCount - degradeCount; b++) {
                        let nDir = oA;
                        let dX = 15 * Math.cos(nDir * Math.PI / 180);
                        let dY = 15 * Math.sin(nDir * Math.PI / 180);
                        let nVel = Math.floor(Math.random() * 10) + 5;
                        let nDobj = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.snip.snipBlk, {gen: lf.step,code:"ppp",len: 3});
                        lf.queueItem(nDobj);
                        oA += 360 / snipCount;
                        oA = oA % 360;
                    }
                    oA = Math.floor(Math.random() * 360);
                    let oCount = degradeCount * 3;
                    for (let pp = 0; pp < oCount; pp++) {
                        let dForm = lfcore.ort["ortP"].core.dformula;
                        dForm.array.forEach((spOps) => {
                            switch (lf.formation) {
                                case "haze":

                                    lf.haze.add(pos.x, pos.y, spOps.subType, 1);
                                
                                    break;
                                default:
                                    
                                        let nDir = oA;
                                        let dX = 8 * Math.cos(nDir * Math.PI / 180);
                                        let dY = 8 * Math.sin(nDir * Math.PI / 180);
                                        let nVel = Math.floor(Math.random() * 9) + 4;
                                        let nSobj = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.spek[spOps.subtype], {gen: lf.step});
                                        lf.queueItem(nSobj);
                                        oA += 360 / oCount;
                                        oA = oA % 360;
                                    
                                    break;
                            }
                        });
                    }
                    break;
                case "blip":
                    // dissolves into nothing since it came from nothing
                    break;
                case "seed":
                    let degradeCount2 = 2;
                    let snipCount2 = lf.seedCount - degradeCount2;
                    let oA2 = Math.floor(Math.random() * 360);
                    for (let b = 0; b < lf.seedCount - degradeCount2; b++) {
                        let nDir = oA2;
                        let dX = 15 * Math.cos(nDir * Math.PI / 180);
                        let dY = 15 * Math.sin(nDir * Math.PI / 180);
                        let nVel = Math.floor(Math.random() * 10) + 5;
                        let nDobj = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfcore.snip.snipEx, {gen: lf.step,code:"e--",len: 3});
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
                "spekX",
                "spekX"
            ];
    
            let r = Math.floor(Math.random() * 150) + 75;
    
            if (mX==null) {
                mX = Math.floor(Math.random() * (lf.w - (r * 2))) + r;
            }
    
            if (mY==null) {
                mY = Math.floor(Math.random() * (lf.h - (r * 2))) + r;
            }
    
            switch (lf.formation) {
                case "haze":

                    let count = Math.floor(Math.random() * 60) + 10;
                    
                    for (let j = 0; j < count; j++) {
                        let r1 = Math.floor(Math.random() * r);
                        let ix1 = Math.floor(Math.random() * validSpeks.length);
                        let k1 = validSpeks[ix1];

                        lf.haze.add(mX, mY, k1, 1);
                    }

                    lf.haze.effect(new LFVector(mX, mY, 0, (Math.random() * 11) + 10 ));

                    break;
                default:
                    let addR = Math.floor(Math.random() * 15) + 5;
                    for (let a = 0; a < 360; a+=addR) {
                        let count = Math.floor(Math.random() * 3) + 1;
                        for (let j = 0; j < count; j++) {
                            let r1 = Math.floor(Math.random() * r);
                            let ix1 = Math.floor(Math.random() * validSpeks.length);
                            let k1 = validSpeks[ix1];
                            let nD = Math.floor(Math.random() * (r - 20)) + 20;
                            let nX = mX + (nD * Math.cos(a * Math.PI / 180));
                            let nY = mY + (nD * Math.sin(a * Math.PI / 180));
                            let nDir = a;
                            let nVel = Math.floor(Math.random() * 11) + 10;
                            let nItem = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.spek[k1], {gen:lf.step});
                            lf.addItem(nItem);
                        }
                        addR += Math.floor(Math.random() * 15) + 5;
                    }

                    break;
            }
    
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
                "spekX",
                "spekX"
            ];
        
            let r = Math.floor(Math.random() * 25) + 15;
    
            if (mX==null) {
                mX = Math.floor(Math.random() * lf.w);
            }
    
            if (mY==null) {
                mY = Math.floor(Math.random() * lf.h);
            }
    
            switch (lf.formation) {
                case "haze":

                    let count = Math.floor(Math.random() * 7) + 6;
                        
                    for (let j = 0; j < count; j++) {
                        let r1 = Math.floor(Math.random() * r);
                        let ix1 = Math.floor(Math.random() * validSpeks.length);
                        let k1 = validSpeks[ix1];

                        lf.haze.add(mX, mY, k1, 1);
                    }

                    lf.haze.effect(new LFVector(mX, mY, 0, (Math.random() * 6) + 5 ));

                    break;
                default:
                    let addR = Math.floor(Math.random() * 30);
                    for (let a = 0; a < 360; a+=addR) {
                        let r1 = Math.floor(Math.random() * r);
                        let ix1 = Math.floor(Math.random() * validSpeks.length);
                        let k1 = validSpeks[ix1];
                        let nDir = a;
                        let nVel = Math.floor(Math.random() * 5) + 5;
                        let nD = Math.floor(Math.random() * (r - 15)) + 15;
                        let nX = mX + (nD * Math.cos(a * Math.PI / 180));
                        let nY = mY + (nD * Math.sin(a * Math.PI / 180));
                        if (nX > 0 && nX < lf.w && nY > 0 && nY < lf.h) {
                            let nItem = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.spek[k1], {gen:lf.step});
                            lf.addItem(nItem);
                        }
                        addR += Math.floor(Math.random() * 20) + 10;
                    }

                    break;
            }
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

    
            if (lf.items.length < gVars.maxItems) {
                if (Math.random() > 0.5) {
                    let nDir = Math.floor(Math.random() * 360);
                    let nBlip = new LFItem(new LFVector(mX, mY, 0, nDir), lfcore.struck.struckBlip, { gen: lf.step });
                    nBlip.obj.style.opacity = 0.4;
                    lf.queueItem(nBlip);
                }
        
                switch (lf.formation) {
                    case "haze":
                        if (mX > 0 && mX < lf.w && mY > 0 && mY < lf.h) {
                            lf.haze.add(mX, mY, "spekG1", 1);
                            lf.haze.add(mX, mY, "spekG2", 1);
                        }

                        break;
                    default:
                        let gs = [ "spekG1", "spekG2" ];
                        let gCount = Math.floor(Math.random() * 4) + 3;
                        let gA = Math.floor(Math.random() * 360);
                        let addA = 360 / gCount;
                        for (let g = 0; g < gCount; g++) {
                            let nVel = Math.floor(Math.random() * 10) + 10;
                            let gName = gs[Math.floor(Math.random() * gs.length)];
                            let nGas = new LFItem(new LFVector(mX, mY, nVel,gA), lfcore.spek[gName], { gen: lf.step });
                            lf.queueItem(nGas);
                            gA += addA;
                            gA = gA % 360;
                        }

                        break;
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
    me.contents = [
        "spekA1", 
        "spekA2",
        "spekB1", 
        "spekB2",
        "spekC1", 
        "spekC2",
        "spekD1", 
        "spekD2",
        "spekX", 
        "spekG1",
        "spekG2", 
        "spekG3"
    ];
    me.checkupdate = ["ortA","ortB","ortC","ortD","ortP","ortE"];
    for (let i = 0; i < me.table.length; i++) {
        me.table[i] = {};
        me.contents.forEach((oo) => { me.table[i][oo] = 0; });
    }

    me.query = (item, options = {}) => {
        let res = {};
        me.contents.forEach((oo) => { res[oo] = 0; });
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
            while (r > me.sW * (qSpanX + 1)) qSpanX++;
            while (r > me.sH * (qSpanY + 1)) qSpanY++;
            for (let i = qX - qSpanX; i <= qX + qSpanX; i++) {
                for (let j = qY - qSpanY; j <= qY + qSpanY; j++) {
                    let qIdx = (j * me.sW) + i;
                    if (qIdx >= 0 && qIdx < me.table.length) {
                        me.contents.forEach((spk) => {
                            res[spk] += me.table[qIdx][spk];
                        });
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
        if (me.dispInit) {
            for (let ti = 0; ti < lf.haze.table.length; ti++) {
                let tbid = "haze-disp-" + ti;
                let tbObj = document.getElementById(tbid);
                if (tbObj) {
                    let tbHTML = "";

                    Object.keys(me.contents).forEach((ky) => {
                        if (lf.haze.table[ti][ky] > 0)
                            tbHTML += "<div>" + ky + ": " + lf.haze.table[ti][ky] + "</div>";
                    });

                    tbObj.innerHTML = tbHTML;
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

                    let nOrt = new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.ort[ort], {gen: lf.step});
                    lf.queueItem(nOrt);
                }
            });
        }
    };

    me.show = () => {
        if (!me.dispInit) {
            for (let ti = 0; ti < lf.haze.table.length; ti++) {
                let tbObj = document.createElement("div");
                tbObj.id = "haze-disp-" + ti;
                tbObj.classList.add("haze-disp");
                tbObj.style.border = "1px solid white";
                tbObj.style.opacity = 0.4;
                tbObj.style.width = lf.haze.sub + "px";
                tbObj.style.height = lf.haze.sub + "px";
                tbObj.style.left = (lf.haze.sub * (ti % lf.haze.sW)) + "px";
                tbObj.style.top = (lf.haze.sub * (Math.floor(ti / lf.haze.sW))) + "px";
                tbObj.style.position = "absolute";
                tbObj.style.color = "#666666";
                tbObj.style.fontSize = "0.4rem";
                tbObj.style.zIndex = 999999;
                lf.obj.appendChild(tbObj);
            }
            me.dispInit = true;
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
  