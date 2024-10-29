let blkCount = 3;
let replCount = 6;

const genRanIdx = 0;

const genMovementSpeed = 1;

const genDigestionCount = 1;
const genDigestionGutCount = 2;
const genDigestionWeight = 3;
const genxDigestionGutType = 0;
const genxDigestionGutSubtype = 1;
const genxDigestionGutCode = 2;
const genxDigestionGutParentId = 3;

const genChemCap = 1;
const genChemStep = 2;
const genChemCounter = 3;
const genChemEmit = 4;

const genRespCounter = 1;
const genRespIn = 2;
const genRespOut = 3;

const genSeekTargetX = 1;
const genSeekTargetY = 2;

const genPerceptionRange = 1;
const genPerceptionCount = 2;

const genOffingWeight = 1;

function LFGenetic(parentVals = null) {
    let me = this;
    me.flags = {
        movement: false,
        digestion: false,
        chem: false,
        respiration: false,
        seek: false,
        perception: false,
        offing: false
    };
    me.vals = {
        movement: [0,-1],
        digestion: [0,-1,-1,-1,-1,-1],
        chem: [0,-1,-1,-1,-1],
        respiration: [0,-1,-1,-1],
        seek: [0,-1,-1],
        perception: [0, -1, -1],
        offing: [0,-1]
    };
    me.extra = {
        digestion: ["","","",""],
        perception: []
    }

    me.reset = function(item) {
        Object.keys(me.vals).forEach(ky => me.vals[ky][genRanIdx] = 0);
        me.vals.perception[genPerceptionCount] = 0;
        me.extra.perception = [];
        me.vals.seek[genSeekTargetX] = -1;
        me.vals.seek[genSeekTargetY] = -1;
    };

    if (parentVals != null && parentVals != undefined) {
        me.vals = JSON.parse(JSON.stringify(parentVals));
    }

    me.vals.digestion[genDigestionCount] = 0;
    me.vals.digestion[genDigestionGutCount] = 0;
    me.extra.digestion[genxDigestionGutType] = "";
    me.extra.digestion[genxDigestionGutSubtype] = "";
    me.extra.digestion[genxDigestionGutCode] = "";
    me.extra.digestion[genxDigestionGutParentId] = "";

    me.vals.perception[genPerceptionCount] = 0;
    me.extra.perception = [];

    me.vals.chem[genChemCap] = 0;
    me.vals.chem[genChemCounter] = 10;
    me.vals.chem[genChemStep] = 0;
    me.vals.chem[genChemEmit] = 0;
    
    me.vals.respiration[genRespCounter] = 0;

    me.vals.movement[genSeekTargetX] = -1;
    me.vals.movement[genSeekTargetY] = -1;
}

