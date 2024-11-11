let blkCount = 3;
let replCount = 6;

const LFBehavior = {
    reset: (item) => {
        let newParams = {};
        newParams["actions"] = [];
        newParams["found"] = [];
        newParams["seektarget"] = null;
        newParams["respiration"] = null;
        newParams["chem"] = null;
        newParams["digestion"] = {
            "snipEx": 3,
            "struckSeed": 6
        };
        newParams["offing"] = 0;
        newParams["speed"] = 0;
        newParams["prange"] = 0;
        newParams["viral"] = {
            markers: 0,
            pull: 1,
            incubate: 5,
            max: 3,
            exp: 2
        };
        return newParams; 
    },
    breathe: (item, params) => {
        if (!params.actions.includes("breathe")) {
            if (item.complex >= 1) {
                params.actions.push("breathe");
                if (!("respirationCount" in item.dynamic.mem)) item.dynamic.mem["respirationCount"] = 0;
                
                let respIn = params.respiration[0];
                let respOut = params.respiration[1]

                let hasBreath = false;

                let found = lf.haze.query(item,respIn);
                let lifeAdd = item.age % 5 == 0 ? 0 : 1;
                if (found.length > 0 && lifeAdd > 0) {
                    shuffleArray(found);
                    lf.haze.transact(found[0].tableIndex,respIn,-1);
                    lf.haze.add(item.pos.x, item.pos.y, respOut, 1);
                    item.life = item.life + lifeAdd > item.maxlife ? item.maxlife : item.life + lifeAdd;
                    //console.log(item.id + " breathed!");
                    hasBreath = true;
                }

                let pip = item.obj.querySelector(".breath-pip");
                if (item.dynamic.mem["respirationCount"] > 0) item.dynamic.mem["respirationCount"]--;
                if (item.dynamic.mem["respirationCount"] == 0) {
                    if (hasBreath) {
                        item.dynamic.mem["respirationCount"] = 10;
                        if (!pip.classList.contains("breathing")) pip.classList.add("breathing"); 
                        else pip.classList.remove("breathing");
                    }
                    else {
                        item.dynamic.mem["respirationCount"] = 0;
                        pip.classList.remove("breathing"); 
                    }
                }
                
            }
        }

        return params;
    },
    move: function(item, params) {
        if (!params.actions.includes("move")) {
            if (item.complex >= 1) {
                params.actions.push("move");

                let iSpeed = params.speed == 0 ? 2 : params.speed;
                if (item.complex == 1) iSpeed *= 0.5;

                let mvSet = false;
                let targetItem = null;
                if (params.seektarget != null && params.seektarget in lf.iHash && lf.items[lf.iHash[params.seektarget]] != undefined)
                    targetItem = lf.items[lf.iHash[params.seektarget]];
                if (targetItem != null) { 
                    let target = targetItem.pos;
                    let des = item.pos.subtract(target);
                    if (lf.dbhr.track != null && lf.dbhr.track == item.id) {
                        lf.dbhr.obj.style.transform = "rotate(" + des.dir + "deg)";
                        lf.dbhr.obj.style.width = des.magnitude() + "px";
                    }
                    let desDir = des.dir;
                    if (Math.abs(item.pos.dir - desDir) > 30) {
                        let tDir = 1;
                        if ("tdir" in item.dynamic.mem && item.dynamic.mem["tdir"] != 0) tdir = item.dynamic.mem["tdir"];
                        else {
                            let ntDir = (Math.abs(desDir)/desDir);
                            item.dynamic.mem["tdir"] = ntDir;
                            tDir = ntDir;
                        }
                        let addVal = 30 * tDir;
                        desDir = item.pos.dir + addVal;
                    }
                    else {
                        item.dynamic.mem["tdir"] = 0;
                    }
                    item.pos.dir = desDir;
                    if (item.complex >= 2 || (item.complex >= 1 && item.pos.vel <= 0.9)) {
                        item.pos.vel = iSpeed;
                        if (des.magnitude() < iSpeed || (target.vel > 0 && des.magnitude() < target.vel)) {
                            item.pos.vel = 0; //des.magnitude();
                        }
                    }
                    mvSet = true;
                }
                
                if (!mvSet) {
                    item.dynamic.mem["tdir"] = 0;
                    if (item.complex >= 2 || (item.complex >= 1 && item.pos.vel <= 0.9)) {
                        item.pos.dir += 10 - Math.floor(Math.random() * 21);
                        item.pos.vel = iSpeed; 
                    }
                } 

                item.obj.setAttribute("dir", item.pos.dir);
                item.obj.setAttribute("speed", params.speed);

                //item.pos.move(0);
                //console.log(item.id + " moved!");
            }
        }

        return params;
    },
    estore: function(item, params) {
        if (!params.actions.includes("estore")) 
            params.actions.push("estore");
        return params;
    },
    eat: function(item, params) {
        if (!params.actions.includes("eat")) {
            if (item.complex >= 2) {  
                params.actions.push("eat");
                if (!("digCount" in item.dynamic.mem)) { item.dynamic.mem["digCount"] = 0; }
                if (!("gut" in item.dynamic.mem)) { item.dynamic.mem["gut"] = []; }
                if (!("digEnergy" in item.dynamic.mem)) { item.dynamic.mem["digEnergy"] = 0; }
                if (!("prey" in item.dynamic.mem)) { item.dynamic.mem["prey"] = null; }
                if (!("preyCount" in item.dynamic.mem)) { item.dynamic.mem["preyCount"] = 0; }
                    

                if (item.dynamic.mem["prey"] != null) {
                    if (!item.dynamic.mem["prey"].active) item.dynamic.mem["prey"] = null;
                    else if (!(item.dynamic.mem["prey"].id in lf.iHash)) item.dynamic.mem["prey"] = null;
                }

                let isDig = item.dynamic.mem["digCount"] > 0 ? true : false;
                let dWeights = params.digestion;
                if (item.dynamic.mem["prey"] != null) {
                    let prey = item.dynamic.mem["prey"];
                    let tVec = prey.pos.subtract(item.pos);

                    if (tVec.magnitude() < prey.obj.clientWidth) {
                        item.pos.dir = tVec.dir;

                        item.dynamic.mem["preyCount"]--;

                        if (item.dynamic.mem["preyCount"] <= 0) {
                            item.dynamic.mem["preyCount"] = 2;
                            if (item.obj.classList.contains("eating")) item.obj.classList.remove("eating");
                            else item.obj.classList.add("eating");
                        }

                        let energy = item.dynamic.mem["prey"].life < 25 ? item.dynamic.mem["prey"].life : 20;
                        item.dynamic.mem["prey"].life = item.dynamic.mem["prey"].life - energy < 0 ? 0 : item.dynamic.mem["prey"].life - energy;
                        if (params.actions.includes("estore")) item.life += energy;
                        else {
                            item.life = item.life + energy > item.maxlife ? item.maxlife : item.life + energy; 
                        }

                        if (item.dynamic.mem["prey"].life <= 0) {
                            item.dynamic.mem["digCount"] = 10;
                            item.dynamic.mem["digEnergy"] = Math.floor(energy * 0.25) + 1 < 5 ? 5 : Math.floor(energy * 0.5) + 1;
                            let fCode = item.dynamic.mem["prey"].dynamic.codes;
                            item.dynamic.mem["gut"].push({type:item.dynamic.mem["prey"].core.type, subtype: item.dynamic.mem["prey"].core.subtype, parentid: item.dynamic.mem["prey"].parent, code: fCode });
                            item.dynamic.mem["prey"].deactivate();
                            item.dynamic.mem["prey"] = null;
                            item.dynamic.mem["preyCount"] = 0;
                            params.seektarget = null;
                            if (!item.obj.classList.contains("eating")) item.obj.classList.add("eating");
                        }
                        else {
                            params.seektarget = item.dynamic.mem["prey"].id;
                        }
                    }
                    else {
                        params.seektarget = item.dynamic.mem["prey"].id;
                    }
                }
                else if (item.dynamic.mem["digCount"] > 0) {
                    item.dynamic.mem["digCount"]--;
                    item.life += item.dynamic.mem["digEnergy"];
                }
                else {
                    if (item.dynamic.mem["gut"].length > 0) {
                        switch (item.dynamic.mem["gut"][0].type) {
                            case "snip":
                                lfcore.snip.decay(item.dynamic.mem["gut"][0].subtype, item.dynamic.mem["gut"][0].code, item.pos);
                                break;
                            case "struck":
                                lfcore.struck.decay(item.dynamic.mem["gut"][0].subtype, item.pos);
                                break;
                            case "proto":

                                lf.haze.add(item.pos.x, item.pos.y, "spekG3", Math.floor(Math.random() * 10) + 5);

                                let pCount = Math.floor(Math.random() * 3);
                                let eCount = Math.floor(Math.random() * 3);
                                let uCount = Math.floor(Math.random() * 3) + 2;

                                let aDir = item.pos.dir - 120;
                                let aAdd = 120 / (pCount + eCount + uCount);

                                for (let pp = 0; pp < pCount; pp++) {
                                    let nX = item.pos.x;
                                    let nY = item.pos.y;
                                    let nDir = aDir;
                                    let nVel = 5;
                                    lf.queueItem(new LFItem(new LFVector(nX,nY,nDir,nVel), lfcore.ort.ortP, null));
                                    aDir += aAdd;
                                }

                                for (let ee = 0; ee < eCount; ee++) {
                                    let nX = item.pos.x;
                                    let nY = item.pos.y;
                                    let nDir = aDir;
                                    let nVel = 5;
                                    lf.queueItem(new LFItem(new LFVector(nX,nY,nDir,nVel), lfcore.ort.ortE, null));
                                    aDir += aAdd;
                                }

                                for (let uu = 0; uu < uCount; uu++) {
                                    let nX = item.pos.x;
                                    let nY = item.pos.y;
                                    let nDir = aDir;
                                    let nVel = 5;
                                    lf.queueItem(new LFItem(new LFVector(nX,nY,nDir,nVel), lfcore.ort.ortU, null));
                                    aDir += aAdd;
                                }

                                break;
                        }
                        let addV = dWeights[item.dynamic.mem["gut"][0].subtype];
                        if (params.offing > 0 && item.dynamic.mem["gut"][0].parentid == item.id) addV = Math.floor(addV * params.offing);
                        if (addV < 1) addV = 1;
                        else if (addV > 30) addV = 30;
                        item.life = item.life + addV > item.maxlife ? item.maxlife : item.life + addV;
                        item.dynamic.mem["digCount"] = 0;
                        item.dynamic.mem["gut"] = [];
                        item.dynamic.mem["digEnergy"] = 0;
                        item.obj.classList.remove("eating");
                    }
                    else {
                        let qR = item.core.range / 2;
                        let fd = lf.query(item, null, { range: qR });

                        fd.forEach((fItem) => {
                            if (fItem.core.subtype in dWeights && dWeights[fItem.core.subtype] > 0 && item.dynamic.mem["digCount"] == 0 && (fItem.parent != item.id || params.offing > 0)) {
                                let des = fItem.pos.subtract(item.pos);

                                if (Math.abs(des.dir) < 30 || des.magnitude() < item.core.range / 2) {
                                    if (fItem.core.type == "proto") {
                                        let canDig = true;

                                        let matchCount = 0;
                                        for (let mc = 0; mc < fItem.dynamic.codes.length; mc++) {
                                            if (item.dynamic.codes.includes(fItem.dynamic.codes[mc])) matchCount++;
                                        }
                                        let perc = matchCount / item.dynamic.codes.length;
                                        if (perc > 0.8) {
                                            canDig = false;
                                        }

                                        if (item.dynamic.mem["prey"] == null && canDig) {
                                            item.dynamic.mem["prey"] = fItem;
                                            item.dynamic.mem["preyCount"] = 2;
                                            if (!item.obj.classList.contains("eating")) item.obj.classList.add("eating");
                                        }
                                    }
                                    
                                    if (item.dynamic.mem["prey"] == null && fItem.core.type != "proto") {
                                        let iWeight = dWeights[fItem.core.subtype];
                                        item.dynamic.mem["digCount"] = iWeight;
                                        item.dynamic.mem["digEnergy"] = 3; 
                                        if (params.offing > 0 && fItem.parentid == item.id) {
                                            item.dynamic.mem["digEnergy"] = 1;
                                            item.dynamic.mem["digCount"] = Math.floor(iWeight / 2);
                                        }
                                        let fCode = "";
                                        if (fItem.core.type == "snip") fCode = fItem.dynamic.codes[0];
                                        item.dynamic.mem["gut"].push({type:fItem.core.type, subtype: fItem.core.subtype, parentid: fItem.parent, code: fCode });
                                        item.life += 2;
                                        fItem.debug += "da-eat;";
                                        fItem.deactivate();
                                        item.obj.classList.add("eating");
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }

        return params;
    },
    chem: function(item, params) {
        if (!params.actions.includes("chem")) {
            if (item.complex == 1 && params.chem != null) {
                params.actions.push("chem");

                if (!("chemCap" in item.dynamic.mem)) item.dynamic.mem["chemCap"] = 0;
                if (!("chemStep" in item.dynamic.mem)) item.dynamic.mem["chemStep"] = 0;
                if (!("chemEmit" in item.dynamic.mem)) item.dynamic.mem["chemEmit"] = 0;
                if (!("chemCounter" in item.dynamic.mem)) item.dynamic.mem["chemCounter"] = 0;

                let hasChem = false;
                let chemType = params.chem.type
                let chemTime = params.chem.time;
                let chemEnergy = params.chem.energy;
                let chemAmount = params.chem.amount;
                
                let found = lf.haze.query(item,chemType);
                if (found.length > 0) {
                    shuffleArray(found);
                    found.forEach((tb) => {
                        if (tb.count > 0 && item.dynamic.mem["chemCap"] < chemAmount) {
                            item.dynamic.mem["chemCap"]++;
                            lf.haze.transact(tb.tableIndex,chemType,-1);
                        }
                    });

                    if (item.dynamic.mem["chemCap"] >= chemAmount) {
                        hasChem = true;
                        if (item.dynamic.mem["chemStep"] >= chemTime) {
                            item.dynamic.mem["chemCounter"] = 0;
                            item.dynamic.mem["chemCap"] -= chemAmount;
                            item.dynamic.mem["chemStep"] = 0;
                            item.dynamic.mem["chemEmit"]++;
                            item.life = item.life + chemEnergy > item.maxlife ? item.maxlife : item.life + chemEnergy;
                            lf.haze.add(item.x, item.y, "spekX", 1);
                            if (item.dynamic.mem["chemEmit"] >= params.chem.emit) {
                                let nDir = (item.pos.dir + 180) % 360;
                                let nVel = 2;
                                let nEx = new LFItem(new LFVector(item.pos.x, item.pos.y, nDir, nVel), lfcore.snip.snipEx, { parent: item.id, code: lfcore.snip["snipEx"].data });
                                lf.queueItem(nEx);
                                item.dynamic.mem["chemEmit"] = 0;
                            }
                            //console.log("chemed!!");
                        }
                        else {
                            item.dynamic.mem["chemStep"]++;
                            item.life = item.life + 2 > item.maxlife ? item.maxlife : item.life + 2;
                        }
                    }
                }

                let pip = item.obj.querySelector(".chem-pip");
                if (item.dynamic.mem["chemCounter"] > 0) item.dynamic.mem["chemCounter"]--;
                if (item.dynamic.mem["chemCounter"] == 0) {
                    if (hasChem) {
                        item.dynamic.mem["chemCounter"] = 10;
                        if (!pip.classList.contains("cheming")) pip.classList.add("cheming"); 
                        else pip.classList.remove("cheming");
                    }
                    else {
                        item.dynamic.mem["chemCounter"] = 0;
                        pip.classList.remove("cheming"); 
                    }
                }
                else if (!hasChem) {
                    pip.classList.remove("cheming"); 
                    item.dynamic.mem["chemCounter"] = 10;
                }   
            }
        }

        return params;
    },
    perceive: function(item, params) {
        if (!params.actions.includes("perceive")) {
            if (item.complex >= 1) {
                params.actions.push("perceive");
                
                let pRange = params.prange == 0 ? item.core.range * 2 : params.prange;

                params.found = lf.query(item, null, { range: pRange });
            }
        }

        return params;
    },
    seek: function(item, params) {
        if (!params.actions.includes("seek")) {
            if (item.complex >= 1 && params.found.length > 0) {
                params.actions.push("seek");

                if (params.seektarget == null) {
                    let target = null;

                    if (params.actions.includes("breathe") && params.respiration != null && params.respiration.length == 2 && params.respiration[0] != null) {
                        let rsp = lf.haze.query(item, params.respiration[0]);
                        let minD = null;
                        rsp.forEach((tb) => {
                            let tbC = lf.haze.getCellPos(tb.tableIndex);
                            if (tbC != null) {
                                let dD = Math.hypot(item.pos.x - tbC.x, item.pos.y - tbC.y);
                                if (params.seektarget == null) { 
                                    minD = dD;
                                    target = new LFVector(tbC.x,tbC.y,0,0);
                                }
                                else if (dD < minD) { 
                                    minD = dD;
                                    target = new LFVector(tbC.x,tbC.y,0,0);
                                }
                            }
                        });
                    }
                    if (params.actions.includes("chem")) {
                        if (item.dynamic.mem["chemCap"] < 3) {
                            let fG3 = lf.haze.query(item, "spekG3");
                            if (fG3.length > 0) {
                                let minD = null;
                                fG3.forEach((tb) => {
                                    let tbC = lf.haze.getCellPos(tb.tableIndex);
                                    if (tbC != null) {
                                        let dD = Math.hypot(item.pos.x - tbC.x, item.pos.y - tbC.y);
                                        if (params.seektarget == null) { 
                                            minD = dD; 
                                            target = new LFVector(tbC.x,tbC.y,0,0);
                                        }
                                        else if (minD == null || dD < minD) { 
                                            minD = dD; 
                                            target = new LFVector(tbC.x,tbC.y,0,0); 
                                        }
                                    }
                                });
                            }
                        }
                    }
                    if (params.actions.includes("eat") && item.dynamic.mem["gut"].length == 0 && item.dynamic.mem["prey"] == null) {
                        let minD = null;
                        for (let ski = params.found.length -1; ski >= 0; ski--) {
                            if (params.found[ski].core.type == "proto" && item.dynamic.codes.length > 0) {
                                let matchCount = 0;
                                for (let mc = 0; mc < params.found[ski].dynamic.codes.length; mc++) {
                                    if (item.dynamic.codes.includes(params.found[ski].dynamic.codes[mc])) matchCount++;
                                }
                                let perc = matchCount / item.dynamic.codes.length;
                                if (perc > 0.8) {
                                    params.found.splice(ski,1);
                                }
                            }
                        }
                        params.found.forEach((sk) => {
                            if (sk.core.subtype in params.digestion) {
                                let isDig = true;

                                if (isDig) {
                                    let dD = Math.hypot(item.pos.x - sk.pos.x, item.pos.y - sk.pos.y);
                                    let tWidth = sk.obj.clientWidth / 2;
                                    if (params.seektarget == null) { 
                                        minD = dD; 
                                        target = sk.id; 
                                    }
                                    else if (minD == null || dD < minD) { 
                                        minD = dD; 
                                        target = sk.id;
                                    }
                                }
                            }
                        });
                        if (target != null) params.found = [];
                    }
                    
                    params.seektarget = target;
                }
            }
        }

        return params;
    },
    antibody: function(item,params) {
        if (!params.actions.includes("anibody")) {
            params.actions.push("antibody");
            
            if (!("antiv" in item.dynamic.mem)) item.dynamic.mem["antiv"] = [];

            if ("infected" in item.dynamic.mem) {
                let vid = item.dynamic.mem["infected"];
                let vItm = null
                if (vid in lf.iHash && lf.items[lf.iHash[vid]].active) vItm = lf.items[lf.iHash[vid]];
                if (vItm != undefined && vItm != null) {
                    item.dynamic.mem["antiv"].push(vItm.dynamic.codes.join(":"));
                    item.dynamic.mem["infected"] = "";
                    vItm.deactivate();
                } 
            }
        }

        return params;
    },
    activate: function(item,params,vops=null) {
        if (!params.actions.includes("v-activate")) {
            params.actions.push("v-activate");
        }
        params.viral.markers++;
        if (vops != null) {
            Object.keys(vops).forEach((ky) => {
                if (ky in params.viral) params.viral[ky] += vops[ky];
            });
        }
        return params;
    },
    infect: function(item, params) {
        if (!params.actions.includes("infect")) {
            params.actions.push("infect");

            if (params.viral.markers >= gVars.vactCount) {
                params.actions.push("infect-active");
                if (!("infcount" in item.dynamic.mem)) item.dynamic.mem["infcount"] = 0;
                if (!("inftotal" in item.dynamic.mem)) item.dynamic.mem["inftotal"] = 0;
                if (!("infhost" in item.dynamic.mem)) item.dynamic.mem["infhost"] = null;

                let hasHost = false;

                if (item.dynamic.mem["infhost"] != null) {
                    let hostID = item.dynamic.mem["infhost"];
                    let host = null;
                    if (hostID in lf.iHash) {
                        if (lf.items[lf.iHash[hostID]].active) {
                            host = lf.items[lf.iHash[hostID]];
                            hasHost = true;
                        }
                    }

                    if (host != null) {
                        item.obj.display = "none";
                        item.pos.vel = 0;
                        item.pos.x = host.pos.x;
                        item.pos.y = host.pos.y;
                        item.pos.dir = host.pos.dir;
                        item.pos.vel = host.pos.vel;
                        item.life = item.maxlife;
                        if (item.dynamic.mem["infcount"] >= params.viral.incubate) {
                            item.dynamic.mem["inftotal"]++;
                            item.dynamic.mem["infcount"] = 0;
                            if (item.dynamic.mem["inftotal"] >= params.viral.max) {
                                item.dynamic.mem["inftotal"] = 0;
                                // expel
                                let expCount = params.viral.exp;
                                item.dynamic.mem["inftotal"] -= expCount;
                                let aDir = host.pos.dir - 20;
                                let aAdd = 20;
                                for (let ee = 0; ee < expCount; ee++) {
                                    let nX = item.pos.x;
                                    let nY = item.pos.y;
                                    let nDir = aDir;
                                    let nVel = host.pos.vel * 2.5;
                                    if (nVel < 5) nVel = 5;
                                    lf.queueItem(new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.strand.strandV, { parent: item.id, codes: JSON.parse(JSON.stringify(item.dynamic.codes)) }));
                                    aDir += aAdd;
                                    aDir %= 360;
                                }
                            }
                        }
                        else {
                            host.life = host.life - params.viral.pull >= 0 ? host.life - params.viral.pull : 0;
                            if (host.life > 0) {
                                item.dynamic.mem["infcount"]++;
                            }
                            else {
                                host = null;
                            }
                        }
                    }

                    if (host == null) {
                        let expCount = item.dynamic.mem["inftotal"];
                        item.dynamic.mem["infhost"] = null;
                        item.dynamic.mem["infcount"] = 0;
                        item.dynamic.mem["inftotal"] = 0;

                        let aDir = item.pos.dir;
                        let aAdd = Math.floor(360 / (expCount + 1));
                        aDir += aAdd;

                        for (let ee = 0; ee < expCount; ee++) {
                            let nX = item.pos.x;
                            let nY = item.pos.y;
                            let nVel = item.pos.vel;
                            let nDir = aDir;
                            lf.queueItem(new LFItem(new LFVector(nX, nY, nDir, nVel), lfcore.strand.strandV, { parent: item.id, codes: JSON.parse(JSON.stringify(item.dynamic.codes)) }));
                            aDir += aAdd;
                            aDir %= 360;
                        }

                        item.obj.style.display = "block";
                    }
                }
                
                if (!hasHost) {
                    let hosts = lf.query(item,"proto");
                    let minDist = null;
                    let newHost = null;
                    let mCode = item.dynamic.codes.join(":");
                    if (hosts.length > 0) {
                        for (let h = 0; h < hosts.length; h++) {
                            if (!("infected" in hosts[h].dynamic.mem)) {
                                let canInfect = true;
                                if ("antiv" in hosts[h].dynamic.mem) {
                                    if (hosts[h].dynamic.mem["antiv"].includes(mCode)) canInfect = false;
                                }
                                if (canInfect) {
                                    let dist = Math.hypot(item.pos.x - hosts[h].pos.x, item.pos.y - hosts[h].pos.y);
                                    if (minDist == null) {
                                        newHost = hosts[h];
                                        minDist = dist;
                                    }
                                    else if (dist < minDist) {
                                        newHost = hosts[h];
                                        minDist = dist;
                                    }
                                }
                            }
                        }
                        if (newHost != null) {
                            item.dynamic.mem["infhost"] = newHost.id;
                            let addClass = "infected-" + item.dynamic.mem["v-type"];
                            newHost.obj.classList.add(addClass);
                            newHost.dynamic.mem["infected"] = item.id;
                            item.obj.display = "none";
                        }
                    }
                }
            }
        }
        
        return params;
    },
    build: function(item, params) {
        if(!params.actions.includes("build")) {
            params.actions.push("build");

            if (!(params.actions.includes("infect-active"))) {

                if (!("buildparts" in item.dynamic.mem)) item.dynamic.mem["buildparts"] = { "p": 0 };
                if (!("buildcount" in item.dynamic.mem)) item.dynamic.mem["buildcount"] = 0;

                let parts = lf.query(item, "ort");
                for (let p = 0; p < parts.length; p++) {
                    if (parts[p].core.type == "ort" && parts[p].core.data == "p" && item.dynamic.mem["buildparts"]["p"] < 3) {
                        item.dynamic.mem["buildparts"]["p"]++;
                        parts[p].debug += "da-build;";
                        parts[p].deactivate();
                    }
                }
                if (item.dynamic.mem["buildparts"]["p"] == 3) {
                    let snipVal = "ppp";
                    let nDir = Math.floor(Math.random() * 360);
                    let nVel = Math.floor(Math.random() * 10) + 5;
                    let nsnip = new LFItem(new LFVector(item.pos.x, item.pos.y, nDir, nVel), lfcore.snip.snipBlk, { code: snipVal });
                    lf.queueItem(nsnip);
                    item.dynamic.mem["buildcount"]++; 
                    item.dynamic.mem["buildparts"]["p"] = 0;
                    if (item.core.type == "snip") item.obj.innerHTML = "&int;";
                    else if (item.core.type == "strand") item.obj.innerHTML = item.core.content;
                }
                else if (item.dynamic.mem["buildparts"]["p"] == 2) {
                    if (item.core.type == "strand") item.obj.innerHTML = "<i class=\"loaded\" style=\"font-size: 0.8rem;font-style: normal;letter-spacing: -0.3rem;\">&prop;&mumap;</i>"; //closed 
                    else item.obj.innerHTML = "<i class=\"loaded\">&cwconint;</i>"; // int with circle
                }
                else if (item.dynamic.mem["buildparts"]["p"] == 1) {
                    if (item.core.type == "strand") item.obj.innerHTML = "<i class=\"loaded\" style=\"font-size: 0.8rem;font-style: normal;\">&prop;</i>"; // unclosed inf 
                    else item.obj.innerHTML = "<i class=\"loaded\">&cwint;</i>"; // int with slash
                }
                else if (item.core.type == "strand") item.obj.innerHTML = item.core.content;
                else item.obj.innerHTML = "&int;";

            }
        }

        return params;
    }
}

function LFCodedBehaviors() {
    let me = this;
    me.validOrts = ["a","b","c","d","u"];
    me.gens = {
        "reset": function(item) { 
            return LFBehavior.reset(item);
        },
        "aaa": function(item,params) {
            // increase speed
            params.speed = params.speed == 0 ? params.speed = 3 : params.speed + 2;
            return params;
        },
        "aab": function(item,params) {
            // increase speed
            params.speed = params.speed == 0 ? params.speed = 5 : params.speed + 2;
            return params;
        },
        "aac": function(item,params) {
            // increase speed
            params.speed += 3;
            return params;
        },
        "aad": function(item,params) {
            params.prange = params.speed == 0 ? params.speed = 7 : params.speed + 2;
            return params;
        },
        "aba": function(item,params) {
            params.prange = item.core.range * 6;
            return params;
        },
        "abb": function(item,params) {
            // perceive
            return LFBehavior.perceive(item,params);
        },
        "abc": function(item,params) {
            // seek
            return LFBehavior.seek(item,params);
        },
        "abd": function(item,params) {
            // move
            return LFBehavior.move(item,params);
        },


        "aca": function(item,params) {
            params.respiration = ["spekG2","spekG1"];
            return params;
        },
        "acb": function(item,params) {
            if (params.respiration == null) params.respiration = ["spekG1","spekG2"];
            return LFBehavior.breathe(item,params);
        },
        "acc": function(item,params) {},
        "acd": function(item,params) {},
        "ada": function(item,params) {},
        "adb": function(item,params) {},
        "adc": function(item,params) {},
        "add": function(item,params) {},

        "baa": function(item,params) {
            // enable chem v1
            if (params.chem == null) {
                params.chem = {
                    type: "spekG3",
                    energy: 10,
                    amount: 2,
                    time: 5,
                    emit: 24
                };
            }
            return params;
        },
        "bab": function(item,params) {
            // enable chem v2
            if (params.chem == null) {
                params.chem = {
                    type: "spekG3",
                    energy: 10,
                    amount: 2,
                    time: 5,
                    emit: 24
                };
            }
            else {
                params.chem.energy += 5;
                params.chem.amount += 1;
                params.chem.time += 0;
                params.chem.emit += 3;
            }
            return params;
        },
        "bac": function(item,params) {
            // enable chem v3
            if (params.chem == null) {
                params.chem = {
                    type: "spekG3",
                    energy: 10,
                    amount: 2,
                    time: 5,
                    emit: 24
                };
            }
            else {
                params.chem.energy += 10;
                params.chem.amount += 1;
                params.chem.time += 4;
                params.chem.emit += 3;
            }
            return params;
        },
        "bad": function(item,params) {
            // chem 
            return LFBehavior.chem(item,params);
        },
        "bba": function(item,params) {
            // enable Ex digestion
            params.digestion["snipEx"] = 10;
            params.digestion["struckSeed"] = 30;
            return params;
        },
        "bbb": function(item,params) {
            // increase Ex digestion
            params.digestion["snipEx"] += 5;
            params.digestion["struckSeed"] += 15;
            return params;
        },
        "bbc": function(item,params) {
            // enable Husk digestion
            params.digestion["struckHusk"] = 20;
            return params;
        },
        "bbd": function(item,params) {
            // increase Husk digestion
            params.digestion["struckHusk"] += 10;
            return params;
        },
        "bca": function(item,params) {
            // set offing
            params.offing = 0.25;
            return params;
        },
        "bcb": function(item,params) {
            // set offing
            params.digestion["protoS"] = 20;
            params.digestion["protoC"] = 20;
            return params;
        },
        "bcc": function(item,params) {
            // enable energey storage
            return LFBehavior.estore(item,params);
        },
        "bcd": function(item,params) {
            // eat
            return LFBehavior.eat(item,params);
        },
        "bda": function(item,params) {},
        "bdb": function(item,params) {},
        "bdc": function(item,params) {},
        "bdd": function(item,params) {},
        
        "caa": function(item,params) {
            // antibodies
            return LFBehavior.antibody(item,params);
        },
        "cab": function(item,params) {
            // antibodies
            return LFBehavior.antibody(item,params);
        },

        "cac": function(item,params) {},
        "cad": function(item,params) {},
        "cba": function(item,params) {},
        "cbb": function(item,params) {},
        "cbc": function(item,params) {},
        "cbd": function(item,params) {},
        "cca": function(item,params) {},
        "ccb": function(item,params) {},
        "ccc": function(item,params) {},
        "ccd": function(item,params) {},
        "cda": function(item,params) {},
        "cdb": function(item,params) {},
        "cdc": function(item,params) {},
        "cdd": function(item,params) {},

        "daa": function(item,params) {},
        "dab": function(item,params) {},
        "dac": function(item,params) {},
        "dad": function(item,params) {},
        "dba": function(item,params) {},
        "dbb": function(item,params) {},
        "dbc": function(item,params) {},
        "dbd": function(item,params) {},
        "dca": function(item,params) {},
        "dcb": function(item,params) {},
        "dcc": function(item,params) {},
        "dcd": function(item,params) {},
        "dda": function(item,params) {},
        "ddb": function(item,params) {},
        "ddc": function(item,params) {},
        "ddd": function(item,params) {},

        // code containing u does not make it into cells
        // most run buildBlock that build Blk type snips

        // activation creates the posiblity of a pesuo-virus
        "aau": function (item,params) { return LFBehavior.activate(item,params); },
        "abu": function (item,params) { return LFBehavior.activate(item,params); },
        "acu": function (item,params) { return LFBehavior.activate(item,params); },
        "auu": function (item,params) { return LFBehavior.activate(item,params); },

        "bau": function (item,params) {},
        "bbu": function (item,params) {},
        "bcu": function (item,params) {},
        "buu": function (item,params) {},
        "cau": function (item,params) {},
        "cbu": function (item,params) {},
        "ccu": function (item,params) {},
        "cuu": function (item,params) {},

        // build
        "uaa": function (item,params) { return LFBehavior.build(item,params); },
        "uab": function (item,params) { return LFBehavior.build(item,params); },
        "uac": function (item,params) { return LFBehavior.build(item,params); },

        "uau": function (item,params) {},
        "uba": function (item,params) {},
        "ubb": function (item,params) {},
        "ubc": function (item,params) {},
        "ubu": function (item,params) {},

        // activation creates the posiblity of a pesuo-virus
        "uca": function (item,params) { return LFBehavior.activate(item,params); },
        "ucb": function (item,params) { return LFBehavior.activate(item,params); },
        "ucc": function (item,params) { return LFBehavior.activate(item,params); },
        "ucu": function (item,params) { return LFBehavior.activate(item,params); },
        "uua": function (item,params) { return LFBehavior.activate(item,params); },
        "uub": function (item,params) { 
            return LFBehavior.activate(item,params,
                {
                    pull: 0,
                    incubate: 10,
                    max: 2,
                    exp: 1
                }); 
        },
        "uuc": function (item,params) { 
            return LFBehavior.activate(item,params,
                {
                    pull: 5,
                    incubate: -2,
                    max: 0,
                    exp: 0
                }); 
        },
        // turn on infection
        "uuu": function (item,params) { return LFBehavior.infect(item,params); },
    };
    me.run = (item,codes) => {
        let params = {};
        for (let r = 0; r < me.runOrder.length; r++) {
            let code = me.runOrder[r];
            if (code == "reset") params = me.gens["reset"](item);
            else if (codes.includes(me.runOrder[r])) {
                params = me.gens[code](item,params);
            }
        }
    };
    me.singles = [
        "e--",
        "ppp",
        "pd-",
        "uaa",
        "uab",
        "uac"
    ];
    me.runOrder = [
        "reset", // reset

        // ----------------
        //  simple markers
        // ----------------

        "bcc", // energy storage marker

        "aau", // pseudo-v marker
        "abu", // pseudo-v marker
        "acu", // pseudo-v marker
        "auu", // pseudo-v marker
        "uca", // pseudo-v marker
        "ucb", // pseudo-v marker
        "ucc", // pseudo-v marker
        "ucu", // pseudo-v marker
        "uua", // pseudo-v marker
        "uub", // pseudo-v marker
        "uuc", // pseudo-v marker

        // ----------------
        // ----------------

        // ----------------
        //  valued markers
        // ----------------
        "aca", // flip respiration

        "baa", // enable chem process v1
        "bab", // enable chem process v2
        "bac", // enable chem process v3

        "aaa", // increase speed
        "aab", // increase speed
        "aac", // increase speed
        "aad", // incease perception range
        "aba", // incease perception range

        "bba", // set Ex digestion
        "bbb", // increase Ex digestion
        "bbc", // set Husk digestion
        "bbd", // increase Husk digestion
        "bca", // offing
        "bcb", // enable proto eating

        // ----------------
        // ----------------

        // ----------------
        //     actions
        // ----------------

        "caa", // activate antibodies
        "cab", // activate antibodies

        "acb", // respirate

        "bad", // chem

        "bcd", // eat

        "abb", // perceive
        "abc", // seek
        "abd", // move

        "uuu", // realize pseudo-v

        "uaa", // build
        "uab", // build
        "uac", // build

        // ----------------
        // ----------------

        "end" // end
    ];

    me.presets = {
        "move1": ["abd"],
        "move2": ["aaa","abd"],
        "move3": ["aaa","aab","abd"],
        "move4": ["aaa","aab","aac","abd"],
        "seek": ["abb","abc"],
        "eat1": ["bba","bcd"],
        "eat2": ["bbc","bcd"],
        "eat3": ["bba","bbc","bcd"],
        "prey1": ["bcb"],
        "chem1": ["baa","bad"],
        "breathe1": ["acb"],
        "breathe2": ["aca", "acb"]
    };

    me.getTypes = function(codes) {
        let types = [];
        if (codes.includes("abd")) types.push("move");
        if ((codes.includes("baa") || codes.includes("bab") || codes.includes("bac")) && codes.includes("bad")) types.push("chem");
        if (codes.includes("acb")) types.push("breathe");
        if (codes.includes("bcd")) types.push("eat");
        let actUCount = 0;
        if (codes.includes("aau")) actUCount++;
        if (codes.includes("abu")) actUCount++;
        if (codes.includes("acu")) actUCount++;
        if (codes.includes("auu")) actUCount++;
        if (codes.includes("uca")) actUCount++;
        if (codes.includes("ucb")) actUCount++;
        if (codes.includes("ucc")) actUCount++;
        if (codes.includes("ucu")) actUCount++;
        if (codes.includes("uua")) actUCount++;
        if (codes.includes("uub")) actUCount++;
        if (codes.includes("uuc")) actUCount++;
        if (actUCount >= gVars.vactCount && codes.includes("uuu")) types.push("pseudo-v");
        if (codes.includes("uub") && codes.includes("uuc") && codes.includes("uuu")) types.push("v2");
        else if (codes.includes("uub") && codes.includes("uuu")) types.push("v3");
        else if (codes.includes("uuc") && codes.includes("uuu")) types.push("v4");
        return types;
    }

    me.activeCodes = Object.keys(me.gens);
}
