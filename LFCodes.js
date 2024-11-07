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
        return newParams; 
    },
    breathe: (item, params) => {
        if (item.complex >= 1) {
            params.actions.push("breathe");
            if (!("respirationCount" in item.dynamic.mem)) item.dynamic.mem["respirationCount"] = 0;
            
            let respIn = params.respiration[0];
            let respOut = params.respiration[1]

            let hasBreath = false;

            let found = lf.haze.query(item,respIn);
            if (found.length > 0) {
                shuffleArray(found);
                lf.haze.transact(found[0].tableIndex,respIn,-1);
                lf.haze.add(item.pos.x, item.pos.y, respOut, 1);
                let lifeAdd = 1;
                //if (resp[0] == "spekG2") lifeAdd = 2;
                item.life = item.life + lifeAdd > 100 ? 100 : item.life + lifeAdd;
                //console.log(item.id + " breathed!");
                hasBreath = true;
            }

            let pip = item.obj.querySelector(".breath-pip");
            if (item.dynamic.mem["respirationCount"] > 0) item.dynamic.mem["respirationCount"]--;
            if (item.dynamic.mem["respirationCount"] == 0) {
                if (hasBreath) {
                    item.dynamic.mem["respirationCount"]= 20;
                    if (!pip.classList.contains("breathing")) pip.classList.add("breathing"); 
                    else pip.classList.remove("breathing");
                }
                else {
                    item.dynamic.mem["respirationCount"] = 0;
                    pip.classList.remove("breathing"); 
                }
            }
            
        }

        return params;
    },
    move: function(item, params) {
        if (item.complex >= 1) {
            params.actions.push("move");

            let iSpeed = params.speed == 0 ? 2 : params.speed;
            if (item.complex == 1) iSpeed *= 0.5;

            let mvSet = false;
            if (params.seektarget != null) { 
                let target = params.seektarget;
                let des = item.pos.subtract(target);
                console.log(item.pos.x + "," + item.pos.y + "  " + target.x + "," + target.y + "  " + des.dir + "  " + des.magnitude());
                let desDir = des.dir;
                if (Math.abs(item.pos.dir - desDir) > 30) {
                    desDir = item.pos.dir + (30 * (Math.abs(desDir)/desDir));
                }
                item.pos.dir = desDir;
                if (item.complex >= 2 || (item.complex >= 1 && item.pos.vel <= 0.9)) {
                    item.pos.vel = iSpeed;
                    console.log("seek target dist: " + des.magnitude() + ", speed: " + iSpeed);
                    if (des.magnitude() < iSpeed) {
                        item.pos.vel = des.magnitude();
                        console.log("shorter [" + item.pos.vel + "]");
                    }
                }
                mvSet = true;

            }
            
            if (!mvSet) {
                if (item.complex >= 2 || (item.complex >= 1 && item.pos.vel <= 0.9)) {
                    item.pos.dir += 10 - Math.floor(Math.random() * 21);
                    item.pos.vel = iSpeed; 
                }
            } 

            item.obj.setAttribute("dir", item.pos.dir);
            item.obj.setAttribute("speed", params.speed);

            item.pos.move(0);
            //console.log(item.id + " moved!");
        }

        return params;
    },
    eat: function(item, params) {
        if (item.complex >= 2) {  
            params.actions.push("eat");
            if (!("digCount" in item.dynamic.mem)) { item.dynamic.mem["digCount"] = 0; }
            if (!("gut" in item.dynamic.mem)) { item.dynamic.mem["gut"] = []; }
            if (!("digEnergy" in item.dynamic.mem)) { item.dynamic.mem["digEnergy"] = 0; }
            if (!("prey" in item.dynamic.mem)) { item.dynamic.mem["prey"] = null; }
            if (!("preyCount" in item.dynamic.mem)) { item.dynamic.mem["preyCount"] = 0; }
                 

            let isDig = item.dynamic.mem["digCount"] > 0 ? true : false;
            let dWeights = params.digestion;
            if (item.dynamic.mem["digCount"] > 0) {
                item.dynamic.mem["digCount"]--;
                item.life += item.dynamic.mem["digEnergy"];
            }
            else {
                if (item.dynamic.mem["prey"] != null) {
                    let tVec = item.dynamic.mem["prey"].pos.subtract(item.pos);

                    if (tVec.magnitude < item.obj.clientWidth) {
                        item.pos.dir = tVec.dir;
                        console.log("preying...");

                        item.dynamic.mem["preyCount"]--;

                        if (item.dynamic.mem["preyCount"] <= 0) {
                            item.dynamic.mem["preyCount"] = 5;
                            if (item.obj.classList.contains("eating")) item.obj.classList.remove("eating");
                            else item.obj.classList.add("eating");
                        }

                        let energy = item.dynamic.mem["prey"].life < 20 ? item.dynamic.mem["prey"].life : 20;
                        item.dynamic.mem["prey"].life = item.dynamic.mem["prey"].life - energy < 0 ? 0 : item.dynamic.mem["prey"].life - energy;
                        item.life = item.life + energy > 100 ? 100 : item.life + energy; 

                        if (item.dynamic.mem["prey"].life <= 0) {
                            item.dynamic.mem["prey"].deactivate();
                            item.dynamic.mem["prey"] = null;
                            item.dynamic.mem["preyCount"] = 0;
                            item.obj.classList.remove("eating");
                        }
                    }
                    else {
                        console.log("following prey: " + item.dynamic.mem["prey"].pos.x + "," + item.dynamic.mem["prey"].pos.y);
                        params.seektarget = new LFVector(item.dynamic.mem["prey"].pos.x,item.dynamic.mem["prey"].pos.y,0,0);
                    }
                }
                else if (item.dynamic.mem["gut"].length > 0) {
                    switch (item.dynamic.mem["gut"][0].type) {
                        case "snip":
                            lfcore.snip.decay(item.dynamic.mem["gut"][0].subtype, item.dynamic.mem["gut"][0].code, item.pos);
                            break;
                        case "struck":
                            lfcore.struck.decay(item.dynamic.mem["gut"][0].subtype, item.pos);
                            break;
                    }
                    let addV = dWeights[item.dynamic.mem["gut"][0].subtype];
                    if (params.offing > 0 && item.dynamic.mem["gut"][0].parentid == item.id) addV = Math.floor(addV * params.offing);
                    if (addV < 1) addV = 1;
                    else if (addV > 30) addV = 30;
                    item.life = item.life + addV > 100 ? 100 : item.life + addV;
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
                                    if (item.dynamic.mem["prey"] == null) {
                                        item.dynamic.mem["prey"] = fItem;
                                        item.dynamic.mem["preyCount"] = 5;
                                        console.log("preying on item");
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

        return params;
    },
    chem: function(item, params) {
        if (item.complex >= 1 && params.chem != null) {
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

            if (item.complex == 2) {
                chemTime *= 2;
                chemEnergy *= 2;
                chemAmount *= 2;
            }
            
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
                        item.dynamic.mem["chemCap"] -= 3;
                        item.dynamic.mem["chemStep"] = 0;
                        item.dynamic.mem["chemEmit"]++;
                        item.life = item.life + chemEnergy > 100 ? 100 : item.life + chemEnergy;
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
                        item.life += 2;
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

        return params;
    },
    perceive: function(item, params) {
        if (item.complex >= 1) {
            params.actions.push("perceive");
            
            let pRange = params.prange == 0 ? item.core.range * 2 : params.prange;

            params.found = lf.query(item, null, { range: pRange });
        }

        return params;
    },
    seek: function(item, params) {
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
                    params.found.forEach((sk) => {
                        if (sk.core.subtype in params.digestion) {
                            let dD = Math.hypot(item.pos.x - sk.pos.x, item.pos.y - sk.pos.y);
                            if (params.seektarget == null) { 
                                minD = dD; 
                                target = new LFVector(sk.pos.x,sk.pos.y,0,0); 
                                console.log("locked onto " + sk.core.subtype);
                            }
                            else if (minD == null || dD < minD) { 
                                minD = dD; 
                                target = new LFVector(sk.pos.x,sk.pos.y,0,0);
                                console.log("locked onto " + sk.core.subtype); 
                            }
                        }
                    });
                }
                
                params.seektarget = target;
            }
        }

        return params;
    },
    build: function(item, params) {
        params.actions.push("build");

        if (!("buildparts" in item.dynamic.mem)) item.dynamic.mem["buildparts"] = { "p": 0 };

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
            item.dynamic.mem["buildparts"]["p"] = 0;
            if (item.core.type == "snip") item.obj.innerHTML = "&int;";
            else if (item.core.type == "strand") item.obj.innerHTML = "&Int;"
        }
        else if (item.dynamic.mem["buildparts"]["p"] == 2) {
            if (item.core.type == "strand") item.obj.innerHTML = "<i class=\"loaded\">&Conint;</i>"; // double int w/ circle
            else item.obj.innerHTML = "<i class=\"loaded\">&cwconint;</i>"; // int with circle
        }
        else if (item.dynamic.mem["buildparts"]["p"] == 1) {
            if (item.core.type == "strand") item.obj.innerHTML = "<i class=\"loaded\" style=\"text-decoration: line-through;\">&Int;</i>"; // double int with line
            else item.obj.innerHTML = "<i class=\"loaded\">&cwint;</i>"; // int with slash
        }
        else if (item.core.type == "strand") item.obj.innerHTML = "&Int;";
        else item.obj.innerHTML = "&int;";

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

        "baa": function(item,params) {
            // enable chem v1
            if (params.chem == null) {
                params.chem = {
                    type: "spekG3",
                    energy: 7,
                    amount: 2,
                    time: 5,
                    emit: 18
                };
            }
            return params;
        },
        "bab": function(item,params) {
            // enable chem v2
            if (params.chem == null) {
                params.chem = {
                    type: "spekG3",
                    energy: 7,
                    amount: 2,
                    time: 5,
                    emit: 18
                };
            }
            else {
                params.chem.energy += 4;
                params.chem.amount += 1;
                params.chem.time += 2;
                params.chem.emit += 3;
            }
            return params;
        },
        "bac": function(item,params) {
            // enable chem v3
            if (params.chem == null) {
                params.chem = {
                    type: "spekG3",
                    energy: 7,
                    amount: 2,
                    time: 5,
                    emit: 18
                };
            }
            else {
                params.chem.energy += 4;
                params.chem.amount += 1;
                params.chem.time += 2;
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
        "bcd": function(item,params) {
            // eat
            return LFBehavior.eat(item,params);
        },

        // code containing u does not make it into cells
        // most run buildBlock that build Blk type snips
        "uua": function (item,params) { return LFBehavior.build(item,params); },
        "uub": function (item,params) { return LFBehavior.build(item,params); },
        "uuc": function (item,params) { return LFBehavior.build(item,params); },
        "uud": function (item,params) { return LFBehavior.build(item,params); },
        "uau": function (item,params) { return LFBehavior.build(item,params); },
        "ubu": function (item,params) { return LFBehavior.build(item,params); },
        "ucu": function (item,params) { return LFBehavior.build(item,params); },
        "udu": function (item,params) { return LFBehavior.build(item,params); }
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
        "uua",
        "uub",
        "uuc",
        "uud",
        "uau",
        "ubu",
        "ucu",
        "udu",
    ];
    me.runOrder = [
        "reset", // reset

        "aca", // flip respiration
        "acb", // respirate

        "baa", // enable chem process v1
        "bab", // enable chem process v2
        "bac", // enable chem process v3
        "bad", // chem

        "bba", // set Ex digestion
        "bbb", // increase Ex digestion
        "bbc", // set Husk digestion
        "bbd", // increase Husk digestion
        "bca", // offing
        "bcb", // enable proto eating
        "bcd", // eat

        "aaa", // increase speed
        "aab", // increase speed
        "aac", // increase speed
        "aad", // incease perception range
        "aba", // incease perception range
        "abb", // perceive
        "abc", // seek
        "abd", // move

        "uua", // build
        "uub", // build
        "uuc", // build
        "uud", // build
        "uau", // build
        "ubu", // build
        "ucu", // build
        "udu", // build

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
        return types;
    }

    me.activeCodes = Object.keys(me.gens);
}