const LFBehavior = {
    respOps: ["spekG1","spekG2"],
    breathe: (item) => {
        if (item.genetic.flags.respiration && item.complex >= 1) {
            let resp = [];
            if (item.genetic.flags.respiration) {
                let respIn = null;
                let respOut = null
                if (item.genetic.vals.respiration[genRespIn] < 0 || item.genetic.vals.respiration[genRespOut] < 0) {
                    // init respiration
                    if (Math.random() > 0.5) { item.genetic.vals.respiration[genRespIn] = 0; item.genetic.vals.respiration[genRespOut] = 1; }
                    else { item.genetic.vals.respiration[genRespIn] = 1; item.genetic.vals.respiration[genRespOut] = 0; }
                }
                
                respIn = LFBehavior.respOps[item.genetic.vals.respiration[genRespIn]];
                respOut = LFBehavior.respOps[item.genetic.vals.respiration[genRespOut]];

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
                if (item.genetic.vals.respiration[genRespCounter] > 0) item.genetic.vals.respiration[genRespCounter]--;
                if (item.genetic.vals.respiration[genRespCounter] == 0) {
                    if (hasBreath) {
                        item.genetic.vals.respiration[genRespCounter]= 20;
                        if (!pip.classList.contains("breathing")) pip.classList.add("breathing"); 
                        else pip.classList.remove("breathing");
                    }
                    else {
                        item.genetic.vals.respiration[genRespCounter] = 0;
                        pip.classList.remove("breathing"); 
                    }
                }
            }
        }
    },
    move: function(item) {
        if (item.genetic.flags.movement && item.complex >= 1) {
            if (item.genetic.vals.movement[genMovementSpeed] < 0) item.genetic.vals.movement[genMovementSpeed] = Math.floor(Math.random() * 8) + 3;

            let iSpeed =item.genetic.vals.movement[genMovementSpeed];
            if (item.complex == 1) iSpeed *= 0.5;

            let mvSet = false;
            if (item.genetic.flags.seek) { 
                if (item.genetic.vals.seek[genRanIdx] == 0) LFBehavior.seek(item);
                if (item.genetic.vals.seek[genSeekTargetX] >= 0 && item.genetic.vals.seek[genSeekTargetY]) {
                    let target = new LFVector(item.genetic.vals.seek[genSeekTargetX], item.genetic.vals.seek[genSeekTargetY], 0, 0);
                    let des = item.pos.subtract(target);
                    let desDir = des.dir;
                    if (Math.abs(item.pos.dir - desDir) > 30) {
                        desDir = item.pos.dir + (30 * (Math.abs(desDir)/desDir));
                    }
                    item.pos.dir = desDir;
                    if (item.complex >= 2 || (item.complex >= 1 && item.pos.vel <= 0.9)) {
                        item.pos.vel = iSpeed;
                        if (des.magnitude() < iSpeed) item.pos.vel = des.magnitude();
                    }
                    mvSet = true;
                }
            }
            
            if (!mvSet) {
                if (item.complex >= 2 || (item.complex >= 1 && item.pos.vel <= 0.9)) {
                    item.pos.dir += 10 - Math.floor(Math.random() * 21);
                    item.pos.vel = iSpeed; 
                }
            } 

            item.obj.setAttribute("dir", item.pos.dir);
            item.obj.setAttribute("speed", item.genetic["speed"]);

            item.pos.move(0);
            //console.log(item.id + " moved!");
        }
    },
    digestionps: ["snipEx","struckSeed","struckHusk"],
    eat: function(item) {
        if (item.genetic.flags.digestion && item.complex >= 2) {  
            if (item.genetic.flags.offing && item.genetic.vals.offing[genOffingWeight] < 0) item.genetic.vals.offing[genOffingWeight] = Math.random() > 0.5 ? 0.25 : 0;
            let w1 = 0;
            let w2 = 0;
            let w3 = 0;
            if (item.genetic.vals.digestion[genDigestionWeight] < 0) {
                let maxWeight = 20;
                w1 = Math.floor(Math.random() * maxWeight);
                w2 = w1 * 3;
                w3 = maxWeight - w1;
                item.genetic.vals.digestion[genDigestionWeight] = w1;
                item.genetic.vals.digestion[genDigestionWeight + 1] = w2;
                item.genetic.vals.digestion[genDigestionWeight + 2] = w3;
            }
            else {
                w1 = item.genetic.vals.digestion[genDigestionWeight];
                w2 = item.genetic.vals.digestion[genDigestionWeight + 1];
                w3 = item.genetic.vals.digestion[genDigestionWeight + 2];
            }
                 
            let digCount = item.genetic.vals.digestion[genDigestionCount];
            let digGutCount = item.genetic.vals.digestion[genDigestionGutCount];
            let digGut = [];
            if (digGutCount > 0) {
                digGut = [ {
                    type: item.genetic.extra.digestion[genxDigestionGutType],
                    subtype: item.genetic.extra.digestion[genxDigestionGutSubtype],
                    code: item.genetic.extra.digestion[genxDigestionGutCode],
                    parent: item.genetic.extra.digestion[genxDigestionGutParentId],
                } ];
            }
            let isDig = digGutCount > 0 ? true : false;
            let dWeights = {};
            if (w1 > 0) dWeights[LFBehavior.digestionps[0]] = w1; 
            if (w2 > 0) dWeights[LFBehavior.digestionps[1]] = w2; 
            if (w3 > 0) dWeights[LFBehavior.digestionps[2]] = w3;
            if (digCount > 0) {
                item.genetic.vals.digestion[genDigestionCount]--;
                item.life++;
            }
            else {
                if (isDig) {
                    switch (item.genetic.extra.digestion[genxDigestionGutType]) {
                        case "snip":
                            lfcore.snip.decay(item.genetic.extra.digestion[genxDigestionGutSubtype], item.genetic.extra.digestion[genxDigestionGutCode], item.pos);
                            break;
                        case "struck":
                            lfcore.struck.decay(item.genetic.extra.digestion[genxDigestionGutSubtype], item.pos);
                            break;
                    }
                    let addV = dWeights[item.genetic.extra.digestion[genxDigestionGutSubtype]];
                    if (item.genetic.flags.offing && item.genetic.extra.digestion[genxDigestionGutParentId] == item.id) addV = Math.floor(addV * item.genetic.vals.offing[genOffingWeight]);
                    if (addV < 1) addV = 1;
                    else if (addV > 20) addV = 20;
                    item.life = item.life + addV > 100 ? 100 : item.life + addV;
                    item.genetic.vals.digestion[genDigestionGutCount] = 0;
                    item.obj.classList.remove("eating");
                }
                else {
                    let qR = item.core.range / 2;
                    let fd = lf.query(item, null, { range: qR });

                    fd.forEach((fItem) => {
                        if (fItem.core.subtype in dWeights && digGutCount == 0 && (fItem.parent != item.id || (item.genetic.flags.offing && item.genetic.vals.offing[genOffingWeight] > 0))) {
                            let des = fItem.pos.subtract(item.pos);

                            if (Math.abs(des.dir) < 30 || des.magnitude() < item.core.range / 2) {
                                console.log("got to eat");
                                item.genetic.vals.digestion[genDigestionCount] = dWeights[fItem.core.subtype];
                                let fCode = "";
                                if (fItem.core.type == "snip") fCode = fItem.dynamic["code"];
                                item.genetic.vals.digestion[genDigestionGutCount]++;
                                item.genetic.extra.digestion[genxDigestionGutType] = fItem.core.type;
                                item.genetic.extra.digestion[genxDigestionGutSubtype] = fItem.core.subtype;
                                item.genetic.extra.digestion[genxDigestionGutCode] = fCode;
                                item.genetic.extra.digestion[genxDigestionGutParentId] = fItem.parent;
                                item.life++;
                                fItem.deactivate();
                                item.obj.classList.add("eating");
                            }
                        }
                    });
                }
            }
        }
    },
    chem: function(item) {
        if (item.genetic.flags.chem && item.complex >= 1) {

            let hasChem = false;
            
            let found = lf.haze.query(item,"spekG3");
            if (found.length > 0) {
                shuffleArray(found);
                found.forEach((tb) => {
                    if (tb.count > 0 && item.genetic.vals.chem[genChemCap] < 3) {
                        item.genetic.vals.chem[genChemCap]++;
                        lf.haze.transact(tb.tableIndex,"spekG3",-1);
                    }
                });

                if (item.genetic.vals.chem[genChemCap] >= 3) {
                    hasChem = true;
                    if (item.genetic.vals.chem[genChemStep] >= 3) {
                        item.genetic.vals.chem[genChemCounter] = 0;
                        item.genetic.vals.chem[genChemCap] -= 3;
                        item.genetic.vals.chem[genChemStep] = 0;
                        item.genetic.vals.chem[genChemEmit]++;
                        item.life = item.life + 5 > 100 ? 100 : item.life + 5;
                        lf.haze.add(item.x, item.y, "spekX", 1);
                        if (item.genetic.vals.chem[genChemEmit] >= 24) {
                            let nDir = (item.pos.dir + 180) % 360;
                            let nVel = 2;
                            let nEx = new LFItem(new LFVector(item.pos.x, item.pos.y, nDir, nVel), lfcore.snip["snipEx"], { gen: lf.step, parent: item.id, code: lfcore.snip["snipEx"].data });
                            lf.queueItem(nEx);
                            item.genetic.vals.chem[genChemEmit] = 0;
                        }
                        //console.log("chemed!!");
                    }
                    else {
                        item.genetic.vals.chem[genChemStep]++;
                    }
                }
            }

            let pip = item.obj.querySelector(".chem-pip");
            if (item.genetic.vals.chem[genChemCounter] > 0) item.genetic.vals.chem[genChemCounter]--;
            if (item.genetic.vals.chem[genChemCounter] == 0) {
                if (hasChem) {
                    item.genetic.vals.chem[genChemCounter] = 10;
                    if (!pip.classList.contains("cheming")) pip.classList.add("cheming"); 
                    else pip.classList.remove("cheming");
                }
                else {
                    item.genetic.vals.chem[genChemCounter] = 0;
                    pip.classList.remove("cheming"); 
                }
            }
            else if (!hasChem) {
                pip.classList.remove("cheming"); 
                item.genetic.vals.chem[genChemCounter] = 10;
            }   
        }
    },
    perceive: function(item) {
        if (item.genetic.flags.perception && item.complex >= 1) {
            if (item.genetic.vals.perception[genPerceptionRange] < 0) item.genetic.vals.perception[genPerceptionRange] =  (Math.floor(Math.random() * 4) + 2) * item.core.range;
            if (item.genetic.vals.perception[genRanIdx] == 0) {
                let pRange = item.genetic.vals.perception[genPerceptionRange];

                item.genetic.extra.perception = [];

                item.genetic.extra.perception = lf.query(item, null, { range: pRange });
                //item.genetic["perception"]["found"].forEach((it) => {it.obj.style.color = "orange"; });
                item.genetic.vals.perception[genRanIdx] = 1;
            }
        }
    },
    seek: function(item) {
        if (item.genetic.flags.perception && item.genetic.flags.seek && item.complex >= 1) {
            
            if (item.genetic.vals.perception[genRanIdx] == 0) LFBehavior.perceive(item);
            if (item.genetic.flags.respiration) {
                let rsp = lf.haze.query(item, item.genetic.vals.respiration[LFBehavior.respOps[item.genetic.vals.respiration[genRespIn]]]);
                let minD = null;
                rsp.forEach((tb) => {
                    let tbC = lf.haze.getCellPos(tb.tableIndex);
                    let dD = Math.hypot(item.pos.x - tbC.x, item.pos.y - tbC.y);
                    if (item.genetic.vals.seek[genSeekTargetX] < 0 &&  item.genetic.vals.seek[genSeekTargetY]) { 
                        minD = dD;
                        item.genetic.vals.seek[genSeekTargetX] = tbC.x;
                        item.genetic.vals.seek[genSeekTargetY] = tbC.y;
                    }
                    else if (dD < minD) { 
                        minD = dD;
                        item.genetic.vals.seek[genSeekTargetX] = tbC.x;
                        item.genetic.vals.seek[genSeekTargetY] = tbC.y; 
                    }
                });
            }
            if (item.genetic.flags.chem) {
                if (item.genetic.vals.chem[genChemCap] < 3) {
                    let fG3 = lf.haze.query(item, "spekG3");
                    if (fG3.length > 0) {
                        let minD = null;
                        fG3.forEach((tb) => {
                            let tbC = lf.haze.getCellPos(tb.tableIndex);
                            let dD = Math.hypot(item.pos.x - tbC.x, item.pos.y - tbC.y);
                            if (item.genetic.vals.seek[genSeekTargetX] < 0 &&  item.genetic.vals.seek[genSeekTargetY]) { 
                                minD = dD; 
                                item.genetic.vals.seek[genSeekTargetX] = tbC.x;
                                item.genetic.vals.seek[genSeekTargetY] = tbC.y;
                            }
                            else if (minD == null || dD < minD) { 
                                minD = dD; 
                                item.genetic.vals.seek[genSeekTargetX] = tbC.x;
                                item.genetic.vals.seek[genSeekTargetY] = tbC.y; 
                            }
                        });
                    }
                }
            }
            if (item.genetic.flags.digestion) {
                let minD = null;
                item.genetic.extra.perception.forEach((sk) => {
                    if (LFBehavior.digestionps.includes(sk.core.subtype)) {
                        if (item.genetic.vals.digestion[genDigestionGutCount] == 0) {
                            let dD = Math.hypot(item.pos.x - sk.pos.x, item.pos.y - sk.pos.y);
                            if (item.genetic.vals.seek[genSeekTargetX] < 0 &&  item.genetic.vals.seek[genSeekTargetY]) { 
                                minD = dD; 
                                item.genetic.vals.seek[genSeekTargetX] = sk.pos.x;
                                item.genetic.vals.seek[genSeekTargetY] = sk.pos.y;
                            }
                            else if (minD == null || dD < minD) { 
                                minD = dD; 
                                item.genetic.vals.seek[genSeekTargetX] = sk.pos.x;
                                item.genetic.vals.seek[genSeekTargetY] = sk.pos.y;
                            }
                        }
                    }
                });
            }
            
        }
    },
    buildBlock: function(item) {
        let parts = lf.query(item);
        if (!("parts" in item.dynamic)) item.dynamic["parts"] = { "p":0 };
        for (let p = 0; p < parts.length; p++) {
            if (parts[p].core.type == "ort" && parts[p].core.data == "p" && item.dynamic["parts"]["p"] < 3) {
                item.dynamic["parts"]["p"]++;
                parts[p].deactivate();
            }
        }
        if (item.dynamic["parts"]["p"] == 3) {
            let snipVal = "ppp";
            parts.forEach((pt) => { pt.deactivate(); });
            let nDir = Math.floor(Math.random() * 360);
            let nVel = Math.floor(Math.random() * 10) + 5;
            let nsnip = new LFItem(new LFVector(item.pos.x, item.pos.y, nDir, nVel), lfcore.snip.snipBlk, { gen: lf.step, code: snipVal, len: snipVal.length });
            lf.queueItem(nsnip);
            item.dynamic["parts"]["p"] = 0;
            if (item.core.type == "snip") item.obj.innerHTML = "&int;";
            else if (item.core.type == "strand") item.obj.innerHTML = "&Int;"
        }
        else if (item.dynamic["parts"]["p"] == 2) {
            if (item.core.type == "strand") item.obj.innerHTML = "<i class=\"loaded\">&Conint;</i>"; // double int w/ circle
            else item.obj.innerHTML = "<i class=\"loaded\">&cwconint;</i>"; // int with circle
        }
        else if (item.dynamic["parts"]["p"] == 1) {
            if (item.core.type == "strand") item.obj.innerHTML = "<i class=\"loaded\" style=\"text-decoration: line-through;\">&Int;</i>"; // double int with line
            else item.obj.innerHTML = "<i class=\"loaded\">&cwint;</i>"; // int with slash
        }
        else if (item.core.type == "strand") item.obj.innerHTML = "&Int;";
        else item.obj.innerHTML = "&int;";
    }
}

