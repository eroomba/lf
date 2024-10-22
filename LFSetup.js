const lfd = {
    curr: this,
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
    
            let closespeks = lf.query(spek, "spek");
        
            closespeks.forEach((c1) => {
                if (c1.active && c1.id != spek.id && spek.core.data != c1.core.data) {
                    let join = spek.core.data & c1.core.data; 
                    if (join > 0) {
                        let comb = spek.core.data | c1.core.data;
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
        
                            let nOrt = new LFItem(new LFVector(spek.pos.x, spek.pos.y, nDir, nVel), lfd.ort[tkKey],{gen:lf.step});
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
                // 00000011
                // 00000010
                return parseInt('00000011', 2); // a1 + a2
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
                // 00001100
                // 00001000 
                return parseInt('00001100', 2);  // b1 + b2
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
                // 00110000
                // 00100000 
                return parseInt('00110000', 2);  // c1 + c2
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
                // 11000000
                // 10000100
                return parseInt('11000100', 2); // d1 + d1
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
                // 11000000
                // 11000001
                return parseInt('11000001', 2); // d1 + x
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
                // 10000100
                // 11000001
                return parseInt('11000101', 2); // d2 + x
            }, 
            range: 10,
            decay: 350,
            dformula: [
                {name: "spekG1", type: "spek"},
                {name: "spekG3", type: "spek"}
            ] 
        },


        // functions

        // update
        update: function(ort) {

            if (ort.life != null)
                ort.life--;
            
            if (ort.life != null && ort.life <= 0 && ort.active) {
                lfd.ort.decay(ort.core.subtype, ort.pos);
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
                        let nDir = Math.floor(Math.random() * 360);
                        let nVel = ort.pos.vel * 1.5;
                        let nSnip = new LFItem(new LFVector(ort.pos.x, ort.pos.y, nDir, nVel), lfd.snip.snipEx, { gen: lf.step, code: "e--", len: 3 });
                        lf.queueItem(nSnip);
        
                        g1.deactivate();
                        g2.deactivate();
                        ort.deactivate();
                    }
                }
                else {
                    let closeOrts = lf.query(ort, "ort");
                    let chVal = "";
                    let nv = ort.pos.vel;
                    let ndr = ort.pos.dir;
                    let tv = 1;
        
                    let snipC = [];
                    let snipVal = ort.core.data;
                    for (let sc = 0; sc < closeOrts.length; sc++) {
                        snipC.push(closeOrts[sc]);
                        snipVal += closeOrts[sc].core.data;
                        nv += closeOrts[sc].pos.vel;
                        ndr += closeOrts[sc].pos.dir;
                        if (snipC.length == 2) break;
                    }
        
                    let validSnip = false;
                    let snipType = null;
                    Object.keys(lfd.snip).forEach((sn) => {
                        if (!validSnip) {
                            if (typeof lfd.snip[sn].formula === 'function')
                                snipType = lfd.snip[sn].formula(snipVal); 
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
                        let nSnip = new LFItem(new LFVector(ort.pos.x, ort.pos.y, nDir, nVel), lfd.snip[snipType], { gen: lf.step, code: snipVal, len: snipVal.length });
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
        
        // decay
        decay: function(ortName, pos) {
            let sA = Math.floor(Math.random() * 360);
            lfd.ort[ortName].dformula.forEach((di) => {
                let nDir = sA;
                sA += 120;
                sA = sA % 360;
                let aX = 8 * Math.cos(nDir * Math.PI / 180);
                let aY = 8 * Math.sin(nDir * Math.PI / 180);
                let nVel = Math.floor(Math.random() * 9) + 4;
                let nDobj = new LFItem(new LFVector(pos.x + aX, pos.y + aY, nDir, nVel), lfd.spek[di.subtype], {gen:lf.step});
                lf.queueItem(nDobj);
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
                    if (v1.indexOf(check[0]) >= 0 && v1.indexOf(check[1]) >= 0) return "snp-pre";
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
                    if (v1.indexOf(check[0]) >= 0 && v1.indexOf(check[1]) >= 0 && v1.indexOf(check[2]) >= 0) return "snp-go";
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
                if (check.toLowerCase() == ":ppp") return "snp-blk";
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
                if (check.toLowerCase() == "e--") return "snp-ex";
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
                    lfd.snip.decay(snip.core.subtype, snip.dynamic["code"], snip.pos);
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
                        Object.keys(lfd.snip).forEach((sn) => {
                            if (!validSnip) {
                                snipType = lfd.snip[sn].formula(newVal); 
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
                            let nSnip = new LFItem(new LFVector(snip.pos.x, snip.pos.y, nDir, snip.pos.vel + velAdd), lfd.snip[snipType], { gen: lf.step, code: newVal, len: newVal.length });
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
        
                        let nBrane = new LFItem(new LFVector(Math.floor(mxSum / mCount), Math.floor(mySum / mCount), 0, 0), lfd.struck.struckBrane, { gen: lf.step });
                        lf.queueItem(nBrane);
                    }
                    else if (closest != undefined && closest != null) {
                        let des = closest.pos.subtract(snip.pos);
                        if (des.magnitude() > snip.core.range) {
                            snip.pos.dir = des.dir;
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
        
                        let nSeed = new LFItem(new LFVector(Math.floor(sxSum / sCount), Math.floor(sySum / sCount), 0, 0), lfd.struck.struckSeed, { gen: lf.step });
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
                        let mX = Math.random() > 0.5 ? snip.pos.x - Math.floor(Math.random() * 4) : snip.pos.x + Math.floor(Math.random() * 4);
                        let mY = Math.random() > 0.5 ? snip.pos.y - Math.floor(Math.random() * 4) : snip.pos.y + Math.floor(Math.random() * 4);
                        let nDir = (snip.pos.dir + addTo.pos.dir) / 2;
                        let nVel = (snip.pos.vel + addTo.pos.vel) / 2;
                        let codes = [ snip.dynamic["code"], addTo.dynamic["code"] ]; 
                        let nStrand = new LFItem(new LFVector(mX, mY, nDir, nVel), lfd.strand.strand, { gen: lf.step, codes: codes });
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
            if (lfd.snip[snipName].subtype == "snipPre" || snipCode.length == 2) {
                let nDir = Math.floor(Math.random() * 360);
                let nVel = Math.floor(Math.random() * 7) + 6;
                let comps = [ snipCode[0], snipCode[1] ];
                comps.forEach((orta) => {
                    let xDir = 12 * Math.cos(nDir * Math.PI / 180);
                    let yDir = 12 * Math.sin(nDir * Math.PI / 180);
                    let nOrt = new LFItem(new LFVector(pos.x + xDir, pos.y + yDir, nDir, nVel), lfd.ort["ort" + orta], {gen:lf.step});
                    lf.queueItem(nOrt);
                    nDir += (360 / comps.length);
                    nDir = nDir % 360;
                });
            }
            else if (lfd.snip[snipName].subtype == "snipEx" || snipCode == "e--") {
                let nDir = pos.dir + 180;
                nDir = nDir % 360;
                let nVel = Math.floor(Math.random() * 5) + 10;
                let dX = 12 * Math.cos(nDir * Math.PI / 180);
                let dY = 12 * Math.sin(nDir * Math.PI / 180);
                let nOrt = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.ort.ortP, {gen:lf.step});
                lf.queueItem(nOrt);
                nDir = pos.dir - 60;
                nDir = nDir % 360;
                nVel = Math.floor(Math.random() * 5) + 10;
                dX = 12 * Math.cos(nDir * Math.PI / 180);
                dY = 12 * Math.sin(nDir * Math.PI / 180);
                let nSpk1 = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.spek.spkX, {gen:lf.step});
                lf.queueItem(nSpk1);
                nDir = pos.dir + 60;
                nDir = nDir % 360;
                dX = 12 * Math.cos(nDir * Math.PI / 180);
                dY = 12 * Math.sin(nDir * Math.PI / 180);
                let nSpk2 = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.spek.spkX, {gen:lf.step});
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
                    let nOrt = new LFItem(new LFVector(pos.x + xDir, pos.y + yDir, nDir, nVel), lfd.ort["ort" + orta.toUpperCase()], {gen:lf.step});
                    lf.queueItem(nOrt);
                    nDir += (360 / comps.length);
                    nDir = nDir % 360;
                });
                let dCmpX = lfd.ort["ort" + dComp.toUpperCase()].dformula;
                let oA = Math.floor(Math.random() * 360);
                let oCount = dCmpX.length;
                dCmpX.forEach((spk) => {
                    let nDir = oA;
                    let dX = 8 * Math.cos(nDir * Math.PI / 180);
                    let dY = 8 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 9) + 4;
                    let nSpk = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.spek[spk.subtype], {gen:lf.step});
                    lf.queueItem(nSpk);
                    oA += 360 / oCount;
                    oA = oA % 360;
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
                lfd.strand.decay(strand.dynamic["codes"], strand.pos);
                strand.deactivate();
            }
            else {
        
                let spawned = false;
                let combined = false
        
                let close = lf.query(strand);
        
                let membrane = null;
                close.forEach((itm) => {
                    let sums = groupObj(strand.dynamic["codes"],[lfd.snip.snipEx.data]);
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
                            strand.pos.vel += itm.pos.vel;
                            strand.pos.dir += itm.pos.dir;
                            itm.deactivate();
                        }
                    }
                    else if (itm.core.type == "strand") {
                        let nCodes = [];
        
                        let codeLen = strand.dynamic["codes"].length + itm.dynamic["codes"].length;
                        let canComb = false;
                        let sumB = groupObj(itm.dynamic["codes"],[lfd.snip.snipEx.data]);
                        let sumE = sums[lfd.snip.snipEx.data] + sumB[lfd.snip.snipEx.data];
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
                            strand.pos.vel += itm.pos.vel;
                            strand.pos.dir += itm.pos.dir;
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
        
                    let nVel = Math.floor(Math.random() * 360);
                    let nDir = Math.floor(Math.random() * 9);
                    let nPro= new LFItem(new LFVector(strand.pos.x, strand.pos.y,nDir,nVel),ldf.proto[protoType], ptDyn, strand.genetic, iOps);
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
                    strand.obj.innerHTML = lfd.strand.strand.content.replace("<!--nm-->",strand.dynamic["codes"].length);
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
                    if (rCodes[0] == lfd.snip.snipEx.data) sType = "snipEx"
                    let nSnp = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.snip[sType], {gen:lf.step, code: rCodes[0]});
                    lf.queueItem(nSnp);
                    oA += 360 / sCount;
                    oA = oA % 360;
                }
                else {
                    let nDir = oA;
                    let dX = 40 * Math.cos(nDir * Math.PI / 180);
                    let dY = 40 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 5) + 10;
                    let nStd = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.strand.strand, {gen:lf.step, codes: rCodes, len: rCodes.length});
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
                    if (rCodes2[0] == lfd.snip.snipEx.data) sType = "snipEx";
                    let nSnp = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.snip[sType], {gen:lf.step, code: rCodes2[0]});
                    lf.queueItem(nSnp);
                    oA += 360 / sCount;
                    oA = oA % 360;
                }
                else {
                    let nDir = oA;
                    let dX = 40 * Math.cos(nDir * Math.PI / 180);
                    let dY = 40 * Math.sin(nDir * Math.PI / 180);
                    let nVel = Math.floor(Math.random() * 5) + 10;
                    let nStd = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.strand.strand, {gen:lf.step, codes: rCodes2, len: rCodes2.length});
                    lf.queueItem(nStd);
                    oA += 360 / sCount;
                    oA = oA % 360;
                }
            }
            let dType = "snipGo";
            if (dCode == lfd.snip.snipEx.data) dType = "snipEx";
            if (dCode != undefined && dCode != null) {
                lfd.snip.decay(dType, dCode, pos);
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
                lfd.proto.decay(proto);
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
                    let nProto = new LFItem(new LFVector(proto.pos.x, proto.pos.y, nDir, nVel), ldf.proto[proto.core.subtype], {gen: lf.step, codes: proto.dynamic["codes"].splice()}, JSON.parse(JSON.stringify(proto.genetic)), iOps);
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
                let nBlk = new LFItem(new LFVector(proto.pos.x + dX, proto.pos.y + dY, oA, nVel), lfd.snip.snipBlk, { gen: lf.step, code: "ppp"});
                lf.queueItem(nBlk);
                oA += 360 / blkCount;
                oA = oA % 360;
            }
        
            lfd.strand.decay(proto.dynamic["codes"], proto.pos);
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
                lfd.struck.decay(struck);
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
                        let nDobj = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.snip.snipBlk, {gen: lf.step,code:"ppp",len: 3});
                        lf.queueItem(nDobj);
                        oA += 360 / snipCount;
                        oA = oA % 360;
                    }
                    oA = Math.floor(Math.random() * 360);
                    let oCount = degradeCount * 3;
                    for (let pp = 0; pp < oCount; pp++) {
                        let dForm = lfd.ort["ortP"].core.dformula;
                        dForm.array.forEach((spOps) => {
                            let nDir = oA;
                            let dX = 8 * Math.cos(nDir * Math.PI / 180);
                            let dY = 8 * Math.sin(nDir * Math.PI / 180);
                            let nVel = Math.floor(Math.random() * 9) + 4;
                            let nSobj = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.spek[spOps.subtype], {gen: lf.step});
                            lf.queueItem(nSobj);
                            oA += 360 / oCount;
                            oA = oA % 360;
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
                        let nDobj = new LFItem(new LFVector(pos.x + dX, pos.y + dY, nDir, nVel), lfd.snip.snipEx, {gen: lf.step,code:"e--",len: 3});
                        lf.queueItem(nDobj);
                        oA2 += 360 / snipCount2;
                        oA2 = oA2 % 360;
                    }
                    oA2 = Math.floor(Math.random() * 360);
                    let oCount2 = degradeCount2;
                    for (let ss = 0; ss < oCount2; ss++) {
                        lfd.snip.decay("snp-ex","e--", pos);
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
                    let nItem = new LFItem(new LFVector(nX, nY, nDir, nVel), lfd.spek[k1], {gen:lf.step});
                    lf.addItem(nItem);
                }
                addR += Math.floor(Math.random() * 15) + 5;
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
                    let nItem = new LFItem(new LFVector(nX, nY, nDir, nVel), lfd.spek[k1], {gen:lf.step});
                    lf.addItem(nItem);
                }
                addR += Math.floor(Math.random() * 20) + 10;
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
                pos: new LFVector(mX, mY, 0, 0),
                ops: { range: r, type: "drip" }
            };
            let close = lf.query(drip);
            close.forEach((elem) => {
                if (elem.active) {
                    let dRes = elem.pos.subtract(drip.pos);
    
                    let dA = dRes.dir % 360;
                    let force = 20;
                    let nVel = ((r - dRes.magnitude()) + 1) * 3;
                    if (elem.pos.vel < 0.5) {
                        elem.obj.classList.add("hit-by-" + dID + "-1");
                        elem.pos.dir = dA;
                        elem.pos.vel += nVel;
                    }
                    else {
                        elem.obj.classList.add("hit-by-" + dID + "-2");
                        elem.pos.vel += nVel;
                        elem.pos.dir = dA;
                    }
                }
            });
    
            if (Math.random() > 0.5) {
                let nDir = Math.floor(Math.random() * 360);
                let nBlip = new LFItem(new LFVector(mX, mY, 0, nDir), lfd.struck.struckBlip, { gen: lf.step });
                nBlip.obj.style.opacity = 0.4;
                lf.queueItem(nBlip);
            }
    
            let gs = [ "spekG1", "spekG2" ];
            let gCount = Math.floor(Math.random() * 4) + 3;
            let gA = Math.floor(Math.random() * 360);
            let addA = 360 / gCount;
            for (let g = 0; g < gCount; g++) {
                let nVel = Math.floor(Math.random() * 10) + 10;
                let gName = gs[Math.floor(Math.random() * gs.length)];
                let nGas = new LFItem(new LFVector(mX, mY, nVel,gA), lfd.spek[gName], { gen: lf.step });
                lf.queueItem(nGas);
                gA += addA;
                gA = gA % 360;
            }
    
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