function LFCodedBehaviors() {
    let me = this;
    me.validOrts = ["a","b","c","d","u"];
    me.gens = {
        "reset": function(item) { item.genetic.reset(); },
        "aaa": function(item) {
            // enable movement - see "bbb"
            if (!item.genetic.flags.movement) item.genetic.flags.movement = true;
        },
        "aab": function(item) {
            // enable respiration 1 - see "aad"
            if (!item.genetic.flags.respiration) {
                item.genetic.flags.respiration = true;
                item.genetic.vals.respiration[genRespIn] = 0; 
                item.genetic.vals.respiration[genRespOut] = 1;
            }
        },
        "aac": function(item) {
            // enable respiration 2 - see "aad"
            if (!item.genetic.flags.respiration) {
                item.genetic.flags.respiration = true;
                item.genetic.vals.respiration[genRespIn] = 1; 
                item.genetic.vals.respiration[genRespOut] = 0;
            }
        },
        "aad": function(item) {
            // respirate - enable see "aab"
            LFBehavior.breathe(item);
        },
        "bbb": function(item) {
            // movement - enable see "aaa"
            LFBehavior.move(item);
        },
        "bba": function(item) {
            // enable digestion 1 - see "bbc"
            if (!item.genetic.flags.digestion) item.genetic.flags.digestion = true;
        },
        "bbc": function(item) {
            // digestion - enable see "bba"
            LFBehavior.eat(item);
        },
        "bbd": function(item) {
            // 25% chance proto can digest their own offings at 1/2 value
            if (!item.genetic.flags.offing) item.genetic.flags.offing = true;
        },
        "bab": function(item) {
            // enable chem - see "bac"
            if (!item.genetic.flags.chem) item.genetic.flags.chem = true;
        },
        "bac": function(item) {
            // chem - enable see "bab"
            LFBehavior.chem(item);
        },
        "cba": function(item) {
            // enable perception - see "cbb"
            if (!item.genetic.flags.perception) item.genetic.flags.perception = true;
        },
        "cbb": function(item) {
            // perception - enable see "cba"
            LFBehavior.perceive(item);
        },
        "cbc": function(item) {
            // enable seek - see "cbd"
            if (!item.genetic.flags.seek) item.genetic.flags.seek = true;
        },
        "cbd": function(item) {
            // seek - enable see "cbc"
            LFBehavior.seek(item);
        },
        "ccc": function(item) {
            // build blks and store
            // TODO
        },
        "cab": function(item) {
            // enable storage - see "cad"
            // TODO
        },
        "cad": function(item) {
            // use storage - enable see "cab"
            // TODO
        },
        "dac": function(item) {
            // sets shorter husk decay
            if (!("htime" in item.genetic)) item.genetic["htime"] = gVars.huskDeay - Math.floor(Math.random() * 2000);
        },
        // code containing u does not make it into cells
        // most run buildBlock that build Blk type snips
        "uua": function (item) { LFBehavior.buildBlock(item); },
        "uub": function (item) { LFBehavior.buildBlock(item); },
        "uuc": function (item) { LFBehavior.buildBlock(item); },
        "uud": function (item) { LFBehavior.buildBlock(item); },
        "uau": function (item) { LFBehavior.buildBlock(item); },
        "ubu": function (item) { LFBehavior.buildBlock(item); },
        "ucu": function (item) { LFBehavior.buildBlock(item); },
        "udu": function (item) { LFBehavior.buildBlock(item); }
    };
    me.run = (item,code) => {
        if (code in me.gens)
            return me.gens[code](item);
        else
            return null;
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

    me.activeCodes = Object.keys(me.gens);
}
